import { redirect } from "next/navigation"
import { auth } from "@/auth"
import MahasiswaNavbar from "@/components/layout/MahasiswaNavbar"

export default async function MahasiswaLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <MahasiswaNavbar userName={session.user.name ?? "Mahasiswa"} />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
