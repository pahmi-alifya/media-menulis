import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import KontenManager from "@/components/konten/KontenManager"
import { mockTahapList, mockKontenList, mockSubmissionList, TAHAP_LABEL, TIPE_SUBMISI_LABEL } from "@/lib/mock/data"

// TODO: replace with real API
const tahapList = mockTahapList.filter((t) => t.kelasId === "k1")

export default async function DosenTahapDetailPage({
  params,
}: {
  params: Promise<{ pertemuanKe: string; tahapId: string }>
}) {
  const { pertemuanKe, tahapId } = await params
  const p = Number(pertemuanKe)

  const tahap = tahapList.find((t) => t.id === tahapId) ?? tahapList[0]
  const initialKonten = mockKontenList.filter((k) => k.tahapId === tahap.id)
  const submissions = mockSubmissionList.filter((s) => s.tahapId === tahap.id)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/dosen/pertemuan/${p}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold">
              Tahap {tahap.urutan}: {TAHAP_LABEL[tahap.kode].singkat}
            </h1>
            <Badge variant="secondary">{TIPE_SUBMISI_LABEL[tahap.tipeSubmisi]}</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Pertemuan {p}</p>
        </div>
        <Link href={`/dosen/pertemuan/${p}/tahap/${tahap.id}/submissions`}>
          <Button variant="outline" size="sm">
            Submissions ({submissions.length})
          </Button>
        </Link>
      </div>

      <KontenManager
        initialKonten={initialKonten}
        tahapId={tahap.id}
        filterPertemuanKe={p}
      />
    </div>
  )
}
