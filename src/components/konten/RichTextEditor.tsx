"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { segmentTeksBody } from "@/lib/utils/url-parser";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis isi materi di sini...",
  minHeight = "160px",
}: RichTextEditorProps) {
  const isExternalUpdate = useRef(false);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    onUpdate: ({ editor }) => {
      if (isExternalUpdate.current) {
        isExternalUpdate.current = false;
        return;
      }
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    editorProps: {
      attributes: {
        class: "rich-editor-content focus:outline-none",
        style: `min-height: ${minHeight}`,
      },
    },
    immediatelyRender: false,
  });

  // Sinkronisasi saat value berubah dari luar
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const normalized = current === "<p></p>" ? "" : current;
    if (normalized !== value) {
      isExternalUpdate.current = true;
      editor.commands.setContent(value || "");
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!editor) return null;

  // Segmentasi body untuk preview embed inline
  const segments = value ? segmentTeksBody(value) : [];
  const hasEmbed = segments.some((s) => s.kind === "embed");

  const ToolBtn = ({
    onClick,
    active,
    disabled,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
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
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
      )}
    >
      {children}
    </button>
  );

  const Sep = () => <div className="w-px h-4 bg-border mx-1 shrink-0" />;

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
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            title="Judul (H2)"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </ToolBtn>
          <ToolBtn
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
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
            onClick={() =>
              editor.chain().focus().unsetAllMarks().clearNodes().run()
            }
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

      {/* ── Preview embed inline — hanya tampil jika ada URL yang bisa di-embed ── */}
      {hasEmbed && (
        <div className="space-y-3 rounded-md border bg-muted/20 p-3">
          <p className="text-xs font-medium text-muted-foreground">Preview</p>
          {segments.map((seg, i) =>
            seg.kind === "html" ? (
              <div
                key={i}
                className="rich-editor-content"
                dangerouslySetInnerHTML={{ __html: seg.html }}
              />
            ) : (
              <div key={i} className="space-y-1.5">
                {seg.embed.type === "youtube" && (
                  <div className="w-full aspect-video rounded-md overflow-hidden bg-muted">
                    <iframe
                      src={seg.embed.embedUrl}
                      className="w-full h-full"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                )}
                {(seg.embed.type === "gdrive" ||
                  seg.embed.type === "canva") && (
                  <div
                    className="w-full rounded-md overflow-hidden bg-muted"
                    style={{ minHeight: "400px" }}
                  >
                    <iframe
                      src={seg.embed.embedUrl}
                      className="w-full h-full"
                      style={{ minHeight: "400px" }}
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                )}
                {seg.embed.type === "pdf" && (
                  <div
                    className="w-full rounded-md overflow-hidden bg-muted"
                    style={{ minHeight: "500px" }}
                  >
                    <iframe
                      src={seg.embed.embedUrl}
                      className="w-full h-full"
                      style={{ minHeight: "500px" }}
                      loading="lazy"
                    />
                  </div>
                )}
                {seg.embed.type === "image" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={seg.embed.embedUrl}
                    alt=""
                    className="w-full rounded-md object-contain max-h-96 bg-muted"
                    loading="lazy"
                  />
                )}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
