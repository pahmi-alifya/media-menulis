"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth.schema"
import { registerMahasiswaAction } from "@/server/actions/auth.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function RegisterForm() {
  const [serverError, setServerError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterInput) {
    setServerError("")
    const result = await registerMahasiswaAction(data)
    if (result?.error) {
      setServerError(result.error)
      toast.error(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="nama">Nama Lengkap</Label>
        <Input
          id="nama"
          placeholder="Nama sesuai identitas"
          className="h-10"
          {...register("nama")}
        />
        {errors.nama && (
          <p className="text-xs text-destructive">{errors.nama.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="nim">NIM / NPM</Label>
        <Input
          id="nim"
          placeholder="Nomor Induk Mahasiswa"
          className="h-10"
          {...register("nim")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="nama@email.com"
          className="h-10"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Kata Sandi</Label>
        <Input
          id="password"
          type="password"
          placeholder="Minimal 8 karakter"
          className="h-10"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="konfirmasi">Konfirmasi Kata Sandi</Label>
        <Input
          id="konfirmasi"
          type="password"
          placeholder="Ulangi kata sandi"
          className="h-10"
          autoComplete="new-password"
          {...register("konfirmasi")}
        />
        {errors.konfirmasi && (
          <p className="text-xs text-destructive">{errors.konfirmasi.message}</p>
        )}
      </div>

      {serverError && (
        <p className="text-sm text-destructive text-center rounded-md border border-destructive/30 bg-destructive/10 py-2 px-3">
          {serverError}
        </p>
      )}

      <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
        {isSubmitting ? "Membuat akun..." : "Buat Akun"}
      </Button>
    </form>
  )
}
