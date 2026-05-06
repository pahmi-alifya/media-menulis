"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { enrollMahasiswaMultiAction } from "@/server/actions/enrollment.actions"

interface EnrollMahasiswaFormProps {
  kelasId: string
  kelasList: { id: string; nama: string }[]
  selectedKelasId: string | null
}

export default function EnrollMahasiswaForm({
  kelasId,
  kelasList,
  selectedKelasId,
}: EnrollMahasiswaFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const initialChecked = selectedKelasId ? [selectedKelasId] : [kelasId]
  const [checkedIds, setCheckedIds] = useState<string[]>(initialChecked)
  const [form, setForm] = useState({ nama: "", nim: "", email: "" })
  const [result, setResult] = useState<{ nama: string; password: string } | null>(null)
  const [copied, setCopied] = useState(false)

  function resetForm() {
    setForm({ nama: "", nim: "", email: "" })
    setCheckedIds(initialChecked)
    setResult(null)
    setCopied(false)
  }

  function handleOpenChange(val: boolean) {
    if (!val) resetForm()
    setOpen(val)
  }

  function toggleKelas(id: string) {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nama.trim() || !form.email.trim() || checkedIds.length === 0) return

    startTransition(async () => {
      const res = await enrollMahasiswaMultiAction({
        nama: form.nama,
        nim: form.nim,
        email: form.email,
        kelasIds: checkedIds,
      })

      if (res.error) {
        toast.error(res.error)
        return
      }

      const { isNewUser, password, addedCount } = res.data!
      if (isNewUser && password) {
        setResult({ nama: form.nama, password })
        setForm({ nama: "", nim: "", email: "" })
        setCheckedIds(initialChecked)
      } else {
        if (addedCount > 0) {
          toast.success(`${form.nama} ditambahkan ke ${addedCount} kelas.`)
        } else {
          toast.info(`${form.nama} sudah terdaftar di semua kelas yang dipilih.`)
        }
        resetForm()
        setOpen(false)
      }

      router.refresh()
    })
  }

  function handleCopy() {
    if (!result) return
    navigator.clipboard.writeText(result.password)
    setCopied(true)
    toast.success("Kata sandi disalin")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2 shrink-0">
        <Plus className="h-4 w-4" />
        Tambah Mahasiswa
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Mahasiswa</DialogTitle>
            <DialogDescription>
              Isi data mahasiswa lalu pilih kelas yang akan diikuti.
            </DialogDescription>
          </DialogHeader>

          {result ? (
            <div className="space-y-4 py-2">
              <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  Mahasiswa berhasil ditambahkan!
                </p>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  Kata sandi sementara untuk <strong>{result.nama}</strong>:
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <code className="bg-white dark:bg-black/20 border px-3 py-1.5 rounded text-sm font-mono tracking-widest">
                    {result.password}
                  </code>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                  Kata sandi hanya ditampilkan sekali.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setResult(null)}
                >
                  Tambah Lagi
                </Button>
                <Button className="flex-1" onClick={() => handleOpenChange(false)}>
                  Selesai
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="enroll-nama">Nama Lengkap</Label>
                  <Input
                    id="enroll-nama"
                    placeholder="Nama mahasiswa"
                    value={form.nama}
                    onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enroll-nim">NIM / NPM</Label>
                  <Input
                    id="enroll-nim"
                    placeholder="Nomor Induk Mahasiswa"
                    value={form.nim}
                    onChange={(e) => setForm((f) => ({ ...f, nim: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="enroll-email">Email</Label>
                  <Input
                    id="enroll-email"
                    type="email"
                    placeholder="email@domain.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Daftarkan ke Kelas</Label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {kelasList.map((k) => (
                    <label
                      key={k.id}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md border cursor-pointer hover:bg-muted/50 transition-colors select-none"
                    >
                      <Checkbox
                        checked={checkedIds.includes(k.id)}
                        onCheckedChange={() => toggleKelas(k.id)}
                      />
                      <span className="text-sm truncate">{k.nama}</span>
                    </label>
                  ))}
                </div>
                {checkedIds.length === 0 && (
                  <p className="text-xs text-destructive">Pilih minimal satu kelas.</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={
                  !form.nama.trim() ||
                  !form.email.trim() ||
                  !form.nim.trim() ||
                  checkedIds.length === 0 ||
                  isPending
                }
              >
                <Plus className="h-4 w-4" />
                {isPending ? "Menambahkan..." : `Tambahkan ke ${checkedIds.length} Kelas`}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
