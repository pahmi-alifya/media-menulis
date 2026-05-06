"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

type Result<T = void> = { data: T; error: null } | { data: null; error: string }

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$"
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

// ── Dosen: tambah mahasiswa ke kelas ─────────────────────────────────────────

export async function enrollMahasiswaAction(input: {
  nama: string
  nim?: string
  email: string
  kelasId: string
}): Promise<Result<{ password: string | null; isNewUser: boolean }>> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }

  const kelas = await prisma.kelas.findUnique({ where: { id: input.kelasId } })
  if (!kelas || kelas.dosenId !== session.user.id) {
    return { data: null, error: "Kelas tidak ditemukan." }
  }

  if (!input.nama.trim() || !input.email.trim()) {
    return { data: null, error: "Nama dan email wajib diisi." }
  }

  const emailLower = input.email.toLowerCase().trim()

  let user = await prisma.user.findUnique({ where: { email: emailLower } })
  let plainPassword: string | null = null
  let isNewUser = false

  if (user) {
    if (user.role !== "MAHASISWA") {
      return { data: null, error: "Email sudah digunakan oleh akun non-mahasiswa." }
    }
    const existing = await prisma.enrollment.findUnique({
      where: { kelasId_userId: { kelasId: input.kelasId, userId: user.id } },
    })
    if (existing) return { data: null, error: "Mahasiswa sudah terdaftar di kelas ini." }
  } else {
    plainPassword = generatePassword()
    const hashed = await bcrypt.hash(plainPassword, 12)
    user = await prisma.user.create({
      data: {
        nama: input.nama.trim(),
        nim: input.nim?.trim() || null,
        email: emailLower,
        password: hashed,
        role: "MAHASISWA",
      },
    })
    isNewUser = true
  }

  await prisma.enrollment.create({
    data: {
      kelasId: input.kelasId,
      userId: user.id,
      nim: input.nim?.trim() || null,
    },
  })

  revalidatePath("/dosen/mahasiswa")
  return { data: { password: plainPassword, isNewUser }, error: null }
}

// ── Dosen: tambah mahasiswa ke banyak kelas sekaligus ────────────────────────

export async function enrollMahasiswaMultiAction(input: {
  nama: string
  nim?: string
  email: string
  kelasIds: string[]
}): Promise<Result<{ password: string | null; isNewUser: boolean; addedCount: number }>> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }
  if (!input.kelasIds.length) return { data: null, error: "Pilih minimal satu kelas." }
  if (!input.nama.trim() || !input.email.trim()) {
    return { data: null, error: "Nama dan email wajib diisi." }
  }

  // Validasi semua kelas milik dosen ini
  const kelasList = await prisma.kelas.findMany({
    where: { id: { in: input.kelasIds }, dosenId: session.user.id },
    select: { id: true },
  })
  if (kelasList.length !== input.kelasIds.length) {
    return { data: null, error: "Satu atau lebih kelas tidak valid." }
  }

  const emailLower = input.email.toLowerCase().trim()
  let user = await prisma.user.findUnique({ where: { email: emailLower } })
  let plainPassword: string | null = null
  let isNewUser = false

  if (user) {
    if (user.role !== "MAHASISWA") {
      return { data: null, error: "Email sudah digunakan oleh akun non-mahasiswa." }
    }
  } else {
    plainPassword = generatePassword()
    const hashed = await bcrypt.hash(plainPassword, 12)
    user = await prisma.user.create({
      data: {
        nama: input.nama.trim(),
        nim: input.nim?.trim() || null,
        email: emailLower,
        password: hashed,
        role: "MAHASISWA",
      },
    })
    isNewUser = true
  }

  // Buat enrollment untuk kelas yang belum diikuti
  const existing = await prisma.enrollment.findMany({
    where: { userId: user.id, kelasId: { in: input.kelasIds } },
    select: { kelasId: true },
  })
  const existingIds = new Set(existing.map((e) => e.kelasId))
  const newKelasIds = input.kelasIds.filter((id) => !existingIds.has(id))

  if (newKelasIds.length > 0) {
    await prisma.enrollment.createMany({
      data: newKelasIds.map((kelasId) => ({
        kelasId,
        userId: user!.id,
        nim: input.nim?.trim() || null,
      })),
    })
  }

  revalidatePath("/dosen/mahasiswa")
  return { data: { password: plainPassword, isNewUser, addedCount: newKelasIds.length }, error: null }
}

// ── Dosen: tambahkan mahasiswa yang sudah ada ke kelas tambahan ───────────────

export async function addKelasToMahasiswaAction(input: {
  userId: string
  kelasIds: string[]
}): Promise<Result<{ addedCount: number }>> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }
  if (!input.kelasIds.length) return { data: { addedCount: 0 }, error: null }

  const kelasList = await prisma.kelas.findMany({
    where: { id: { in: input.kelasIds }, dosenId: session.user.id },
    select: { id: true },
  })
  if (kelasList.length !== input.kelasIds.length) {
    return { data: null, error: "Satu atau lebih kelas tidak valid." }
  }

  const existing = await prisma.enrollment.findMany({
    where: { userId: input.userId, kelasId: { in: input.kelasIds } },
    select: { kelasId: true },
  })
  const existingIds = new Set(existing.map((e) => e.kelasId))
  const newKelasIds = input.kelasIds.filter((id) => !existingIds.has(id))

  if (newKelasIds.length > 0) {
    await prisma.enrollment.createMany({
      data: newKelasIds.map((kelasId) => ({ kelasId, userId: input.userId })),
    })
  }

  revalidatePath("/dosen/mahasiswa")
  return { data: { addedCount: newKelasIds.length }, error: null }
}

// ── Mahasiswa: set kelas aktif ────────────────────────────────────────────────

export async function setActiveMahasiswaKelasAction(kelasId: string): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "MAHASISWA") {
    return { data: null, error: "Akses ditolak." }
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id, kelasId },
  })
  if (!enrollment) return { data: null, error: "Tidak terdaftar di kelas ini." }

  const cookieStore = await cookies()
  cookieStore.set("activeMahasiswaKelasId", kelasId, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  })
  return { data: undefined, error: null }
}

// ── Mahasiswa: bergabung via kode ─────────────────────────────────────────────

export async function joinKelasAction(kode: string): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "MAHASISWA") {
    return { data: null, error: "Akses ditolak." }
  }

  const kelas = await prisma.kelas.findUnique({ where: { kode: kode.toUpperCase().trim() } })
  if (!kelas) return { data: null, error: "Kode kelas tidak ditemukan." }

  const existing = await prisma.enrollment.findUnique({
    where: { kelasId_userId: { kelasId: kelas.id, userId: session.user.id } },
  })
  if (existing) return { data: null, error: "Kamu sudah terdaftar di kelas ini." }

  await prisma.enrollment.create({
    data: { kelasId: kelas.id, userId: session.user.id },
  })

  revalidatePath("/mahasiswa/dashboard")
  return { data: undefined, error: null }
}

// ── Dosen: hapus mahasiswa dari kelas ────────────────────────────────────────

export async function removeEnrollmentAction(enrollmentId: string): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      kelas: { include: { tahaps: { select: { id: true } } } },
    },
  })
  if (!enrollment) return { data: null, error: "Data tidak ditemukan." }
  if (enrollment.kelas.dosenId !== session.user.id) return { data: null, error: "Akses ditolak." }

  const tahapIds = enrollment.kelas.tahaps.map((t) => t.id)
  const submissions = await prisma.submission.findMany({
    where: { userId: enrollment.userId, tahapId: { in: tahapIds } },
    select: { id: true },
  })
  const submissionIds = submissions.map((s) => s.id)

  if (submissionIds.length > 0) {
    await prisma.nilaiAspek.deleteMany({ where: { submissionId: { in: submissionIds } } })
    await prisma.nilaiKolaborasi.deleteMany({ where: { submissionId: { in: submissionIds } } })
    await prisma.peerReview.deleteMany({ where: { submissionId: { in: submissionIds } } })
    await prisma.submission.deleteMany({ where: { id: { in: submissionIds } } })
  }

  await prisma.enrollment.delete({ where: { id: enrollmentId } })

  revalidatePath("/dosen/mahasiswa")
  return { data: undefined, error: null }
}

// ── Dosen: edit data mahasiswa ────────────────────────────────────────────────

export async function updateEnrollmentAction(input: {
  enrollmentId: string
  nama: string
  nim?: string
  email: string
}): Promise<Result> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: input.enrollmentId },
    include: { kelas: true },
  })
  if (!enrollment) return { data: null, error: "Data tidak ditemukan." }
  if (enrollment.kelas.dosenId !== session.user.id) return { data: null, error: "Akses ditolak." }

  const emailLower = input.email.toLowerCase().trim()
  const conflict = await prisma.user.findFirst({
    where: { email: emailLower, NOT: { id: enrollment.userId } },
  })
  if (conflict) return { data: null, error: "Email sudah digunakan akun lain." }

  await prisma.user.update({
    where: { id: enrollment.userId },
    data: {
      nama: input.nama.trim(),
      nim: input.nim?.trim() || null,
      email: emailLower,
    },
  })

  await prisma.enrollment.update({
    where: { id: input.enrollmentId },
    data: { nim: input.nim?.trim() || null },
  })

  revalidatePath("/dosen/mahasiswa")
  return { data: undefined, error: null }
}

// ── Dosen: reset kata sandi mahasiswa ────────────────────────────────────────

export async function resetMahasiswaPasswordAction(
  userId: string,
  kelasId: string,
): Promise<Result<{ password: string }>> {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "DOSEN") {
    return { data: null, error: "Akses ditolak." }
  }

  const kelas = await prisma.kelas.findUnique({ where: { id: kelasId } })
  if (!kelas || kelas.dosenId !== session.user.id) {
    return { data: null, error: "Kelas tidak ditemukan." }
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { kelasId_userId: { kelasId, userId } },
  })
  if (!enrollment) return { data: null, error: "Mahasiswa tidak terdaftar di kelas ini." }

  const plainPassword = generatePassword()
  const hashed = await bcrypt.hash(plainPassword, 12)
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } })

  return { data: { password: plainPassword }, error: null }
}
