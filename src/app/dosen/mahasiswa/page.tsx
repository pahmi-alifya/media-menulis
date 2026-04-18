import Link from "next/link"
import { ArrowLeft, Plus, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import MahasiswaList from "@/components/mahasiswa/MahasiswaList"
import { mockEnrollmentList } from "@/lib/mock/data"

// TODO: replace with real API
const enrollmentList = mockEnrollmentList.filter((e) => e.kelasId === "k1")

export default function DosenMahasiswaPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dosen/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Daftar Mahasiswa</h1>
          <p className="text-muted-foreground text-sm">Kelola peserta kelas</p>
        </div>
      </div>

      {/* Form tambah mahasiswa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tambah Mahasiswa</CardTitle>
          <CardDescription>
            Sistem akan membuat akun otomatis dan menampilkan kata sandi sementara.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input id="nama" placeholder="Nama mahasiswa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nim">NIM</Label>
                <Input id="nim" placeholder="Nomor Induk Mahasiswa" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@domain.com" />
              </div>
            </div>
            {/* TODO: replace with Server Action — enrollMahasiswa() */}
            <Button type="submit" className="gap-2">
              <Plus className="h-4 w-4" />
              Tambahkan
            </Button>
          </form>

          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              Mahasiswa berhasil ditambahkan!
            </p>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
              Kata sandi sementara untuk <strong>Ahmad Fauzi</strong>:
            </p>
            <div className="flex items-center gap-2 mt-2">
              <code className="bg-white dark:bg-black/20 border px-3 py-1.5 rounded text-sm font-mono tracking-widest">
                Xk9#mP2q
              </code>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-xs text-green-600 dark:text-green-500 mt-2">
              Berikan kata sandi ini kepada mahasiswa. Kata sandi hanya ditampilkan sekali.
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Daftar mahasiswa */}
      <div>
        <h2 className="font-semibold mb-3">
          Terdaftar ({enrollmentList.length} mahasiswa)
        </h2>
        <MahasiswaList enrollmentList={enrollmentList} />
      </div>
    </div>
  )
}
