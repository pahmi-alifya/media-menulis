"use client"

import { useState } from "react"
import { Search, Copy, KeyRound, ChevronLeft, ChevronRight, Check, Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { type MockUser } from "@/lib/mock/data"

const PAGE_SIZE = 5

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$"
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

interface DosenListProps {
  initialList: MockUser[]
}

export default function DosenList({ initialList }: DosenListProps) {
  const [dosenList, setDosenList] = useState<MockUser[]>(initialList)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  // Tambah
  const [addForm, setAddForm] = useState({ nama: "", email: "" })
  const [newEntry, setNewEntry] = useState<{ nama: string; password: string } | null>(null)

  // Edit
  const [editTarget, setEditTarget] = useState<MockUser | null>(null)
  const [editForm, setEditForm] = useState({ nama: "", email: "" })

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<MockUser | null>(null)

  // Reset sandi
  const [resetTarget, setResetTarget] = useState<MockUser | null>(null)
  const [newPassword, setNewPassword] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const filtered = dosenList.filter(
    (d) =>
      d.nama.toLowerCase().includes(query.toLowerCase()) ||
      d.email.toLowerCase().includes(query.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleQueryChange(val: string) { setQuery(val); setPage(1) }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!addForm.nama.trim() || !addForm.email.trim()) return
    const pwd = generatePassword()
    setDosenList((prev) => [...prev, { id: `ud${Date.now()}`, nama: addForm.nama.trim(), email: addForm.email.trim(), role: "DOSEN" }])
    setNewEntry({ nama: addForm.nama.trim(), password: pwd })
    setAddForm({ nama: "", email: "" })
    // TODO: replace with Server Action — createDosenAccount(nama, email, password)
  }

  function openEdit(d: MockUser) { setEditTarget(d); setEditForm({ nama: d.nama, email: d.email }) }

  function handleEditSave() {
    if (!editTarget) return
    setDosenList((prev) =>
      prev.map((d) => d.id === editTarget.id ? { ...d, nama: editForm.nama.trim(), email: editForm.email.trim() } : d)
    )
    setEditTarget(null)
    toast.success("Data dosen diperbarui.")
    // TODO: replace with Server Action — updateDosenAccount(id, { nama, email })
  }

  function handleDelete() {
    if (!deleteTarget) return
    setDosenList((prev) => prev.filter((d) => d.id !== deleteTarget.id))
    setDeleteTarget(null)
    toast.success(`Akun ${deleteTarget.nama} dihapus.`)
    // TODO: replace with Server Action — deleteDosenAccount(id)
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
    <div className="space-y-6">
      {/* Form tambah */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tambah Akun Dosen</CardTitle>
          <CardDescription>Sistem akan membuat akun dan menampilkan kata sandi sementara.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama-dosen">Nama Lengkap</Label>
                <Input id="nama-dosen" placeholder="Dr. Nama Dosen, M.Pd." value={addForm.nama} onChange={(e) => setAddForm((f) => ({ ...f, nama: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-dosen">Email</Label>
                <Input id="email-dosen" type="email" placeholder="dosen@unj.ac.id" value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <Button type="submit" disabled={!addForm.nama.trim() || !addForm.email.trim()} className="gap-2">
              <Plus className="h-4 w-4" />Tambahkan
            </Button>
          </form>

          {newEntry && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">Akun dosen berhasil dibuat!</p>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Kata sandi sementara untuk <strong>{newEntry.nama}</strong>:
              </p>
              <div className="flex items-center gap-2 mt-2">
                <code className="bg-white dark:bg-black/20 border px-3 py-1.5 rounded text-sm font-mono tracking-widest">
                  {newEntry.password}
                </code>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(newEntry.password)}>
                  {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <p className="text-xs text-green-600 dark:text-green-500 mt-2">Kata sandi hanya ditampilkan sekali.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* List + search */}
      <div className="space-y-3">
        <h2 className="font-semibold">Terdaftar ({dosenList.length} dosen)</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari nama atau email..." value={query} onChange={(e) => handleQueryChange(e.target.value)} className="pl-9" />
        </div>
        {query && <p className="text-xs text-muted-foreground">{filtered.length} dari {dosenList.length} dosen</p>}

        <Card>
          <CardContent className="p-0">
            {paginated.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Tidak ada dosen yang cocok.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium">Nama</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Email</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((d, idx) => (
                    <tr key={d.id} className={idx < paginated.length - 1 ? "border-b" : ""}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{d.nama}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">{d.email}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{d.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Edit" onClick={() => openEdit(d)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Reset Sandi" onClick={() => setResetTarget(d)}>
                            <KeyRound className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" title="Hapus" onClick={() => setDeleteTarget(d)}>
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)} className="gap-1">
              <ChevronLeft className="h-4 w-4" />Sebelumnya
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Button key={n} variant={n === currentPage ? "default" : "ghost"} size="sm" className="w-8 h-8 p-0" onClick={() => setPage(n)}>{n}</Button>
              ))}
            </div>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setPage((p) => p + 1)} className="gap-1">
              Berikutnya<ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Dialog Edit */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Dosen</DialogTitle>
            <DialogDescription>Perbarui informasi akun dosen.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input value={editForm.nama} onChange={(e) => setEditForm((f) => ({ ...f, nama: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Batal</Button>
            <Button onClick={handleEditSave} disabled={!editForm.nama.trim() || !editForm.email.trim()}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Delete */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Akun Dosen?</AlertDialogTitle>
            <AlertDialogDescription>
              Akun <strong>{deleteTarget?.nama}</strong> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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

      {/* Dialog Reset — konfirmasi */}
      <AlertDialog open={!!resetTarget} onOpenChange={(open) => !open && setResetTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Kata Sandi?</AlertDialogTitle>
            <AlertDialogDescription>
              Kata sandi baru akan dibuat untuk <strong>{resetTarget?.nama}</strong> ({resetTarget?.email}).
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

      {/* Dialog sandi baru */}
      <Dialog open={!!newPassword} onOpenChange={(open) => !open && setNewPassword(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kata Sandi Baru</DialogTitle>
            <DialogDescription>Berikan kata sandi ini kepada dosen. Kata sandi hanya ditampilkan sekali.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted border px-4 py-2.5 rounded-md text-base font-mono tracking-widest text-center">{newPassword}</code>
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
