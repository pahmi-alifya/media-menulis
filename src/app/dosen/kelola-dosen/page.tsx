import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import DosenList from "@/components/dosen/DosenList"
import { mockDosenList } from "@/lib/mock/data"

// TODO: replace with real API
const dosenList = mockDosenList

export default function KelolaDosenPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dosen/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Kelola Akun Dosen</h1>
          <p className="text-muted-foreground text-sm">Tambah dan kelola akun dosen lain</p>
        </div>
      </div>

      <DosenList initialList={dosenList} />
    </div>
  )
}
