"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { submitPeerReviewAction } from "@/server/actions/peer-review.actions"

interface PeerReviewFormProps {
  peerReviewId: string
  revieweeName: string
}

export default function PeerReviewForm({ peerReviewId, revieweeName }: PeerReviewFormProps) {
  const [komentar, setKomentar] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    if (!komentar.trim()) {
      toast.error("Komentar tidak boleh kosong")
      return
    }
    startTransition(async () => {
      const result = await submitPeerReviewAction(peerReviewId, komentar)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Review berhasil dikirim!")
      }
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Tulis Review untuk {revieweeName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Berikan komentar yang membangun: kelebihan esai, area yang bisa ditingkatkan, dan saran spesifik.
        </p>
        <Textarea
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
          placeholder="Tulis komentar peer review Anda di sini..."
          rows={6}
          disabled={isPending}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!komentar.trim() || isPending}
            className="gap-2"
          >
            {isPending ? "Mengirim..." : "Kirim Review"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
