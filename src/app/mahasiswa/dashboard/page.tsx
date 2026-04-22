import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/auth"
import { getKelasByMahasiswa } from "@/server/queries/kelas.queries"
import JoinKelasForm from "@/components/mahasiswa/JoinKelasForm"

export default async function MahasiswaDashboardPage() {
  const session = await auth()
  const enrollment = session?.user?.id ? await getKelasByMahasiswa(session.user.id) : null
  const kelas = enrollment?.kelas ?? null

  return (
    <div className="space-y-6">
      {kelas ? (
        <>
          {/* Info kelas */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Kelas:</span>
            <span className="font-medium text-foreground">{kelas.nama}</span>
            <Badge variant="outline" className="font-mono text-xs">{kelas.kode}</Badge>
          </div>

          {/* Pertemuan cards */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Pertemuan</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2].map((ke) => (
                <Card key={ke} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Pertemuan {ke}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground">
                      5 tahap Knows SGM dengan materi dan tugas
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link href={`/mahasiswa/pertemuan/${ke}`} className="w-full">
                      <Button className="w-full gap-2" size="sm">
                        Masuk Pertemuan {ke}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Empty state — belum bergabung kelas */
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Selamat datang!</h1>
            <p className="text-muted-foreground mt-1">
              Masukkan kode kelas dari dosen untuk mulai belajar.
            </p>
          </div>
          <JoinKelasForm />
        </div>
      )}
    </div>
  )
}
