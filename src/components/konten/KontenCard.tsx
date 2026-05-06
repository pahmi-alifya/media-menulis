import { ExternalLink, FileText, Image, Video, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type MockKonten, type KontenTipe } from "@/lib/mock/data";
import { buildEmbedUrl, segmentTeksBody } from "@/lib/utils/url-parser";

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

export default function KontenCard({ konten }: { konten: MockKonten }) {
  const Icon = ICON_MAP[konten.tipe];
  const embed = konten.url ? buildEmbedUrl(konten.url) : null;

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-muted/30">
        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="font-medium text-sm flex-1">{konten.judul}</span>
        <Badge variant="outline" className="text-xs">
          {LABEL_MAP[konten.tipe]}
        </Badge>
      </div>

      <div className="p-4 space-y-3">
        {/* Teks konten — render segmen inline (embed di posisi URL) */}
        {konten.tipe === "TEKS" && konten.body && (
          <div className="space-y-3">
            {segmentTeksBody(konten.body).map((seg, i) =>
              seg.kind === "html" ? (
                <div
                  key={i}
                  className="rich-editor-content"
                  dangerouslySetInnerHTML={{ __html: seg.html }}
                />
              ) : (
                <div key={i} className="space-y-1.5">
                  {seg.embed.type === "youtube" && (
                    <div className="w-full aspect-video rounded-md overflow-hidden bg-muted">
                      <iframe
                        src={seg.embed.embedUrl}
                        className="w-full h-full"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  )}
                  {(seg.embed.type === "gdrive" ||
                    seg.embed.type === "canva") && (
                    <div
                      className="w-full rounded-md overflow-hidden bg-muted"
                      style={{ minHeight: "520px" }}
                    >
                      <iframe
                        src={seg.embed.embedUrl}
                        className="w-full h-full"
                        style={{ minHeight: "520px" }}
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  )}
                  {seg.embed.type === "pdf" && (
                    <div
                      className="w-full rounded-md overflow-hidden bg-muted"
                      style={{ minHeight: "640px" }}
                    >
                      <iframe
                        src={seg.embed.embedUrl}
                        className="w-full h-full"
                        style={{ minHeight: "640px" }}
                        loading="lazy"
                      />
                    </div>
                  )}
                  {seg.embed.type === "webpage" && (
                    <div
                      className="w-full rounded-md overflow-hidden bg-muted"
                      style={{ minHeight: "600px" }}
                    >
                      <iframe
                        src={seg.embed.embedUrl}
                        className="w-full h-full"
                        style={{ minHeight: "600px" }}
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                  )}
                  {seg.embed.type === "image" && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={seg.embed.embedUrl}
                      alt=""
                      className="w-full rounded-md object-contain max-h-150 bg-muted"
                      loading="lazy"
                    />
                  )}
                  <div className="flex justify-end">
                    <a href={seg.url} target="_blank" rel="noopener noreferrer">
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
                </div>
              ),
            )}
          </div>
        )}

        {/* Embed full-width */}
        {embed && (
          <>
            {embed.type === "youtube" && (
              <div className="w-full aspect-video rounded-md overflow-hidden bg-muted">
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
              <div
                className="w-full rounded-md overflow-hidden bg-muted"
                style={{ minHeight: "520px" }}
              >
                <iframe
                  src={embed.embedUrl}
                  className="w-full h-full"
                  style={{ minHeight: "520px" }}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}

            {embed.type === "pdf" && (
              <div
                className="w-full rounded-md overflow-hidden bg-muted"
                style={{ minHeight: "640px" }}
              >
                <iframe
                  src={embed.embedUrl}
                  className="w-full h-full"
                  style={{ minHeight: "640px" }}
                  loading="lazy"
                />
              </div>
            )}

            {embed.type === "webpage" && (
              <div
                className="w-full rounded-md overflow-hidden bg-muted"
                style={{ minHeight: "600px" }}
              >
                <iframe
                  src={embed.embedUrl}
                  className="w-full h-full"
                  style={{ minHeight: "600px" }}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}

            {embed.type === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={embed.embedUrl}
                alt={konten.judul}
                className="w-full rounded-md object-contain max-h-150 bg-muted"
                loading="lazy"
              />
            )}

            {/* Fallback link di bawah embed */}
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
          </>
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
    </div>
  );
}
