"use client";

import { useState, useTransition } from "react";
import { Pencil, Check, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateLinkPanduanMahasiswaAction } from "@/server/actions/kelas.actions";

interface PanduanMahasiswaEditorProps {
  initialLink: string | null;
}

export default function PanduanMahasiswaEditor({
  initialLink,
}: PanduanMahasiswaEditorProps) {
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
      const result = await updateLinkPanduanMahasiswaAction(draft);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setLink(draft.trim());
      setEditing(false);
      toast.success("Link panduan mahasiswa diperbarui.");
    });
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 flex-wrap rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
        <HelpCircle className="h-4 w-4 text-primary shrink-0" />
        <Input
          className="flex-1 min-w-40 h-8 text-sm"
          placeholder="https://docs.google.com/..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") cancelEdit();
          }}
          autoFocus
        />
        <div className="flex gap-2 shrink-0">
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
      </div>
    );
  }

  if (!link) {
    return (
      <button
        onClick={openEdit}
        className="w-full flex  items-center gap-3 rounded-lg border border-dashed border-primary/50 px-4 py-3 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors text-left"
      >
        <HelpCircle className="h-4 w-4 shrink-0" />
        <span>
          Tambahkan panduan cara menggunakan aplikasi untuk mahasiswa…
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border px-4 py-3">
      <HelpCircle className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">Panduan Mahasiswa</p>
        <p className="text-sm truncate">{link}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0"
        onClick={openEdit}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
