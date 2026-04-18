import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockTahapList, mockSubmissionList, mockNilaiAspekList, TAHAP_LABEL, ASPEK_LABEL } from "@/lib/mock/data"

// TODO: replace with real API
const tahapList = mockTahapList.filter((t) => t.kelasId === "k1")

function skorToLabel(skor: number) {
  if (skor === 4) return { label: "Sangat Baik", color: "text-green-600" }
  if (skor === 3) return { label: "Baik", color: "text-blue-600" }
  if (skor === 2) return { label: "Cukup", color: "text-amber-600" }
  return { label: "Kurang", color: "text-red-600" }
}

export default async function NilaiMahasiswaPage({
  params,
}: {
  params: Promise<{ pertemuanKe: string; tahapId: string }>
}) {
  const { pertemuanKe, tahapId } = await params
  const p = Number(pertemuanKe)

  const tahap = tahapList.find((t) => t.id === tahapId) ?? tahapList[3]
  const submission = mockSubmissionList.find(
    (s) => s.tahapId === tahap.id && s.userId === "u2"
  )
  const nilaiList = mockNilaiAspekList

  if (!submission?.nilaiTotal) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <Link href={`/mahasiswa/pertemuan/${p}/tahap/${tahap.id}`}>
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-xl font-bold">Nilai Saya</h1>
        </div>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>Nilai belum tersedia. Dosen sedang menilai submission Anda.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href={`/mahasiswa/pertemuan/${p}/tahap/${tahap.id}`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">Nilai Saya</h1>
          <p className="text-muted-foreground text-sm">
            Tahap {tahap.urutan}: {TAHAP_LABEL[tahap.kode].singkat}
          </p>
        </div>
      </div>

      <Card className="border-primary/30">
        <CardContent className="pt-6 pb-6 text-center">
          <p className="text-muted-foreground text-sm mb-1">Nilai Akhir</p>
          <p className="text-5xl font-bold">{submission.nilaiTotal}</p>
          <p className="text-muted-foreground text-sm mt-1">dari 100</p>
          <Badge className="mt-3">
            {submission.nilaiTotal >= 85
              ? "Sangat Memuaskan"
              : submission.nilaiTotal >= 70
              ? "Memuaskan"
              : submission.nilaiTotal >= 55
              ? "Cukup"
              : "Perlu Perbaikan"}
          </Badge>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="font-semibold">Rincian Penilaian</h2>
        {nilaiList.map((n) => {
          const { label, color } = skorToLabel(n.skor)
          return (
            <Card key={n.aspek}>
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{ASPEK_LABEL[n.aspek]}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${color}`}>{n.skor}/4</span>
                    <Badge variant="outline" className={`text-xs ${color}`}>{label}</Badge>
                  </div>
                </div>
              </CardHeader>
              {n.komentar && (
                <CardContent className="pt-0 pb-4">
                  <p className="text-sm text-muted-foreground">{n.komentar}</p>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
