import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(1, "Kata sandi wajib diisi."),
})

export const registerSchema = z
  .object({
    nama: z.string().min(2, "Nama minimal 2 karakter.").max(100, "Nama terlalu panjang."),
    nim: z.string().optional(),
    email: z.string().email("Format email tidak valid."),
    password: z.string().min(8, "Kata sandi minimal 8 karakter."),
    konfirmasi: z.string(),
  })
  .refine((d) => d.password === d.konfirmasi, {
    message: "Konfirmasi kata sandi tidak cocok.",
    path: ["konfirmasi"],
  })

export const changePasswordSchema = z
  .object({
    passwordLama: z.string().min(1, "Kata sandi lama wajib diisi."),
    passwordBaru: z.string().min(8, "Kata sandi baru minimal 8 karakter."),
    konfirmasi: z.string(),
  })
  .refine((d) => d.passwordBaru === d.konfirmasi, {
    message: "Konfirmasi kata sandi tidak cocok.",
    path: ["konfirmasi"],
  })
  .refine((d) => d.passwordBaru !== d.passwordLama, {
    message: "Kata sandi baru tidak boleh sama dengan yang lama.",
    path: ["passwordBaru"],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
