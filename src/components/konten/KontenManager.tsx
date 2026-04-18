"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MessageSquare,
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
import { Separator } from "@/components/ui/separator";
import RichTextEditor from "@/components/konten/RichTextEditor";
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
import KontenCard from "@/components/konten/KontenCard";
import {
  type MockKonten,
  type MockPesan,
  type KontenTipe,
  type KategoriKonten,
  type Role,
  KATEGORI_LABEL,
  mockPesanList,
} from "@/lib/mock/data";

// ─── Forum diskusi inline (hanya untuk dosen, materi BERKONTRIBUSI) ───────────

function DosenForumSection({
  kontenId,
  pesanList,
}: {
  kontenId: string;
  pesanList: MockPesan[];
}) {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [localPesan, setLocalPesan] = useState<MockPesan[]>(pesanList);

  const topLevel = localPesan.filter((p) => !p.replyToId);

  function doKirim(replyToId: string | null) {
    if (!input.trim()) return;
    const now = new Date().toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (replyToId) {
      setLocalPesan((prev) =>
        prev.map((p) =>
          p.id === replyToId
            ? {
                ...p,
                replies: [
                  ...(p.replies ?? []),
                  {
                    id: `r-${Date.now()}`,
                    forumId: `f-${kontenId}`,
                    userId: "u1",
                    namaPengirim: "Dosen",
                    rolePengirim: "DOSEN" as Role,
                    isi: input,
                    createdAt: now,
                    replyToId,
                  },
                ],
              }
            : p,
        ),
      );
    } else {
      setLocalPesan((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          forumId: `f-${kontenId}`,
          userId: "u1",
          namaPengirim: "Dosen",
          rolePengirim: "DOSEN" as Role,
          isi: input,
          createdAt: now,
          replyToId: null,
        },
      ]);
    }
    setInput("");
    setReplyTo(null);
    // TODO: Server Action — createPesan()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm">Forum Diskusi</h3>
        <Badge variant="secondary" className="text-xs">
          {topLevel.length}
        </Badge>
      </div>

      {/* Daftar pesan */}
      <div className="space-y-4">
        {topLevel.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Belum ada diskusi dari mahasiswa.
          </p>
        )}
        {topLevel.map((pesan) => {
          const initials = pesan.namaPengirim
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase();
          const replies = pesan.replies ?? [];

          return (
            <div key={pesan.id}>
              <div className="flex gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    pesan.rolePengirim === "DOSEN"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-medium">
                      {pesan.namaPengirim}
                    </span>
                    {pesan.rolePengirim === "DOSEN" && (
                      <Badge variant="secondary" className="text-xs py-0">
                        Dosen
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {pesan.createdAt}
                    </span>
                  </div>
                  <div
                    className="rich-editor-content text-sm"
                    dangerouslySetInnerHTML={{ __html: pesan.isi }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs mt-1 gap-1 text-muted-foreground hover:text-foreground -ml-2"
                    onClick={() =>
                      setReplyTo(replyTo === pesan.id ? null : pesan.id)
                    }
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    {replyTo === pesan.id ? "Batal" : "Balas"}
                  </Button>

                  {/* Inline reply editor */}
                  {replyTo === pesan.id && (
                    <div className="mt-2 space-y-2">
                      <RichTextEditor
                        value={input}
                        onChange={setInput}
                        placeholder={`Balas ke ${pesan.namaPengirim}...`}
                        minHeight="80px"
                      />
                      <Button
                        size="sm"
                        className="gap-1.5"
                        disabled={!input.trim()}
                        onClick={() => doKirim(pesan.id)}
                      >
                        Kirim Balasan
                      </Button>
                    </div>
                  )}

                  {/* Nested replies */}
                  {replies.length > 0 && (
                    <div className="mt-3 ml-2 space-y-3 border-l-2 border-muted pl-4">
                      {replies.map((reply) => {
                        const rInitials = reply.namaPengirim
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase();
                        return (
                          <div key={reply.id} className="flex gap-3">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                reply.rolePengirim === "DOSEN"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {rInitials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <span className="text-sm font-medium">
                                  {reply.namaPengirim}
                                </span>
                                {reply.rolePengirim === "DOSEN" && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs py-0"
                                  >
                                    Dosen
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {reply.createdAt}
                                </span>
                              </div>
                              <div
                                className="rich-editor-content text-sm"
                                dangerouslySetInnerHTML={{ __html: reply.isi }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input komentar baru (sembunyikan jika sedang reply) */}
      {!replyTo && (
        <>
          <Separator />
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">
              Tulis komentar
            </p>
            <RichTextEditor
              value={input}
              onChange={setInput}
              placeholder="Tulis komentar atau tanggapan kepada mahasiswa..."
              minHeight="100px"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                className="gap-1.5"
                disabled={!input.trim()}
                onClick={() => doKirim(null)}
              >
                Kirim
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── KontenManager ────────────────────────────────────────────────────────────

interface KontenManagerProps {
  initialKonten: MockKonten[];
  tahapId: string;
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

// Peta tahapId → forumId pada mock data
const TAHAP_FORUM_ID: Record<string, string> = {
  t2: "f-t2",
  t3: "f-t3",
  t4: "f1",
};

export default function KontenManager({
  initialKonten,
  tahapId,
  filterPertemuanKe,
}: KontenManagerProps) {
  const defaultPertemuan = filterPertemuanKe ?? 1;
  const emptyForm: FormState = {
    tipe: "VIDEO",
    kategori: "LIHAT",
    judul: "",
    url: "",
    body: "",
    pertemuanKe: defaultPertemuan,
  };

  const [items, setItems] = useState<MockKonten[]>(
    filterPertemuanKe
      ? initialKonten.filter((k) => k.pertemuanKe === filterPertemuanKe)
      : initialKonten,
  );
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  // Index materi yang sedang ditampilkan di panel preview kiri
  const [previewIndex, setPreviewIndex] = useState(0);

  // Item sudah diurutkan berdasarkan `urutan`
  const sorted = [...items].sort((a, b) => a.urutan - b.urutan);
  const current = sorted[Math.min(previewIndex, sorted.length - 1)];
  const hasPrev = previewIndex > 0;
  const hasNext = previewIndex < sorted.length - 1;

  // Harus dideklarasikan sebelum previewKonten agar tidak masuk temporal dead zone
  const isEditing = editingId !== null;

  // Live preview: saat mengedit item yang sedang ditampilkan, gabungkan state form
  const previewKonten: MockKonten | undefined = (() => {
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

  // Pesan forum yang relevan untuk tahap ini (berdasarkan mock forumId)
  const forumId = TAHAP_FORUM_ID[tahapId] ?? `f-${tahapId}`;
  const tahapPesanList = mockPesanList.filter((p) => p.forumId === forumId);

  // ── Edit ────────────────────────────────────────────────────────────────────
  function startEdit(konten: MockKonten) {
    setEditingId(konten.id);
    setForm({
      tipe: konten.tipe,
      kategori: konten.kategori,
      judul: konten.judul,
      url: konten.url ?? "",
      body: konten.body ?? "",
      pertemuanKe: konten.pertemuanKe ?? 1,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function saveEdit() {
    if (!form.judul.trim()) return;
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
    setEditingId(null);
    setForm(emptyForm);
    // TODO: replace with Server Action — updateKonten()
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  function confirmDelete() {
    if (!deleteId) return;
    setItems((prev) => {
      const filtered = prev
        .filter((k) => k.id !== deleteId)
        .map((k, i) => ({ ...k, urutan: i + 1 }));
      // Koreksi previewIndex jika item yang dihapus adalah yang terakhir
      setPreviewIndex((idx) => Math.min(idx, Math.max(filtered.length - 1, 0)));
      return filtered;
    });
    setDeleteId(null);
    // TODO: replace with Server Action — deleteKonten()
  }

  // ── Add ─────────────────────────────────────────────────────────────────────
  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.judul.trim()) return;
    const newId = `c-${Date.now()}`;
    setItems((prev) => {
      const updated = [
        ...prev,
        {
          id: newId,
          tahapId,
          tipe: form.tipe,
          kategori: form.kategori,
          judul: form.judul,
          url: form.tipe !== "TEKS" ? form.url || null : null,
          body: form.tipe === "TEKS" ? form.body || null : null,
          urutan: prev.length + 1,
          pertemuanKe: form.pertemuanKe,
        },
      ];
      // Langsung navigasi ke item baru
      setPreviewIndex(updated.length - 1);
      return updated;
    });
    setForm(emptyForm);
    // TODO: replace with Server Action — createKonten()
  }

  // ── Reorder (Urutan Materi) ──────────────────────────────────────────────────
  function moveItem(id: string, direction: "up" | "down") {
    setItems((prev) => {
      const arr = [...prev].sort((a, b) => a.urutan - b.urutan);
      const idx = arr.findIndex((k) => k.id === id);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= arr.length) return prev;
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      const renumbered = arr.map((k, i) => ({ ...k, urutan: i + 1 }));
      // Perbarui previewIndex agar tetap di item yang sama
      const newIdx = renumbered.findIndex((k) => k.id === current?.id);
      if (newIdx !== -1) setPreviewIndex(newIdx);
      return renumbered;
    });
    // TODO: replace with Server Action — reorderKonten(ids[])
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
      {/* ── Bagian 1: Preview satu item + Form ── */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* ── Panel kiri: preview satu item ── */}
        <div className="lg:col-span-3 space-y-3">
          <p className="font-semibold text-sm">Materi ({sorted.length})</p>

          {sorted.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground text-sm">
                Belum ada materi. Tambahkan materi di panel kanan.
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Indikator live preview */}
              {isLivePreview && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Preview langsung — perubahan belum disimpan
                </div>
              )}

              {/* KontenCard satu item */}
              <div className="relative">
                <KontenCard konten={previewKonten!} />
              </div>

              {/* Forum diskusi — hanya untuk materi BERKONTRIBUSI */}
              {previewKonten?.kategori === "BERKONTRIBUSI" && (
                <Card>
                  <CardContent className="pt-5 pb-5">
                    <DosenForumSection
                      key={previewKonten.id}
                      kontenId={previewKonten.id}
                      pesanList={tahapPesanList}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Dot navigator */}
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

              {/* Counter + Prev/Next */}
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

        {/* ── Panel kanan: form tambah / edit ── */}
        <div className="lg:col-span-2">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {isEditing ? "Edit Materi" : "Tambah Materi"}
                </CardTitle>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={cancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
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
                      <SelectTrigger>
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
                    <SelectTrigger>
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LIHAT">
                        Lihat — Materi & bacaan
                      </SelectItem>
                      <SelectItem value="SERAHKAN">
                        Serahkan — Tugas & pengumpulan
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
                      onChange={(html) =>
                        setForm((f) => ({ ...f, body: html }))
                      }
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={cancelEdit}
                    >
                      Batal
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="flex-1 gap-2"
                    disabled={!form.judul.trim()}
                  >
                    {isEditing ? (
                      <>
                        <Check className="h-4 w-4" />
                        Simpan
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Tambahkan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Bagian 2: Urutan Materi (tombol ▲/▼) ── */}
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
                {/* Nomor urutan */}
                <span className="text-xs font-mono text-muted-foreground w-5 text-center shrink-0">
                  {konten.urutan}
                </span>

                {/* Judul — klik untuk navigasi ke item ini di preview */}
                <button
                  type="button"
                  className="text-sm font-medium flex-1 truncate text-left hover:text-primary transition-colors"
                  onClick={() => setPreviewIndex(idx)}
                  title="Lihat preview"
                >
                  {konten.judul}
                </button>

                {/* Badge kategori */}
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 hidden sm:inline ${kategoriColor[konten.kategori]}`}
                >
                  {KATEGORI_LABEL[konten.kategori]}
                </span>

                {/* Badge pertemuan */}
                <Badge variant="outline" className="text-[10px] shrink-0">
                  P{konten.pertemuanKe}
                </Badge>

                {/* Edit / Delete */}
                <div className="flex gap-0.5 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      startEdit(konten);
                      setPreviewIndex(idx);
                    }}
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

                {/* Tombol ▲/▼ */}
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

      {/* ── Confirm delete dialog ── */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Materi?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>"{deletingItem?.judul}"</strong> akan dihapus permanen dan
              tidak bisa dipulihkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
