import Link from "next/link"
import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Daftar sebagai Mahasiswa</h1>
            <p className="text-muted-foreground text-sm mt-1">Bergabung ke Media Menulis</p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input id="nama" placeholder="Nama sesuai identitas" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nim">
              NIM
              <span className="text-muted-foreground font-normal ml-1 text-xs">(opsional)</span>
            </Label>
            <Input id="nim" placeholder="Nomor Induk Mahasiswa" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="nama@email.com" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input id="password" type="password" placeholder="Minimal 8 karakter" className="h-10" autoComplete="new-password" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
            <Input id="confirmPassword" type="password" placeholder="Ulangi kata sandi" className="h-10" autoComplete="new-password" />
          </div>
          {/* TODO: replace with Server Action — registerMahasiswa() */}
          <Button type="submit" className="w-full h-10">
            Buat Akun
          </Button>
        </form>

        <div className="space-y-3 text-center">
          <p className="text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4">
              Masuk
            </Link>
          </p>
          <p className="text-xs text-muted-foreground border-t pt-3">
            Akun dosen tidak dapat dibuat secara mandiri.
            Hubungi pengelola untuk mendapatkan akses.
          </p>
        </div>
      </div>
    </div>
  )
}
