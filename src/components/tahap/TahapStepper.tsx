import Link from "next/link"
import { Lock, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { TAHAP_LABEL } from "@/lib/mock/data"

type TahapStep = {
  id: string
  urutan: number
  kode: string
  isUnlocked: boolean
}

interface TahapStepperProps {
  tahapList: TahapStep[]
  activeTahapId?: string
  kelasId: string
  baseHref: string // "/mahasiswa/kelas/[kelasId]/tahap" or "/dosen/..."
}

export default function TahapStepper({
  tahapList,
  activeTahapId,
  kelasId,
  baseHref,
}: TahapStepperProps) {
  return (
    <div className="overflow-x-auto pb-2">
      <ol className="flex items-start min-w-max gap-0">
        {tahapList.map((tahap, idx) => {
          const isActive = tahap.id === activeTahapId
          const isDone =
            activeTahapId &&
            tahapList.findIndex((t) => t.id === activeTahapId) > idx

          return (
            <li key={tahap.id} className="flex items-start">
              {/* Step */}
              <div className="flex flex-col items-center gap-1.5 w-[72px]">
                {tahap.isUnlocked ? (
                  <Link
                    href={`${baseHref}/${tahap.id}`}
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors shrink-0",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : isDone
                        ? "bg-primary/15 text-primary border-primary/40 hover:bg-primary/25"
                        : "bg-muted text-muted-foreground border-muted-foreground/30 hover:bg-muted/80"
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      tahap.urutan
                    )}
                  </Link>
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-muted border-2 border-muted-foreground/20 shrink-0">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                )}
                <span
                  className={cn(
                    "text-[10px] font-medium text-center leading-tight w-full",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {TAHAP_LABEL[tahap.kode as keyof typeof TAHAP_LABEL]?.singkat ?? tahap.kode}
                </span>
              </div>

              {/* Connector line */}
              {idx < tahapList.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 mt-[18px] w-8 shrink-0",
                    tahapList[idx + 1].isUnlocked ? "bg-primary/30" : "bg-muted"
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
