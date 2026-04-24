import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, CheckCircle2, FileText, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/auth"
import { getTahapById, getPeerReviewAsReviewer } from "@/server/queries/kelas.queries"
import { TAHAP_LABEL } from "@/lib/mock/data"
import PeerReviewForm from "@/components/assessment/PeerReviewForm"

export default async function MahasiswaPeerReviewPage({
  params,
}: {
  params: Promise<{ pertemuanKe: string; tahapId: string }>
}) {
  const { pertemuanKe, tahapId } = await params
  const p = Number(pertemuanKe)

  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [tahap, peerReview] = await Promise.all([
    getTahapById(tahapId),
    getPeerReviewAsReviewer(tahapId, session.user.id),
  ])

  if (!tahap || tahap.kode !== "IMMM") redirect(`/mahasiswa/pertemuan/${p}`)

  const label = TAHAP_LABEL[tahap.kode as keyof typeof TAHAP_LABEL]

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href={`/mahasiswa/pertemuan/${p}/tahap/${tahap.id}`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">Peer Review</h1>
          <p className="text-muted-foreground text-sm">
            Tahap {tahap.urutan}: {label?.singkat ?? tahap.kode}
          </p>
        </div>
      </div>

      {!peerReview ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground space-y-2">
            <FileText className="h-10 w-10 mx-auto opacity-30" />
            <p className="font-medium">Belum ada tugas peer review</p>
            <p className="text-sm">
              Dosen akan mengaktifkan peer review setelah deadline pengumpulan.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Info: esai siapa yang harus di-review */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm">
                  Esai yang perlu Anda review — {peerReview.reviewee.nama}
                </CardTitle>
                {peerReview.komentar !== null && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Selesai
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {peerReview.submission.isiEsai ? (
                <div
                  className="rich-editor-content text-sm border rounded-lg p-4 max-h-80 overflow-y-auto bg-muted/30"
                  dangerouslySetInnerHTML={{ __html: peerReview.submission.isiEsai }}
                />
              ) : peerReview.submission.linkSubmisi ? (
                <a
                  href={peerReview.submission.linkSubmisi}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2 w-full">
                    <ExternalLink className="h-4 w-4" />
                    Buka Submission
                  </Button>
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">Konten submission tidak tersedia.</p>
              )}
            </CardContent>
          </Card>

          {/* Form atau tampilan review yang sudah dikirim */}
          {peerReview.komentar !== null ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Review Anda</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{peerReview.komentar}</p>
              </CardContent>
            </Card>
          ) : (
            <PeerReviewForm peerReviewId={peerReview.id} revieweeName={peerReview.reviewee.nama} />
          )}
        </div>
      )}
    </div>
  )
}
