import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getKelasByDosen, getTahapsByKelas } from "@/server/queries/kelas.queries"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ModelPembelajaranBanner from "@/components/kelas/ModelPembelajaranBanner"
import EditableNamaKelas from "@/components/kelas/EditableNamaKelas"
import { TAHAP_LABEL } from "@/lib/mock/data"

export default async function DosenPertemuanIndexPage() {
  const session = await auth()
  const kelas = session?.user?.id ? await getKelasByDosen(session.user.id) : null
  if (!kelas) redirect("/dosen/dashboard")

  const tahapList = await getTahapsByKelas(kelas.id)
  const unlockedCount = tahapList.filter((t) => t.isUnlocked).length

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-0.5">
        <EditableNamaKelas initialNama={kelas.nama} kode={kelas.kode} />
        <p className="text-muted-foreground text-sm">
          Kode: <span className="font-mono font-semibold">{kelas.kode}</span>
        </p>
      </div>

      <ModelPembelajaranBanner initialLink={kelas.linkModelPembelajaran ?? null} />

      <div className="grid sm:grid-cols-2 gap-4">
        {([1, 2] as const).map((p) => (
          <Link key={p} href={`/dosen/pertemuan/${p}`}>
            <Card className="hover:border-primary/50 hover:bg-accent/30 transition-colors cursor-pointer h-full">
              <CardContent className="pt-5 pb-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-lg font-bold">Pertemuan {p}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">5 tahap Knows SGM</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {unlockedCount} / 5 terbuka
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tahapList.map((t) => (
                    <span
                      key={t.id}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        t.isUnlocked
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground border-transparent"
                      }`}
                    >
                      {TAHAP_LABEL[t.kode as keyof typeof TAHAP_LABEL]?.singkat ?? t.kode}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
