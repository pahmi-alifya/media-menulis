import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

const kelasByDosenArgs = {
  include: {
    tahaps: { orderBy: { urutan: "asc" } as const },
    _count: { select: { enrollments: true } },
  },
} satisfies Prisma.KelasDefaultArgs

const kelasByMahasiswaArgs = {
  include: {
    tahaps: { orderBy: { urutan: "asc" } as const },
    dosen: { select: { nama: true } },
  },
} satisfies Prisma.KelasDefaultArgs

export type KelasByDosen = Prisma.KelasGetPayload<typeof kelasByDosenArgs>
export type KelasByMahasiswa = Prisma.KelasGetPayload<typeof kelasByMahasiswaArgs>

/** @deprecated Gunakan getActiveKelas() untuk multi-kelas support */
export async function getKelasByDosen(dosenId: string): Promise<KelasByDosen | null> {
  return prisma.kelas.findFirst({
    where: { dosenId },
    ...kelasByDosenArgs,
    orderBy: { createdAt: "desc" },
  })
}

export async function getSemuaKelasByDosen(dosenId: string): Promise<KelasByDosen[]> {
  return prisma.kelas.findMany({
    where: { dosenId },
    ...kelasByDosenArgs,
    orderBy: { createdAt: "desc" },
  })
}

export async function getKelasById(
  kelasId: string,
  dosenId: string,
): Promise<KelasByDosen | null> {
  return prisma.kelas.findFirst({
    where: { id: kelasId, dosenId },
    ...kelasByDosenArgs,
  })
}

export async function getActiveKelas(dosenId: string): Promise<KelasByDosen | null> {
  const cookieStore = await cookies()
  const activeId = cookieStore.get("activeKelasId")?.value

  if (activeId) {
    const kelas = await getKelasById(activeId, dosenId)
    if (kelas) return kelas
  }

  return prisma.kelas.findFirst({
    where: { dosenId },
    ...kelasByDosenArgs,
    orderBy: { createdAt: "desc" },
  })
}

export async function getTahapsByKelas(kelasId: string) {
  return prisma.tahap.findMany({
    where: { kelasId },
    orderBy: { urutan: "asc" },
    include: {
      _count: { select: { submissions: { where: { isDraft: false } } } },
    },
  })
}

export async function getTahapById(tahapId: string) {
  return prisma.tahap.findUnique({
    where: { id: tahapId },
    include: { kelas: true },
  })
}

export async function getKontenByTahap(tahapId: string, pertemuanKe: number) {
  return prisma.konten.findMany({
    where: { tahapId, pertemuanKe },
    orderBy: { urutan: "asc" },
  })
}

export async function getEnrollmentsByKelas(kelasId: string) {
  return prisma.enrollment.findMany({
    where: { kelasId },
    include: { user: { select: { id: true, nama: true, email: true, nim: true } } },
    orderBy: { joinedAt: "asc" },
  })
}

export async function getSemuaEnrollmentsByDosen(dosenId: string) {
  return prisma.enrollment.findMany({
    where: { kelas: { dosenId } },
    include: {
      user: { select: { id: true, nama: true, email: true, nim: true } },
      kelas: { select: { id: true, nama: true, kode: true } },
    },
    orderBy: [{ kelas: { createdAt: "desc" } }, { joinedAt: "asc" }],
  })
}

export async function getKelasByMahasiswa(userId: string) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: { kelas: { ...kelasByMahasiswaArgs } },
    orderBy: { joinedAt: "asc" },
  })
}

export async function getAllKelasByMahasiswa(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: { kelas: { ...kelasByMahasiswaArgs } },
    orderBy: { joinedAt: "asc" },
  })
}

export async function getActiveMahasiswaKelas(userId: string) {
  const cookieStore = await cookies()
  const activeId = cookieStore.get("activeMahasiswaKelasId")?.value

  const enrollments = await getAllKelasByMahasiswa(userId)
  if (enrollments.length === 0) return null

  if (activeId) {
    const found = enrollments.find((e) => e.kelas.id === activeId)
    if (found) return found
  }
  return enrollments[0]
}

export async function getSubmissionByMahasiswa(tahapId: string, userId: string) {
  return prisma.submission.findUnique({
    where: { tahapId_userId: { tahapId, userId } },
  })
}

export async function getMySubmissionWithNilai(tahapId: string, userId: string) {
  return prisma.submission.findUnique({
    where: { tahapId_userId: { tahapId, userId } },
    include: {
      nilaiAspeks: { orderBy: { aspek: "asc" } },
      nilaiKolabs: { orderBy: { aspek: "asc" } },
    },
  })
}

export async function getSubmissionsByTahap(tahapId: string) {
  return prisma.submission.findMany({
    where: { tahapId },
    include: {
      user: { select: { id: true, nama: true, nim: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  })
}

export async function getSubmissionWithNilai(submissionId: string) {
  return prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      user: { select: { nama: true, nim: true, email: true } },
      tahap: {
        include: { kelas: { select: { dosenId: true, nama: true } } },
      },
      nilaiAspeks: true,
      nilaiKolabs: true,
    },
  })
}

export async function getDosenList() {
  return prisma.user.findMany({
    where: { role: "DOSEN" },
    select: { id: true, nama: true, email: true, role: true },
    orderBy: { nama: "asc" },
  })
}

/** Peer review yang harus dikerjakan oleh mahasiswa (sebagai reviewer). */
export async function getPeerReviewAsReviewer(tahapId: string, reviewerId: string) {
  return prisma.peerReview.findFirst({
    where: {
      reviewerId,
      submission: { tahapId },
    },
    include: {
      submission: {
        select: { isiEsai: true, linkSubmisi: true },
      },
      reviewee: { select: { nama: true } },
    },
  })
}

/** Semua peer review yang diterima mahasiswa (sebagai reviewee). */
export async function getPeerReviewsReceived(tahapId: string, revieweeId: string) {
  return prisma.peerReview.findMany({
    where: {
      revieweeId,
      submission: { tahapId },
    },
    include: {
      reviewer: { select: { nama: true } },
    },
    orderBy: { createdAt: "asc" },
  })
}

/** Jumlah peer review yang sudah di-assign untuk sebuah tahap. */
export async function getPeerReviewCount(tahapId: string) {
  return prisma.peerReview.count({
    where: { submission: { tahapId } },
  })
}
