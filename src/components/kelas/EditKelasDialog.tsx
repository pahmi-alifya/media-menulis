"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
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
import { updateKelasAction } from "@/server/actions/kelas.actions"

const schema = z.object({
  nama: z.string().min(1, "Nama kelas wajib diisi"),
  deskripsi: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  kelas: { id: string; nama: string; deskripsi: string | null }
}

export default function EditKelasDialog({ open, onOpenChange, kelas }: Props) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: { nama: kelas.nama, deskripsi: kelas.deskripsi ?? "" },
  })

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await updateKelasAction({
        kelasId: kelas.id,
        nama: values.nama,
        deskripsi: values.deskripsi,
      })
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Kelas berhasil diperbarui")
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Kelas</DialogTitle>
          <DialogDescription>Ubah nama dan deskripsi kelas.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="edit-nama">Nama Kelas</Label>
            <Input id="edit-nama" {...form.register("nama")} placeholder="Nama kelas" />
            {form.formState.errors.nama && (
              <p className="text-xs text-destructive">{form.formState.errors.nama.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-deskripsi">
              Deskripsi{" "}
              <span className="text-muted-foreground font-normal text-xs">(opsional)</span>
            </Label>
            <Textarea
              id="edit-deskripsi"
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
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
