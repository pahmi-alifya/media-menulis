"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteKelasAction } from "@/server/actions/kelas.actions"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  kelas: { id: string; nama: string }
}

export default function HapusKelasDialog({ open, onOpenChange, kelas }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleHapus() {
    startTransition(async () => {
      const result = await deleteKelasAction(kelas.id)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Kelas berhasil dihapus")
      onOpenChange(false)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus kelas ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Kelas <strong>{kelas.nama}</strong> beserta semua materi, submission, nilai, dan
            data mahasiswa akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleHapus}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
