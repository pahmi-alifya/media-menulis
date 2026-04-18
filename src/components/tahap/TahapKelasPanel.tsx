"use client"

import { useState } from "react"
import Link from "next/link"
import { Lock, LockOpen, CheckCircle2, BookOpen, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
import { toast } from "sonner"
import { type MockTahap, TAHAP_LABEL, TIPE_SUBMISI_LABEL } from "@/lib/mock/data"

interface TahapKelasPanelProps {
  pertemuanKe: number
  initialTahapList: MockTahap[]
}

export default function TahapKelasPanel({ pertemuanKe, initialTahapList }: TahapKelasPanelProps) {
  const [tahapList, setTahapList] = useState<MockTahap[]>(initialTahapList)
  const [pendingUnlock, setPendingUnlock] = useState<MockTahap | null>(null)

  function handleUnlock() {
    if (!pendingUnlock) return
    const now = new Date().toISOString().split("T")[0]
    setTahapList((prev) =>
      prev.map((t) =>
        t.id === pendingUnlock.id ? { ...t, isUnlocked: true, unlockedAt: now } : t
      )
    )
    toast.success(`Tahap ${pendingUnlock.urutan} — ${TAHAP_LABEL[pendingUnlock.kode].singkat} berhasil dibuka`)
    setPendingUnlock(null)
    // TODO: replace with Server Action — unlockTahap(tahapId)
  }

  return (
    <>
      <div className="space-y-3">
        {tahapList.map((tahap, idx) => {
          const prevUnlocked = idx === 0 || tahapList[idx - 1].isUnlocked
          const isUnlockable = !tahap.isUnlocked && prevUnlocked

          return (
            <Card
              key={tahap.id}
              className={`transition-opacity ${tahap.isUnlocked ? "" : "opacity-60"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  {/* Nomor + Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${
                        tahap.isUnlocked
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tahap.urutan}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-sm font-semibold">
                          {TAHAP_LABEL[tahap.kode].singkat}
                        </CardTitle>
                        {tahap.isUnlocked ? (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <LockOpen className="h-3 w-3" />
                            Terbuka
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Lock className="h-3 w-3" />
                            Terkunci
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {tahap.deskripsi}
                      </p>
                    </div>
                  </div>

                  {/* Tombol aksi */}
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/dosen/pertemuan/${pertemuanKe}/tahap/${tahap.id}`}>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        Kelola
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    {isUnlockable && (
                      <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={() => setPendingUnlock(tahap)}
                      >
                        <LockOpen className="h-3.5 w-3.5" />
                        Buka Tahap
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              {tahap.isUnlocked && (
                <CardContent className="pt-0">
                  <Separator className="mb-3" />
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span>
                      Tipe tugas:{" "}
                      <span className="font-medium text-foreground">
                        {TIPE_SUBMISI_LABEL[tahap.tipeSubmisi]}
                      </span>
                    </span>
                    {tahap.jumlahSubmisi !== undefined && (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {tahap.jumlahSubmisi} submission terkumpul
                      </span>
                    )}
                    {tahap.unlockedAt && (
                      <span>
                        Dibuka:{" "}
                        {new Date(tahap.unlockedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Dialog konfirmasi buka tahap */}
      <AlertDialog open={!!pendingUnlock} onOpenChange={(open) => !open && setPendingUnlock(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Buka Tahap {pendingUnlock?.urutan}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span className="space-y-2 text-sm flex flex-col">
                <p>
                  <strong>{pendingUnlock && TAHAP_LABEL[pendingUnlock.kode].singkat}</strong> —{" "}
                  {pendingUnlock?.nama}
                </p>
                <p className="text-muted-foreground">
                  Setelah dibuka, mahasiswa dapat mengakses materi dan mengumpulkan tugas
                  pada tahap ini. <strong>Tahap yang sudah dibuka tidak bisa dikunci kembali.</strong>
                </p>
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingUnlock(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnlock}>
              <LockOpen className="h-4 w-4 mr-1.5" />
              Ya, Buka Tahap
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
