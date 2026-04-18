"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validations/auth.schema"
import { changePasswordAction } from "@/server/actions/auth.actions"

export default function GantiSandiForm() {
  const [show, setShow] = useState({ lama: false, baru: false, konfirmasi: false })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  })

  async function onSubmit(data: ChangePasswordInput) {
    const result = await changePasswordAction({
      passwordLama: data.passwordLama,
      passwordBaru: data.passwordBaru,
      konfirmasi: data.konfirmasi,
    })

    if (result?.error) {
      toast.error(result.error)
      return
    }

    toast.success("Kata sandi berhasil diubah.")
    reset()
  }

  function toggleShow(key: keyof typeof show) {
    setShow((s) => ({ ...s, [key]: !s[key] }))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      {/* Kata Sandi Lama */}
      <div className="space-y-2">
        <Label htmlFor="passwordLama">Kata Sandi Lama</Label>
        <div className="relative">
          <Input
            id="passwordLama"
            type={show.lama ? "text" : "password"}
            placeholder="••••••••"
            className="pr-10"
            autoComplete="current-password"
            {...register("passwordLama")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => toggleShow("lama")}
          >
            {show.lama ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.passwordLama && (
          <p className="text-xs text-destructive">{errors.passwordLama.message}</p>
        )}
      </div>

      {/* Kata Sandi Baru */}
      <div className="space-y-2">
        <Label htmlFor="passwordBaru">Kata Sandi Baru</Label>
        <div className="relative">
          <Input
            id="passwordBaru"
            type={show.baru ? "text" : "password"}
            placeholder="Minimal 8 karakter"
            className="pr-10"
            autoComplete="new-password"
            {...register("passwordBaru")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => toggleShow("baru")}
          >
            {show.baru ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.passwordBaru && (
          <p className="text-xs text-destructive">{errors.passwordBaru.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Minimal 8 karakter, berbeda dari kata sandi lama.
        </p>
      </div>

      {/* Konfirmasi */}
      <div className="space-y-2">
        <Label htmlFor="konfirmasi">Konfirmasi Kata Sandi Baru</Label>
        <div className="relative">
          <Input
            id="konfirmasi"
            type={show.konfirmasi ? "text" : "password"}
            placeholder="Ulangi kata sandi baru"
            className="pr-10"
            autoComplete="new-password"
            {...register("konfirmasi")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => toggleShow("konfirmasi")}
          >
            {show.konfirmasi ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.konfirmasi && (
          <p className="text-xs text-destructive">{errors.konfirmasi.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="gap-2 w-full sm:w-auto">
        <KeyRound className="h-4 w-4" />
        {isSubmitting ? "Menyimpan..." : "Simpan Kata Sandi"}
      </Button>
    </form>
  )
}
