"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { AspekNilai, AspekKolaborasi } from "@prisma/client"

type Result<T> = { data: T; error: null } | { data: null; error: string }

type NilaiAspekInput = {
  aspek: AspekNilai
  skor: number
  komentar?: string | null
}

type NilaiKolaborasiInput = {
  aspek: AspekKolaborasi
  skor: number
  komentar?: string | null
}

async function verifyDosenOwnsSubmission(submissionId: string, dosenId: string) {
  const sub = await prisma.submission.findUnique({
    where: { id: submissionId },
    select: { tahap: { select: { kelas: { select: { dosenId: true } } } } },
  })
  return sub?.tahap.kelas.dosenId === dosenId ? sub : null
}

/** Simpan penilaian rubrik esai (Tahap 4 — IMMM). Nilai = rata-rata × 25. */
export async function nilaiSubmissionAction(
  submissionId: string,
  aspeks: NilaiAspekInput[],
): Promise<Result<{ nilaiTotal: number }>> {
  const session = await auth()
  if (!session?.user?.id) return { data: null, error: "Tidak terautentikasi" }

  const ok = await verifyDosenOwnsSubmission(submissionId, session.user.id)
  if (!ok) return { data: null, error: "Submission tidak ditemukan atau akses ditolak" }

  if (aspeks.length === 0) return { data: null, error: "Data penilaian tidak valid" }

  const nilaiTotal = (aspeks.reduce((s, a) => s + a.skor, 0) / aspeks.length) * 25

  await prisma.$transaction([
    prisma.nilaiAspek.deleteMany({ where: { submissionId } }),
    prisma.nilaiAspek.createMany({
      data: aspeks.map((a) => ({
        submissionId,
        aspek: a.aspek,
        skor: a.skor,
        komentar: a.komentar ?? null,
      })),
    }),
    prisma.submission.update({
      where: { id: submissionId },
      data: { nilaiTotal },
    }),
  ])

  revalidatePath("/dosen")
  revalidatePath("/mahasiswa")

  return { data: { nilaiTotal }, error: null }
}

/** Simpan penilaian kolaborasi (Tahap 3 — KMBM). Nilai = (rata-rata / 3) × 100. */
export async function nilaiKolaborasiAction(
  submissionId: string,
  aspeks: NilaiKolaborasiInput[],
): Promise<Result<{ nilaiTotal: number }>> {
  const session = await auth()
  if (!session?.user?.id) return { data: null, error: "Tidak terautentikasi" }

  const ok = await verifyDosenOwnsSubmission(submissionId, session.user.id)
  if (!ok) return { data: null, error: "Submission tidak ditemukan atau akses ditolak" }

  if (aspeks.length === 0) return { data: null, error: "Data penilaian tidak valid" }

  const nilaiTotal = (aspeks.reduce((s, a) => s + a.skor, 0) / aspeks.length / 3) * 100

  await prisma.$transaction([
    prisma.nilaiKolaborasi.deleteMany({ where: { submissionId } }),
    prisma.nilaiKolaborasi.createMany({
      data: aspeks.map((a) => ({
        submissionId,
        aspek: a.aspek,
        skor: a.skor,
        komentar: a.komentar ?? null,
      })),
    }),
    prisma.submission.update({
      where: { id: submissionId },
      data: { nilaiTotal },
    }),
  ])

  revalidatePath("/dosen")
  revalidatePath("/mahasiswa")

  return { data: { nilaiTotal }, error: null }
}
