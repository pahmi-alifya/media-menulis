"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type Result<T> = { data: T; error: null } | { data: null; error: string }

type SubmissionData = {
  isiEsai?: string | null
  linkSubmisi?: string | null
}

export async function saveDraftAction(
  tahapId: string,
  data: SubmissionData,
): Promise<Result<{ id: string }>> {
  const session = await auth()
  if (!session?.user?.id) return { data: null, error: "Tidak terautentikasi" }

  const userId = session.user.id

  const tahap = await prisma.tahap.findUnique({
    where: { id: tahapId },
    select: { isUnlocked: true },
  })
  if (!tahap) return { data: null, error: "Tahap tidak ditemukan" }
  if (!tahap.isUnlocked) return { data: null, error: "Tahap belum dibuka" }

  // Tidak boleh edit submission yang sudah final
  const existing = await prisma.submission.findUnique({
    where: { tahapId_userId: { tahapId, userId } },
    select: { isDraft: true },
  })
  if (existing && !existing.isDraft) {
    return { data: null, error: "Tugas sudah dikumpulkan dan tidak dapat diubah" }
  }

  const submission = await prisma.submission.upsert({
    where: { tahapId_userId: { tahapId, userId } },
    create: { tahapId, userId, isDraft: true, ...data },
    update: { ...data },
    select: { id: true },
  })

  return { data: { id: submission.id }, error: null }
}

export async function submitTugasAction(
  tahapId: string,
  data: SubmissionData,
): Promise<Result<{ id: string }>> {
  const session = await auth()
  if (!session?.user?.id) return { data: null, error: "Tidak terautentikasi" }

  const userId = session.user.id

  const tahap = await prisma.tahap.findUnique({
    where: { id: tahapId },
    select: { isUnlocked: true, tipeSubmisi: true },
  })
  if (!tahap) return { data: null, error: "Tahap tidak ditemukan" }
  if (!tahap.isUnlocked) return { data: null, error: "Tahap belum dibuka" }

  const existing = await prisma.submission.findUnique({
    where: { tahapId_userId: { tahapId, userId } },
    select: { isDraft: true },
  })
  if (existing && !existing.isDraft) {
    return { data: null, error: "Tugas sudah dikumpulkan dan tidak dapat diubah" }
  }

  // Validasi isi per tipe
  if (tahap.tipeSubmisi === "TEKS_LANGSUNG" && !data.isiEsai?.trim()) {
    return { data: null, error: "Esai tidak boleh kosong" }
  }
  if (
    (tahap.tipeSubmisi === "LINK_SLIDE" ||
      tahap.tipeSubmisi === "LINK_DOKUMEN" ||
      tahap.tipeSubmisi === "LINK_VIDEO") &&
    !data.linkSubmisi?.trim()
  ) {
    return { data: null, error: "Link tidak boleh kosong" }
  }
  if (tahap.tipeSubmisi === "CAMPURAN" && !data.isiEsai?.trim() && !data.linkSubmisi?.trim()) {
    return { data: null, error: "Minimal esai atau link harus diisi" }
  }

  const submission = await prisma.submission.upsert({
    where: { tahapId_userId: { tahapId, userId } },
    create: {
      tahapId,
      userId,
      isDraft: false,
      submittedAt: new Date(),
      ...data,
    },
    update: {
      isDraft: false,
      submittedAt: new Date(),
      ...data,
    },
    select: { id: true },
  })

  revalidatePath(`/mahasiswa/pertemuan`)

  return { data: { id: submission.id }, error: null }
}
