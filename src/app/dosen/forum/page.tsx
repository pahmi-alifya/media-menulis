import { redirect } from "next/navigation"

// Forum diskusi tidak lagi global — forum tersedia langsung di dalam
// setiap materi bertipe BERKONTRIBUSI pada halaman tahap masing-masing.
export default function DosenForumPage() {
  redirect("/dosen/dashboard")
}
