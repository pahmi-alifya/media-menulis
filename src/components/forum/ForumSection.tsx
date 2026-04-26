"use client"

import { useState, useTransition, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { MessageSquare, Users, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import RichTextEditor from "@/components/konten/RichTextEditor"
import { sendPesanAction } from "@/server/actions/forum.actions"
import { formatTanggal, makeInitials, sanitizeHtml } from "@/lib/utils/forum-helpers"

// ─── Types ────────────────────────────────────────────────────────────────────

type ReplyItem = {
  id: string
  isi: string
  createdAt: string
  user: { nama: string; role: "DOSEN" | "MAHASISWA" | "ADMIN" }
}

type PesanItem = {
  id: string
  isi: string
  createdAt: string
  user: { nama: string; role: "DOSEN" | "MAHASISWA" | "ADMIN" }
  replies: ReplyItem[]
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ nama, role, size = "md" }: { nama: string; role: string; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-7 h-7 text-[10px]" : "w-8 h-8 text-xs"
  const bg = role === "DOSEN" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
  return (
    <div className={`${dim} ${bg} rounded-full flex items-center justify-center font-bold shrink-0`}>
      {makeInitials(nama)}
    </div>
  )
}

// ─── Skeleton loading ─────────────────────────────────────────────────────────

function ForumSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Single message ───────────────────────────────────────────────────────────

function PesanCard({
  pesan,
  onReply,
  activeReplyId,
  onSendReply,
  isPendingReply,
}: {
  pesan: PesanItem
  onReply: (id: string | null) => void
  activeReplyId: string | null
  onSendReply: (replyToId: string, isi: string) => void
  isPendingReply: boolean
}) {
  const [replyInput, setReplyInput] = useState("")

  function handleKirimBalasan() {
    if (!replyInput.trim()) return
    onSendReply(pesan.id, replyInput)
    setReplyInput("")
  }

  return (
    <div>
      <div className="flex gap-3">
        <Avatar nama={pesan.user.nama} role={pesan.user.role} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-medium">{pesan.user.nama}</span>
            {pesan.user.role === "DOSEN" && (
              <Badge variant="secondary" className="text-xs py-0">Dosen</Badge>
            )}
            <span className="text-xs text-muted-foreground">{formatTanggal(pesan.createdAt)}</span>
          </div>
          <div
            className="rich-editor-content text-sm"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(pesan.isi) }}
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs mt-1 gap-1 text-muted-foreground hover:text-foreground -ml-2"
            onClick={() => onReply(activeReplyId === pesan.id ? null : pesan.id)}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {activeReplyId === pesan.id ? "Batal" : "Balas"}
          </Button>

          {/* Inline reply editor */}
          {activeReplyId === pesan.id && (
            <div className="mt-2 space-y-2">
              <RichTextEditor
                value={replyInput}
                onChange={setReplyInput}
                placeholder={`Balas ke ${pesan.user.nama}...`}
                minHeight="80px"
              />
              <Button
                size="sm"
                className="gap-1.5"
                disabled={!replyInput.replace(/<[^>]*>/g, "").trim() || isPendingReply}
                onClick={handleKirimBalasan}
              >
                {isPendingReply ? "Mengirim..." : "Kirim Balasan"}
              </Button>
            </div>
          )}

          {/* Nested replies */}
          {pesan.replies.length > 0 && (
            <div className="mt-3 ml-2 space-y-3 border-l-2 border-muted pl-4">
              {pesan.replies.map((reply) => (
                <div key={reply.id} className="flex gap-3">
                  <Avatar nama={reply.user.nama} role={reply.user.role} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-medium">{reply.user.nama}</span>
                      {reply.user.role === "DOSEN" && (
                        <Badge variant="secondary" className="text-xs py-0">Dosen</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{formatTanggal(reply.createdAt)}</span>
                    </div>
                    <div
                      className="rich-editor-content text-sm"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(reply.isi) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main ForumSection ────────────────────────────────────────────────────────

interface ForumSectionProps {
  kontenId: string
  kelasId: string
  tahapUrutan: number
  kelompokName?: string | null
}

export default function ForumSection({
  kontenId,
  kelasId,
  tahapUrutan,
  kelompokName,
}: ForumSectionProps) {
  const queryClient = useQueryClient()
  const [newInput, setNewInput] = useState("")
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Build query key + URL
  const kelompokParam = tahapUrutan === 3 && kelompokName ? kelompokName : null
  const queryKey = ["forum-pesan", kontenId, kelasId, kelompokParam]
  const apiUrl = `/api/forum/pesan?kontenId=${encodeURIComponent(kontenId)}&kelasId=${encodeURIComponent(kelasId)}${kelompokParam ? `&kelompok=${encodeURIComponent(kelompokParam)}` : ""}`

  const { data, isLoading, isError, dataUpdatedAt } = useQuery<{ pesans: PesanItem[] }>({
    queryKey,
    queryFn: () => fetch(apiUrl).then((r) => r.json()),
    refetchInterval: 30_000,
    staleTime: 25_000,
  })

  // Format waktu terakhir update
  const [lastUpdate, setLastUpdate] = useState<string>("")
  useEffect(() => {
    if (dataUpdatedAt) {
      setLastUpdate(new Date(dataUpdatedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }))
    }
  }, [dataUpdatedAt])

  const pesans = data?.pesans ?? []

  function invalidate() {
    queryClient.invalidateQueries({ queryKey })
  }

  function handleKirim(isi: string, replyToId?: string | null) {
    startTransition(async () => {
      const result = await sendPesanAction(kontenId, kelasId, isi, replyToId, kelompokParam)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Pesan terkirim")
        invalidate()
        setActiveReplyId(null)
        if (!replyToId) setNewInput("")
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Kelompok banner — hanya Tahap 3 (KMBM) */}
      {tahapUrutan === 3 && kelompokName && (
        <div className="flex items-center gap-2.5 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2.5">
          <Users className="h-4 w-4 text-primary shrink-0" />
          <div>
            <p className="text-xs font-semibold text-primary">{kelompokName}</p>
            <p className="text-xs text-muted-foreground">Forum diskusi kelompok Anda</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Diskusi</h3>
          {!isLoading && (
            <Badge variant="secondary" className="text-xs">{pesans.length}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">Diperbarui {lastUpdate}</span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={invalidate}
            title="Muat ulang"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Pesan list */}
      {isLoading ? (
        <ForumSkeleton />
      ) : isError ? (
        <div className="text-center py-6 space-y-2">
          <p className="text-sm text-muted-foreground">Gagal memuat diskusi.</p>
          <Button variant="outline" size="sm" onClick={invalidate}>Coba Lagi</Button>
        </div>
      ) : pesans.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Belum ada diskusi. Jadilah yang pertama berkomentar!
        </p>
      ) : (
        <div className="space-y-4">
          {pesans.map((pesan) => (
            <PesanCard
              key={pesan.id}
              pesan={pesan}
              onReply={setActiveReplyId}
              activeReplyId={activeReplyId}
              onSendReply={(replyToId, isi) => handleKirim(isi, replyToId)}
              isPendingReply={isPending}
            />
          ))}
        </div>
      )}

      {/* Input komentar baru */}
      {activeReplyId === null && (
        <>
          <Separator />
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Komentar baru</p>
            <RichTextEditor
              value={newInput}
              onChange={setNewInput}
              placeholder="Tulis komentar atau pertanyaan..."
              minHeight="100px"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                className="gap-1.5"
                disabled={!newInput.replace(/<[^>]*>/g, "").trim() || isPending}
                onClick={() => handleKirim(newInput)}
              >
                {isPending ? "Mengirim..." : "Kirim"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
