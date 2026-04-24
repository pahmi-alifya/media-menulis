"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

type Result<T> = { data: T; error: null } | { data: null; error: string }

async function getOrCreateForum(kontenId: string, kelasId: string, kelompokName?: string | null) {
  const existing = await prisma.forum.findFirst({
    where: {
      kontenId,
      kelasId,
      namaKelompok: kelompokName ?? null,
    },
  })
  if (existing) return existing

  const tipe = kelompokName ? ("KELOMPOK" as const) : ("KELAS" as const)
  return prisma.forum.create({
    data: { kontenId, kelasId, tipe, namaKelompok: kelompokName ?? null },
  })
}

/** Kirim pesan baru ke forum (top-level atau reply). */
export async function sendPesanAction(
  kontenId: string,
  kelasId: string,
  isi: string,
  replyToId?: string | null,
  kelompokName?: string | null,
): Promise<Result<{ id: string }>> {
  const session = await auth()
  if (!session?.user?.id) return { data: null, error: "Tidak terautentikasi" }

  const trimmed = isi.replace(/<[^>]*>/g, "").trim()
  if (!trimmed) return { data: null, error: "Pesan tidak boleh kosong" }

  const forum = await getOrCreateForum(kontenId, kelasId, kelompokName)

  const pesan = await prisma.pesanForum.create({
    data: {
      forumId: forum.id,
      userId: session.user.id,
      isi,
      replyToId: replyToId ?? null,
    },
  })

  return { data: { id: pesan.id }, error: null }
}
