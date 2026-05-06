import { Users, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/auth"
import { getActiveKelas } from "@/server/queries/kelas.queries"
import BuatKelasDialog from "@/components/dosen/BuatKelasDialog"
import PanduanMahasiswaEditor from "@/components/kelas/PanduanMahasiswaEditor"

export default async function DosenDashboardPage() {
  const session = await auth()
  const kelas = session?.user?.id ? await getActiveKelas(session.user.id) : null
  const namaDosen = session?.user?.name ?? "Dosen"

  const totalMahasiswa = kelas?._count.enrollments ?? 0
  const tahapTerbuka = kelas?.tahaps.filter((t) => t.isUnlocked).length ?? 0

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">Selamat datang kembali</p>
        <h1 className="text-2xl font-bold">{namaDosen}</h1>
      </div>

      {kelas ? (
        <>
          {/* Kelas aktif */}
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Kelas Aktif</p>
              <p className="font-semibold truncate">{kelas.nama}</p>
              {kelas.deskripsi && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{kelas.deskripsi}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground mb-0.5">Kode Kelas</p>
              <code className="font-mono font-bold text-lg tracking-widest">{kelas.kode}</code>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-0 shadow-sm bg-primary text-primary-foreground">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-primary-foreground/70 text-xs font-medium uppercase tracking-wide">
                      Mahasiswa
                    </p>
                    <p className="text-3xl sm:text-4xl font-bold mt-1">{totalMahasiswa}</p>
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
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Tahap Terbuka
                    </p>
                    <p className="text-3xl sm:text-4xl font-bold mt-1">{tahapTerbuka}/5</p>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panduan mahasiswa */}
          <PanduanMahasiswaEditor initialLink={kelas.linkPanduanMahasiswa ?? null} />
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Belum ada kelas</p>
              <p className="text-sm text-muted-foreground mt-1">
                Buat kelas baru untuk mulai mengelola materi dan mahasiswa.
              </p>
            </div>
            <BuatKelasDialog />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
