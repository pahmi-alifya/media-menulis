import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getKelasByDosen,
  getTahapsByKelas,
} from "@/server/queries/kelas.queries";
import TahapKelasPanel from "@/components/tahap/TahapKelasPanel";
import ModelPembelajaranBanner from "@/components/kelas/ModelPembelajaranBanner";

export default async function DosenPertemuanPage({
  params,
}: {
  params: Promise<{ pertemuanKe: string }>;
}) {
  const { pertemuanKe } = await params;
  const p = Number(pertemuanKe);

  const session = await auth();
  const kelas = session?.user?.id
    ? await getKelasByDosen(session.user.id)
    : null;

  if (!kelas) redirect("/dosen/dashboard");

  const tahapList = await getTahapsByKelas(kelas.id);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dosen/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Pertemuan {p}</h1>
          <p className="text-muted-foreground text-sm">
            Kelola materi dan pantau progress 5 tahap Knows SGM
          </p>
        </div>
      </div>

      {/* <ModelPembelajaranBanner initialLink={kelas.linkModelPembelajaran ?? null} /> */}

      <TahapKelasPanel pertemuanKe={p} initialTahapList={tahapList} />
    </div>
  );
}
