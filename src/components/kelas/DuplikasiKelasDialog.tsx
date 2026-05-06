"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Copy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { duplicateKelasAction } from "@/server/actions/kelas.actions"

const schema = z.object({
  nama: z.string().min(1, "Nama kelas wajib diisi"),
  deskripsi: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  sourceKelas: { id: string; nama: string; deskripsi: string | null }
}

export default function DuplikasiKelasDialog({ open, onOpenChange, sourceKelas }: Props) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      nama: `${sourceKelas.nama} — Salinan`,
      deskripsi: sourceKelas.deskripsi ?? "",
    },
  })

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await duplicateKelasAction({
        sourceKelasId: sourceKelas.id,
        nama: values.nama,
        deskripsi: values.deskripsi,
      })
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Kelas berhasil diduplikasi dan dijadikan aktif")
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!isPending) onOpenChange(v) }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplikasi Kelas</DialogTitle>
          <DialogDescription>
            Semua materi dari <strong className="text-foreground">{sourceKelas.nama}</strong> akan
            disalin ke kelas baru. Data mahasiswa, submission, nilai, dan forum tidak ikut disalin.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="dup-nama">Nama Kelas Baru</Label>
            <Input id="dup-nama" {...form.register("nama")} placeholder="Nama kelas baru" />
            {form.formState.errors.nama && (
              <p className="text-xs text-destructive">{form.formState.errors.nama.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dup-deskripsi">
              Deskripsi{" "}
              <span className="text-muted-foreground font-normal text-xs">(opsional)</span>
            </Label>
            <Textarea
              id="dup-deskripsi"
              {...form.register("deskripsi")}
              placeholder="Deskripsi singkat kelas..."
              rows={3}
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" className="flex-1 gap-2" disabled={isPending}>
              <Copy className="h-4 w-4" />
              {isPending ? "Menduplikasi..." : "Duplikasi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
