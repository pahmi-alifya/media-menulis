import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import SubmissionForm from "@/components/submission/SubmissionForm"
import PanduanSubmisi from "@/components/submission/PanduanSubmisi"
import { mockTahapList, mockSubmissionList, TAHAP_LABEL } from "@/lib/mock/data"

// TODO: replace with real API
const tahapList = mockTahapList.filter((t) => t.kelasId === "k1")

export default async function SubmitTugasPage({
  params,
}: {
  params: Promise<{ pertemuanKe: string; tahapId: string }>
}) {
  const { pertemuanKe, tahapId } = await params
  const p = Number(pertemuanKe)

  const tahap = tahapList.find((t) => t.id === tahapId) ?? tahapList[0]
  const mySubmission = mockSubmissionList.find(
    (s) => s.tahapId === tahap.id && s.userId === "u2"
  ) ?? null

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
            Tahap {tahap.urutan}: {TAHAP_LABEL[tahap.kode].singkat}
          </p>
        </div>
      </div>

      <PanduanSubmisi tipeSubmisi={tahap.tipeSubmisi} />

      <SubmissionForm
        tipeSubmisi={tahap.tipeSubmisi}
        tahapUrutan={tahap.urutan}
        existingSubmission={mySubmission}
      />
    </div>
  )
}
