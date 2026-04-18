// src/lib/utils/url-parser.ts
// Mendeteksi tipe URL dan mengkonversi ke embed URL.
// Semua embed ditampilkan full-width — tidak ada ukuran fixed kecuali tinggi minimum.

export type EmbedType =
  | "youtube"  // YouTube video → iframe aspect-video
  | "gdrive"   // Google Docs / Drive / Slides / Forms → iframe min-h-[600px]
  | "canva"    // Canva design → iframe min-h-[600px]
  | "image"    // Gambar publik (imgur, photos.google, jpg/png/webp) → <img>
  | "pdf"      // PDF via GDrive atau direct → iframe min-h-[700px]

export interface EmbedResult {
  embedUrl: string
  type: EmbedType
}

/**
 * Konversi URL publik ke URL embed yang bisa ditampilkan dalam iframe/img.
 * Mengembalikan null jika URL tidak bisa di-embed (tampilkan link card sebagai fallback).
 *
 * | Input                             | Output                          | Tipe     |
 * |-----------------------------------|---------------------------------|----------|
 * | youtube.com/watch?v=ID            | youtube.com/embed/ID            | youtube  |
 * | youtu.be/ID                       | youtube.com/embed/ID            | youtube  |
 * | docs.google.com/.../edit          | .../preview                     | gdrive   |
 * | drive.google.com/.../view         | .../preview                     | gdrive   |
 * | drive.google.com/file/d/ID/view   | .../preview                     | pdf      |
 * | slides.google.com/.../edit        | .../preview                     | gdrive   |
 * | canva.com/design/...              | .../view?embed                  | canva    |
 * | photos.google.com/photo/...       | URL langsung                    | image    |
 * | imgur.com/...                     | URL langsung (direct image)     | image    |
 * | *.jpg / *.png / *.webp / *.gif   | URL langsung                    | image    |
 * | lainnya                           | null → tampilkan link card      | —        |
 */
export function buildEmbedUrl(url: string): EmbedResult | null {
  if (!url) return null

  try {
    // ── YouTube ──────────────────────────────────────────────────────────────
    if (url.includes("youtube.com/watch")) {
      const parsed = new URL(url)
      const id = parsed.searchParams.get("v")
      if (id) return { embedUrl: `https://www.youtube.com/embed/${id}?rel=0`, type: "youtube" }
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0]?.split("#")[0]
      if (id) return { embedUrl: `https://www.youtube.com/embed/${id}?rel=0`, type: "youtube" }
    }
    if (url.includes("youtube.com/embed/")) {
      return { embedUrl: url, type: "youtube" }
    }

    // ── Google Slides (published) ─────────────────────────────────────────
    if (url.includes("slides.google.com")) {
      const embedUrl = url
        .replace(/\/edit.*$/, "/preview")
        .replace(/\/pub(\?.*)?$/, "/embed$1")
      return { embedUrl, type: "gdrive" }
    }

    // ── Google Drive — PDF via /file/d/ID ────────────────────────────────
    if (url.includes("drive.google.com/file/d/")) {
      const match = url.match(/\/file\/d\/([^/]+)/)
      if (match) {
        return {
          embedUrl: `https://drive.google.com/file/d/${match[1]}/preview`,
          type: "pdf",
        }
      }
    }

    // ── Google Docs / Drive (general) ────────────────────────────────────
    if (url.includes("docs.google.com") || url.includes("drive.google.com")) {
      const embedUrl = url
        .replace(/\/edit(\?.*)?$/, "/preview")
        .replace(/\/view(\?.*)?$/, "/preview")
        .replace(/\/copy(\?.*)?$/, "/preview")
      return { embedUrl, type: "gdrive" }
    }

    // ── Canva ─────────────────────────────────────────────────────────────
    if (url.includes("canva.com/design/")) {
      const base = url.split("?")[0].replace(/\/view$/, "")
      return { embedUrl: `${base}/view?embed`, type: "canva" }
    }

    // ── Google Photos ─────────────────────────────────────────────────────
    if (url.includes("photos.google.com")) {
      return { embedUrl: url, type: "image" }
    }

    // ── Imgur ─────────────────────────────────────────────────────────────
    if (url.includes("imgur.com")) {
      // Convert gallery/album to direct image if possible
      const direct = url
        .replace(/imgur\.com\/gallery\//, "i.imgur.com/")
        .replace(/imgur\.com\/a\/[^/]+\/?$/, url) // album → fallback link
      return { embedUrl: direct, type: "image" }
    }

    // ── Direct image extensions ───────────────────────────────────────────
    const imageExt = /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i
    if (imageExt.test(url)) {
      return { embedUrl: url, type: "image" }
    }

    // ── Direct PDF ───────────────────────────────────────────────────────
    if (/\.pdf(\?.*)?$/i.test(url)) {
      return { embedUrl: url, type: "pdf" }
    }

  } catch {
    // URL tidak valid
    return null
  }

  return null
}

/**
 * Deteksi apakah sebuah string adalah URL yang valid.
 */
export function isUrl(text: string): boolean {
  return /^https?:\/\/[^\s]+$/i.test(text.trim())
}

/**
 * Ekstrak semua URL dari teks biasa.
 */
export function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s]+/gi)
  return matches ?? []
}
