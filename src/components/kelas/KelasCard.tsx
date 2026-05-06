"use client"

import { useState, useTransition } from "react"
import { MoreVertical, Pencil, Copy, Trash2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { setActiveKelasAction } from "@/server/actions/kelas.actions"
import EditKelasDialog from "@/components/kelas/EditKelasDialog"
import DuplikasiKelasDialog from "@/components/kelas/DuplikasiKelasDialog"
import HapusKelasDialog from "@/components/kelas/HapusKelasDialog"
import type { KelasByDosen } from "@/server/queries/kelas.queries"

interface Props {
  kelas: KelasByDosen
  isActive: boolean
}

export default function KelasCard({ kelas, isActive }: Props) {
  const [isPending, startTransition] = useTransition()
  const [dialog, setDialog] = useState<"edit" | "duplikasi" | "hapus" | null>(null)

  const tanggal = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(kelas.createdAt))

  function handleJadikanAktif() {
    startTransition(async () => {
      const result = await setActiveKelasAction(kelas.id)
      if (result.error) toast.error(result.error)
      else toast.success(`${kelas.nama} dijadikan kelas aktif`)
    })
  }

  return (
    <>
      <Card className={isActive ? "border-primary/50 bg-primary/5" : ""}>
        <CardContent className="pt-4 pb-4 space-y-3">
          {/* Header baris */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                {isActive && (
                  <Badge variant="default" className="text-xs gap-1 shrink-0">
                    <CheckCircle2 className="h-3 w-3" />
                    Aktif
                  </Badge>
                )}
                <p className="font-semibold text-sm leading-snug truncate">{kelas.nama}</p>
              </div>
              {kelas.deskripsi && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {kelas.deskripsi}
                </p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground shrink-0 outline-none">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!isActive && (
                  <DropdownMenuItem onClick={handleJadikanAktif} disabled={isPending}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Jadikan Aktif
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => setDialog("edit")}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDialog("duplikasi")}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplikasi
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDialog("hapus")}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <code className="font-mono font-semibold bg-muted px-1.5 py-0.5 rounded text-foreground">
              {kelas.kode}
            </code>
            <span>{kelas._count.enrollments} mahasiswa</span>
            <span className="hidden sm:block">{tanggal}</span>
          </div>
        </CardContent>
      </Card>

      <EditKelasDialog
        open={dialog === "edit"}
        onOpenChange={(v) => !v && setDialog(null)}
        kelas={{ id: kelas.id, nama: kelas.nama, deskripsi: kelas.deskripsi }}
      />
      <DuplikasiKelasDialog
        open={dialog === "duplikasi"}
        onOpenChange={(v) => !v && setDialog(null)}
        sourceKelas={{ id: kelas.id, nama: kelas.nama, deskripsi: kelas.deskripsi }}
      />
      <HapusKelasDialog
        open={dialog === "hapus"}
        onOpenChange={(v) => !v && setDialog(null)}
        kelas={{ id: kelas.id, nama: kelas.nama }}
      />
    </>
  )
}
