import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/auth"
import {
  getTahapById,
  getMySubmissionWithNilai,
  getPeerReviewsReceived,
} from "@/server/queries/kelas.queries"
import {
  TAHAP_LABEL,
  ASPEK_LABEL,
  ASPEK_KOLABORASI_LABEL,
  type AspekNilai,
  type AspekKolaborasi,
} from "@/lib/mock/data"

function skorToLabelEsai(skor: number) {
  if (skor === 4) return { label: "Sangat Baik", color: "text-green-600" }
  if (skor === 3) return { label: "Baik", color: "text-blue-600" }
  if (skor === 2) return { label: "Cukup", color: "text-amber-600" }
  return { label: "Kurang", color: "text-red-600" }
}

function skorToLabelKolab(skor: number) {
  if (skor === 3) return { label: "Baik", color: "text-green-600" }
  if (skor === 2) return { label: "Cukup", color: "text-amber-600" }
  return { label: "Kurang", color: "text-red-600" }
}

function predikat(nilai: number) {
  if (nilai >= 85) return "Sangat Memuaskan"
  if (nilai >= 70) return "Memuaskan"
  if (nilai >= 55) return "Cukup"
  return "Perlu Perbaikan"
}

export default async function NilaiMahasiswaPage({
  params,
}: {
  params: Promise<{ pertemuanKe: string; tahapId: string }>
}) {
  const { pertemuanKe, tahapId } = await params
  const p = Number(pertemuanKe)

  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [tahap, submission, peerReviewsReceived] = await Promise.all([
    getTahapById(tahapId),
    getMySubmissionWithNilai(tahapId, session.user.id),
    getPeerReviewsReceived(tahapId, session.user.id),
  ])

  if (!tahap) redirect("/mahasiswa/dashboard")

  type NilaiRow = { aspek: string; skor: number; komentar: string | null }

  const label = TAHAP_LABEL[tahap.kode as keyof typeof TAHAP_LABEL]
  const isIMMM = tahap.kode === "IMMM"
  const isKMBM = tahap.kode === "KMBM"

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
            Tahap {tahap.urutan}: {label?.singkat ?? tahap.kode}
          </p>
        </div>
      </div>

      <Card className="border-primary/30">
        <CardContent className="pt-6 pb-6 text-center">
          <p className="text-muted-foreground text-sm mb-1">Nilai Akhir</p>
          <p className="text-4xl sm:text-5xl font-bold">{submission.nilaiTotal.toFixed(1)}</p>
          <p className="text-muted-foreground text-sm mt-1">dari 100</p>
          <Badge className="mt-3">{predikat(submission.nilaiTotal)}</Badge>
        </CardContent>
      </Card>

      {/* Rincian per aspek — IMMM (esai 5 aspek, skala 1–4) */}
      {isIMMM && submission.nilaiAspeks.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold">Rincian Penilaian</h2>
          {submission.nilaiAspeks.map((n: NilaiRow) => {
            const { label: lbl, color } = skorToLabelEsai(n.skor)
            return (
              <Card key={n.aspek}>
                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      {ASPEK_LABEL[n.aspek as AspekNilai] ?? n.aspek}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${color}`}>{n.skor}/4</span>
                      <Badge variant="outline" className={`text-xs ${color}`}>{lbl}</Badge>
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
      )}

      {/* Rincian per aspek — KMBM (kolaborasi 2 aspek, skala 1–3) */}
      {isKMBM && submission.nilaiKolabs.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold">Rincian Penilaian Kolaborasi</h2>
          {submission.nilaiKolabs.map((n: NilaiRow) => {
            const { label: lbl, color } = skorToLabelKolab(n.skor)
            return (
              <Card key={n.aspek}>
                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      {ASPEK_KOLABORASI_LABEL[n.aspek as AspekKolaborasi] ?? n.aspek}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${color}`}>{n.skor}/3</span>
                      <Badge variant="outline" className={`text-xs ${color}`}>{lbl}</Badge>
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
      )}

      {/* Peer review yang diterima — hanya IMMM */}
      {isIMMM && peerReviewsReceived.length > 0 && (
        <div className="space-y-3">
          <Separator />
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold">Peer Review dari Teman</h2>
            <Badge variant="secondary" className="text-xs">{peerReviewsReceived.length}</Badge>
          </div>
          {peerReviewsReceived.map((pr: { id: string; komentar: string | null }, idx: number) => (
            <Card key={pr.id}>
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Reviewer {idx + 1}</CardTitle>
                  {pr.komentar === null && (
                    <Badge variant="outline" className="text-xs text-amber-600">Belum diisi</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                {pr.komentar ? (
                  <p className="text-sm whitespace-pre-wrap">{pr.komentar}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Reviewer belum mengisi komentar.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Link ke halaman peer review jika IMMM */}
      {isIMMM && (
        <Link href={`/mahasiswa/pertemuan/${p}/tahap/${tahap.id}/peer-review`}>
          <Button variant="outline" className="w-full gap-2">
            <MessageCircle className="h-4 w-4" />
            Lihat Tugas Peer Review Saya
          </Button>
        </Link>
      )}
    </div>
  )
}
