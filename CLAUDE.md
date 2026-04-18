# CLAUDE.md — Media Menulis LMS

Panduan kerja permanen untuk Claude Code dalam membangun project ini.
Baca file ini di setiap sesi sebelum mulai bekerja.

---

## IDENTITAS PROJECT

**Nama**: Media Menulis
**Tipe**: Learning Management System (LMS) sederhana untuk perkuliahan menulis
**Prinsip Utama**: Zero-Storage Architecture — server TIDAK pernah menyimpan file,
hanya menyimpan URL string dan teks pendek.
**Biaya operasional target**: Rp 0/bulan

---

## TECH STACK

| Layer      | Teknologi                          | Versi     |
|------------|------------------------------------|-----------|
| Framework  | Next.js (App Router)               | 15        |
| Language   | TypeScript                         | strict    |
| Styling    | TailwindCSS + shadcn/ui            | latest    |
| State      | Zustand + TanStack Query           | v5        |
| Database   | PostgreSQL via Neon (free tier)    | -         |
| ORM        | Prisma                             | latest    |
| Auth       | NextAuth.js                        | v5 (beta) |
| Hosting    | Vercel (free tier)                 | -         |
| Storage    | TIDAK ADA                          | -         |

---

## PRINSIP ARSITEKTUR

### Zero-Storage (WAJIB DIPATUHI)
- TIDAK BOLEH ada `multer`, `formidable`, S3, R2, Cloudinary, atau apapun yang menerima file upload
- Semua konten materi = URL string yang disimpan di kolom `url` database
- Semua submission file = URL string yang di-paste mahasiswa (Google Drive, YouTube, dll)
- Satu-satunya "file" yang disimpan di DB = teks esai di kolom `isiEsai` (tipe TEXT, HTML dari Tiptap)

### Layanan yang Diizinkan untuk Link
```
docs.google.com      → Google Docs / Sheets / Slides
drive.google.com     → Google Drive file / video / PDF
youtube.com          → YouTube video
youtu.be             → YouTube short link
canva.com            → Canva design
slides.google.com    → Google Slides
forms.google.com     → Google Forms
photos.google.com    → Google Photos
imgur.com            → Gambar publik
github.com           → Kode mahasiswa
```

---

## KONVENSI KODE (WAJIB)

### Struktur File
- Server Actions → `src/server/actions/*.actions.ts`
- Prisma Queries → `src/server/queries/*.queries.ts`
- Validasi Zod → `src/lib/validations/*.schema.ts`
- Custom Hooks → `src/lib/hooks/use*.ts`
- Utils murni → `src/lib/utils/*.ts`

### Error Handling
Selalu gunakan Result Pattern, bukan throw:
```typescript
type Result<T> = { data: T; error: null } | { data: null; error: string }
```

### Form
- Selalu gunakan React Hook Form + Zod resolver
- Bukan controlled state manual

### Bahasa UI
- Semua teks yang tampil ke user: **Bahasa Indonesia**
- Variable/fungsi/komentar kode: **Bahasa Inggris** (konvensi programmer)
- Format tanggal: `dd MMMM yyyy` (contoh: "13 April 2026")

### Notifikasi
- Gunakan `sonner` toast, bukan `alert()`

### Loading State
- Gunakan Skeleton dari shadcn/ui, bukan spinner custom

### Rich Text Editor (Tiptap)
Gunakan `RichTextEditor.tsx` (Tiptap) — bukan `<textarea>` biasa — di tiga tempat:
1. **Dosen**: form tambah/edit konten bertipe `TEKS`
2. **Mahasiswa**: form esai submission tipe `TEKS_LANGSUNG` (Tahap 4)
3. **Semua pengguna**: input komentar di forum diskusi

Editor harus mendukung **link preview otomatis**: ketika user menempelkan URL (YouTube, Google Drive,
PDF, foto), editor menampilkan preview embed/thumbnail sebelum disimpan.

### Komponen Server vs Client
- Default: Server Component
- Tandai `"use client"` HANYA jika perlu interaktivitas browser (form, state, efek)

---

## MODEL PEDAGOGIS — KNOWS SGM (WAJIB DIPAHAMI)

Aplikasi mengimplementasikan model **Knows SGM** (Knowledge Sharing SECI + Genre-Based + Multimodal)
dari panduan dosen UNJ. Model ini mendefinisikan **5 tahap TETAP** yang auto-generate saat kelas dibuat.

### 5 Tahap TETAP (tidak bisa ditambah/hapus oleh dosen)

| No | Kode  | Nama Lengkap                                     | Fokus Pedagogis            |
|----|-------|--------------------------------------------------|----------------------------|
| 1  | SMKM  | Sharing dan Mengkonstruksi Konten Multimodal     | Eksternalisasi pengetahuan |
| 2  | EPM   | Eksplorasi dan Penelaahan Multimodal             | Internalisasi sumber       |
| 3  | KMBM  | Kolaborasi dan Menulis Bersama Multimodal        | Kombinasi kolaboratif      |
| 4  | IMMM  | Independensi Menulis Mandiri Multimodal          | Sosialisasi → mandiri      |
| 5  | IMTM  | Integrasi dan Mempublikasikan Teks Multimodal    | Publikasi karya            |

### Tipe Submission ALAMI per Tahap

| Tahap | TipeSubmisi     | Artefak yang Dikumpulkan                |
|-------|-----------------|-----------------------------------------|
| 1     | LINK_SLIDE      | Mind map / peta konsep (Canva/Slides)   |
| 2     | LINK_DOKUMEN    | Ringkasan penelaahan (Google Docs)      |
| 3     | LINK_DOKUMEN    | Esai kolaboratif bersama (Google Docs)  |
| 4     | TEKS_LANGSUNG   | Esai mandiri (ditulis di LMS via Tiptap)|
| 5     | LINK_SLIDE      | Infografis / presentasi akhir           |

### Rubrik Penilaian per Tahap
- **Tahap 3 (KMBM)**: Rubrik kolaborasi individual — 2 aspek (`AspekKolaborasi`), skala 1–3.
- **Tahap 4 (IMMM)**: Rubrik esai mandiri — 5 aspek (`AspekNilai`), skala 1–4. Nilai total = rata-rata × 25 (skala 100).
- Tahap lain: tidak ada rubrik terstruktur, dosen beri umpan balik via forum (jika `hasForum: true`).

### Tahap 3 — Kolaborasi Kelompok
- Mahasiswa dibagi kelompok oleh dosen (input manual, disimpan sebagai string nama anggota)
- Forum tipe `KELOMPOK` muncul di halaman Tahap 3 (karena `hasForum: true` otomatis saat kelas dibuat)
- Submission: satu link Google Docs kondivisi per kelompok (tiap anggota submit link yang sama)

---

## DATABASE MODEL PENTING

### Tipe Konten (`KontenTipe`)
```
TEKS        → body: String (HTML dari Tiptap), url: null
VIDEO       → url: YouTube / GDrive video link
INFOGRAFIS  → url: Canva / gambar publik
DOKUMEN     → url: Google Docs / GDrive PDF / artikel
TEMPLATE    → url: Google Docs template (mahasiswa copy)
```

### Field Penting pada Model `Konten`
```
pertemuanKe: Int        → nomor pertemuan (1 atau 2, default 1)
kategori: KategoriKonten → menentukan tampilan di KontenViewer mahasiswa (default LIHAT)
```

### `KategoriKonten` Enum
```
LIHAT          → tampilkan KontenCard saja (read-only, hanya materi)
SERAHKAN       → KontenCard + status submission + tombol kerjakan/lihat tugas
BERKONTRIBUSI  → KontenCard + forum diskusi terintegrasi di bawah konten
```
Setiap tahap boleh memiliki lebih dari satu item berkategori `BERKONTRIBUSI`.
Idealnya hanya ada satu item `SERAHKAN` per tahap (item panduan + form tugas).
**Tidak ada `hasForum` di level Tahap** — forum dikontrol per item konten.

### Tipe Submission (`TipeSubmisi`)
```
TEKS_LANGSUNG  → isiEsai: String (HTML dari Tiptap), dengan auto-save draft 30 detik
LINK_DOKUMEN   → linkSubmisi: Google Docs/Drive URL
LINK_VIDEO     → linkSubmisi: YouTube/GDrive video URL
LINK_SLIDE     → linkSubmisi: Canva/Google Slides URL
CAMPURAN       → isiEsai + linkSubmisi (keduanya opsional tapi min 1 harus ada)
```

### Aspek Penilaian Rubrik Esai (`AspekNilai`) — TAHAP 4
```
ISI_KONTEN    → kualitas konten tulisan
ORGANISASI    → struktur dan alur
KOSAKATA      → pilihan kata
KEBAHASAAN    → tata bahasa
MEKANIK       → ejaan, tanda baca
```
Skor 1–4. Nilai total = rata-rata × 25 (skala 100).

### Aspek Penilaian Rubrik Kolaborasi (`AspekKolaborasi`) — TAHAP 3
```
MENULIS_KOLABORASI      → kontribusi dalam proses penulisan kolaboratif
UMPAN_BALIK_KOLABORASI  → partisipasi diskusi, umpan balik rekan, revisi
```
Skor 1–3. Nilai total = rata-rata / 3 × 100 (skala 100).

---

## BUSINESS RULES KRITIS

1. **5 Tahap TETAP**: Saat kelas dibuat, sistem auto-generate 5 tahap SMKM→EPM→KMBM→IMMM→IMTM. Dosen TIDAK bisa tambah/hapus tahap, hanya bisa unlock berurutan.
2. **Urutan tahap**: Tahap N hanya unlock setelah Tahap N-1 unlock. Tahap 1 auto-unlock saat kelas dibuat. Dosen yang memutuskan kapan unlock tahap berikutnya.
3. **Kode kelas**: 6 karakter uppercase, unik, case-insensitive saat input mahasiswa.
4. **URL tidak divalidasi isinya** — hanya format dan domain yang dicek. Jika link private, dosen akan tahu saat buka.
5. **Draft vs Final**: Draft bisa diedit, submission final (`isDraft: false`) TIDAK BISA diubah.
6. **Nilai**: Hanya dosen kelas tersebut yang bisa memberi nilai. Tahap 3 (KMBM) pakai rubrik kolaborasi skala 1–3; Tahap 4 (IMMM) pakai rubrik esai skala 1–4. Tahap lain tanpa rubrik terstruktur.
7. **Peer Review**: Aktif di Tahap 4. Sistem assign reviewer secara acak, tidak boleh review diri sendiri.
8. **Auto-save draft**: Khusus `TEKS_LANGSUNG` (Tahap 4), auto-save tiap 30 detik (debounced). Editor menggunakan Tiptap, simpan sebagai HTML di kolom `isiEsai`.
9. **Registrasi hanya untuk mahasiswa**: Halaman `/register` hanya membuat akun MAHASISWA (nama + NIM opsional + email + kata sandi). Tidak ada pilihan role. Akun dosen TIDAK bisa dibuat lewat register — hanya admin via `/admin/dosen`.
10. **Pertemuan**: Hanya ada **2 pertemuan** per kelas. Setiap pertemuan mencakup semua 5 tahap Knows SGM dengan topik berbeda. Konten dikelompokkan berdasarkan `pertemuanKe` (1 atau 2).
11. **Ganti kata sandi**: Tersedia untuk semua role di `/[role]/akun/ganti-sandi`. Validasi: sandi lama benar, sandi baru min 8 karakter, tidak boleh sama dengan sandi lama.
12. **Role ADMIN**: Admin mengelola akun dosen (CRUD) via `/admin/dosen`. Dosen hanya mengelola mahasiswa di kelasnya. Mahasiswa register mandiri.
13. **Forum per-konten**: Tidak ada halaman forum global. Forum muncul di `KontenViewer` hanya jika item konten yang sedang ditampilkan berkategori `BERKONTRIBUSI`. Input komentar forum menggunakan Tiptap.
14. **Rubrik visible ke mahasiswa**: Di halaman submit, mahasiswa dapat melihat tabel rubrik (kriteria + deskripsi skor) secara read-only sebelum mengumpulkan — khusus Tahap 3 dan Tahap 4.

---

## KOMPONEN KRITIS

### `url-parser.ts` (`src/lib/utils/url-parser.ts`)
Mendeteksi tipe URL dan mengkonversi ke embed URL. Semua embed ditampilkan **full-width**.

| Input | Output embed |
|---|---|
| `youtube.com/watch?v=ID` | `youtube.com/embed/ID` |
| `youtu.be/ID` | `youtube.com/embed/ID` |
| GDrive `/view` atau `/edit` | `/preview` |
| GDrive PDF langsung | `/preview` (via `/preview` suffix) |
| Canva design URL | URL + `/view?embed` |
| Gambar (imgur, photos.google.com) | URL langsung di `<img>` |
| Lainnya | `null` → tampilkan link card |

### `KontenCard.tsx`
Logika render (semua embed **full-width**, bukan card kecil):
1. Coba `buildEmbedUrl(url)`
2. Jika berhasil:
   - VIDEO → `<iframe>` full-width `aspect-video`
   - DOKUMEN/TEMPLATE/INFOGRAFIS (embed) → `<iframe>` full-width `min-h-[600px]`
   - Gambar → `<img>` full-width
3. Jika gagal → render LinkCard (judul + ikon + tombol "Buka")
4. Selalu tampilkan link asli sebagai fallback di bawah embed

### `KontenViewer.tsx` — Viewer Mahasiswa
Komponen client untuk halaman tahap mahasiswa. Menampilkan konten **satu per satu** (bukan list scroll):
- State internal: `currentIndex`
- Dot navigator (klik langsung ke item tertentu)
- Tombol **Sebelumnya** / **Selanjutnya** di bawah konten
- Counter "n dari total" di sudut atas
- Item diurutkan berdasarkan `urutan` sebelum ditampilkan
- Di bawah `KontenCard`, render berdasarkan `kategori` item:
  - `LIHAT` → tidak ada tambahan
  - `SERAHKAN` → status submission + tombol "Kerjakan Tugas" / "Lihat Submission"
  - `BERKONTRIBUSI` → forum diskusi inline (ForumSection)

### `RichTextEditor.tsx`
Editor Tiptap dengan fitur:
- Bold, Italic, Underline, Heading, List, Blockquote
- **Link embed preview**: ketika user paste URL (YouTube/GDrive/PDF/foto), editor menampilkan preview embed/thumbnail inline sebelum disimpan
- Output: HTML string (disimpan ke `body` konten atau `isiEsai` submission)
- Dipakai di: form konten dosen, form esai mahasiswa (Tahap 4), input forum

### `KontenManager.tsx` — Manajemen Materi Dosen
Komponen dosen untuk mengelola konten dalam satu tahap. Terdiri dari **dua bagian**:

**Bagian 1 — Preview + Form (sudah ada, tidak berubah):**
- Kiri: daftar KontenCard full-width dengan tombol Edit/Hapus (hover)
- Kanan: form tambah/edit materi (tipe, judul, URL/Tiptap)

**Bagian 2 — Section "Urutan Materi" (BARU, di bawah Bagian 1):**
- Card/section terpisah di bawah
- Menampilkan semua materi sebagai compact list (nama + tipe badge + nomor urutan)
- Drag-and-drop **hanya di sini** untuk mengatur posisi/urutan tampil
- Saat di-drag dan di-drop, field `urutan` tiap item diperbarui otomatis
- Ini yang mengontrol urutan yang dilihat mahasiswa di `KontenViewer`

### `SubmissionForm.tsx`
Tampilan berubah berdasarkan `tipeSubmisi`:
- `LINK_*` → input URL + domain hint + preview link
- `TEKS_LANGSUNG` → **RichTextEditor** (bukan textarea) + word counter + auto-save 30 detik
- `CAMPURAN` → RichTextEditor + input URL, min 1 harus diisi

Tambahan: untuk Tahap 3 dan 4, tampilkan **RubrikPreview** (read-only) di atas form agar mahasiswa
tahu kriteria penilaian sebelum mengumpulkan.

### `ForumSection.tsx`
Komponen yang ditampilkan di halaman tahap **jika `tahap.hasForum === true`**:
- Daftar pesan threaded (MessageCard)
- Input komentar menggunakan **RichTextEditor**
- Polling 30 detik via TanStack Query `refetchInterval: 30000`
- Untuk Tahap 3: tampilkan forum per kelompok (`ForumTipe.KELOMPOK`)

---

## FASE IMPLEMENTASI

```
FASE 0 — UI First         : ✅ SELESAI — Semua halaman dengan mock data statis
FASE 1 — Fondasi          : Setup Prisma + Neon + NextAuth + Auth UI
FASE 2 — Kelas & Tahap    : CRUD Kelas, enrollment, unlock tahap, CRUD Konten
FASE 3 — Konten Viewer    : url-parser full-width, KontenCard iframe, halaman tahap
FASE 4 — Submission       : SubmissionForm semua tipe (Tiptap untuk TEKS_LANGSUNG)
FASE 5 — Asesmen          : RubrikForm, RubrikPreview mahasiswa, halaman nilai, export CSV
FASE 6 — Forum & Polish   : ForumSection per-tahap, forum kelompok, peer review, mobile
```

---

## YANG TIDAK BOLEH DIBUAT

- File upload handler (multer, formidable, dll)
- S3 / R2 / Cloudinary / storage SDK apapun
- Email verification flow (pakai manual enrollment)
- Real-time WebSocket (forum pakai polling 30 detik)
- Payment gateway
- CDN untuk media
- Halaman forum global (`/mahasiswa/forum`, `/dosen/forum`) — forum hanya per-tahap
- Tab "Bahan Bacaan"/"Lembar Kerja" — tidak diperlukan
- Field `moda` (Luring/Daring) — tidak diperlukan
- Blok metadata terstruktur di halaman pertemuan — tidak diperlukan
- Section "Informasi Umum Kelas" — tidak diperlukan

---

## CATATAN NEON + PRISMA

- Connection string dari environment variable `DATABASE_URL`
- Gunakan `@prisma/adapter-neon` untuk edge compatibility di Vercel
- Tambahkan `?sslmode=require` di connection string
- Jalankan `prisma generate` setelah setiap perubahan schema

## CATATAN NEXTAUTH v5

- Config di `auth.ts` di root (bukan `pages/api/auth`)
- Middleware di `middleware.ts` di root
- Gunakan `auth()` helper dari NextAuth untuk get session di Server Components
- JWT strategy (tidak pakai database session untuk hemat kuota Neon)
