/**
 * Helpers bersama untuk Forum — bisa dipakai di ForumSection dan komponen lain.
 */

/** Format ISO date ke "12 Apr 2025, 09:30" */
export function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/** Inisial 1–2 kata pertama dari nama. "Ahmad Fauzi" → "AF" */
export function makeInitials(nama: string): string {
  return nama
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

/**
 * Sanitasi HTML ringan — hapus script tag, event handler inline, dan
 * javascript: protocol. Tidak butuh library eksternal.
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") return html
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "")
}
