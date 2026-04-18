import Link from "next/link"
import { Users, BookOpen, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockDosen, mockEnrollmentList, mockTahapList } from "@/lib/mock/data"

// TODO: replace with real API
const user = mockDosen
const totalMahasiswa = mockEnrollmentList.filter((e) => e.kelasId === "k1").length
const tahapList = mockTahapList.filter((t) => t.kelasId === "k1")
const tahapTerbuka = tahapList.filter((t) => t.isUnlocked).length

const pertemuan = [
  {
    ke: 1,
    topik: "Pengantar Esai Argumentatif",
    deskripsi: "Materi pengantar, infografis struktur esai, dan template peta konsep.",
  },
  {
    ke: 2,
    topik: "Korupsi dan Komikus",
    deskripsi: "Esai model, panduan penelaahan, topik kolaboratif dan mandiri.",
  },
]

export default function DosenDashboardPage() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">Selamat datang kembali</p>
        <h1 className="text-2xl font-bold">{user.nama.split(",")[0]}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm bg-primary text-primary-foreground">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-wide">Mahasiswa</p>
                <p className="text-4xl font-bold mt-1">{totalMahasiswa}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Tahap Terbuka</p>
                <p className="text-4xl font-bold mt-1">{tahapTerbuka}/5</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pertemuan */}
      <div>
        <h2 className="font-semibold mb-3">Pertemuan</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {pertemuan.map((p) => (
            <Card key={p.ke} className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-semibold">Pertemuan {p.ke}</CardTitle>
                  <Badge variant="secondary" className="text-xs shrink-0">{p.topik}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-xs text-muted-foreground">{p.deskripsi}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href={`/dosen/pertemuan/${p.ke}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    Kelola Pertemuan {p.ke}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="flex gap-3">
        <Link href="/dosen/mahasiswa" className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            <Users className="h-4 w-4" />
            Mahasiswa
          </Button>
        </Link>
      </div>
    </div>
  )
}
