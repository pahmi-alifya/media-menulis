"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LogOut, Menu, X, KeyRound } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { makeInitials } from "@/lib/utils/forum-helpers"
import { logoutAction } from "@/server/actions/auth.actions"

const navItems = [
  { href: "/mahasiswa/dashboard", label: "Dashboard", icon: LayoutDashboard },
]

interface MahasiswaNavbarProps {
  userName: string
}

export default function MahasiswaNavbar({ userName }: MahasiswaNavbarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-30 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-6">
          <Link href="/mahasiswa/dashboard" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Media Menulis" width={28} height={28} className="rounded-md" />
            <span className="font-bold text-[15px]">Media Menulis</span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {makeInitials(userName)}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Mahasiswa</p>
            </div>
          </div>
          <Link href="/mahasiswa/akun/ganti-sandi" className="hidden md:block">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
              <KeyRound className="h-4 w-4" />
              Ganti Sandi
            </Button>
          </Link>
          <form action={logoutAction} className="hidden md:block">
            <Button variant="ghost" size="sm" type="submit" className="gap-1.5 text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </form>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-card px-4 py-3 space-y-1 shadow-md">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
          <div className="pt-2 mt-1 border-t flex items-center justify-between px-3 py-2">
            <div>
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">Mahasiswa</p>
            </div>
            <div className="flex gap-1">
              <Link href="/mahasiswa/akun/ganti-sandi" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                  <KeyRound className="h-4 w-4" />
                  Ganti Sandi
                </Button>
              </Link>
              <form action={logoutAction}>
                <Button variant="ghost" size="sm" type="submit" className="gap-1.5 text-muted-foreground">
                  <LogOut className="h-4 w-4" />
                  Keluar
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
