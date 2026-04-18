import { redirect } from "next/navigation"

export default function RootPage() {
  // TODO: replace with real auth check — if logged in, redirect to /dosen/dashboard or /mahasiswa/dashboard
  redirect("/login")
}
