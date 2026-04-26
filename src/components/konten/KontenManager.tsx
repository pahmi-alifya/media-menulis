"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import RichTextEditor from "@/components/konten/RichTextEditor";
import KontenCard from "@/components/konten/KontenCard";
import ForumSection from "@/components/forum/ForumSection";
import {
  type KontenTipe,
  type KategoriKonten,
  KATEGORI_LABEL,
} from "@/lib/mock/data";
import { toast } from "sonner";
import {
  createKontenAction,
  updateKontenAction,
  deleteKontenAction,
  reorderKontenAction,
} from "@/server/actions/konten.actions";

type KontenItem = {
  id: string;
  tahapId: string;
  tipe: KontenTipe;
  judul: string;
  body: string | null;
  url: string | null;
  urutan: number;
  pertemuanKe: number;
  kategori: KategoriKonten;
};

interface KontenManagerProps {
  initialKonten: KontenItem[];
  tahapId: string;
  kelasId: string;
  tahapUrutan: number;
  filterPertemuanKe?: number;
}

type FormState = {
  tipe: KontenTipe;
  kategori: KategoriKonten;
  judul: string;
  url: string;
  body: string;
  pertemuanKe: number;
};

export default function KontenManager({
  initialKonten,
  tahapId,
  kelasId,
  tahapUrutan,
  filterPertemuanKe,
}: KontenManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const defaultPertemuan = filterPertemuanKe ?? 1;
  const emptyForm: FormState = {
    tipe: "VIDEO",
    kategori: "LIHAT",
    judul: "",
    url: "",
    body: "",
    pertemuanKe: defaultPertemuan,
  };

  const [items, setItems] = useState<KontenItem[]>(
    filterPertemuanKe
      ? initialKonten.filter((k) => k.pertemuanKe === filterPertemuanKe)
      : initialKonten,
  );
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const filtered = filterPertemuanKe
      ? initialKonten.filter((k) => k.pertemuanKe === filterPertemuanKe)
      : initialKonten;
    setItems(filtered);
  }, [initialKonten]); // eslint-disable-line react-hooks/exhaustive-deps

  const sorted = [...items].sort((a, b) => a.urutan - b.urutan);
  const current = sorted[Math.min(previewIndex, sorted.length - 1)];
  const hasPrev = previewIndex > 0;
  const hasNext = previewIndex < sorted.length - 1;
  const isEditing = editingId !== null;

  const previewKonten: KontenItem | undefined = (() => {
    if (!current) return undefined;
    if (isEditing && editingId === current.id) {
      return {
        ...current,
        tipe: form.tipe,
        kategori: form.kategori,
        judul: form.judul.trim() || current.judul,
        url: form.tipe !== "TEKS" ? form.url || null : null,
        body: form.tipe === "TEKS" ? form.body || null : null,
        pertemuanKe: form.pertemuanKe,
      };
    }
    return current;
  })();

  // ── Drawer helpers ───────────────────────────────────────────────────────────
  function openAddDrawer() {
    // setEditingId(null);
    // setForm(emptyForm);
    setDrawerOpen(true);
  }

  function openEditDrawer(konten: KontenItem, idx: number) {
    setPreviewIndex(idx);
    setEditingId(konten.id);
    setForm({
      tipe: konten.tipe,
      kategori: konten.kategori,
      judul: konten.judul,
      url: konten.url ?? "",
      body: konten.body ?? "",
      pertemuanKe: konten.pertemuanKe ?? 1,
    });
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    // setEditingId(null);
    // setForm(emptyForm);
  }

  // ── Save / Add ───────────────────────────────────────────────────────────────
  function handleAdd(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!form.judul.trim()) return;
    startTransition(async () => {
      const result = await createKontenAction({
        tahapId,
        pertemuanKe: form.pertemuanKe,
        tipe: form.tipe,
        judul: form.judul,
        body: form.body || undefined,
        url: form.url || undefined,
        kategori: form.kategori,
      });
      if (result.error || !result.data) {
        if (result.error) toast.error(result.error);
        return;
      }
      const newItem: KontenItem = {
        id: result.data.id,
        tahapId,
        tipe: form.tipe,
        kategori: form.kategori,
        judul: form.judul,
        url: form.tipe !== "TEKS" ? form.url || null : null,
        body: form.tipe === "TEKS" ? form.body || null : null,
        urutan: items.length + 1,
        pertemuanKe: form.pertemuanKe,
      };
      setItems((prev) => {
        const updated = [...prev, newItem];
        setPreviewIndex(updated.length - 1);
        return updated;
      });
      setForm(emptyForm);
      setDrawerOpen(false);
      toast.success("Materi ditambahkan.");
      router.refresh();
    });
  }

  function saveEdit() {
    if (!editingId || !form.judul.trim()) return;
    startTransition(async () => {
      const result = await updateKontenAction({
        id: editingId,
        tipe: form.tipe,
        judul: form.judul,
        body: form.body || undefined,
        url: form.url || undefined,
        kategori: form.kategori,
        pertemuanKe: form.pertemuanKe,
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setItems((prev) =>
        prev.map((k) =>
          k.id === editingId
            ? {
                ...k,
                tipe: form.tipe,
                kategori: form.kategori,
                judul: form.judul,
                url: form.tipe !== "TEKS" ? form.url || null : null,
                body: form.tipe === "TEKS" ? form.body || null : null,
                pertemuanKe: form.pertemuanKe,
              }
            : k,
        ),
      );
      setDrawerOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      toast.success("Materi diperbarui.");
      router.refresh();
    });
  }

  // ── Delete ───────────────────────────────────────────────────────────────────
  function confirmDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteKontenAction(deleteId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setItems((prev) => {
        const filtered = prev
          .filter((k) => k.id !== deleteId)
          .map((k, i) => ({ ...k, urutan: i + 1 }));
        setPreviewIndex((idx) =>
          Math.min(idx, Math.max(filtered.length - 1, 0)),
        );
        return filtered;
      });
      setDeleteId(null);
      toast.success("Materi dihapus.");
      router.refresh();
    });
  }

  // ── Reorder ──────────────────────────────────────────────────────────────────
  function moveItem(id: string, direction: "up" | "down") {
    setItems((prev) => {
      const arr = [...prev].sort((a, b) => a.urutan - b.urutan);
      const idx = arr.findIndex((k) => k.id === id);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= arr.length) return prev;
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      const renumbered = arr.map((k, i) => ({ ...k, urutan: i + 1 }));
      const newIdx = renumbered.findIndex((k) => k.id === current?.id);
      if (newIdx !== -1) setPreviewIndex(newIdx);
      const orderedIds = renumbered.map((k) => k.id);
      reorderKontenAction(orderedIds).catch(() =>
        toast.error("Gagal mengubah urutan."),
      );
      return renumbered;
    });
  }

  const deletingItem = items.find((k) => k.id === deleteId);
  const isLivePreview = isEditing && editingId === current?.id;

  const kategoriColor: Record<KategoriKonten, string> = {
    LIHAT: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    SERAHKAN:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    BERKONTRIBUSI:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  };

  return (
    <>
      {/* ── Bagian 1: Preview ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm">Materi ({sorted.length})</p>
          <Button size="sm" className="gap-2" onClick={openAddDrawer}>
            <Plus className="h-4 w-4" />
            Tambah Materi
          </Button>
        </div>

        {sorted.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground text-sm">
              Belum ada materi. Klik &ldquo;Tambah Materi&rdquo; untuk memulai.
            </CardContent>
          </Card>
        ) : (
          <>
            {isLivePreview && (
              <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Preview langsung — perubahan belum disimpan
              </div>
            )}

            <KontenCard konten={previewKonten!} />

            {previewKonten?.kategori === "BERKONTRIBUSI" && (
              <Card>
                <CardContent className="pt-5 pb-5">
                  <ForumSection
                    key={previewKonten.id}
                    kontenId={previewKonten.id}
                    kelasId={kelasId}
                    tahapUrutan={tahapUrutan}
                  />
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
              {sorted.map((k, idx) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setPreviewIndex(idx)}
                  title={k.judul}
                  className={`rounded-full transition-all ${
                    idx === previewIndex
                      ? "w-6 h-2.5 bg-primary"
                      : "w-2.5 h-2.5 bg-muted hover:bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>

            <p className="text-center text-xs text-muted-foreground">
              {previewIndex + 1} / {sorted.length}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                disabled={!hasPrev}
                onClick={() => setPreviewIndex((i) => i - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </Button>
              <Button
                variant={hasNext ? "default" : "outline"}
                className="flex-1 gap-2"
                disabled={!hasNext}
                onClick={() => setPreviewIndex((i) => i + 1)}
              >
                Berikutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* ── Bagian 2: Urutan Materi ── */}
      {sorted.length > 0 && (
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Urutan Materi</CardTitle>
            <p className="text-xs text-muted-foreground">
              Gunakan tombol ▲/▼ untuk mengatur urutan tampilan materi bagi
              mahasiswa.
            </p>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {sorted.map((konten, idx) => (
              <div
                key={konten.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
                  current?.id === konten.id
                    ? "bg-primary/5 border-primary/30"
                    : "bg-card hover:bg-accent/40"
                }`}
              >
                <span className="text-xs font-mono text-muted-foreground w-5 text-center shrink-0">
                  {konten.urutan}
                </span>

                <button
                  type="button"
                  className="text-sm font-medium flex-1 truncate text-left hover:text-primary transition-colors"
                  onClick={() => setPreviewIndex(idx)}
                  title="Lihat preview"
                >
                  {konten.judul}
                </button>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 hidden sm:inline ${kategoriColor[konten.kategori]}`}
                >
                  {KATEGORI_LABEL[konten.kategori]}
                </span>

                <Badge variant="outline" className="text-[10px] shrink-0">
                  P{konten.pertemuanKe}
                </Badge>

                <div className="flex gap-0.5 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => openEditDrawer(konten, idx)}
                    title="Edit"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteId(konten.id)}
                    title="Hapus"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex flex-col gap-0.5 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-6"
                    disabled={idx === 0}
                    onClick={() => moveItem(konten.id, "up")}
                    title="Naikan urutan"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-6"
                    disabled={idx === sorted.length - 1}
                    onClick={() => moveItem(konten.id, "down")}
                    title="Turunkan urutan"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ── Sheet Form Tambah / Edit ── */}
      <Sheet open={drawerOpen} onOpenChange={(open) => { if (!open) closeDrawer(); }}>
        <SheetContent side="right" showCloseButton={false} className="w-[85vw] sm:max-w-none! overflow-y-auto">
          <SheetHeader className="flex flex-row items-center justify-between border-b pb-4">
            <SheetTitle>
              {isEditing ? "Edit Materi" : "Tambah Materi"}
            </SheetTitle>
            <SheetClose render={<Button variant="ghost" size="icon" className="h-7 w-7"><X className="h-4 w-4" /></Button>} /></SheetHeader>

          <div className="p-4">
            <form
              onSubmit={
                isEditing
                  ? (e) => {
                      e.preventDefault();
                      saveEdit();
                    }
                  : handleAdd
              }
              className="space-y-4"
            >
              {!filterPertemuanKe && (
                <div className="space-y-2">
                  <Label>Pertemuan</Label>
                  <Select
                    value={String(form.pertemuanKe)}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, pertemuanKe: Number(v) }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Pertemuan 1</SelectItem>
                      <SelectItem value="2">Pertemuan 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Tipe Materi</Label>
                <Select
                  value={form.tipe}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, tipe: v as KontenTipe }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="INFOGRAFIS">Infografis</SelectItem>
                    <SelectItem value="DOKUMEN">Dokumen</SelectItem>
                    <SelectItem value="TEMPLATE">Template</SelectItem>
                    <SelectItem value="TEKS">Teks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select
                  value={form.kategori}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, kategori: v as KategoriKonten }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LIHAT">
                      Lihat — Materi &amp; bacaan
                    </SelectItem>
                    <SelectItem value="SERAHKAN">
                      Serahkan — Tugas &amp; pengumpulan
                    </SelectItem>
                    <SelectItem value="BERKONTRIBUSI">
                      Berkontribusi — Diskusi forum
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Judul</Label>
                <Input
                  placeholder="Judul materi"
                  value={form.judul}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, judul: e.target.value }))
                  }
                  required
                />
              </div>

              {form.tipe !== "TEKS" ? (
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={form.url}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, url: e.target.value }))
                    }
                    type="url"
                  />
                  <p className="text-xs text-muted-foreground">
                    YouTube, Google Drive, Canva, Google Docs/Slides
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Isi Teks</Label>
                  <RichTextEditor
                    value={form.body}
                    onChange={(html) => setForm((f) => ({ ...f, body: html }))}
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={closeDrawer}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={!form.judul.trim() || isPending}
                >
                  {isEditing ? (
                    <>
                      <Check className="h-4 w-4" />
                      {isPending ? "Menyimpan..." : "Simpan"}
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      {isPending ? "Menambahkan..." : "Tambahkan"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Confirm delete */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Materi?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>&ldquo;{deletingItem?.judul}&rdquo;</strong> akan dihapus
              permanen dan tidak bisa dipulihkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
