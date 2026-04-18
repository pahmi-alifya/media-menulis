import Link from "next/link"
import { ArrowLeft, ExternalLink, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import RubrikForm from "@/components/assessment/RubrikForm"
import RubrikKolaborasiForm from "@/components/assessment/RubrikKolaborasiForm"
import { mockTahapList, mockSubmissionList, mockNilaiAspekList, TAHAP_LABEL } from "@/lib/mock/data"

// TODO: replace with real API
const tahapList = mockTahapList.filter((t) => t.kelasId === "k1")

const initialValues = Object.fromEntries(
  mockNilaiAspekList.map((n) => [n.aspek, { skor: n.skor, komentar: n.komentar }])
) as Record<string, { skor: number; komentar: string }>

export default async function DosenSubmissionDetailPage({
  params,
}: {
  params: Promise<{ pertemuanKe: string; tahapId: string; subId: string }>
}) {
  const { pertemuanKe, tahapId, subId } = await params
  const p = Number(pertemuanKe)

  const tahap = tahapList.find((t) => t.id === tahapId) ?? tahapList[3]
  const submission = mockSubmissionList.find((s) => s.id === subId) ?? mockSubmissionList[4]
  const isIMMM = tahap.kode === "IMMM"
  const isKMBM = tahap.kode === "KMBM"

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/dosen/pertemuan/${p}/tahap/${tahap.id}/submissions`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">Detail Submission</h1>
          <p className="text-muted-foreground text-sm">
            {submission.namaMahasiswa} · Pertemuan {p} · Tahap {tahap.urutan}: {TAHAP_LABEL[tahap.kode].singkat}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base">{submission.namaMahasiswa}</CardTitle>
            {submission.isDraft ? (
              <Badge variant="outline" className="gap-1 text-amber-600 border-amber-400">
                <Clock className="h-3 w-3" />Draft
              </Badge>
            ) : (
              <Badge className="gap-1 bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200">
                <CheckCircle2 className="h-3 w-3" />Terkumpul
              </Badge>
            )}
          </div>
          {submission.submittedAt && (
            <p className="text-xs text-muted-foreground">Dikumpulkan: {submission.submittedAt}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {submission.linkSubmisi && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Link:</p>
              <a href={submission.linkSubmisi} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Buka dokumen mahasiswa
                </Button>
              </a>
            </div>
          )}
          {submission.isiEsai && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Esai:</p>
              <div className="bg-muted/30 rounded-md p-4 text-sm leading-relaxed whitespace-pre-wrap border">
                {submission.isiEsai}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {isIMMM ? (
        <div className="space-y-4">
          <h2 className="font-semibold">Penilaian Rubrik Esai Mandiri</h2>
          <RubrikForm
            isReadOnly={submission.nilaiTotal !== null}
            initialValues={submission.nilaiTotal !== null ? initialValues : undefined}
          />
        </div>
      ) : isKMBM ? (
        <div className="space-y-4">
          <h2 className="font-semibold">Penilaian Kolaborasi Individual</h2>
          <RubrikKolaborasiForm
            isReadOnly={submission.nilaiTotal !== null}
          />
        </div>
      ) : (
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">
              Untuk tahap ini, Anda dapat memberikan umpan balik langsung kepada mahasiswa melalui forum.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
