import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import TahapStepper from "@/components/tahap/TahapStepper";
import KontenViewer from "@/components/konten/KontenViewer";
import { auth } from "@/auth";
import {
  getTahapById,
  getKontenByTahap,
  getSubmissionByMahasiswa,
  getActiveMahasiswaKelas,
} from "@/server/queries/kelas.queries";
import { TAHAP_LABEL } from "@/lib/mock/data";

export default async function MahasiswaTahapDetailPage({
  params,
}: {
  params: Promise<{ pertemuanKe: string; tahapId: string }>;
}) {
  const { pertemuanKe, tahapId } = await params;
  const p = Number(pertemuanKe);

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [tahap, enrollment] = await Promise.all([
    getTahapById(tahapId),
    getActiveMahasiswaKelas(userId),
  ]);

  if (!tahap || !enrollment) redirect("/mahasiswa/dashboard");

  // Redirect ke halaman pertemuan jika tahap belum dibuka
  if (!tahap.isUnlocked) redirect(`/mahasiswa/pertemuan/${p}`);

  const [kontenList, mySubmission] = await Promise.all([
    getKontenByTahap(tahapId, p),
    getSubmissionByMahasiswa(tahapId, userId),
  ]);

  const tahapList = enrollment.kelas.tahaps;
  const kelompokName = enrollment.kelompok ?? null;
  const label = TAHAP_LABEL[tahap.kode as keyof typeof TAHAP_LABEL];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href={`/mahasiswa/pertemuan/${p}`}
          className="hover:text-foreground"
        >
          Pertemuan {p}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">
          Tahap {tahap.urutan}: {label?.singkat ?? tahap.kode}
        </span>
      </div>

      {/* Stepper */}
      <Card>
        <CardContent className="pt-4">
          <TahapStepper
            tahapList={tahapList}
            activeTahapId={tahap.id}
            kelasId={enrollment.kelasId}
            baseHref={`/mahasiswa/pertemuan/${p}/tahap`}
          />
        </CardContent>
      </Card>

      {/* Deskripsi tahap */}
      <div>
        <h1 className="text-xl font-bold mb-1">
          Tahap {tahap.urutan}: {label?.singkat ?? tahap.kode}
        </h1>
        <p className="text-muted-foreground text-sm">{label?.panjang}</p>
      </div>

      {/* Konten viewer — satu item per layar */}
      <div>
        <h2 className="font-semibold mb-3">Materi Pertemuan {p}</h2>
        <KontenViewer
          kontenList={kontenList}
          tahap={tahap}
          pertemuanKe={p}
          kelasId={tahap.kelas.id}
          mySubmission={mySubmission}
          kelompokName={kelompokName}
        />
      </div>
    </div>
  );
}
