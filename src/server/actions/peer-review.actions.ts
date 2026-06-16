"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type Result<T> = { data: T; error: null } | { data: null; error: string }

/** Assign peer review secara acak untuk semua submission final di sebuah tahap.
 *  Setiap mahasiswa mendapat 1 reviewer (tidak boleh review diri sendiri).
 *  Distribusi merata: tiap mahasiswa hanya jadi reviewer untuk 1 orang.
 *  Idempotent: jika sudah ada assignment, tidak ditimpa. */
export async function assignPeerReviewAction(
  tahapId: string,
  pertemuanKe: number,
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

  // Ambil semua submission final untuk pertemuan ini
  const submissions = await prisma.submission.findMany({
    where: { tahapId, pertemuanKe, isDraft: false },
    select: { id: true, userId: true },
  })

  if (submissions.length < 2) {
    return { data: null, error: "Minimal 2 submission untuk assign peer review" }
  }

  // Bungkus dalam transaksi untuk hindari race condition
  const assigned = await prisma.$transaction(async (tx) => {
    // Cek ulang di dalam transaksi
    const existing = await tx.peerReview.findMany({
      where: { submissionId: { in: submissions.map((s) => s.id) } },
      select: { submissionId: true },
    })
    const alreadyAssigned = new Set(existing.map((e) => e.submissionId))

    const unassigned = submissions.filter((s) => !alreadyAssigned.has(s.id))
    if (unassigned.length === 0) return 0

    // Fisher-Yates shuffle untuk distribusi merata
    const shuffled = [...unassigned]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Rotasi sirkular: submission[i] di-review oleh submission[i+1]
    // Jika userId sama (satu user punya >1 submission), coba rotasi lebih jauh
    const toCreate: { submissionId: string; reviewerId: string; revieweeId: string }[] = []
    for (let i = 0; i < shuffled.length; i++) {
      const target = shuffled[i]
      let reviewerIdx = (i + 1) % shuffled.length
      // Hindari self-review — cari reviewer berikutnya yang userId berbeda
      let attempts = 0
      while (shuffled[reviewerIdx].userId === target.userId && attempts < shuffled.length) {
        reviewerIdx = (reviewerIdx + 1) % shuffled.length
        attempts++
      }
      if (shuffled[reviewerIdx].userId === target.userId) continue // tidak bisa hindari (semua 1 user)

      toCreate.push({
        submissionId: target.id,
        reviewerId: shuffled[reviewerIdx].userId,
        revieweeId: target.userId,
      })
    }

    if (toCreate.length === 0) return 0

    await tx.peerReview.createMany({ data: toCreate, skipDuplicates: true })
    return toCreate.length
  })

  revalidatePath("/dosen")
  revalidatePath("/mahasiswa")

  return { data: { assigned }, error: null }
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
  if (trimmed.length > 5000) return { data: null, error: "Komentar maksimal 5000 karakter" }

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
