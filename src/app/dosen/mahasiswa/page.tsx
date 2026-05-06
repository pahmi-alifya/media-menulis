import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import {
  getSemuaEnrollmentsByDosen,
  getSemuaKelasByDosen,
} from "@/server/queries/kelas.queries";
import EnrollMahasiswaForm from "@/components/mahasiswa/EnrollMahasiswaForm";
import MahasiswaList from "@/components/mahasiswa/MahasiswaList";
import KelasFilterSelect from "@/components/mahasiswa/KelasFilterSelect";

interface Props {
  searchParams: Promise<{ k?: string }>;
}

export default async function DosenMahasiswaPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { k: selectedKelasId } = await searchParams;

  const [semuaEnrollments, semuaKelas] = await Promise.all([
    getSemuaEnrollmentsByDosen(session.user.id),
    getSemuaKelasByDosen(session.user.id),
  ]);

  if (semuaKelas.length === 0) redirect("/dosen/dashboard");

  const validKelasId =
    selectedKelasId && semuaKelas.some((k) => k.id === selectedKelasId)
      ? selectedKelasId
      : null;

  const filtered = validKelasId
    ? semuaEnrollments.filter((e) => e.kelas.id === validKelasId)
    : semuaEnrollments;

  const enrollKelasId = validKelasId ?? semuaKelas[0].id;
  const kelasMeta = semuaKelas.map((k) => ({ id: k.id, nama: k.nama }));

  const uniqueStudents = new Set(semuaEnrollments.map((e) => e.userId)).size;
  const uniqueFiltered = new Set(filtered.map((e) => e.userId)).size;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link href="/dosen/dashboard">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold">Daftar Mahasiswa</h1>
            <p className="text-muted-foreground text-sm">
              {uniqueStudents} mahasiswa di {semuaKelas.length} kelas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-11 sm:pl-0 flex-wrap">
          <EnrollMahasiswaForm
            kelasId={enrollKelasId}
            kelasList={kelasMeta}
            selectedKelasId={validKelasId}
          />
        </div>
      </div>

      {/* List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold mb-3">
            {validKelasId
              ? `${uniqueFiltered} mahasiswa di kelas ini`
              : `${uniqueStudents} mahasiswa terdaftar`}
          </h2>
          <KelasFilterSelect
            kelasList={kelasMeta}
            selectedKelasId={validKelasId}
          />
        </div>
        <MahasiswaList
          enrollments={filtered}
          kelasId={enrollKelasId}
          showKelasColumn={!validKelasId}
          semuaKelas={kelasMeta}
        />
      </div>
    </div>
  );
}
