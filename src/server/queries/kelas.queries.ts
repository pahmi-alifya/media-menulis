import { prisma } from "@/lib/prisma"

export async function getKelasByDosen(dosenId: string) {
  return prisma.kelas.findFirst({
    where: { dosenId },
    include: {
      tahaps: { orderBy: { urutan: "asc" } },
      _count: { select: { enrollments: true } },
    },
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

export async function getKelasByMahasiswa(userId: string) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      kelas: {
        include: {
          tahaps: { orderBy: { urutan: "asc" } },
          dosen: { select: { nama: true } },
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  })
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
