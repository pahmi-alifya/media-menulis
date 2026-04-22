"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

type Result<T = void> = { data: T; error: null } | { data: null; error: string }

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$"
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") return null
  return session
}

export async function createDosenAction(input: {
  nama: string
  email: string
}): Promise<Result<{ password: string }>> {
  if (!(await requireAdmin())) return { data: null, error: "Akses ditolak." }

  if (!input.nama.trim() || !input.email.trim()) {
    return { data: null, error: "Nama dan email wajib diisi." }
  }

  const exists = await prisma.user.findUnique({ where: { email: input.email.toLowerCase().trim() } })
  if (exists) return { data: null, error: "Email sudah terdaftar." }

  const plainPassword = generatePassword()
  const hashed = await bcrypt.hash(plainPassword, 12)

  await prisma.user.create({
    data: {
      nama: input.nama.trim(),
      email: input.email.toLowerCase().trim(),
      password: hashed,
      role: "DOSEN",
    },
  })

  revalidatePath("/admin/dosen")
  return { data: { password: plainPassword }, error: null }
}

export async function updateDosenAction(input: {
  id: string
  nama: string
  email: string
}): Promise<Result> {
  if (!(await requireAdmin())) return { data: null, error: "Akses ditolak." }

  if (!input.nama.trim() || !input.email.trim()) {
    return { data: null, error: "Nama dan email wajib diisi." }
  }

  const conflict = await prisma.user.findFirst({
    where: { email: input.email.toLowerCase().trim(), NOT: { id: input.id } },
  })
  if (conflict) return { data: null, error: "Email sudah digunakan." }

  await prisma.user.update({
    where: { id: input.id },
    data: { nama: input.nama.trim(), email: input.email.toLowerCase().trim() },
  })

  revalidatePath("/admin/dosen")
  return { data: undefined, error: null }
}

export async function deleteDosenAction(id: string): Promise<Result> {
  if (!(await requireAdmin())) return { data: null, error: "Akses ditolak." }

  const hasKelas = await prisma.kelas.count({ where: { dosenId: id } })
  if (hasKelas > 0) {
    return { data: null, error: "Dosen masih memiliki kelas aktif. Hapus kelas terlebih dahulu." }
  }

  await prisma.user.delete({ where: { id } })

  revalidatePath("/admin/dosen")
  return { data: undefined, error: null }
}

export async function resetDosenPasswordAction(userId: string): Promise<Result<{ password: string }>> {
  if (!(await requireAdmin())) return { data: null, error: "Akses ditolak." }

  const plainPassword = generatePassword()
  const hashed = await bcrypt.hash(plainPassword, 12)
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } })

  revalidatePath("/admin/dosen")
  return { data: { password: plainPassword }, error: null }
}
