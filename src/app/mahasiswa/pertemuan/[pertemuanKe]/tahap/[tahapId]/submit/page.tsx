import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import SubmissionForm from "@/components/submission/SubmissionForm"
import PanduanSubmisi from "@/components/submission/PanduanSubmisi"
import { auth } from "@/auth"
import { getTahapById, getSubmissionByMahasiswa } from "@/server/queries/kelas.queries"
import { TAHAP_LABEL } from "@/lib/mock/data"

export default async function SubmitTugasPage({
  params,
}: {
  params: Promise<{ pertemuanKe: string; tahapId: string }>
}) {
  const { pertemuanKe, tahapId } = await params
  const p = Number(pertemuanKe)

  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [tahap, mySubmission] = await Promise.all([
    getTahapById(tahapId),
    getSubmissionByMahasiswa(tahapId, session.user.id),
  ])

  if (!tahap) redirect("/mahasiswa/dashboard")
  if (!tahap.isUnlocked) redirect(`/mahasiswa/pertemuan/${p}`)

  const label = TAHAP_LABEL[tahap.kode as keyof typeof TAHAP_LABEL]

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <Link href={`/mahasiswa/pertemuan/${p}/tahap/${tahap.id}`}>
          <Button variant="ghost" size="icon" className="mt-0.5 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold">Kumpulkan Tugas</h1>
            <Badge variant="secondary" className="text-xs px-2.5 py-0.5 shrink-0">
              Poin Maks: 100
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Tahap {tahap.urutan}: {label?.singkat ?? tahap.kode}
          </p>
        </div>
      </div>

      <PanduanSubmisi tipeSubmisi={tahap.tipeSubmisi} />

      <SubmissionForm
        tahapId={tahapId}
        tipeSubmisi={tahap.tipeSubmisi}
        tahapUrutan={tahap.urutan}
        existingSubmission={mySubmission}
      />
    </div>
  )
}
