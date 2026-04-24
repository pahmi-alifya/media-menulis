"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type Result<T> = { data: T; error: null } | { data: null; error: string }

/** Assign peer review secara acak untuk semua submission final di sebuah tahap.
 *  Setiap mahasiswa mendapat 1 reviewer (tidak boleh review diri sendiri).
 *  Idempotent: jika sudah ada assignment, tidak ditimpa. */
export async function assignPeerReviewAction(
  tahapId: string,
): Promise<Result<{ assigned: number }>> {
  const session = await auth()
  if (!session?.user?.id) return { data: null, error: "Tidak terautentikasi" }

  // Verifikasi dosen memiliki kelas ini
  const tahap = await prisma.tahap.findUnique({
    where: { id: tahapId },
    include: { kelas: { select: { dosenId: true } } },
  })
  if (!tahap || tahap.kelas.dosenId !== session.user.id) {
    return { data: null, error: "Akses ditolak" }
  }
  if (tahap.kode !== "IMMM") {
    return { data: null, error: "Peer review hanya untuk Tahap 4 (IMMM)" }
  }

  // Ambil semua submission final yang belum punya reviewer
  const submissions = await prisma.submission.findMany({
    where: { tahapId, isDraft: false },
    select: { id: true, userId: true },
  })

  if (submissions.length < 2) {
    return { data: null, error: "Minimal 2 submission untuk assign peer review" }
  }

  // Cek yang sudah ada
  const existing = await prisma.peerReview.findMany({
    where: { submissionId: { in: submissions.map((s) => s.id) } },
    select: { submissionId: true },
  })
  const alreadyAssigned = new Set(existing.map((e) => e.submissionId))

  // Shuffled copy untuk assign
  const shuffled = [...submissions].sort(() => Math.random() - 0.5)
  const toCreate: { submissionId: string; reviewerId: string; revieweeId: string }[] = []

  for (let i = 0; i < shuffled.length; i++) {
    const target = shuffled[i]
    if (alreadyAssigned.has(target.id)) continue

    // Cari reviewer bukan diri sendiri
    const reviewer = shuffled.find(
      (s) => s.userId !== target.userId && s.id !== target.id,
    )
    if (!reviewer) continue

    toCreate.push({
      submissionId: target.id,
      reviewerId: reviewer.userId,
      revieweeId: target.userId,
    })
  }

  if (toCreate.length === 0) {
    return { data: { assigned: 0 }, error: null }
  }

  await prisma.peerReview.createMany({ data: toCreate, skipDuplicates: true })

  revalidatePath("/dosen")
  revalidatePath("/mahasiswa")

  return { data: { assigned: toCreate.length }, error: null }
}

/** Mahasiswa submit komentar peer review yang ditugaskan kepadanya. */
export async function submitPeerReviewAction(
  peerReviewId: string,
  komentar: string,
): Promise<Result<true>> {
  const session = await auth()
  if (!session?.user?.id) return { data: null, error: "Tidak terautentikasi" }

  const trimmed = komentar.trim()
  if (!trimmed) return { data: null, error: "Komentar tidak boleh kosong" }

  const pr = await prisma.peerReview.findUnique({
    where: { id: peerReviewId },
    select: { reviewerId: true, komentar: true },
  })

  if (!pr) return { data: null, error: "Peer review tidak ditemukan" }
  if (pr.reviewerId !== session.user.id) return { data: null, error: "Akses ditolak" }
  if (pr.komentar !== null) return { data: null, error: "Review sudah pernah dikirim" }

  await prisma.peerReview.update({
    where: { id: peerReviewId },
    data: { komentar: trimmed },
  })

  revalidatePath("/mahasiswa")

  return { data: true, error: null }
}
