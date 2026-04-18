import Link from "next/link"
import { GraduationCap } from "lucide-react"
import RegisterForm from "@/components/auth/RegisterForm"

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

        <RegisterForm />

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
