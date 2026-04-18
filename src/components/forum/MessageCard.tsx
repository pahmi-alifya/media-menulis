import { type MockPesan } from "@/lib/mock/data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

interface MessageCardProps {
  pesan: MockPesan
  onReply?: (id: string) => void
  isNested?: boolean
}

export default function MessageCard({ pesan, onReply, isNested = false }: MessageCardProps) {
  const initials = pesan.namaPengirim
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className={`flex gap-3 ${isNested ? "ml-8 mt-3" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          pesan.rolePengirim === "DOSEN"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-medium">{pesan.namaPengirim}</span>
          {pesan.rolePengirim === "DOSEN" && (
            <Badge variant="secondary" className="text-xs py-0">Dosen</Badge>
          )}
          <span className="text-xs text-muted-foreground">{pesan.createdAt}</span>
        </div>
        <p className="text-sm leading-relaxed">{pesan.isi}</p>

        {!isNested && onReply && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs mt-1 gap-1 text-muted-foreground hover:text-foreground -ml-2"
            onClick={() => onReply(pesan.id)}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Balas
          </Button>
        )}

        {/* Nested replies */}
        {pesan.replies && pesan.replies.length > 0 && (
          <div className="mt-1 space-y-0">
            {pesan.replies.map((reply) => (
              <MessageCard key={reply.id} pesan={reply} isNested />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
