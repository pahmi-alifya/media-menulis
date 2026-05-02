"use client"

import { useState, useEffect, useRef, useTransition } from "react"
import { CheckCircle2, Clock, ExternalLink, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import RichTextEditor from "@/components/konten/RichTextEditor"
import RubrikPreview from "@/components/assessment/RubrikPreview"
import { saveDraftAction, submitTugasAction } from "@/server/actions/submission.actions"

type ExistingSubmission = {
  isDraft: boolean
  isiEsai: string | null
  linkSubmisi: string | null
  updatedAt: Date
} | null

interface SubmissionFormProps {
  tahapId: string
  tipeSubmisi: string
  tahapUrutan: number
  existingSubmission?: ExistingSubmission
}

const DOMAIN_HINTS: Record<string, string> = {
  LINK_SLIDE: "Canva (canva.com) atau Google Slides (slides.google.com)",
  LINK_DOKUMEN: "Google Docs (docs.google.com) atau Google Drive (drive.google.com)",
  LINK_VIDEO: "YouTube (youtube.com) atau Google Drive (drive.google.com)",
}

/** Hitung jumlah kata dari HTML — strip tag terlebih dahulu */
function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  if (!text) return 0
  return text.split(" ").filter(Boolean).length
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
}

export default function SubmissionForm({
  tahapId,
  tipeSubmisi,
  tahapUrutan,
  existingSubmission,
}: SubmissionFormProps) {
  const isFinal = existingSubmission && !existingSubmission.isDraft
  const [linkValue, setLinkValue] = useState(existingSubmission?.linkSubmisi ?? "")
  const [essayValue, setEssayValue] = useState(existingSubmission?.isiEsai ?? "")
  const [savedAt, setSavedAt] = useState<string | null>(
    existingSubmission?.updatedAt ? formatTime(existingSubmission.updatedAt) : null,
  )
  const [submitted, setSubmitted] = useState(isFinal ?? false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const wordCount = countWords(essayValue)

  // Auto-save untuk TEKS_LANGSUNG — debounce 30 detik
  useEffect(() => {
    if (tipeSubmisi !== "TEKS_LANGSUNG" || isFinal || !essayValue.trim()) return
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(async () => {
      const result = await saveDraftAction(tahapId, { isiEsai: essayValue })
      if (!result.error) {
        setSavedAt(formatTime(new Date()))
      }
    }, 30000)
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    }
  }, [essayValue, tipeSubmisi, isFinal, tahapId])

  function handleSaveDraft() {
    startTransition(async () => {
      const result = await saveDraftAction(tahapId, {
        isiEsai: essayValue || null,
        linkSubmisi: linkValue || null,
      })
      if (result.error) {
        toast.error(result.error)
        return
      }
      setSavedAt(formatTime(new Date()))
      toast.success("Draft tersimpan")
    })
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await submitTugasAction(tahapId, {
        isiEsai: essayValue || null,
        linkSubmisi: linkValue || null,
      })
      if (result.error) {
        toast.error(result.error)
        return
      }
      setSubmitted(true)
      toast.success("Tugas berhasil dikumpulkan!")
    })
  }

  if (submitted) {
    return (
      <Card className="border-green-200 dark:border-green-800">
        <CardContent className="pt-6 pb-6 text-center space-y-3">
          <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
          <div>
            <p className="font-semibold text-lg">Tugas Terkumpul!</p>
            <p className="text-sm text-muted-foreground">
              Submission Anda sudah diterima dan tidak dapat diubah lagi.
            </p>
          </div>
          {tipeSubmisi !== "TEKS_LANGSUNG" && linkValue && (
            <a href={linkValue} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-3.5 w-3.5" />
                Lihat submission saya
              </Button>
            </a>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rubrik penilaian — hanya tahap 3 & 4 */}
      <RubrikPreview tahapUrutan={tahapUrutan} />

      {/* ── LINK types ── */}
      {(tipeSubmisi === "LINK_SLIDE" ||
        tipeSubmisi === "LINK_DOKUMEN" ||
        tipeSubmisi === "LINK_VIDEO") && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="link">Link Submission</Label>
            <Input
              id="link"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              placeholder="https://..."
              type="url"
              disabled={isFinal ?? false}
            />
            <p className="text-xs text-muted-foreground">
              Gunakan: {DOMAIN_HINTS[tipeSubmisi]}. Pastikan link dapat diakses publik.
            </p>
          </div>

          {linkValue && (
            <a href={linkValue} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <ExternalLink className="h-3.5 w-3.5" />
                Preview link
              </Button>
            </a>
          )}
        </div>
      )}

      {/* ── TEKS_LANGSUNG — Tiptap RichTextEditor ── */}
      {tipeSubmisi === "TEKS_LANGSUNG" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Label>Tulis Esai Anda</Label>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {savedAt && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Tersimpan {savedAt}
                </span>
              )}
              <span
                className={
                  wordCount < 800 ? "text-amber-500 font-medium" : "text-green-600 font-medium"
                }
              >
                {wordCount} kata {wordCount < 800 && `(min. 800)`}
              </span>
            </div>
          </div>

          {isFinal ? (
            <div
              className="rich-editor-content border rounded-md px-4 py-3 bg-muted/30 min-h-40"
              dangerouslySetInnerHTML={{ __html: essayValue }}
            />
          ) : (
            <RichTextEditor
              value={essayValue}
              onChange={setEssayValue}
              placeholder="Tulis esai argumentatif Anda di sini... (minimal 800 kata)"
              minHeight="400px"
            />
          )}

          {wordCount < 800 && wordCount > 0 && !isFinal && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              Masih kurang {800 - wordCount} kata lagi
            </p>
          )}
        </div>
      )}

      {/* ── CAMPURAN ── */}
      {tipeSubmisi === "CAMPURAN" && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Esai (opsional)</Label>
            {isFinal ? (
              <div
                className="rich-editor-content border rounded-md px-4 py-3 bg-muted/30 min-h-32"
                dangerouslySetInnerHTML={{ __html: essayValue }}
              />
            ) : (
              <RichTextEditor
                value={essayValue}
                onChange={setEssayValue}
                placeholder="Tulis esai Anda di sini..."
                minHeight="200px"
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-camp">Link (opsional)</Label>
            <Input
              id="link-camp"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              placeholder="https://..."
              disabled={isFinal ?? false}
            />
            <p className="text-xs text-muted-foreground">
              Minimal salah satu (esai atau link) harus diisi.
            </p>
          </div>
        </div>
      )}

      {/* ── Submit controls ── */}
      {!isFinal && (
        <div className="flex items-center gap-3 pt-2 flex-wrap">
          {tipeSubmisi === "TEKS_LANGSUNG" && (
            <Button variant="outline" disabled={isPending} onClick={handleSaveDraft}>
              Simpan Draft
            </Button>
          )}

          <Button
            className="gap-2"
            disabled={
              isPending ||
              (tipeSubmisi === "TEKS_LANGSUNG" && wordCount < 800) ||
              ((tipeSubmisi === "LINK_SLIDE" ||
                tipeSubmisi === "LINK_DOKUMEN" ||
                tipeSubmisi === "LINK_VIDEO") &&
                !linkValue.trim()) ||
              (tipeSubmisi === "CAMPURAN" && !essayValue.trim() && !linkValue.trim())
            }
            onClick={() => setDialogOpen(true)}
          >
            Kumpulkan Tugas
          </Button>

          {tipeSubmisi === "TEKS_LANGSUNG" && savedAt && (
            <Badge variant="outline" className="text-xs font-normal gap-1">
              <Clock className="h-3 w-3" />
              Auto-save aktif
            </Badge>
          )}
        </div>
      )}

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kumpulkan Tugas?</AlertDialogTitle>
            <AlertDialogDescription>
              Setelah dikumpulkan, Anda <strong>tidak dapat mengubah</strong> submission ini.
              Pastikan pekerjaan Anda sudah selesai.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => {
                handleSubmit()
                setDialogOpen(false)
              }}
            >
              {isPending ? "Mengumpulkan..." : "Ya, Kumpulkan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
