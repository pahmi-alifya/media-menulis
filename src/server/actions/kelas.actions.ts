"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { getKelasById } from "@/server/queries/kelas.queries"

type Result<T = void> = { data: T; error: null } | { data: null; error: string }

const TAHAP_DEFINITIONS = [
  { urutan: 1, kode: "SMKM" as const, tipeSubmisi: "LINK_SLIDE" as const,    isUnlocked: true  },
  { urutan: 2, kode: "EPM"  as const, tipeSubmisi: "LINK_DOKUMEN" as const,  isUnlocked: false },
  { urutan: 3, kode: "KMBM" as const, tipeSubmisi: "LINK_DOKUMEN" as const,  isUnlocked: false },
  { urutan: 4, kode: "IMMM" as const, tipeSubmisi: "TEKS_LANGSUNG" as const, isUnlocked: false },
  { urutan: 5, kode: "IMTM" as const, tipeSubmisi: "LINK_SLIDE" as const,    isUnlocked: false },
]

export async function createKelasAction(input: {
  nama: string
  deskripsi?: string
}): Promise<Result<{ id: string; kode: string }>> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }

  if (!input.nama.trim()) return { data: null, error: "Nama kelas wajib diisi." }

  // Generate unique 6-char uppercase kode
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let kode = ""
  let attempt = 0
  do {
    kode = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    attempt++
    if (attempt > 10) return { data: null, error: "Gagal membuat kode kelas. Coba lagi." }
  } while (await prisma.kelas.findUnique({ where: { kode } }))

  const kelas = await prisma.kelas.create({
    data: {
      nama: input.nama.trim(),
      deskripsi: input.deskripsi?.trim() || null,
      kode,
      dosenId: session.user.id,
      tahaps: {
        create: TAHAP_DEFINITIONS.map((def) => ({
          urutan: def.urutan,
          kode: def.kode,
          tipeSubmisi: def.tipeSubmisi,
          isUnlocked: def.isUnlocked,
          unlockedAt: def.isUnlocked ? new Date() : null,
        })),
      },
    },
  })

  // Forum KELAS default
  await prisma.forum.create({
    data: { kelasId: kelas.id, tipe: "KELAS" },
  })

  revalidatePath("/dosen/dashboard")
  return { data: { id: kelas.id, kode: kelas.kode }, error: null }
}

export async function unlockTahapAction(tahapId: string): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }

  const tahap = await prisma.tahap.findUnique({
    where: { id: tahapId },
    include: { kelas: true },
  })

  if (!tahap) return { data: null, error: "Tahap tidak ditemukan." }
  if (tahap.kelas.dosenId !== session.user.id) return { data: null, error: "Akses ditolak." }
  if (tahap.isUnlocked) return { data: null, error: "Tahap sudah terbuka." }

  if (tahap.urutan > 1) {
    const prevTahap = await prisma.tahap.findUnique({
      where: { kelasId_urutan: { kelasId: tahap.kelasId, urutan: tahap.urutan - 1 } },
    })
    if (!prevTahap?.isUnlocked) {
      return { data: null, error: "Tahap sebelumnya belum dibuka." }
    }
  }

  await prisma.tahap.update({
    where: { id: tahapId },
    data: { isUnlocked: true, unlockedAt: new Date() },
  })

  revalidatePath("/dosen/pertemuan/1")
  revalidatePath("/dosen/pertemuan/2")
  return { data: undefined, error: null }
}

export async function updateLinkPanduanMahasiswaAction(link: string): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id) return { data: null, error: "Tidak terautentikasi." }

  const cookieStore = await cookies()
  const activeId = cookieStore.get("activeKelasId")?.value
  const kelas = activeId
    ? await getKelasById(activeId, session.user.id)
    : await prisma.kelas.findFirst({ where: { dosenId: session.user.id } })
  if (!kelas) return { data: null, error: "Kelas tidak ditemukan." }

  await prisma.kelas.update({
    where: { id: kelas.id },
    data: { linkPanduanMahasiswa: link.trim() || null },
  })

  revalidatePath("/dosen/dashboard")
  revalidatePath("/mahasiswa/dashboard")
  return { data: undefined, error: null }
}

export async function updateNamaKelasAction(nama: string): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id) return { data: null, error: "Tidak terautentikasi." }
  if (!nama.trim()) return { data: null, error: "Nama kelas wajib diisi." }

  const cookieStore = await cookies()
  const activeId = cookieStore.get("activeKelasId")?.value
  const kelas = activeId
    ? await getKelasById(activeId, session.user.id)
    : await prisma.kelas.findFirst({ where: { dosenId: session.user.id } })
  if (!kelas) return { data: null, error: "Kelas tidak ditemukan." }

  await prisma.kelas.update({ where: { id: kelas.id }, data: { nama: nama.trim() } })

  revalidatePath("/dosen/pertemuan")
  revalidatePath("/dosen/pertemuan/1")
  revalidatePath("/dosen/pertemuan/2")
  revalidatePath("/dosen/dashboard")
  return { data: undefined, error: null }
}

export async function updateLinkModelPembelajaranAction(link: string): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id) return { data: null, error: "Tidak terautentikasi." }

  const cookieStore = await cookies()
  const activeId = cookieStore.get("activeKelasId")?.value
  const kelas = activeId
    ? await getKelasById(activeId, session.user.id)
    : await prisma.kelas.findFirst({ where: { dosenId: session.user.id } })
  if (!kelas) return { data: null, error: "Kelas tidak ditemukan." }

  await prisma.kelas.update({
    where: { id: kelas.id },
    data: { linkModelPembelajaran: link.trim() || null },
  })

  revalidatePath("/dosen/pertemuan/1")
  revalidatePath("/dosen/pertemuan/2")
  return { data: undefined, error: null }
}

// ─── Multi-kelas actions ───────────────────────────────────────────────────

export async function setActiveKelasAction(kelasId: string): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }

  const kelas = await getKelasById(kelasId, session.user.id)
  if (!kelas) return { data: null, error: "Kelas tidak ditemukan." }

  const cookieStore = await cookies()
  cookieStore.set("activeKelasId", kelasId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: false,
    sameSite: "lax",
  })

  revalidatePath("/dosen/dashboard")
  revalidatePath("/dosen/pertemuan")
  revalidatePath("/dosen/pertemuan/1")
  revalidatePath("/dosen/pertemuan/2")
  return { data: undefined, error: null }
}

export async function updateKelasAction(input: {
  kelasId: string
  nama: string
  deskripsi?: string
}): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }
  if (!input.nama.trim()) return { data: null, error: "Nama kelas wajib diisi." }

  const kelas = await getKelasById(input.kelasId, session.user.id)
  if (!kelas) return { data: null, error: "Kelas tidak ditemukan." }

  await prisma.kelas.update({
    where: { id: input.kelasId },
    data: {
      nama: input.nama.trim(),
      deskripsi: input.deskripsi?.trim() || null,
    },
  })

  revalidatePath("/dosen/kelas")
  revalidatePath("/dosen/dashboard")
  revalidatePath("/dosen/pertemuan")
  revalidatePath("/dosen/pertemuan/1")
  revalidatePath("/dosen/pertemuan/2")
  return { data: undefined, error: null }
}

export async function deleteKelasAction(kelasId: string): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }

  const kelas = await getKelasById(kelasId, session.user.id)
  if (!kelas) return { data: null, error: "Kelas tidak ditemukan." }

  // Ambil ID semua tahap dan forum milik kelas ini
  const tahapIds = kelas.tahaps.map((t) => t.id)
  const forumIds = (
    await prisma.forum.findMany({ where: { kelasId }, select: { id: true } })
  ).map((f) => f.id)

  await prisma.$transaction([
    // Hapus PeerReview (FK → Submission)
    prisma.peerReview.deleteMany({ where: { submission: { tahapId: { in: tahapIds } } } }),
    // Hapus NilaiAspek & NilaiKolaborasi (FK → Submission)
    prisma.nilaiAspek.deleteMany({ where: { submission: { tahapId: { in: tahapIds } } } }),
    prisma.nilaiKolaborasi.deleteMany({ where: { submission: { tahapId: { in: tahapIds } } } }),
    // Hapus Submission
    prisma.submission.deleteMany({ where: { tahapId: { in: tahapIds } } }),
    // Hapus PesanForum: nullify self-ref dulu, lalu delete
    prisma.pesanForum.updateMany({ where: { forumId: { in: forumIds } }, data: { replyToId: null } }),
    prisma.pesanForum.deleteMany({ where: { forumId: { in: forumIds } } }),
    // Hapus Forum, Konten, Tahap, Enrollment, Kelas
    prisma.forum.deleteMany({ where: { kelasId } }),
    prisma.konten.deleteMany({ where: { tahapId: { in: tahapIds } } }),
    prisma.tahap.deleteMany({ where: { kelasId } }),
    prisma.enrollment.deleteMany({ where: { kelasId } }),
    prisma.kelas.delete({ where: { id: kelasId } }),
  ])

  // Hapus cookie aktif jika ini kelas yang sedang aktif
  const cookieStore = await cookies()
  if (cookieStore.get("activeKelasId")?.value === kelasId) {
    cookieStore.delete("activeKelasId")
  }

  revalidatePath("/dosen/kelas")
  revalidatePath("/dosen/dashboard")
  return { data: undefined, error: null }
}

export async function duplicateKelasAction(input: {
  sourceKelasId: string
  nama: string
  deskripsi?: string
}): Promise<Result<{ id: string; kode: string }>> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }
  if (!input.nama.trim()) return { data: null, error: "Nama kelas wajib diisi." }

  // Fetch source kelas + semua tahap + konten dalam 1 query
  const source = await prisma.kelas.findFirst({
    where: { id: input.sourceKelasId, dosenId: session.user.id },
    include: {
      tahaps: {
        orderBy: { urutan: "asc" },
        include: { konten: { orderBy: { urutan: "asc" } } },
      },
    },
  })
  if (!source) return { data: null, error: "Kelas sumber tidak ditemukan." }

  // Build map urutan → konten[]
  const kontenByUrutan: Record<number, typeof source.tahaps[0]["konten"]> = {}
  for (const t of source.tahaps) {
    kontenByUrutan[t.urutan] = t.konten
  }

  // Generate kode unik
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let kode = ""
  let attempt = 0
  do {
    kode = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    attempt++
    if (attempt > 10) return { data: null, error: "Gagal membuat kode kelas. Coba lagi." }
  } while (await prisma.kelas.findUnique({ where: { kode } }))

  const newKelas = await prisma.kelas.create({
    data: {
      nama: input.nama.trim(),
      deskripsi: input.deskripsi?.trim() ?? source.deskripsi ?? null,
      kode,
      dosenId: session.user.id,
      linkModelPembelajaran: source.linkModelPembelajaran,
      linkPanduanMahasiswa: source.linkPanduanMahasiswa,
      tahaps: {
        create: TAHAP_DEFINITIONS.map((def) => ({
          urutan: def.urutan,
          kode: def.kode,
          tipeSubmisi: def.tipeSubmisi,
          isUnlocked: def.isUnlocked,
          unlockedAt: def.isUnlocked ? new Date() : null,
          konten: {
            create: (kontenByUrutan[def.urutan] ?? []).map((k) => ({
              tipe: k.tipe,
              judul: k.judul,
              body: k.body,
              url: k.url,
              urutan: k.urutan,
              pertemuanKe: k.pertemuanKe,
              kategori: k.kategori,
            })),
          },
        })),
      },
    },
  })

  // Forum KELAS default
  await prisma.forum.create({ data: { kelasId: newKelas.id, tipe: "KELAS" } })

  // Set kelas baru sebagai aktif
  const cookieStore = await cookies()
  cookieStore.set("activeKelasId", newKelas.id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: false,
    sameSite: "lax",
  })

  revalidatePath("/dosen/kelas")
  revalidatePath("/dosen/dashboard")
  revalidatePath("/dosen/pertemuan")
  revalidatePath("/dosen/pertemuan/1")
  revalidatePath("/dosen/pertemuan/2")
  return { data: { id: newKelas.id, kode: newKelas.kode }, error: null }
}
