"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Video,
  Image,
  File,
  ChevronRight as ChevronRightIcon,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ForumSection from "@/components/forum/ForumSection";
import RubrikPreview from "@/components/assessment/RubrikPreview";
import { TIPE_SUBMISI_LABEL, KATEGORI_LABEL } from "@/lib/mock/data";
import { buildEmbedUrl, segmentTeksBody } from "@/lib/utils/url-parser";

// ─── Local types (Prisma-compatible) ─────────────────────────────────────────

type KontenTipe = "TEKS" | "VIDEO" | "INFOGRAFIS" | "DOKUMEN" | "TEMPLATE";
type KategoriKonten = "LIHAT" | "SERAHKAN" | "BERKONTRIBUSI";

type KontenItem = {
  id: string;
  tipe: KontenTipe;
  judul: string;
  body: string | null;
  url: string | null;
  urutan: number;
  kategori: KategoriKonten;
};

type TahapForViewer = {
  id: string;
  urutan: number;
  tipeSubmisi: string;
};

type SubmissionForViewer = {
  isDraft: boolean;
} | null;

// ─── Full-width konten display ────────────────────────────────────────────────

const ICON_MAP: Record<KontenTipe, React.ElementType> = {
  TEKS: FileText,
  VIDEO: Video,
  INFOGRAFIS: Image,
  DOKUMEN: File,
  TEMPLATE: File,
};

const LABEL_MAP: Record<KontenTipe, string> = {
  TEKS: "Teks",
  VIDEO: "Video",
  INFOGRAFIS: "Infografis",
  DOKUMEN: "Dokumen",
  TEMPLATE: "Template",
};

function KontenDisplay({ konten }: { konten: KontenItem }) {
  const Icon = ICON_MAP[konten.tipe];
  const embed = konten.url ? buildEmbedUrl(konten.url) : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-md bg-muted shrink-0">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-lg leading-tight">
            {konten.judul}
          </h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {LABEL_MAP[konten.tipe]}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs ${
                konten.kategori === "BERKONTRIBUSI"
                  ? "border-emerald-300 text-emerald-700 dark:text-emerald-400"
                  : konten.kategori === "SERAHKAN"
                    ? "border-amber-300 text-amber-700 dark:text-amber-400"
                    : "border-sky-300 text-sky-700 dark:text-sky-400"
              }`}
            >
              {KATEGORI_LABEL[konten.kategori]}
            </Badge>
          </div>
        </div>
      </div>

      {/* Teks content — render segmen inline (embed di posisi URL) */}
      {konten.tipe === "TEKS" && konten.body && (
        <div className="space-y-4">
          {segmentTeksBody(konten.body).map((seg, i) =>
            seg.kind === "html" ? (
              <div
                key={i}
                className="rich-editor-content"
                dangerouslySetInnerHTML={{ __html: seg.html }}
              />
            ) : (
              <div key={i} className="space-y-2">
                {seg.embed.type === "youtube" && (
                  <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted border">
                    <iframe src={seg.embed.embedUrl} className="w-full h-full" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" allowFullScreen loading="lazy" />
                  </div>
                )}
                {(seg.embed.type === "gdrive" || seg.embed.type === "canva") && (
                  <div className="w-full rounded-lg overflow-hidden bg-muted border min-h-87.5 md:min-h-150">
                    <iframe src={seg.embed.embedUrl} className="w-full min-h-87.5 md:min-h-150" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" allowFullScreen loading="lazy" />
                  </div>
                )}
                {seg.embed.type === "pdf" && (
                  <div className="w-full rounded-lg overflow-hidden bg-muted border min-h-100 md:min-h-175">
                    <iframe src={seg.embed.embedUrl} className="w-full min-h-100 md:min-h-175" loading="lazy" />
                  </div>
                )}
                {seg.embed.type === "image" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={seg.embed.embedUrl} alt="" className="w-full rounded-lg object-contain max-h-125 bg-muted" loading="lazy" />
                )}
                <div className="flex justify-end">
                  <a href={seg.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Buka di tab baru
                    </Button>
                  </a>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Embed full-width */}
      {embed && (
        <div className="space-y-2">
          {embed.type === "youtube" && (
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted border">
              <iframe
                src={embed.embedUrl}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}

          {(embed.type === "gdrive" || embed.type === "canva") && (
            <div className="w-full rounded-lg overflow-hidden bg-muted border min-h-87.5 md:min-h-150">
              <iframe
                src={embed.embedUrl}
                className="w-full min-h-87.5 md:min-h-150"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}

          {embed.type === "pdf" && (
            <div className="w-full rounded-lg overflow-hidden bg-muted border min-h-100 md:min-h-175">
              <iframe
                src={embed.embedUrl}
                className="w-full min-h-100 md:min-h-175"
                loading="lazy"
              />
            </div>
          )}

          {embed.type === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={embed.embedUrl}
              alt={konten.judul}
              className="w-full rounded-lg object-contain max-h-125 bg-muted"
              loading="lazy"
            />
          )}

          {konten.url && (
            <div className="flex justify-end">
              <a href={konten.url} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-xs text-muted-foreground"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Buka di tab baru
                </Button>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Tidak bisa di-embed → link card */}
      {konten.url && !embed && (
        <a href={konten.url} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="gap-2 w-full">
            <ExternalLink className="h-4 w-4" />
            Buka {LABEL_MAP[konten.tipe]}
          </Button>
        </a>
      )}
    </div>
  );
}

// ─── Submission status card (SERAHKAN) ───────────────────────────────────────

function SubmissionCard({
  tahap,
  pertemuanKe,
  mySubmission,
}: {
  tahap: TahapForViewer;
  pertemuanKe: number;
  mySubmission?: SubmissionForViewer;
}) {
  const sudahKumpul = mySubmission && !mySubmission.isDraft;
  const isDraft = mySubmission?.isDraft;

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Tugas</span>
          <Badge variant="secondary" className="text-xs">
            {
              TIPE_SUBMISI_LABEL[
                tahap.tipeSubmisi as keyof typeof TIPE_SUBMISI_LABEL
              ]
            }
          </Badge>
        </div>
        {sudahKumpul ? (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200">
            Terkumpul
          </Badge>
        ) : isDraft ? (
          <Badge variant="outline" className="text-amber-600 border-amber-400">
            Draft tersimpan
          </Badge>
        ) : (
          <Badge variant="outline">Belum dikerjakan</Badge>
        )}
      </div>
      <Link
        href={`/mahasiswa/pertemuan/${pertemuanKe}/tahap/${tahap.id}/submit`}
      >
        <Button
          variant={sudahKumpul ? "outline" : "default"}
          className="w-full gap-2"
        >
          {sudahKumpul
            ? "Lihat Submission Saya"
            : isDraft
              ? "Lanjutkan Mengerjakan"
              : "Kerjakan Tugas"}
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

// ─── Main KontenViewer ────────────────────────────────────────────────────────

interface KontenViewerProps {
  kontenList: KontenItem[];
  tahap: TahapForViewer;
  pertemuanKe: number;
  kelasId: string;
  mySubmission?: SubmissionForViewer;
  kelompokName?: string | null;
}

export default function KontenViewer({
  kontenList,
  tahap,
  pertemuanKe,
  kelasId,
  mySubmission,
  kelompokName,
}: KontenViewerProps) {
  const sorted = [...kontenList].sort((a, b) => a.urutan - b.urutan);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-tandai SERAHKAN items sebagai selesai jika ada final submission
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    const auto = new Set<string>();
    if (mySubmission && !mySubmission.isDraft) {
      sorted
        .filter((k) => k.kategori === "SERAHKAN")
        .forEach((k) => auto.add(k.id));
    }
    return auto;
  });

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Belum ada materi untuk pertemuan ini.
      </p>
    );
  }

  const current = sorted[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < sorted.length - 1;
  const isCompleted = completedIds.has(current.id);
  const completedCount = completedIds.size;

  function toggleComplete(id: string) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // TODO: Server Action — markKontenSelesai(id) / unmarkKontenSelesai(id)
  }

  return (
    <div className="space-y-5">
      {/* ── Content area ── */}
      <Card>
        <CardContent className="pt-6 pb-4">
          <KontenDisplay konten={current} />
        </CardContent>
      </Card>

      {/* ── Extra section berdasarkan kategori ── */}
      {current.kategori === "SERAHKAN" && (
        <>
          <SubmissionCard
            tahap={tahap}
            pertemuanKe={pertemuanKe}
            mySubmission={mySubmission}
          />
          <RubrikPreview tahapUrutan={tahap.urutan} />
        </>
      )}

      {current.kategori === "BERKONTRIBUSI" && (
        <Card>
          <CardContent className="pt-5 pb-5">
            <ForumSection
              kontenId={current.id}
              kelasId={kelasId}
              tahapUrutan={tahap.urutan}
              kelompokName={kelompokName}
            />
          </CardContent>
        </Card>
      )}

      {/* ── Navigation ── */}
      <div className="space-y-3">
        {/* Dot navigator — hijau jika selesai, primary jika aktif */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {sorted.map((k, idx) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              title={k.judul}
              className={`rounded-full transition-all ${
                idx === currentIndex
                  ? "w-6 h-2.5 bg-primary"
                  : completedIds.has(k.id)
                    ? "w-2.5 h-2.5 bg-green-500"
                    : "w-2.5 h-2.5 bg-muted hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>

        {/* Counter + progres selesai */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>
            {currentIndex + 1} / {sorted.length} materi
          </span>
          {completedCount > 0 && (
            <>
              <span>·</span>
              <span className="text-green-600 font-medium">
                {completedCount}/{sorted.length} selesai
              </span>
            </>
          )}
        </div>

        {/* Tombol Tandai Selesai */}
        <div className="flex justify-center">
          <Button
            variant={isCompleted ? "secondary" : "outline"}
            size="sm"
            className={`gap-2 text-xs ${isCompleted ? "text-green-700 dark:text-green-400" : ""}`}
            onClick={() => toggleComplete(current.id)}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Sudah Selesai
              </>
            ) : (
              <>
                <Circle className="h-3.5 w-3.5" />
                Tandai Selesai
              </>
            )}
          </Button>
        </div>

        {/* Prev / Next */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            disabled={!hasPrev}
            onClick={() => {
              setCurrentIndex((i) => i - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Button>
          <Button
            variant={hasNext ? "default" : "outline"}
            className="flex-1 gap-2"
            disabled={!hasNext}
            onClick={() => {
              setCurrentIndex((i) => i + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
