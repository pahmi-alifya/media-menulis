import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, Lock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TahapStepper from "@/components/tahap/TahapStepper"
import { auth } from "@/auth"
import { getActiveMahasiswaKelas } from "@/server/queries/kelas.queries"
import { TAHAP_LABEL, TIPE_SUBMISI_LABEL } from "@/lib/mock/data"

export default async function MahasiswaPertemuanPage({
  params,
}: {
  params: Promise<{ pertemuanKe: string }>
}) {
  const { pertemuanKe } = await params
  const p = Number(pertemuanKe)

  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const enrollment = await getActiveMahasiswaKelas(session.user.id)
  if (!enrollment) redirect("/mahasiswa/dashboard")

  const tahapList = enrollment.kelas.tahaps
  const latestUnlockedId = tahapList.filter((t) => t.isUnlocked).at(-1)?.id

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/mahasiswa/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">Pertemuan {p}</h1>
          <p className="text-muted-foreground text-sm">5 tahap pembelajaran Knows SGM</p>
        </div>
      </div>

      {/* Stepper */}
      <Card>
        <CardContent className="pt-4">
          <TahapStepper
            tahapList={tahapList}
            activeTahapId={latestUnlockedId}
            kelasId={enrollment.kelasId}
            baseHref={`/mahasiswa/pertemuan/${p}/tahap`}
          />
        </CardContent>
      </Card>

      {/* Daftar tahap */}
      <div className="space-y-3">
        {tahapList.map((tahap) => {
          const label = TAHAP_LABEL[tahap.kode as keyof typeof TAHAP_LABEL]
          const submisiLabel = TIPE_SUBMISI_LABEL[tahap.tipeSubmisi as keyof typeof TIPE_SUBMISI_LABEL]
          return (
            <Card
              key={tahap.id}
              className={tahap.isUnlocked ? "hover:shadow-md transition-shadow" : "opacity-60"}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        tahap.isUnlocked
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tahap.isUnlocked ? tahap.urutan : <Lock className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm">{label?.singkat ?? tahap.kode}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-0.5">{label?.panjang}</CardDescription>
                    </div>
                  </div>
                  {tahap.isUnlocked && (
                    <Link href={`/mahasiswa/pertemuan/${p}/tahap/${tahap.id}`}>
                      <Button size="sm" className="gap-1 shrink-0">
                        Buka
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              {tahap.isUnlocked && (
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {submisiLabel ?? tahap.tipeSubmisi}
                    </Badge>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
