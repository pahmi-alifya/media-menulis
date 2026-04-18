# FEATURE_COMPARISON.md — Referensi LMS vs Media Menulis

Dokumen ini membandingkan fitur LMS referensi (kampus) dengan kondisi Media Menulis saat ini.
Update kolom **Status** setiap fitur selesai diimplementasi.

> **Referensi LMS** menggunakan 3 kategori aktivitas:
>
> - **Lihat** — Hanya melihat materi yang dipublikasi (read-only)
> - **Serahkan** — Melihat dan mengumpulkan tugas, dosen memberi nilai
> - **Berkontribusi** — Materi + forum diskusi terintegrasi

---

## MAPPING KE MEDIA MENULIS

| Kategori Referensi | Ekuivalen di Media Menulis | Halaman Utama                                           |
| ------------------ | -------------------------- | ------------------------------------------------------- |
| **Lihat**          | Konten materi per tahap    | `/mahasiswa/pertemuan/[p]/tahap/[id]`                   |
| **Serahkan**       | Submit tugas + nilai       | `/mahasiswa/pertemuan/[p]/tahap/[id]/submit` & `/nilai` |
| **Berkontribusi**  | Forum diskusi per-konten   | Inline di `/mahasiswa/pertemuan/[p]/tahap/[id]`         |

---

## 1. LIHAT — Viewer Materi

### Referensi: Fitur yang ada

- Konten materi ter-embed full-width (PDF, dokumen Google Docs)
- Video YouTube ter-embed aspect-video
- Tab terpisah: **Bahan Bacaan** | **Lembar Kerja**
- Navigasi urut antar item: tombol **Sebelumnya** / **Berikutnya**
- Status penyelesaian per item ("Selesaikan Semua Item")
- Halaman overview kursus: semua topik/tahap dalam satu tampilan accordion
- Blok metadata pertemuan: **Jumlah Pertemuan**, **Tujuan Pembelajaran**, **Moda** (Luring/Daring)
- Section "Informasi Umum Mata Kuliah" di halaman awal kursus

### Media Menulis: Kondisi saat ini

- [x] KontenCard — embed iframe untuk YouTube & Google Docs/Drive/Canva (full-width)
- [x] Fallback "Buka di tab baru" jika tidak bisa di-embed
- [x] Konten tipe TEKS dengan rich HTML (Tiptap)
- [x] Halaman tahap mahasiswa menampilkan konten satu per satu dengan `KontenViewer`
- [x] Breadcrumb navigasi Pertemuan → Tahap
- [x] Navigasi Sebelumnya / Berikutnya antar konten
- [x] Status penyelesaian per item — tombol "Tandai Selesai" + progress counter + dot hijau
- [x] Iframe dokumen full-width (bukan aspect kecil)
- [ ] Tab "Bahan Bacaan" / "Lembar Kerja" — **tidak usah**
- [ ] Field `moda` (Luring/Daring) di model data & tampilan — **tidak usah**
- [ ] Blok metadata terstruktur di halaman pertemuan/tahap — **tidak usah**
- [ ] Section informasi umum kelas — **tidak usah**

### Perbedaan ukuran viewer

| Aspek               | Referensi               | Media Menulis                                  |
| ------------------- | ----------------------- | ---------------------------------------------- |
| Dokumen Google Docs | Full-width viewer besar | iframe full-width `min-h-[600px]` ✅           |
| Video YouTube       | Full-width aspect-video | `aspect-video` full-width ✅                   |
| PDF langsung        | Viewer besar full-page  | iframe full-width `min-h-[700px]` ✅           |

---

## 2. SERAHKAN — Tugas & Penilaian

### Referensi: Fitur yang ada (sisi mahasiswa)

- Halaman tugas menampilkan rubrik penilaian (tabel kriteria + tingkat skor + poin)
- Poin maksimum ditampilkan di header tugas ("Poin: 100")
- Status submission per tugas ("1 file dikumpulkan", "Belum dikumpulkan")
- Upload file fisik ke server (PDF, Word, dll)
- Konfirmasi sebelum final submit

### Referensi: Fitur yang ada (sisi dosen)

- Melihat semua submission mahasiswa
- Memberi nilai per mahasiswa berdasarkan rubrik
- Mengunduh semua submission sekaligus

### Media Menulis: Kondisi saat ini (mahasiswa)

- [x] SubmissionForm — LINK_SLIDE, LINK_DOKUMEN, LINK_VIDEO (input URL)
- [x] SubmissionForm — TEKS_LANGSUNG (Tiptap rich editor + word count + auto-save 30 detik)
- [x] SubmissionForm — CAMPURAN (esai + link)
- [x] PanduanSubmisi — panduan langkah-langkah per tipe (accordion)
- [x] AlertDialog konfirmasi sebelum final submit
- [x] Status badge: Terkumpul / Draft tersimpan / Belum dikerjakan
- [x] Halaman `/nilai` — tampilkan nilai akhir + rincian per aspek + komentar dosen
- [x] Rubrik penilaian (tabel kriteria) ditampilkan ke mahasiswa sebelum submit — `RubrikPreview` Tahap 3 & 4
- [x] Poin Maks: 100 — ditampilkan di header halaman submit
- [ ] Upload file fisik — **tidak akan dibuat** (Zero-Storage by design)

### Media Menulis: Kondisi saat ini (dosen)

- [x] Halaman submissions per tahap — daftar semua mahasiswa + status
- [x] Halaman detail submission per mahasiswa — lihat isi esai / buka link
- [x] RubrikForm Tahap 4 (IMMM) — 5 aspek (ISI, ORGANISASI, KOSAKATA, KEBAHASAAN, MEKANIK), skala 1–4
- [x] RubrikKolaborasiForm Tahap 3 (KMBM) — 2 aspek (MENULIS, UMPAN_BALIK), skala 1–3
- [x] Export nilai ke CSV — tombol "Export CSV" di halaman submissions dosen
- [ ] Bulk action: unduh semua submission — **tidak ada** (zero-storage, tidak ada file)

---

## 3. BERKONTRIBUSI — Materi + Forum

### Referensi: Fitur yang ada

- Forum diskusi **terintegrasi langsung** di dalam halaman materi/tahap
- Forum terpisah per topik/section (bukan global)
- Mahasiswa dan dosen bisa berdiskusi dalam konteks konten yang sedang dilihat
- Thread diskusi terstruktur (parent + reply)

### Media Menulis: Kondisi saat ini

- [x] Forum global `/mahasiswa/forum` — **dihapus**, digantikan forum per-konten
- [x] Forum terintegrasi per konten — muncul di `KontenViewer` hanya jika `kategori === "BERKONTRIBUSI"`
- [x] MessageCard — avatar inisial, badge "Dosen", timestamp
- [x] Reply/thread 1 level (nested)
- [x] Input komentar menggunakan **RichTextEditor** (Tiptap)
- [x] Forum tipe KELOMPOK (Tahap 3 KMBM) — banner "Kelompok A" + label "Forum diskusi kelompok Anda"
- [ ] Polling 30 detik via TanStack Query — **TODO implementasi real API**
- [ ] Forum tipe `KELAS` untuk semua anggota — akan otomatis terpenuhi saat tidak ada `kelompokName`
- [ ] Indikator unread / notifikasi pesan baru — Fase 6

---

## RINGKASAN FEATURE GAP

| #   | Fitur                                                 | Kategori      | Prioritas | Status              |
| --- | ----------------------------------------------------- | ------------- | --------- | ------------------- |
| 1   | Rubrik penilaian ditampilkan ke mahasiswa (read-only) | Serahkan      | Tinggi    | ✅ Selesai          |
| 2   | Forum terintegrasi per tahap                          | Berkontribusi | Tinggi    | ✅ Selesai          |
| 3   | Forum tipe KELOMPOK (Tahap 3 KMBM)                    | Berkontribusi | Tinggi    | ✅ Selesai          |
| 4   | Field `moda` (Luring/Daring) di model + UI            | Lihat         | —         | 🚫 Tidak usah       |
| 5   | Blok metadata terstruktur di halaman tahap            | Lihat         | —         | 🚫 Tidak usah       |
| 6   | Tab "Bahan Bacaan" / "Lembar Kerja" di halaman tahap  | Lihat         | —         | 🚫 Tidak usah       |
| 7   | Iframe dokumen full-width (bukan aspect-[4/3])        | Lihat         | Sedang    | ✅ Selesai          |
| 8   | Navigasi Sebelumnya / Berikutnya antar konten         | Lihat         | Sedang    | ✅ Selesai          |
| 9   | Poin/skor maksimum di header tugas                    | Serahkan      | Sedang    | ✅ Selesai          |
| 10  | Status penyelesaian per item konten                   | Lihat         | Sedang    | ✅ Selesai          |
| 11  | Export nilai CSV                                      | Serahkan      | Sedang    | ✅ Selesai          |
| 12  | Indikator unread / notifikasi forum                   | Berkontribusi | Rendah    | ⏳ Fase 6           |
| 13  | Section "Informasi Umum Kelas"                        | Lihat         | —         | 🚫 Tidak usah       |

---

## YANG SENGAJA TIDAK DIIMPLEMENTASI

| Fitur                       | Alasan                                                              |
| --------------------------- | ------------------------------------------------------------------- |
| Upload file fisik           | Zero-Storage Architecture — mahasiswa paste URL (Google Drive, dll) |
| Unduh bulk submission dosen | Zero-Storage — tidak ada file di server                             |
| Email notifikasi            | Tidak ada email service, enrollment manual                          |
| Real-time WebSocket forum   | Polling 30 detik (hemat biaya)                                      |
| Tab "Bahan Bacaan"          | Tidak sesuai model pedagogis Knows SGM                              |
| Field `moda` (Luring/Daring)| Tidak diperlukan untuk fitur inti                                   |
| Blok metadata terstruktur   | Sudah cukup dengan deskripsi + tujuan tahap                        |
| Section Informasi Umum Kelas| Tidak diperlukan untuk fitur inti                                   |

---

#### Note:

1. Untuk Text editor buat agar bisa append link gambar atau dokumen yang ketika di tampilkan bisa dilihat dan ada previewnya juga, misalkan link PDF otomatis ada previewnya sebelum disubmit ✅

2. Untuk forum diskusi ketika koment gunakan text editor ✅

3. Pastikan setiap link, seperti google drive, photo, yt dan lain sebagainya bisa tampil dan muncul ✅
