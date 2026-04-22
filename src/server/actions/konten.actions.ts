"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { KontenTipe, KategoriKonten } from "@prisma/client"

type Result<T = void> = { data: T; error: null } | { data: null; error: string }

async function verifyDosenTahap(tahapId: string, dosenId: string) {
  return prisma.tahap.findFirst({
    where: { id: tahapId, kelas: { dosenId } },
    include: { kelas: true },
  })
}

export async function createKontenAction(input: {
  tahapId: string
  pertemuanKe: number
  tipe: KontenTipe
  judul: string
  body?: string
  url?: string
  kategori: KategoriKonten
}): Promise<Result<{ id: string }>> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }

  const tahap = await verifyDosenTahap(input.tahapId, session.user.id)
  if (!tahap) return { data: null, error: "Tahap tidak ditemukan atau akses ditolak." }

  if (!input.judul.trim()) return { data: null, error: "Judul wajib diisi." }
  if (input.tipe !== "TEKS" && !input.url?.trim()) return { data: null, error: "URL wajib diisi." }
  if (input.tipe === "TEKS" && !input.body?.trim()) return { data: null, error: "Isi teks wajib diisi." }

  const maxUrutan = await prisma.konten.aggregate({
    where: { tahapId: input.tahapId, pertemuanKe: input.pertemuanKe },
    _max: { urutan: true },
  })
  const urutan = (maxUrutan._max.urutan ?? 0) + 1

  const konten = await prisma.konten.create({
    data: {
      tahapId: input.tahapId,
      pertemuanKe: input.pertemuanKe,
      tipe: input.tipe,
      judul: input.judul.trim(),
      body: input.tipe === "TEKS" ? (input.body?.trim() ?? null) : null,
      url: input.tipe !== "TEKS" ? (input.url?.trim() ?? null) : null,
      kategori: input.kategori,
      urutan,
    },
  })

  revalidatePath(`/dosen/pertemuan/${input.pertemuanKe}/tahap/${input.tahapId}`)
  return { data: { id: konten.id }, error: null }
}

export async function updateKontenAction(input: {
  id: string
  tipe: KontenTipe
  judul: string
  body?: string
  url?: string
  kategori: KategoriKonten
  pertemuanKe: number
}): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }

  const konten = await prisma.konten.findUnique({
    where: { id: input.id },
    include: { tahap: { include: { kelas: true } } },
  })
  if (!konten || konten.tahap.kelas.dosenId !== session.user.id) {
    return { data: null, error: "Konten tidak ditemukan atau akses ditolak." }
  }

  if (!input.judul.trim()) return { data: null, error: "Judul wajib diisi." }

  await prisma.konten.update({
    where: { id: input.id },
    data: {
      tipe: input.tipe,
      judul: input.judul.trim(),
      body: input.tipe === "TEKS" ? (input.body?.trim() ?? null) : null,
      url: input.tipe !== "TEKS" ? (input.url?.trim() ?? null) : null,
      kategori: input.kategori,
      pertemuanKe: input.pertemuanKe,
    },
  })

  revalidatePath(`/dosen/pertemuan/${input.pertemuanKe}/tahap/${konten.tahapId}`)
  return { data: undefined, error: null }
}

export async function deleteKontenAction(id: string): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }

  const konten = await prisma.konten.findUnique({
    where: { id },
    include: { tahap: { include: { kelas: true } } },
  })
  if (!konten || konten.tahap.kelas.dosenId !== session.user.id) {
    return { data: null, error: "Konten tidak ditemukan atau akses ditolak." }
  }

  await prisma.konten.delete({ where: { id } })
  revalidatePath(`/dosen/pertemuan/${konten.pertemuanKe}/tahap/${konten.tahapId}`)
  return { data: undefined, error: null }
}

export async function reorderKontenAction(orderedIds: string[]): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }

  if (orderedIds.length === 0) return { data: undefined, error: null }

  const kontenList = await prisma.konten.findMany({
    where: { id: { in: orderedIds } },
    include: { tahap: { include: { kelas: true } } },
  })
  if (kontenList.some((k) => k.tahap.kelas.dosenId !== session.user.id)) {
    return { data: null, error: "Akses ditolak." }
  }

  await prisma.$transaction(
    orderedIds.map((id, idx) =>
      prisma.konten.update({ where: { id }, data: { urutan: idx + 1 } }),
    ),
  )

  return { data: undefined, error: null }
}
