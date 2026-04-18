"use client"

import { useState } from "react"
import { Search, Copy, KeyRound, ChevronLeft, ChevronRight, Check, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { type MockEnrollment } from "@/lib/mock/data"

const PAGE_SIZE = 4

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$"
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

interface MahasiswaListProps {
  enrollmentList: MockEnrollment[]
}

export default function MahasiswaList({ enrollmentList: initial }: MahasiswaListProps) {
  const [list, setList] = useState<MockEnrollment[]>(initial)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  // Edit
  const [editTarget, setEditTarget] = useState<MockEnrollment | null>(null)
  const [editForm, setEditForm] = useState({ nama: "", nim: "", email: "" })

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<MockEnrollment | null>(null)

  // Reset sandi
  const [resetTarget, setResetTarget] = useState<MockEnrollment | null>(null)
  const [newPassword, setNewPassword] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const filtered = list.filter(
    (e) =>
      e.namaMahasiswa.toLowerCase().includes(query.toLowerCase()) ||
      e.email.toLowerCase().includes(query.toLowerCase()) ||
      (e.nim ?? "").includes(query)
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleQueryChange(val: string) { setQuery(val); setPage(1) }

  function openEdit(e: MockEnrollment) {
    setEditTarget(e)
    setEditForm({ nama: e.namaMahasiswa, nim: e.nim ?? "", email: e.email })
  }

  function handleEditSave() {
    if (!editTarget) return
    setList((prev) =>
      prev.map((e) =>
        e.id === editTarget.id
          ? { ...e, namaMahasiswa: editForm.nama.trim(), nim: editForm.nim.trim() || null, email: editForm.email.trim() }
          : e
      )
    )
    setEditTarget(null)
    toast.success("Data mahasiswa diperbarui.")
    // TODO: replace with Server Action — updateEnrollment(id, { nama, nim, email })
  }

  function handleDelete() {
    if (!deleteTarget) return
    setList((prev) => prev.filter((e) => e.id !== deleteTarget.id))
    setDeleteTarget(null)
    toast.success(`${deleteTarget.namaMahasiswa} dihapus dari daftar.`)
    // TODO: replace with Server Action — removeEnrollment(id)
  }

  function handleConfirmReset() {
    if (!resetTarget) return
    const pwd = generatePassword()
    setNewPassword(pwd)
    setResetTarget(null)
    // TODO: replace with Server Action — resetPassword(userId, newPassword)
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Kata sandi disalin")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      {/* Search */}
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
        {filtered.length === list.length
          ? `${list.length} mahasiswa terdaftar`
          : `${filtered.length} dari ${list.length} mahasiswa`}
      </p>

      {/* Tabel */}
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
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">NIM</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Bergabung</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {paginated.map((e, idx) => (
                  <tr key={e.id} className={idx < paginated.length - 1 ? "border-b" : ""}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{e.namaMahasiswa}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">{e.nim ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {e.nim ?? <span className="italic opacity-50">Belum diisi</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {e.email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {new Date(e.joinedAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="Edit"
                          onClick={() => openEdit(e)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="Reset Sandi"
                          onClick={() => setResetTarget(e)}
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          title="Hapus"
                          onClick={() => setDeleteTarget(e)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)} className="gap-1">
            <ChevronLeft className="h-4 w-4" />Sebelumnya
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Button key={n} variant={n === currentPage ? "default" : "ghost"} size="sm" className="w-8 h-8 p-0" onClick={() => setPage(n)}>
                {n}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setPage((p) => p + 1)} className="gap-1">
            Berikutnya<ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Dialog Edit */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Mahasiswa</DialogTitle>
            <DialogDescription>Perbarui informasi mahasiswa.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input value={editForm.nama} onChange={(e) => setEditForm((f) => ({ ...f, nama: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>NIM <span className="text-muted-foreground font-normal text-xs">(opsional)</span></Label>
              <Input placeholder="Nomor Induk Mahasiswa" value={editForm.nim} onChange={(e) => setEditForm((f) => ({ ...f, nim: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Batal</Button>
            <Button onClick={handleEditSave} disabled={!editForm.nama.trim() || !editForm.email.trim()}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Delete */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Mahasiswa?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.namaMahasiswa}</strong> akan dihapus dari daftar peserta.
              Seluruh data submission mahasiswa ini juga akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Trash2 className="h-4 w-4 mr-1.5" />Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Reset Sandi — konfirmasi */}
      <AlertDialog open={!!resetTarget} onOpenChange={(open) => !open && setResetTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Kata Sandi?</AlertDialogTitle>
            <AlertDialogDescription>
              Kata sandi baru akan dibuat untuk <strong>{resetTarget?.namaMahasiswa}</strong> ({resetTarget?.email}).
              Kata sandi lama tidak akan bisa digunakan lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReset}>
              <KeyRound className="h-4 w-4 mr-1.5" />Ya, Reset Sandi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog tampilkan sandi baru */}
      <Dialog open={!!newPassword} onOpenChange={(open) => !open && setNewPassword(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kata Sandi Baru</DialogTitle>
            <DialogDescription>Berikan kata sandi ini kepada mahasiswa. Kata sandi hanya ditampilkan sekali.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted border px-4 py-2.5 rounded-md text-base font-mono tracking-widest text-center">
                {newPassword}
              </code>
              <Button variant="outline" size="icon" className="shrink-0" onClick={() => newPassword && handleCopy(newPassword)}>
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button className="w-full" onClick={() => setNewPassword(null)}>Selesai</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
