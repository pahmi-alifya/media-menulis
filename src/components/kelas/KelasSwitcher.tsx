"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { ChevronsUpDown, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { setActiveKelasAction } from "@/server/actions/kelas.actions"

interface KelasItem {
  id: string
  nama: string
  kode: string
}

interface Props {
  kelasList: KelasItem[]
  activeKelasId: string
}

export default function KelasSwitcher({ kelasList, activeKelasId }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const activeKelas = kelasList.find((k) => k.id === activeKelasId)

  function handleSwitch(kelasId: string) {
    if (kelasId === activeKelasId) return
    startTransition(async () => {
      await setActiveKelasAction(kelasId)
      router.refresh()
    })
  }

  if (kelasList.length <= 1) {
    return (
      <h1 className="text-xl sm:text-2xl font-bold">{activeKelas?.nama ?? "Kelas"}</h1>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className="flex items-center gap-2 font-bold text-xl sm:text-2xl outline-none hover:text-primary transition-colors disabled:opacity-50"
      >
        {isPending ? "Memuat..." : (activeKelas?.nama ?? "Pilih Kelas")}
        <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56">
        {kelasList.map((k) => (
          <DropdownMenuItem
            key={k.id}
            onClick={() => handleSwitch(k.id)}
            className="gap-2"
          >
            <Check
              className={`h-4 w-4 shrink-0 ${k.id === activeKelasId ? "opacity-100" : "opacity-0"}`}
            />
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{k.nama}</p>
              <p className="text-xs text-muted-foreground font-mono">{k.kode}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
