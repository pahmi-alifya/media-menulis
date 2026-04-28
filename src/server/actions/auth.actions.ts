"use server"

import { signIn, signOut, auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { registerSchema } from "@/lib/validations/auth.schema"

type ActionResult = { error?: string }

// ── Login ─────────────────────────────────────────────────────────────────────

export async function loginAction(email: string, password: string): Promise<ActionResult> {
  try {
    await signIn("credentials", { email, password, redirectTo: "/" })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email atau kata sandi salah." }
        default:
          return { error: "Terjadi kesalahan. Coba lagi." }
      }
    }
    throw error // Re-throw redirect error (NEXT_REDIRECT)
  }
  return {}
}

// ── Register Mahasiswa ────────────────────────────────────────────────────────

export async function registerMahasiswaAction(input: {
  nama: string
  nim: string
  email: string
  password: string
  konfirmasi: string
}): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid." }
  }

  const { nama, nim, email, password } = parsed.data

  const exists = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })
  if (exists) {
    return { error: "Email sudah terdaftar." }
  }

  const hashed = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      nama,
      nim,
      email: email.toLowerCase(),
      password: hashed,
      role: "MAHASISWA",
    },
  })

  // Auto-login dan redirect setelah register berhasil
  try {
    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirectTo: "/mahasiswa/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Akun berhasil dibuat. Silakan login." }
    }
    throw error
  }

  return {}
}

// ── Ganti Kata Sandi ─────────────────────────────────────────────────────────

export async function changePasswordAction(input: {
  passwordLama: string
  passwordBaru: string
  konfirmasi: string
}): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Sesi tidak ditemukan. Silakan login kembali." }
  }

  if (input.passwordBaru !== input.konfirmasi) {
    return { error: "Konfirmasi kata sandi tidak cocok." }
  }

  if (input.passwordBaru.length < 8) {
    return { error: "Kata sandi baru minimal 8 karakter." }
  }

  if (input.passwordBaru === input.passwordLama) {
    return { error: "Kata sandi baru tidak boleh sama dengan yang lama." }
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return { error: "Pengguna tidak ditemukan." }

  const valid = await bcrypt.compare(input.passwordLama, user.password)
  if (!valid) return { error: "Kata sandi lama tidak sesuai." }

  const hashed = await bcrypt.hash(input.passwordBaru, 12)
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  })

  return {}
}

// ── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAction() {
  await signOut({ redirectTo: "/login" })
}
