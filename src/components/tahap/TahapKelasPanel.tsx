"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
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
import { TAHAP_LABEL, TIPE_SUBMISI_LABEL } from "@/lib/mock/data"
import { unlockTahapAction } from "@/server/actions/kelas.actions"

type TahapWithCount = {
  id: string
  kelasId: string
  urutan: number
  kode: string
  tipeSubmisi: string
  isUnlocked: boolean
  unlockedAt: Date | null
  _count: { submissions: number }
}

const TAHAP_DESKRIPSI: Record<string, string> = {
  SMKM: "Berbagi dan mengkonstruksi konten multimodal bersama.",
  EPM: "Mengeksplorasi dan menelaah sumber-sumber multimodal.",
  KMBM: "Berkolaborasi dan menulis esai bersama dalam kelompok.",
  IMMM: "Menulis esai argumentatif mandiri melalui editor LMS.",
  IMTM: "Mengintegrasikan dan mempublikasikan karya teks multimodal.",
}

interface TahapKelasPanelProps {
  pertemuanKe: number
  initialTahapList: TahapWithCount[]
}

export default function TahapKelasPanel({ pertemuanKe, initialTahapList }: TahapKelasPanelProps) {
  const router = useRouter()
  const [tahapList, setTahapList] = useState<TahapWithCount[]>(initialTahapList)
  const [pendingUnlock, setPendingUnlock] = useState<TahapWithCount | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => { setTahapList(initialTahapList) }, [initialTahapList])

  function handleUnlock() {
    if (!pendingUnlock) return
    startTransition(async () => {
      const result = await unlockTahapAction(pendingUnlock.id)
      if (result.error) {
        toast.error(result.error)
        setPendingUnlock(null)
        return
      }
      setTahapList((prev) =>
        prev.map((t) =>
          t.id === pendingUnlock.id ? { ...t, isUnlocked: true, unlockedAt: new Date() } : t,
        ),
      )
      toast.success(`Tahap ${pendingUnlock.urutan} — ${TAHAP_LABEL[pendingUnlock.kode as keyof typeof TAHAP_LABEL].singkat} berhasil dibuka`)
      setPendingUnlock(null)
      router.refresh()
    })
  }

  return (
    <>
      <div className="space-y-3">
        {tahapList.map((tahap, idx) => {
          const prevUnlocked = idx === 0 || tahapList[idx - 1].isUnlocked
          const isUnlockable = !tahap.isUnlocked && prevUnlocked
          const label = TAHAP_LABEL[tahap.kode as keyof typeof TAHAP_LABEL]
          const submisiLabel = TIPE_SUBMISI_LABEL[tahap.tipeSubmisi as keyof typeof TIPE_SUBMISI_LABEL]

          return (
            <Card key={tahap.id} className={`transition-opacity ${tahap.isUnlocked ? "" : "opacity-60"}`}>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
                        <CardTitle className="text-sm font-semibold">{label.singkat}</CardTitle>
                        {tahap.isUnlocked ? (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <LockOpen className="h-3 w-3" />Terbuka
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Lock className="h-3 w-3" />Terkunci
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {TAHAP_DESKRIPSI[tahap.kode] ?? ""}
                      </p>
                    </div>
                  </div>

                  {/* Tombol aksi */}
                  <div className="flex gap-2 shrink-0 pl-11 sm:pl-0">
                    <Link href={`/dosen/pertemuan/${pertemuanKe}/tahap/${tahap.id}`}>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        Kelola
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    {isUnlockable && (
                      <Button size="sm" className="gap-1.5" onClick={() => setPendingUnlock(tahap)}>
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
                      <span className="font-medium text-foreground">{submisiLabel}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {tahap._count.submissions} submission terkumpul
                    </span>
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
            <AlertDialogTitle>Buka Tahap {pendingUnlock?.urutan}?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-sm">
              <span className="block">
                <strong>{pendingUnlock && TAHAP_LABEL[pendingUnlock.kode as keyof typeof TAHAP_LABEL].singkat}</strong>
                {" — "}
                {pendingUnlock && TAHAP_LABEL[pendingUnlock.kode as keyof typeof TAHAP_LABEL].panjang}
              </span>
              <span className="block text-muted-foreground">
                Setelah dibuka, mahasiswa dapat mengakses materi dan mengumpulkan tugas pada tahap ini.{" "}
                <strong>Tahap yang sudah dibuka tidak bisa dikunci kembali.</strong>
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingUnlock(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnlock} disabled={isPending}>
              <LockOpen className="h-4 w-4 mr-1.5" />
              {isPending ? "Membuka..." : "Ya, Buka Tahap"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
