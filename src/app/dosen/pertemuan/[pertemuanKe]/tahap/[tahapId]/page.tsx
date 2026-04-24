import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import KontenManager from "@/components/konten/KontenManager"
import { getTahapById, getKontenByTahap } from "@/server/queries/kelas.queries"
import { TAHAP_LABEL, TIPE_SUBMISI_LABEL } from "@/lib/mock/data"
import { prisma } from "@/lib/prisma"

export default async function DosenTahapDetailPage({
  params,
}: {
  params: Promise<{ pertemuanKe: string; tahapId: string }>
}) {
  const { pertemuanKe, tahapId } = await params
  const p = Number(pertemuanKe)

  const tahap = await getTahapById(tahapId)
  if (!tahap) notFound()

  const [initialKonten, submissionCount] = await Promise.all([
    getKontenByTahap(tahapId, p),
    prisma.submission.count({ where: { tahapId, isDraft: false } }),
  ])

  const hasSerahkan = initialKonten.some((k) => k.kategori === "SERAHKAN")

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
              Tahap {tahap.urutan}: {TAHAP_LABEL[tahap.kode as keyof typeof TAHAP_LABEL].singkat}
            </h1>
            <Badge variant="secondary">{TIPE_SUBMISI_LABEL[tahap.tipeSubmisi as keyof typeof TIPE_SUBMISI_LABEL]}</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Pertemuan {p}</p>
        </div>
        {hasSerahkan && (
          <Link href={`/dosen/pertemuan/${p}/tahap/${tahap.id}/submissions`}>
            <Button variant="outline" size="sm">
              Submissions ({submissionCount})
            </Button>
          </Link>
        )}
      </div>

      <KontenManager
        initialKonten={initialKonten}
        tahapId={tahap.id}
        filterPertemuanKe={p}
      />
    </div>
  )
}
