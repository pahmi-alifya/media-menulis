import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import TahapKelasPanel from "@/components/tahap/TahapKelasPanel"
import { mockTahapList } from "@/lib/mock/data"

// TODO: replace with real API
const tahapList = mockTahapList.filter((t) => t.kelasId === "k1")

export default async function DosenPertemuanPage({
  params,
}: {
  params: Promise<{ pertemuanKe: string }>
}) {
  const { pertemuanKe } = await params
  const p = Number(pertemuanKe)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dosen/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Pertemuan {p}</h1>
          <p className="text-muted-foreground text-sm">
            Kelola materi dan pantau progress 5 tahap Knows SGM
          </p>
        </div>
      </div>

      <TahapKelasPanel pertemuanKe={p} initialTahapList={tahapList} />
    </div>
  )
}
