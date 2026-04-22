import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getKelasByDosen, getEnrollmentsByKelas } from "@/server/queries/kelas.queries"
import EnrollMahasiswaForm from "@/components/mahasiswa/EnrollMahasiswaForm"
import MahasiswaList from "@/components/mahasiswa/MahasiswaList"

export default async function DosenMahasiswaPage() {
  const session = await auth()
  const kelas = session?.user?.id ? await getKelasByDosen(session.user.id) : null

  if (!kelas) redirect("/dosen/dashboard")

  const enrollments = await getEnrollmentsByKelas(kelas.id)

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
          <p className="text-muted-foreground text-sm">Kelola peserta kelas · {kelas.nama}</p>
        </div>
      </div>

      <EnrollMahasiswaForm kelasId={kelas.id} />

      <Separator />

      <div>
        <h2 className="font-semibold mb-3">
          Terdaftar ({enrollments.length} mahasiswa)
        </h2>
        <MahasiswaList enrollments={enrollments} kelasId={kelas.id} />
      </div>
    </div>
  )
}
