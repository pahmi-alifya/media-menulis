"use client";

import { useState, useTransition } from "react";
import { ExternalLink, Pencil, X, Check, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateLinkModelPembelajaranAction } from "@/server/actions/kelas.actions";
import { buildEmbedUrl } from "@/lib/utils/url-parser";

interface ModelPembelajaranBannerProps {
  initialLink: string | null;
}

export default function ModelPembelajaranBanner({
  initialLink,
}: ModelPembelajaranBannerProps) {
  const [link, setLink] = useState(initialLink ?? "");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(link);
  const [isPending, startTransition] = useTransition();

  function openEdit() {
    setDraft(link);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setDraft(link);
  }

  function save() {
    startTransition(async () => {
      const result = await updateLinkModelPembelajaranAction(draft);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setLink(draft.trim());
      setEditing(false);
      toast.success("Link model pembelajaran diperbarui.");
    });
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
        <BookOpen className="h-4 w-4 text-primary shrink-0" />
        <Input
          className="flex-1 h-8 text-sm"
          placeholder="https://docs.google.com/..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
        />
        <Button
          size="sm"
          className="gap-1.5 h-8"
          disabled={isPending}
          onClick={save}
        >
          <Check className="h-3.5 w-3.5" />
          {isPending ? "Menyimpan..." : "Simpan"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={cancelEdit}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  if (!link) {
    return (
      <button
        onClick={openEdit}
        className="w-full flex items-center gap-3 rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors text-left"
      >
        <BookOpen className="h-4 w-4 shrink-0" />
        <span>Tambahkan link panduan model pembelajaran Knows SGM…</span>
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 dark:border-sky-800/50 dark:bg-sky-950/20">
      <div className="flex items-center gap-3 mb-5">
        <BookOpen className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
        <span className="text-sm font-medium text-sky-800 dark:text-sky-300 flex-1 min-w-0">
          Panduan Model Pembelajaran
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-sky-600 hover:text-sky-800 dark:text-sky-400 shrink-0"
          onClick={openEdit}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="w-full rounded-lg overflow-hidden bg-muted border">
        <iframe
          src={buildEmbedUrl(link)?.embedUrl ?? link}
          className="w-full"
          style={{ minHeight: "700px" }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
