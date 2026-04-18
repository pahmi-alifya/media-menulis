import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ASPEK_LABEL,
  ASPEK_SUBDESKRIPSI,
  RUBRIK_SKOR_DESKRIPSI,
  ASPEK_KOLABORASI_LABEL,
  ASPEK_KOLABORASI_SUBDESKRIPSI,
  RUBRIK_KOLABORASI_DESKRIPSI,
  type AspekNilai,
  type AspekKolaborasi,
} from "@/lib/mock/data"

// ─── Rubrik Esai Mandiri (Tahap 4 — IMMM) ─────────────────────────────────────

const ASPEK_ESAI: AspekNilai[] = [
  "ISI_KONTEN",
  "ORGANISASI",
  "KOSAKATA",
  "KEBAHASAAN",
  "MEKANIK",
]

const SKOR_COLOR: Record<number, string> = {
  4: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300",
  3: "bg-sky-50 text-sky-800 dark:bg-sky-950/30 dark:text-sky-300",
  2: "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
  1: "bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300",
}

const SKOR_LABEL: Record<number, string> = {
  4: "Sangat Baik",
  3: "Baik",
  2: "Cukup",
  1: "Perlu Perbaikan",
}

function RubrikEsai() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="text-sm">Rubrik Penilaian Esai Mandiri</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              5 aspek × skor 1–4 · Nilai total = rata-rata × 25 (skala 100)
            </p>
          </div>
          <Badge variant="outline" className="text-xs shrink-0">Hanya baca</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {ASPEK_ESAI.map((aspek) => (
          <div key={aspek} className="space-y-2">
            <div>
              <p className="text-sm font-semibold">{ASPEK_LABEL[aspek]}</p>
              <p className="text-xs text-muted-foreground">{ASPEK_SUBDESKRIPSI[aspek]}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {([4, 3, 2, 1] as const).map((skor) => (
                <div
                  key={skor}
                  className={`rounded-md p-2.5 ${SKOR_COLOR[skor]}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold leading-none">{skor}</span>
                    <span className="text-xs font-medium leading-none">{SKOR_LABEL[skor]}</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-80">
                    {RUBRIK_SKOR_DESKRIPSI[aspek][skor]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Formula nilai */}
        <div className="rounded-lg border border-dashed px-4 py-3 text-xs text-muted-foreground space-y-0.5">
          <p className="font-semibold text-foreground text-sm">Formula Nilai</p>
          <p>Nilai = (jumlah skor 5 aspek ÷ 5) × 25</p>
          <p>Contoh: skor 4+3+4+3+3 = 17 → 17/5 = 3,4 → 3,4 × 25 = <strong className="text-foreground">85</strong></p>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Rubrik Kolaborasi (Tahap 3 — KMBM) ──────────────────────────────────────

const ASPEK_KOLABORASI_LIST: AspekKolaborasi[] = [
  "MENULIS_KOLABORASI",
  "UMPAN_BALIK_KOLABORASI",
]

const SKOR_KOLABORASI_COLOR: Record<number, string> = {
  3: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300",
  2: "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
  1: "bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300",
}

const SKOR_KOLABORASI_LABEL: Record<number, string> = {
  3: "Baik",
  2: "Cukup",
  1: "Kurang",
}

function RubrikKolaborasi() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="text-sm">Rubrik Penilaian Kolaborasi</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              2 aspek × skor 1–3 · Nilai total = rata-rata / 3 × 100
            </p>
          </div>
          <Badge variant="outline" className="text-xs shrink-0">Hanya baca</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {ASPEK_KOLABORASI_LIST.map((aspek) => (
          <div key={aspek} className="space-y-2">
            <div>
              <p className="text-sm font-semibold">{ASPEK_KOLABORASI_LABEL[aspek]}</p>
              <p className="text-xs text-muted-foreground">{ASPEK_KOLABORASI_SUBDESKRIPSI[aspek]}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {([3, 2, 1] as const).map((skor) => (
                <div
                  key={skor}
                  className={`rounded-md p-2.5 ${SKOR_KOLABORASI_COLOR[skor]}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold leading-none">{skor}</span>
                    <span className="text-xs font-medium leading-none">{SKOR_KOLABORASI_LABEL[skor]}</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-80">
                    {RUBRIK_KOLABORASI_DESKRIPSI[aspek][skor]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Formula nilai */}
        <div className="rounded-lg border border-dashed px-4 py-3 text-xs text-muted-foreground space-y-0.5">
          <p className="font-semibold text-foreground text-sm">Formula Nilai</p>
          <p>Nilai = (rata-rata skor 2 aspek ÷ 3) × 100</p>
          <p>Contoh: skor 3+2 = 5 → 5/2 = 2,5 → 2,5/3 × 100 = <strong className="text-foreground">83,3</strong></p>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Export utama ─────────────────────────────────────────────────────────────

interface RubrikPreviewProps {
  /** Urutan tahap (1–5). Rubrik hanya ditampilkan untuk tahap 3 dan 4. */
  tahapUrutan: number
}

export default function RubrikPreview({ tahapUrutan }: RubrikPreviewProps) {
  if (tahapUrutan === 4) return <RubrikEsai />
  if (tahapUrutan === 3) return <RubrikKolaborasi />
  return null
}
