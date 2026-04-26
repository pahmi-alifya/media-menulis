import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import KontenManager from "@/components/konten/KontenManager";
import {
  getTahapById,
  getKontenByTahap,
  getTahapsByKelas,
} from "@/server/queries/kelas.queries";
import { TAHAP_LABEL, TIPE_SUBMISI_LABEL } from "@/lib/mock/data";
import { prisma } from "@/lib/prisma";
import RubrikPreview from "@/components/assessment/RubrikPreview";

export default async function DosenTahapDetailPage({
  params,
}: {
  params: Promise<{ pertemuanKe: string; tahapId: string }>;
}) {
  const { pertemuanKe, tahapId } = await params;
  const p = Number(pertemuanKe);
  const tahap = await getTahapById(tahapId);
  if (!tahap) notFound();

  const [initialKonten, submissionCount, allTahaps] = await Promise.all([
    getKontenByTahap(tahapId, p),
    prisma.submission.count({ where: { tahapId, isDraft: false } }),
    getTahapsByKelas(tahap.kelas.id),
  ]);

  const prevTahap = allTahaps.find((t) => t.urutan === tahap.urutan - 1);
  const nextTahap = allTahaps.find((t) => t.urutan === tahap.urutan + 1);

  const hasSerahkan = initialKonten.some((k) => k.kategori === "SERAHKAN");
  console.log("recon sini", nextTahap);
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/dosen/pertemuan/${p}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold">
              Tahap {tahap.urutan}:{" "}
              {TAHAP_LABEL[tahap.kode as keyof typeof TAHAP_LABEL].singkat}
            </h1>
            <Badge variant="secondary">
              {
                TIPE_SUBMISI_LABEL[
                  tahap.tipeSubmisi as keyof typeof TIPE_SUBMISI_LABEL
                ]
              }
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Pertemuan {p}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {prevTahap && (
            <Link href={`/dosen/pertemuan/${p}/tahap/${prevTahap.id}`}>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {`${prevTahap.urutan}: ${TAHAP_LABEL[prevTahap.kode as keyof typeof TAHAP_LABEL]?.singkat}`}
                </span>
              </Button>
            </Link>
          )}
          {nextTahap && nextTahap.isUnlocked && (
            <Link href={`/dosen/pertemuan/${p}/tahap/${nextTahap.id}`}>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <span className="hidden sm:inline">
                  {`${nextTahap.urutan}: ${TAHAP_LABEL[nextTahap.kode as keyof typeof TAHAP_LABEL]?.singkat}`}
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
          {hasSerahkan && (
            <Link href={`/dosen/pertemuan/${p}/tahap/${tahap.id}/submissions`}>
              <Button variant="outline" size="sm">
                Submissions ({submissionCount})
              </Button>
            </Link>
          )}
        </div>
      </div>

      <KontenManager
        initialKonten={initialKonten}
        tahapId={tahap.id}
        kelasId={tahap.kelas.id}
        tahapUrutan={tahap.urutan}
        filterPertemuanKe={p}
      />

      <RubrikPreview tahapUrutan={tahap.urutan} />
    </div>
  );
}
