"use client"

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  type AspekKolaborasi,
  ASPEK_KOLABORASI_LABEL,
  ASPEK_KOLABORASI_SUBDESKRIPSI,
  RUBRIK_KOLABORASI_DESKRIPSI,
} from "@/lib/mock/data"

const ASPEK_ORDER: AspekKolaborasi[] = [
  "MENULIS_KOLABORASI",
  "UMPAN_BALIK_KOLABORASI",
]

const SKOR_LABEL: Record<number, string> = {
  1: "Kurang",
  2: "Cukup",
  3: "Baik",
}

interface RubrikKolaborasiFormProps {
  isReadOnly?: boolean
  initialValues?: Partial<Record<AspekKolaborasi, { skor: number; komentar: string }>>
}

export default function RubrikKolaborasiForm({
  isReadOnly = false,
  initialValues,
}: RubrikKolaborasiFormProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [values, setValues] = useState<Record<AspekKolaborasi, { skor: number; komentar: string }>>(() => {
    const init: Record<string, { skor: number; komentar: string }> = {}
    ASPEK_ORDER.forEach((a) => {
      init[a] = initialValues?.[a] ?? { skor: 0, komentar: "" }
    })
    return init as Record<AspekKolaborasi, { skor: number; komentar: string }>
  })
  const [saved, setSaved] = useState(isReadOnly)

  const allFilled = ASPEK_ORDER.every((a) => values[a].skor > 0)
  // Nilai total: rata-rata skor × (100/3), dibulatkan ke 1 desimal
  const totalNilai = allFilled
    ? (ASPEK_ORDER.reduce((sum, a) => sum + values[a].skor, 0) / ASPEK_ORDER.length / 3) * 100
    : null

  function setAspek(aspek: AspekKolaborasi, field: "skor" | "komentar", val: number | string) {
    setValues((prev) => ({
      ...prev,
      [aspek]: { ...prev[aspek], [field]: val },
    }))
  }

  function handleSave() {
    // TODO: replace with Server Action — nilaiSubmissionKolaborasi()
    setSaved(true)
  }

  return (
    <div className="space-y-4">
      {ASPEK_ORDER.map((aspek) => {
        const v = values[aspek]
        return (
          <Card key={aspek}>
            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Label className="font-semibold">{ASPEK_KOLABORASI_LABEL[aspek]}</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {ASPEK_KOLABORASI_SUBDESKRIPSI[aspek]}
                  </p>
                </div>
                {v.skor > 0 && (
                  <Badge variant="outline" className="text-xs shrink-0">
                    {v.skor} — {SKOR_LABEL[v.skor]}
                  </Badge>
                )}
              </div>

              {/* Skor buttons */}
              <div className="flex gap-2">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    disabled={saved}
                    onClick={() => setAspek(aspek, "skor", n)}
                    className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
                      v.skor === n
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-input hover:bg-muted"
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
                <span>Kurang</span>
                <span>Cukup</span>
                <span>Baik</span>
              </div>

              {/* Deskripsi semua skor */}
              <div className="space-y-1.5">
                {([1, 2, 3] as const).map((n) => (
                  <div
                    key={n}
                    className={`px-3 py-2 rounded-md text-xs leading-relaxed transition-colors ${
                      v.skor === n
                        ? "bg-primary/10 border border-primary/20 text-foreground"
                        : "bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <span className={`font-semibold mr-1 ${v.skor === n ? "text-primary" : ""}`}>
                      {n} — {SKOR_LABEL[n]}:
                    </span>
                    {RUBRIK_KOLABORASI_DESKRIPSI[aspek][n]}
                  </div>
                ))}
              </div>

              <Textarea
                placeholder="Komentar untuk aspek ini (opsional)..."
                value={v.komentar}
                onChange={(e) => setAspek(aspek, "komentar", e.target.value)}
                disabled={saved}
                rows={2}
                className="text-sm resize-none"
              />
            </CardContent>
          </Card>
        )
      })}

      {/* Total nilai */}
      {allFilled && (
        <div className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3">
          <span className="font-semibold">Nilai Total</span>
          <span className="text-2xl font-bold">{totalNilai?.toFixed(1)}</span>
        </div>
      )}

      {!saved && (
        <>
          <Button
            className="w-full"
            disabled={!allFilled}
            onClick={() => setDialogOpen(true)}
          >
            Simpan Penilaian
          </Button>
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Simpan Penilaian Kolaborasi?</AlertDialogTitle>
                <AlertDialogDescription>
                  Nilai total: <strong>{totalNilai?.toFixed(1)}</strong>.
                  Setelah disimpan, mahasiswa dapat melihat nilai dan komentar ini.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDialogOpen(false)}>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => { handleSave(); setDialogOpen(false) }}>
                  Simpan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {saved && (
        <div className="flex items-center justify-center gap-2 py-3 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Penilaian tersimpan</span>
        </div>
      )}
    </div>
  )
}
