"use client"

import { useEffect, useRef, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  TextQuote,
  Minus,
  Undo2,
  Redo2,
  RemoveFormatting,
  ExternalLink,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { buildEmbedUrl, isUrl, extractUrls } from "@/lib/utils/url-parser"

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis isi materi di sini...",
  minHeight = "160px",
}: RichTextEditorProps) {
  const isExternalUpdate = useRef(false)
  // Preview URL yang terdeteksi dari paste
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    onUpdate: ({ editor }) => {
      if (isExternalUpdate.current) {
        isExternalUpdate.current = false
        return
      }
      const html = editor.getHTML()
      onChange(html === "<p></p>" ? "" : html)

      // Scan konten untuk URL — tampilkan preview URL terakhir yang valid
      const text = editor.getText()
      const urls = extractUrls(text)
      const lastEmbeddable = [...urls].reverse().find((u) => buildEmbedUrl(u) !== null)
      if (lastEmbeddable && lastEmbeddable !== previewUrl) {
        setPreviewUrl(lastEmbeddable)
      }
    },
    editorProps: {
      attributes: {
        class: "rich-editor-content focus:outline-none",
        style: `min-height: ${minHeight}`,
      },
      handlePaste: (_view, event) => {
        const text = event.clipboardData?.getData("text/plain") ?? ""
        const trimmed = text.trim()
        // Jika yang di-paste murni sebuah URL, tampilkan preview-nya
        if (isUrl(trimmed) && buildEmbedUrl(trimmed)) {
          setPreviewUrl(trimmed)
        }
        return false // Biarkan Tiptap handle paste seperti biasa
      },
    },
    immediatelyRender: false,
  })

  // Sinkronisasi saat value berubah dari luar
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const normalized = current === "<p></p>" ? "" : current
    if (normalized !== value) {
      isExternalUpdate.current = true
      editor.commands.setContent(value || "")
      // Scan ulang URL setelah konten di-set dari luar
      const text = editor.getText()
      const urls = extractUrls(text)
      const lastEmbeddable = [...urls].reverse().find((u) => buildEmbedUrl(u) !== null)
      setPreviewUrl(lastEmbeddable ?? null)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!editor) return null

  const embed = previewUrl ? buildEmbedUrl(previewUrl) : null

  const ToolBtn = ({
    onClick,
    active,
    disabled,
    title,
    children,
  }: {
    onClick: () => void
    active?: boolean
    disabled?: boolean
    title: string
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        "h-7 w-7 rounded flex items-center justify-center transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none"
      )}
    >
      {children}
    </button>
  )

  const Sep = () => <div className="w-px h-4 bg-border mx-1 shrink-0" />

  return (
    <div className="space-y-2">
      <div className="border border-input rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-ring">
        {/* ── Toolbar ── */}
        <div className="flex items-center flex-wrap gap-0.5 border-b px-2 py-1.5 bg-muted/30">
          <ToolBtn
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Urungkan (Ctrl+Z)"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Ulangi (Ctrl+Y)"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </ToolBtn>

          <Sep />

          <ToolBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            title="Judul (H2)"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            title="Subjudul (H3)"
          >
            <Heading3 className="h-3.5 w-3.5" />
          </ToolBtn>

          <Sep />

          <ToolBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Tebal (Ctrl+B)"
          >
            <Bold className="h-3.5 w-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Miring (Ctrl+I)"
          >
            <Italic className="h-3.5 w-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Garis Bawah (Ctrl+U)"
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Coret"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Kode Inline"
          >
            <Code className="h-3.5 w-3.5" />
          </ToolBtn>

          <Sep />

          <ToolBtn
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Daftar Bullet"
          >
            <List className="h-3.5 w-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Daftar Bernomor"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolBtn>

          <Sep />

          <ToolBtn
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Kutipan"
          >
            <TextQuote className="h-3.5 w-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Garis Pemisah"
          >
            <Minus className="h-3.5 w-3.5" />
          </ToolBtn>

          <Sep />

          <ToolBtn
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            title="Hapus Pemformatan"
          >
            <RemoveFormatting className="h-3.5 w-3.5" />
          </ToolBtn>
        </div>

        {/* ── Area tulis ── */}
        <div className="relative px-3 py-2">
          {editor.isEmpty && (
            <p className="absolute top-2 left-3 text-sm text-muted-foreground pointer-events-none select-none">
              {placeholder}
            </p>
          )}
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* ── Preview URL yang ter-detect ── */}
      {previewUrl && embed && (
        <div className="border rounded-md overflow-hidden bg-muted/30">
          {/* Preview header */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-b bg-muted/50">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-xs text-muted-foreground truncate">Preview: {previewUrl}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <button
                  type="button"
                  className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Buka di tab baru"
                >
                  <ExternalLink className="h-3 w-3" />
                </button>
              </a>
              <button
                type="button"
                onClick={() => setPreviewUrl(null)}
                className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Tutup preview"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Preview content */}
          <div className="p-2">
            {embed.type === "youtube" && (
              <div className="w-full aspect-video rounded overflow-hidden bg-black">
                <iframe
                  src={embed.embedUrl}
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
            {(embed.type === "gdrive" || embed.type === "canva") && (
              <div className="w-full rounded overflow-hidden" style={{ minHeight: "360px" }}>
                <iframe
                  src={embed.embedUrl}
                  className="w-full"
                  style={{ minHeight: "360px" }}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
            {embed.type === "pdf" && (
              <div className="w-full rounded overflow-hidden" style={{ minHeight: "400px" }}>
                <iframe
                  src={embed.embedUrl}
                  className="w-full"
                  style={{ minHeight: "400px" }}
                  loading="lazy"
                />
              </div>
            )}
            {embed.type === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={embed.embedUrl}
                alt="Preview"
                className="w-full rounded object-contain max-h-80 bg-muted"
                loading="lazy"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
