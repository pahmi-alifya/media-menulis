import DosenList from "@/components/dosen/DosenList"
import { mockDosenList } from "@/lib/mock/data"

// TODO: replace with real API
const dosenList = mockDosenList

export default function AdminDosenPage() {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-2xl font-bold">Kelola Akun Dosen</h1>
        <p className="text-muted-foreground text-sm">Tambah, edit, dan hapus akun dosen</p>
      </div>
      <DosenList initialList={dosenList} />
    </div>
  )
}
