// src/lib/utils/url-parser.ts
// Mendeteksi tipe URL dan mengkonversi ke embed URL.
// Semua embed ditampilkan full-width — tidak ada ukuran fixed kecuali tinggi minimum.

export type EmbedType =
  | "youtube"  // YouTube video → iframe aspect-video
  | "gdrive"   // Google Docs / Drive / Slides / Forms → iframe min-h-[600px]
  | "canva"    // Canva design → iframe min-h-[600px]
  | "image"    // Gambar publik (imgur, photos.google, jpg/png/webp) → <img>
  | "pdf"      // PDF via GDrive atau direct → iframe min-h-[700px]
  | "webpage"  // Halaman HTML publik (heyzine, dll) → iframe min-h-[600px]

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

    // ── Google Drive folder — tidak bisa di-embed, tampilkan sebagai link card
    if (url.includes("drive.google.com/drive/folders/")) {
      return null
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

    // ── Halaman HTML publik (heyzine, flipbook, dll) ──────────────────────
    if (/\.html?(\?.*)?$/i.test(url)) {
      return { embedUrl: url, type: "webpage" }
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

// ─── Segmentasi body TEKS untuk rendering embed inline ───────────────────────

export type BodySegment =
  | { kind: "html"; html: string }
  | { kind: "embed"; url: string; embed: EmbedResult }

/**
 * Proses inner content sebuah <p> untuk menemukan URL embeddable.
 * Mengembalikan posisi (start/end) setiap URL + embed result-nya.
 */
function findEmbeddableInInner(
  inner: string,
): Array<{ start: number; end: number; url: string; embed: EmbedResult }> {
  const found: Array<{ start: number; end: number; url: string; embed: EmbedResult }> = []

  // 1. Cari <a href="embeddable-url">...</a>
  const aRx = /<a(?:\s[^>]*)?\shref="(https?:\/\/[^"]+)"[^>]*>[\s\S]*?<\/a>/gi
  let am
  while ((am = aRx.exec(inner)) !== null) {
    const url = am[1].replace(/[.,;!?)>\s]+$/, "")
    const embed = buildEmbedUrl(url)
    if (embed) found.push({ start: am.index, end: am.index + am[0].length, url, embed })
  }

  // 2. Cari URL plain text (bukan yang sudah ada di dalam <a>)
  // Ganti posisi <a>...</a> dengan spasi agar tidak terdeteksi ganda
  const masked = inner.replace(/<a[^>]*>[\s\S]*?<\/a>/gi, (m) => " ".repeat(m.length))
  const urlRx = /https?:\/\/\S+/gi
  let um
  while ((um = urlRx.exec(masked)) !== null) {
    const rawUrl = um[0].replace(/[.,;!?)>]+$/, "")
    const embed = buildEmbedUrl(rawUrl)
    if (embed && !found.some((f) => f.start <= um!.index && um!.index < f.end)) {
      found.push({ start: um.index, end: um.index + rawUrl.length, url: rawUrl, embed })
    }
  }

  return found.sort((a, b) => a.start - b.start)
}

/**
 * Konversi HTML body Tiptap (tipe TEKS) menjadi array BodySegment.
 *
 * Setiap URL embeddable di dalam <p> diganti embed-nya di posisi yang sama —
 * teks sebelum URL tetap ditampilkan, URL teks dihilangkan, embed muncul di
 * tempat URL tersebut. Block lain (ol, ul, heading, dll.) dipertahankan utuh.
 */
export function segmentTeksBody(html: string): BodySegment[] {
  if (!html.trim()) return []

  const segments: BodySegment[] = []

  // Regex untuk menangkap top-level block elements
  const blockRx =
    /(<p(?:\s[^>]*)?>)([\s\S]*?)(<\/p>)|<(?:ol|ul)(?:\s[^>]*)?>[\s\S]*?<\/(?:ol|ul)>|<h[1-6](?:\s[^>]*)?>[\s\S]*?<\/h[1-6]>|<blockquote(?:\s[^>]*)?>[\s\S]*?<\/blockquote>|<hr\s*\/?>/gi

  let lastIdx = 0
  let m: RegExpExecArray | null

  while ((m = blockRx.exec(html)) !== null) {
    // Konten di antara block elements
    if (m.index > lastIdx) {
      const between = html.slice(lastIdx, m.index).trim()
      if (between) segments.push({ kind: "html", html: between })
    }

    const isPTag = m[1] !== undefined && m[2] !== undefined && m[3] !== undefined

    if (isPTag) {
      // Proses <p> — pecah di posisi URL embeddable
      const openTag = m[1]
      const inner = m[2]
      const closeTag = m[3]

      const embeds = findEmbeddableInInner(inner)

      if (embeds.length === 0) {
        segments.push({ kind: "html", html: m[0] })
      } else {
        let cursor = 0
        for (const { start, end, url, embed } of embeds) {
          // Teks sebelum URL
          const before = inner.slice(cursor, start)
          if (before.replace(/<[^>]+>/g, "").trim()) {
            segments.push({ kind: "html", html: openTag + before + closeTag })
          }
          // Embed menggantikan URL
          segments.push({ kind: "embed", url, embed })
          cursor = end
        }
        // Teks sesudah URL terakhir
        const after = inner.slice(cursor)
        if (after.replace(/<[^>]+>/g, "").trim()) {
          segments.push({ kind: "html", html: openTag + after + closeTag })
        }
      }
    } else {
      // Block bukan <p> (ol, ul, heading, dll.) — simpan apa adanya
      segments.push({ kind: "html", html: m[0] })
    }

    lastIdx = m.index + m[0].length
  }

  // Sisa HTML setelah block terakhir
  const rest = html.slice(lastIdx).trim()
  if (rest) segments.push({ kind: "html", html: rest })

  return segments
}
