"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { createKelasAction } from "@/server/actions/kelas.actions"

export default function BuatKelasDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [nama, setNama] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [kodeResult, setKodeResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  function handleOpen() {
    setOpen(true)
    setNama("")
    setDeskripsi("")
    setKodeResult(null)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    startTransition(async () => {
      const result = await createKelasAction({ nama, deskripsi })
      if (result.error || !result.data) {
        if (result.error) toast.error(result.error)
        return
      }
      setKodeResult(result.data.kode)
      toast.success("Kelas berhasil dibuat!")
    })
  }

  function handleCopy() {
    if (!kodeResult) return
    navigator.clipboard.writeText(kodeResult)
    setCopied(true)
    toast.success("Kode kelas disalin")
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDone() {
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <Button onClick={handleOpen} className="gap-2">
        <Plus className="h-4 w-4" />
        Buat Kelas Baru
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!v && !kodeResult) setOpen(false) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Kelas Baru</DialogTitle>
            <DialogDescription>
              Sistem akan membuat 5 tahap Knows SGM secara otomatis.
            </DialogDescription>
          </DialogHeader>

          {!kodeResult ? (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="nama-kelas">Nama Kelas</Label>
                <Input
                  id="nama-kelas"
                  placeholder="cth. Menulis Esai Argumentatif — 4A"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deskripsi-kelas">
                  Deskripsi <span className="text-muted-foreground font-normal text-xs">(opsional)</span>
                </Label>
                <Textarea
                  id="deskripsi-kelas"
                  placeholder="Deskripsi singkat kelas..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="flex-1" disabled={!nama.trim() || isPending}>
                  {isPending ? "Membuat..." : "Buat Kelas"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                Kelas <strong>{nama}</strong> berhasil dibuat. Bagikan kode ini kepada mahasiswa untuk bergabung.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted border px-4 py-3 rounded-md text-xl font-mono tracking-widest text-center font-bold">
                  {kodeResult}
                </code>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                5 tahap Knows SGM (SMKM → EPM → KMBM → IMMM → IMTM) sudah dibuat otomatis. Tahap 1 langsung terbuka.
              </p>
              <Button className="w-full" onClick={handleDone}>
                Selesai
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
