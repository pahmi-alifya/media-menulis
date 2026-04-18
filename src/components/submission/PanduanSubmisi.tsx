import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { type TipeSubmisi } from "@/lib/mock/data"

const PANDUAN: Record<TipeSubmisi, { judul: string; langkah: string[] }> = {
  LINK_SLIDE: {
    judul: "Cara Mengumpulkan Link Slide / Infografis",
    langkah: [
      "Buat mind map atau infografis menggunakan Canva atau Google Slides.",
      "Pastikan dokumen dapat diakses oleh siapa saja (ubah pengaturan berbagi ke 'Siapa saja yang punya link dapat melihat').",
      "Salin link dokumen Anda.",
      "Tempelkan link di kolom submission dan klik 'Kumpulkan Tugas'.",
    ],
  },
  LINK_DOKUMEN: {
    judul: "Cara Mengumpulkan Link Dokumen",
    langkah: [
      "Buka Google Docs dan kerjakan tugas sesuai instruksi.",
      "Klik tombol 'Bagikan' di pojok kanan atas Google Docs.",
      "Ubah akses menjadi 'Siapa saja yang punya link dapat melihat'.",
      "Salin link dan tempelkan di kolom submission.",
      "Klik 'Kumpulkan Tugas' setelah siap.",
    ],
  },
  LINK_VIDEO: {
    judul: "Cara Mengumpulkan Link Video",
    langkah: [
      "Upload video ke YouTube (pilih visibilitas 'Tidak Tercantum' atau 'Publik') atau Google Drive.",
      "Untuk YouTube: klik 'Bagikan' → salin link.",
      "Untuk Google Drive: klik kanan file → 'Dapatkan link' → ubah ke 'Siapa saja yang punya link'.",
      "Tempelkan link di kolom submission dan kumpulkan.",
    ],
  },
  TEKS_LANGSUNG: {
    judul: "Cara Menulis Esai Langsung",
    langkah: [
      "Ketik esai Anda langsung di kotak teks yang tersedia.",
      "Esai minimal 800 kata dengan referensi minimal 3 sumber akademik.",
      "Draf tersimpan otomatis setiap 30 detik — Anda bisa menutup halaman dan melanjutkan nanti.",
      "Klik 'Simpan Draft' untuk menyimpan manual kapan saja.",
      "Setelah selesai, klik 'Kumpulkan Tugas'. Esai yang sudah dikumpulkan tidak dapat diubah.",
    ],
  },
  CAMPURAN: {
    judul: "Cara Mengumpulkan Tugas Campuran",
    langkah: [
      "Isi kotak teks dan/atau kolom link (minimal salah satu harus diisi).",
      "Untuk link: pastikan dapat diakses publik.",
      "Klik 'Kumpulkan Tugas' setelah siap.",
    ],
  },
}

export default function PanduanSubmisi({ tipeSubmisi }: { tipeSubmisi: TipeSubmisi }) {
  const panduan = PANDUAN[tipeSubmisi]

  return (
    <Accordion>
      <AccordionItem value="panduan" className="border rounded-md px-4">
        <AccordionTrigger className="text-sm font-medium hover:no-underline">
          {panduan.judul}
        </AccordionTrigger>
        <AccordionContent>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            {panduan.langkah.map((langkah, i) => (
              <li key={i}>{langkah}</li>
            ))}
          </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
