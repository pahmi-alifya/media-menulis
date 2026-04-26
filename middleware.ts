import NextAuth from "next-auth"
import { authConfig } from "./src/auth.config"
import { NextResponse } from "next/server"
import type { Role } from "@prisma/client"

const { auth } = NextAuth(authConfig)

const ROLE_DASHBOARD: Record<Role, string> = {
  DOSEN: "/dosen/dashboard",
  MAHASISWA: "/mahasiswa/dashboard",
  ADMIN: "/admin/dosen",
}

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth
  const role = session?.user?.role as Role | undefined
  const isLoggedIn = !!session

  // ── Redirect user yang sudah login dari halaman publik ──────────────────────
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register"

  if (isLoggedIn && isPublicRoute) {
    const dashboard = role ? ROLE_DASHBOARD[role] : "/login"
    return NextResponse.redirect(new URL(dashboard, req.url))
  }

  // ── Proteksi route dosen ─────────────────────────────────────────────────────
  if (pathname.startsWith("/dosen")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url))
    if (role !== "DOSEN") return NextResponse.redirect(new URL(ROLE_DASHBOARD[role!] ?? "/login", req.url))
  }

  // ── Proteksi route mahasiswa ─────────────────────────────────────────────────
  if (pathname.startsWith("/mahasiswa")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url))
    if (role !== "MAHASISWA") return NextResponse.redirect(new URL(ROLE_DASHBOARD[role!] ?? "/login", req.url))
  }

  // ── Proteksi route admin ─────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url))
    if (role !== "ADMIN") return NextResponse.redirect(new URL(ROLE_DASHBOARD[role!] ?? "/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
