import Link from "next/link";
import { Users, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/auth";
import { getKelasByDosen } from "@/server/queries/kelas.queries";
import BuatKelasDialog from "@/components/dosen/BuatKelasDialog";
import PanduanMahasiswaEditor from "@/components/kelas/PanduanMahasiswaEditor";

const pertemuanMeta = [
  { ke: 1, label: "Pertemuan 1" },
  { ke: 2, label: "Pertemuan 2" },
];

export default async function DosenDashboardPage() {
  const session = await auth();
  const kelas = session?.user?.id
    ? await getKelasByDosen(session.user.id)
    : null;

  const totalMahasiswa = kelas?._count.enrollments ?? 0;
  const tahapTerbuka =
    kelas?.tahaps.filter((t: { isUnlocked: boolean }) => t.isUnlocked).length ??
    0;
  const namaDosen = session?.user?.name ?? "Dosen";

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          Selamat datang kembali
        </p>
        <h1 className="text-2xl font-bold">{namaDosen}</h1>
      </div>

      {kelas ? (
        <>
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

          {/* Kode kelas */}
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">
                Kode Kelas — {kelas.nama}
              </p>
              <p className="font-mono font-bold text-xl tracking-widest">
                {kelas.kode}
              </p>
            </div>
            <Badge variant="outline" className="text-xs shrink-0 hidden sm:flex">
              Bagikan ke mahasiswa
            </Badge>
            <Badge variant="outline" className="text-xs shrink-0 sm:hidden">
              Share
            </Badge>
          </div>

          {/* Panduan mahasiswa */}
          <PanduanMahasiswaEditor initialLink={kelas.linkPanduanMahasiswa ?? null} />

          {/* Pertemuan */}
          {/* <div>
            <h2 className="font-semibold mb-3">Pertemuan</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {pertemuanMeta.map((p) => (
                <Card key={p.ke} className="hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">
                      {p.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-xs text-muted-foreground">
                      Kelola materi dan pantau progress 5 tahap Knows SGM
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link href={`/dosen/pertemuan/${p.ke}`} className="w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                      >
                        Kelola Pertemuan {p.ke}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div> */}

          {/* Quick links */}
          {/* <div className="flex gap-3">
            <Link href="/dosen/mahasiswa" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <Users className="h-4 w-4" />
                Mahasiswa
              </Button>
            </Link>
          </div> */}
        </>
      ) : (
        /* Empty state — belum ada kelas */
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
  );
}
