import { redirect } from "next/navigation"
import { auth } from "@/auth"
import DosenSidebar from "@/components/layout/DosenSidebar"

export default async function DosenLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <DosenSidebar userName={session.user.name ?? "Dosen"} />
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        {children}
      </main>
    </div>
  )
}
