"use client"

import { useState, useTransition, useRef, useEffect } from "react"
import { Pencil, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { updateNamaKelasAction } from "@/server/actions/kelas.actions"

interface EditableNamaKelasProps {
  initialNama: string
  kode: string
}

export default function EditableNamaKelas({ initialNama, kode }: EditableNamaKelasProps) {
  const [nama, setNama] = useState(initialNama)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(initialNama)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  function openEdit() {
    setDraft(nama)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setDraft(nama)
  }

  function save() {
    if (!draft.trim()) return
    startTransition(async () => {
      const result = await updateNamaKelasAction(draft)
      if (result.error) { toast.error(result.error); return }
      setNama(draft.trim())
      setEditing(false)
      toast.success("Nama kelas diperbarui.")
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") save()
    if (e.key === "Escape") cancelEdit()
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-8 text-xl font-bold w-64"
          disabled={isPending}
        />
        <Button size="icon" className="h-8 w-8" disabled={!draft.trim() || isPending} onClick={save}>
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEdit}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 group">
      <h1 className="text-2xl font-bold">{nama}</h1>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={openEdit}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <p className="text-muted-foreground text-sm hidden">
        Kode: <span className="font-mono font-semibold">{kode}</span>
      </p>
    </div>
  )
}
