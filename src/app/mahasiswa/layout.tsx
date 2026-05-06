import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getAllKelasByMahasiswa } from "@/server/queries/kelas.queries"
import MahasiswaNavbar from "@/components/layout/MahasiswaNavbar"

export default async function MahasiswaLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const cookieStore = await cookies()
  const activeId = cookieStore.get("activeMahasiswaKelasId")?.value

  const allEnrollments = await getAllKelasByMahasiswa(session.user.id)
  const kelasList = allEnrollments.map((e) => ({
    id: e.kelas.id,
    nama: e.kelas.nama,
    kode: e.kelas.kode,
  }))
  const activeKelasId =
    allEnrollments.find((e) => e.kelas.id === activeId)?.kelas.id ??
    allEnrollments[0]?.kelas.id ??
    null

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <MahasiswaNavbar
        userName={session.user.name ?? "Mahasiswa"}
        kelasList={kelasList}
        activeKelasId={activeKelasId}
      />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
