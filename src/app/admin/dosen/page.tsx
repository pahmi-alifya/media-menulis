import DosenList from "@/components/dosen/DosenList"
import PanduanDosenEditor from "@/components/admin/PanduanDosenEditor"
import { getDosenList, getAppSetting } from "@/server/queries/kelas.queries"

export default async function AdminDosenPage() {
  const [dosenList, setting] = await Promise.all([
    getDosenList(),
    getAppSetting(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Kelola Akun Dosen</h1>
        <p className="text-muted-foreground text-sm">Tambah, edit, dan hapus akun dosen</p>
      </div>

      <PanduanDosenEditor initialLink={setting?.linkPanduanDosen ?? null} />

      <DosenList initialList={dosenList} />
    </div>
  )
}
