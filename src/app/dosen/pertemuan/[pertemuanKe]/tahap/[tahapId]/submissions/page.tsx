import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, CheckCircle2, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ExportCsvButton from "@/components/submission/ExportCsvButton"
import AssignPeerReviewButton from "@/components/assessment/AssignPeerReviewButton"
import { auth } from "@/auth"
import { getTahapById, getSubmissionsByTahap, getPeerReviewCount } from "@/server/queries/kelas.queries"
import { TAHAP_LABEL } from "@/lib/mock/data"

export default async function DosenSubmissionsPage({
  params,
}: {
  params: Promise<{ pertemuanKe: string; tahapId: string }>
}) {
  const { pertemuanKe, tahapId } = await params
  const p = Number(pertemuanKe)

  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const tahap = await getTahapById(tahapId)
  if (!tahap) redirect(`/dosen/pertemuan/${p}`)
  if (tahap.kelas.dosenId !== session.user.id) redirect(`/dosen/pertemuan/${p}`)

  const [submissions, peerReviewCount] = await Promise.all([
    getSubmissionsByTahap(tahapId),
    tahap.kode === "IMMM" ? getPeerReviewCount(tahapId) : Promise.resolve(0),
  ])
  const final = submissions.filter((s) => !s.isDraft)
  const draft = submissions.filter((s) => s.isDraft)

  const label = TAHAP_LABEL[tahap.kode as keyof typeof TAHAP_LABEL]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href={`/dosen/pertemuan/${p}/tahap/${tahap.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Submissions</h1>
            <p className="text-muted-foreground text-sm">
              Pertemuan {p} — Tahap {tahap.urutan}: {label?.singkat ?? tahap.kode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {tahap.kode === "IMMM" && final.length >= 2 && (
            <AssignPeerReviewButton tahapId={tahap.id} alreadyAssigned={peerReviewCount > 0} />
          )}
          {submissions.length > 0 && (
            <ExportCsvButton submissions={submissions} tahapKode={tahap.kode} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{submissions.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-green-600">{final.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Terkumpul</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-amber-500">{draft.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Draft</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {submissions.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Belum ada submission</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium">Mahasiswa</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Status</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Waktu Kumpul</th>
                  <th className="text-left px-4 py-3 font-medium">Nilai</th>
                  <th className="text-right px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s, idx) => (
                  <tr key={s.id} className={idx < submissions.length - 1 ? "border-b" : ""}>
                    <td className="px-4 py-3 font-medium">
                      {s.user.nama}
                      {s.user.nim && (
                        <span className="text-xs text-muted-foreground ml-1">({s.user.nim})</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {s.isDraft ? (
                        <Badge variant="outline" className="gap-1 text-xs">
                          <Clock className="h-3 w-3" />Draft
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1 text-xs text-green-700 bg-green-50 dark:bg-green-950/30">
                          <CheckCircle2 className="h-3 w-3" />Terkumpul
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {s.submittedAt
                        ? s.submittedAt.toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {s.nilaiTotal !== null ? (
                        <span className="font-semibold">{s.nilaiTotal.toFixed(1)}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Belum dinilai</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/dosen/pertemuan/${p}/tahap/${tahap.id}/submissions/${s.id}`}>
                        <Button variant="outline" size="sm">Lihat</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
