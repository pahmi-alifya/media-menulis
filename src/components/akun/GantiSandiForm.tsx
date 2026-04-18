"use client"

import { useState } from "react"
import { Eye, EyeOff, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function GantiSandiForm() {
  const [form, setForm] = useState({ lama: "", baru: "", konfirmasi: "" })
  const [show, setShow] = useState({ lama: false, baru: false, konfirmasi: false })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e: Partial<typeof form> = {}
    if (!form.lama) e.lama = "Kata sandi lama wajib diisi."
    if (form.baru.length < 8) e.baru = "Kata sandi baru minimal 8 karakter."
    if (form.baru === form.lama) e.baru = "Kata sandi baru tidak boleh sama dengan yang lama."
    if (form.konfirmasi !== form.baru) e.konfirmasi = "Konfirmasi kata sandi tidak cocok."
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    // TODO: replace with Server Action — changePassword(form.lama, form.baru)
    setTimeout(() => {
      setLoading(false)
      setForm({ lama: "", baru: "", konfirmasi: "" })
      toast.success("Kata sandi berhasil diubah.")
    }, 600)
  }

  function field(
    id: keyof typeof form,
    label: string,
    showKey: keyof typeof show
  ) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <div className="relative">
          <Input
            id={id}
            type={show[showKey] ? "text" : "password"}
            value={form[id]}
            onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
            className="pr-10"
            autoComplete={id === "lama" ? "current-password" : "new-password"}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShow((s) => ({ ...s, [showKey]: !s[showKey] }))}
          >
            {show[showKey] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors[id] && <p className="text-xs text-destructive">{errors[id]}</p>}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {field("lama", "Kata Sandi Lama", "lama")}
      {field("baru", "Kata Sandi Baru", "baru")}
      <p className="text-xs text-muted-foreground -mt-1">Minimal 8 karakter, berbeda dari kata sandi lama.</p>
      {field("konfirmasi", "Konfirmasi Kata Sandi Baru", "konfirmasi")}
      <Button type="submit" disabled={loading} className="gap-2 w-full sm:w-auto">
        <KeyRound className="h-4 w-4" />
        {loading ? "Menyimpan..." : "Simpan Kata Sandi"}
      </Button>
    </form>
  )
}
