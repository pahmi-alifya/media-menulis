import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { auth } from "@/auth"
import { getSemuaKelasByDosen } from "@/server/queries/kelas.queries"
import BuatKelasDialog from "@/components/dosen/BuatKelasDialog"
import KelasCard from "@/components/kelas/KelasCard"

export default async function DosenKelasPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const kelasList = await getSemuaKelasByDosen(session.user.id)
  const cookieStore = await cookies()
  const activeKelasId = cookieStore.get("activeKelasId")?.value ?? kelasList[0]?.id ?? null

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Kelola Kelas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {kelasList.length} kelas terdaftar
          </p>
        </div>
        <BuatKelasDialog />
      </div>

      {kelasList.length === 0 ? (
        <div className="border border-dashed rounded-lg py-16 flex flex-col items-center gap-3 text-center">
          <p className="font-semibold">Belum ada kelas</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Buat kelas baru untuk mulai mengelola materi dan mahasiswa.
          </p>
          <BuatKelasDialog />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kelasList.map((kelas) => (
            <KelasCard
              key={kelas.id}
              kelas={kelas}
              isActive={kelas.id === activeKelasId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
