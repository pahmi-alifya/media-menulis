"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Copy,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  Check,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  removeEnrollmentAction,
  updateEnrollmentAction,
  resetMahasiswaPasswordAction,
  addKelasToMahasiswaAction,
} from "@/server/actions/enrollment.actions";

type EnrollmentRow = {
  id: string;
  userId: string;
  nim: string | null;
  joinedAt: Date;
  kelas?: { id: string; nama: string; kode: string };
  user: { id: string; nama: string; email: string; nim: string | null };
};

type MahasiswaGrouped = {
  userId: string;
  user: { id: string; nama: string; email: string; nim: string | null };
  enrollments: EnrollmentRow[];
};

function groupEnrollments(rows: EnrollmentRow[]): MahasiswaGrouped[] {
  const map = new Map<string, MahasiswaGrouped>();
  for (const e of rows) {
    if (!map.has(e.userId)) {
      map.set(e.userId, { userId: e.userId, user: e.user, enrollments: [] });
    }
    map.get(e.userId)!.enrollments.push(e);
  }
  return Array.from(map.values());
}

const PAGE_SIZE = 10;

interface MahasiswaListProps {
  enrollments: EnrollmentRow[];
  kelasId: string;
  showKelasColumn?: boolean;
  semuaKelas?: { id: string; nama: string }[];
}

export default function MahasiswaList({
  enrollments: initial,
  kelasId,
  showKelasColumn = false,
  semuaKelas = [],
}: MahasiswaListProps) {
  const router = useRouter();
  const [rawList, setRawList] = useState<EnrollmentRow[]>(initial);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Edit state
  const [editTarget, setEditTarget] = useState<MahasiswaGrouped | null>(null);
  const [editForm, setEditForm] = useState({ nama: "", nim: "", email: "" });
  const [editKelasIds, setEditKelasIds] = useState<string[]>([]);
  const [initialEditKelasIds, setInitialEditKelasIds] = useState<string[]>([]);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<MahasiswaGrouped | null>(null);
  const [deleteEnrollmentIds, setDeleteEnrollmentIds] = useState<string[]>([]);

  // Reset state
  const [resetTarget, setResetTarget] = useState<MahasiswaGrouped | null>(null);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setRawList(initial);
  }, [initial]);

  const grouped = groupEnrollments(rawList);

  const filtered = grouped.filter(
    (m) =>
      m.user.nama.toLowerCase().includes(query.toLowerCase()) ||
      m.user.email.toLowerCase().includes(query.toLowerCase()) ||
      (m.user.nim ?? "").includes(query),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handleQueryChange(val: string) {
    setQuery(val);
    setPage(1);
  }

  function openEdit(m: MahasiswaGrouped) {
    setEditTarget(m);
    setEditForm({ nama: m.user.nama, nim: m.user.nim ?? "", email: m.user.email });
    const enrolled = m.enrollments.map((e) => e.kelas?.id).filter(Boolean) as string[];
    setEditKelasIds(enrolled);
    setInitialEditKelasIds(enrolled);
  }

  function openDelete(m: MahasiswaGrouped) {
    setDeleteTarget(m);
    setDeleteEnrollmentIds(m.enrollments.map((e) => e.id));
  }

  function toggleEditKelas(id: string) {
    setEditKelasIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function handleEditSave() {
    if (!editTarget) return;
    const firstEnrollment = editTarget.enrollments[0];

    const toAdd = editKelasIds.filter((id) => !initialEditKelasIds.includes(id));
    const toRemoveKelasIds = initialEditKelasIds.filter(
      (id) => !editKelasIds.includes(id),
    );
    const kelasToEnrollmentId = new Map(
      editTarget.enrollments.map((e) => [e.kelas?.id ?? "", e.id]),
    );
    const toRemoveEnrollmentIds = toRemoveKelasIds
      .map((kelasId) => kelasToEnrollmentId.get(kelasId))
      .filter(Boolean) as string[];

    startTransition(async () => {
      // Update user data first (enrollment still exists at this point)
      const updateResult = await updateEnrollmentAction({
        enrollmentId: firstEnrollment.id,
        nama: editForm.nama,
        nim: editForm.nim || undefined,
        email: editForm.email,
      });
      if (updateResult.error) { toast.error(updateResult.error); return; }

      // Add and remove in parallel
      const [addResult, ...removeResults] = await Promise.all([
        toAdd.length > 0
          ? addKelasToMahasiswaAction({ userId: editTarget.userId, kelasIds: toAdd })
          : Promise.resolve({ data: { addedCount: 0 }, error: null }),
        ...toRemoveEnrollmentIds.map((id) => removeEnrollmentAction(id)),
      ]);

      if (addResult.error) { toast.error(addResult.error); return; }
      const removeError = removeResults.find((r) => r.error)?.error;
      if (removeError) { toast.error(removeError); return; }

      setRawList((prev) => {
        const withoutRemoved = prev.filter(
          (e) => !toRemoveEnrollmentIds.includes(e.id),
        );
        return withoutRemoved.map((e) =>
          e.userId === editTarget.userId
            ? {
                ...e,
                user: {
                  ...e.user,
                  nama: editForm.nama.trim(),
                  nim: editForm.nim.trim() || null,
                  email: editForm.email.trim(),
                },
              }
            : e,
        );
      });

      const added = addResult.data?.addedCount ?? 0;
      const removed = toRemoveEnrollmentIds.length;
      setEditTarget(null);

      let msg = "Data mahasiswa diperbarui.";
      if (added > 0 && removed > 0)
        msg = `Data diperbarui. Ditambahkan ke ${added} kelas, dihapus dari ${removed} kelas.`;
      else if (added > 0)
        msg = `Data diperbarui. ${editForm.nama} ditambahkan ke ${added} kelas baru.`;
      else if (removed > 0)
        msg = `Data diperbarui. ${editForm.nama} dihapus dari ${removed} kelas.`;

      toast.success(msg);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!deleteTarget || deleteEnrollmentIds.length === 0) return;
    startTransition(async () => {
      const results = await Promise.all(
        deleteEnrollmentIds.map((id) => removeEnrollmentAction(id)),
      );
      const firstError = results.find((r) => r.error);
      if (firstError?.error) { toast.error(firstError.error); return; }
      setRawList((prev) =>
        prev.filter((e) => !deleteEnrollmentIds.includes(e.id)),
      );
      const count = deleteEnrollmentIds.length;
      const nama = deleteTarget.user.nama;
      setDeleteTarget(null);
      toast.success(
        count === 1 ? `${nama} dihapus dari kelas.` : `${nama} dihapus dari ${count} kelas.`,
      );
      router.refresh();
    });
  }

  function handleConfirmReset() {
    if (!resetTarget) return;
    const firstKelasId = resetTarget.enrollments[0]?.kelas?.id ?? kelasId;
    startTransition(async () => {
      const result = await resetMahasiswaPasswordAction(resetTarget.userId, firstKelasId);
      if (result.error) { toast.error(result.error); return; }
      setNewPassword(result.data!.password);
      setResetTarget(null);
    });
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Kata sandi disalin");
    setTimeout(() => setCopied(false), 2000);
  }

  const isRemovingFromKelas = initialEditKelasIds.some(
    (id) => !editKelasIds.includes(id),
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama, NIM, atau email..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length === grouped.length
          ? `${grouped.length} mahasiswa terdaftar`
          : `${filtered.length} dari ${grouped.length} mahasiswa`}
      </p>

      <Card>
        <CardContent className="p-0">
          {paginated.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Tidak ada mahasiswa yang cocok.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium">Nama</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
                    NIM / NPM
                  </th>
                  {showKelasColumn && (
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                      Kelas
                    </th>
                  )}
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                    Bergabung
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {paginated.map((m, idx) => {
                  const earliestJoin = m.enrollments.reduce(
                    (acc, e) =>
                      new Date(e.joinedAt) < acc ? new Date(e.joinedAt) : acc,
                    new Date(m.enrollments[0].joinedAt),
                  );
                  return (
                    <tr
                      key={m.userId}
                      className={idx < paginated.length - 1 ? "border-b" : ""}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium">{m.user.nama}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {m.user.nim ?? "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {m.user.nim ?? (
                          <span className="italic opacity-50">Belum diisi</span>
                        )}
                      </td>
                      {showKelasColumn && (
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {m.enrollments.map((e) => (
                              <span
                                key={e.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-xs font-medium"
                              >
                                {e.kelas?.nama ?? "—"}
                                {e.kelas?.kode && (
                                  <code className="text-[10px] text-muted-foreground font-mono">
                                    {e.kelas.kode}
                                  </code>
                                )}
                              </span>
                            ))}
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                        {m.user.email}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                        {earliestJoin.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title="Edit"
                            onClick={() => openEdit(m)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title="Reset Sandi"
                            onClick={() => setResetTarget(m)}
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            title="Hapus"
                            onClick={() => openDelete(m)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => p - 1)}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Sebelumnya
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Button
                key={n}
                variant={n === currentPage ? "default" : "ghost"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setPage(n)}
              >
                {n}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="gap-1"
          >
            Berikutnya
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Dialog Edit */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Mahasiswa</DialogTitle>
            <DialogDescription>Perbarui informasi mahasiswa.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input
                value={editForm.nama}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, nama: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>
                NIM{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (opsional)
                </span>
              </Label>
              <Input
                placeholder="Nomor Induk Mahasiswa"
                value={editForm.nim}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, nim: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>

            {semuaKelas.length > 0 && (
              <div className="space-y-2">
                <Label>Kelas</Label>
                {isRemovingFromKelas && (
                  <p className="text-xs text-destructive">
                    Menghapus centang dari kelas akan menghapus semua data
                    submission mahasiswa di kelas tersebut.
                  </p>
                )}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {semuaKelas.map((k) => {
                    const isEnrolled = initialEditKelasIds.includes(k.id);
                    return (
                      <label
                        key={k.id}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-md border cursor-pointer hover:bg-muted/50 transition-colors select-none"
                      >
                        <Checkbox
                          checked={editKelasIds.includes(k.id)}
                          onCheckedChange={() => toggleEditKelas(k.id)}
                        />
                        <span className="text-sm flex-1">{k.nama}</span>
                        {isEnrolled && (
                          <span className="text-[10px] text-muted-foreground">
                            Terdaftar
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                {editKelasIds.length === 0 && (
                  <p className="text-xs text-destructive">
                    Pilih minimal satu kelas.
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              Batal
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={
                !editForm.nama.trim() ||
                !editForm.email.trim() ||
                editKelasIds.length === 0 ||
                isPending
              }
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Delete */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Mahasiswa?</AlertDialogTitle>
            <AlertDialogDescription>
              Pilih kelas yang ingin dihapus untuk{" "}
              <strong>{deleteTarget?.user.nama}</strong>. Seluruh data submission
              di kelas yang dipilih juga akan ikut terhapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteTarget && deleteTarget.enrollments.length > 1 && (
            <div className="space-y-1.5 px-1 max-h-48 overflow-y-auto">
              {deleteTarget.enrollments.map((e) => (
                <label
                  key={e.id}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md border cursor-pointer hover:bg-muted/50 transition-colors select-none"
                >
                  <Checkbox
                    checked={deleteEnrollmentIds.includes(e.id)}
                    onCheckedChange={() =>
                      setDeleteEnrollmentIds((prev) =>
                        prev.includes(e.id)
                          ? prev.filter((x) => x !== e.id)
                          : [...prev, e.id],
                      )
                    }
                  />
                  <span className="text-sm flex-1">{e.kelas?.nama ?? "—"}</span>
                  {e.kelas?.kode && (
                    <code className="text-[10px] text-muted-foreground font-mono">
                      {e.kelas.kode}
                    </code>
                  )}
                </label>
              ))}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending || deleteEnrollmentIds.length === 0}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              {isPending
                ? "Menghapus..."
                : `Ya, Hapus dari ${deleteEnrollmentIds.length} Kelas`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Reset Sandi */}
      <AlertDialog
        open={!!resetTarget}
        onOpenChange={(open) => !open && setResetTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Kata Sandi?</AlertDialogTitle>
            <AlertDialogDescription>
              Kata sandi baru akan dibuat untuk{" "}
              <strong>{resetTarget?.user.nama}</strong> (
              {resetTarget?.user.email}). Kata sandi lama tidak akan bisa
              digunakan lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReset}
              disabled={isPending}
            >
              <KeyRound className="h-4 w-4 mr-1.5" />
              {isPending ? "Mereset..." : "Ya, Reset Sandi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog sandi baru */}
      <Dialog
        open={!!newPassword}
        onOpenChange={(open) => !open && setNewPassword(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kata Sandi Baru</DialogTitle>
            <DialogDescription>
              Berikan kata sandi ini kepada mahasiswa. Kata sandi hanya
              ditampilkan sekali.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted border px-4 py-2.5 rounded-md text-base font-mono tracking-widest text-center">
                {newPassword}
              </code>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() => newPassword && handleCopy(newPassword)}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button className="w-full" onClick={() => setNewPassword(null)}>
              Selesai
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
