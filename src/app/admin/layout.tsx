import Image from "next/image"
import { redirect } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import { makeInitials } from "@/lib/utils/forum-helpers"
import { logoutAction } from "@/server/actions/auth.actions"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const userName = session.user.name ?? "Admin"

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Media Menulis" width={28} height={28} className="rounded-md" />
            <span className="font-bold text-[15px]">Media Menulis</span>
            <span className="text-xs text-muted-foreground border rounded px-1.5 py-0.5 ml-1">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {makeInitials(userName)}
              </div>
              <span className="text-sm font-medium hidden sm:block">{userName}</span>
            </div>
            <form action={logoutAction}>
              <Button variant="ghost" size="sm" type="submit" className="gap-1.5 text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
