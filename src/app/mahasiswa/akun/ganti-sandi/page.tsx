import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import GantiSandiForm from "@/components/akun/GantiSandiForm"

export default function MahasiswaGantiSandiPage() {
  return (
    <div className="p-6 max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/mahasiswa/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">Ganti Kata Sandi</h1>
          <p className="text-muted-foreground text-sm">Perbarui kata sandi akun Anda</p>
        </div>
      </div>

      <GantiSandiForm />
    </div>
  )
}
