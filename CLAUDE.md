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
- Satu-satunya "file" yang disimpan di DB = teks esai di kolom `isiEsai` (tipe TEXT)

### Layanan yang Diizinkan untuk Link
```
docs.google.com      → Google Docs / Sheets / Slides
drive.google.com     → Google Drive file/video
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

### Komponen Server vs Client
- Default: Server Component
- Tandai `"use client"` HANYA jika perlu interaktivitas browser (form, state, efek)

---

## MODEL PEDAGOGIS — KNOWS SGM (WAJIB DIPAHAMI)

Aplikasi mengimplementasikan model **Knows SGM** (Knowledge Sharing SECI + Genre-Based + Multimodal)
dari panduan dosen UNJ. Model ini mendefinisikan **5 tahap TETAP** yang auto-generate saat kelas dibuat.

### 5 Tahap TETAP (tidak bisa ditambah/hapus oleh dosen)

| No | Kode  | Nama Lengkap                                     | Fokus Pedagogis              |
|----|-------|--------------------------------------------------|------------------------------|
| 1  | SMKM  | Sharing dan Mengkonstruksi Konten Multimodal     | Eksternalisasi pengetahuan   |
| 2  | EPM   | Eksplorasi dan Penelaahan Multimodal             | Internalisasi sumber         |
| 3  | KMBM  | Kolaborasi dan Menulis Bersama Multimodal        | Kombinasi kolaboratif        |
| 4  | IMMM  | Independensi Menulis Mandiri Multimodal          | Sosialisasi → mandiri        |
| 5  | IMTM  | Integrasi dan Mempublikasikan Teks Multimodal    | Publikasi karya              |

### Tipe Submission ALAMI per Tahap

| Tahap | TipeSubmisi     | Artefak yang Dikumpulkan              |
|-------|-----------------|---------------------------------------|
| 1     | LINK_SLIDE      | Mind map / peta konsep (Canva/Slides) |
| 2     | LINK_DOKUMEN    | Ringkasan penelaahan (Google Docs)    |
| 3     | LINK_DOKUMEN    | Esai kolaboratif bersama (Google Docs)|
| 4     | TEKS_LANGSUNG   | Esai mandiri (ditulis langsung di LMS)|
| 5     | LINK_SLIDE      | Infografis / presentasi akhir         |

### Rubrik Penilaian: HANYA untuk Tahap 4 (IMMM)
Rubrik 5 aspek hanya berlaku untuk esai mandiri Tahap 4.
Tahap lain: dosen bisa beri feedback teks, tapi tidak pakai rubrik terstruktur.

### Tahap 3 — Kolaborasi Kelompok
- Mahasiswa dibagi kelompok oleh dosen (input manual, disimpan sebagai string nama anggota)
- Forum tipe `KELOMPOK` digunakan untuk diskusi per kelompok
- Submission: satu link Google Docs kondivisi per kelompok (tiap anggota submit link yang sama)

---

## DATABASE MODEL PENTING

### Tipe Konten (`KontenTipe`)
```
TEKS        → body: String (HTML), url: null
VIDEO       → url: YouTube / GDrive video link
INFOGRAFIS  → url: Canva / gambar publik
DOKUMEN     → url: Google Docs / artikel
TEMPLATE    → url: Google Docs template (mahasiswa copy)
```

### Tipe Submission (`TipeSubmisi`)
```
TEKS_LANGSUNG  → isiEsai: String (ketik langsung), dengan auto-save draft 30 detik
LINK_DOKUMEN   → linkSubmisi: Google Docs/Drive URL
LINK_VIDEO     → linkSubmisi: YouTube/GDrive video URL
LINK_SLIDE     → linkSubmisi: Canva/Google Slides URL
CAMPURAN       → isiEsai + linkSubmisi (keduanya opsional tapi min 1 harus ada)
```

### Aspek Penilaian Rubrik (`AspekNilai`) — KHUSUS TAHAP 4
```
ISI_KONTEN    → kualitas konten tulisan
ORGANISASI    → struktur dan alur
KOSAKATA      → pilihan kata
KEBAHASAAN    → tata bahasa
MEKANIK       → ejaan, tanda baca
```
Masing-masing skor 1–4. Nilai total = rata-rata × 25 (skala 100).

---

## BUSINESS RULES KRITIS

1. **5 Tahap TETAP**: Saat kelas dibuat, sistem auto-generate 5 tahap SMKM→EPM→KMBM→IMMM→IMTM. Dosen TIDAK bisa tambah/hapus tahap, hanya bisa unlock berurutan.
2. **Urutan tahap**: Tahap N hanya unlock setelah Tahap N-1 unlock. Tahap 1 auto-unlock saat kelas dibuat. Dosen yang memutuskan kapan unlock tahap berikutnya.
3. **Kode kelas**: 6 karakter uppercase, unik, case-insensitive saat input mahasiswa.
4. **URL tidak divalidasi isinya** — hanya format dan domain yang dicek. Jika link private, dosen akan tahu saat buka.
5. **Draft vs Final**: Draft bisa diedit, submission final (`isDraft: false`) TIDAK BISA diubah.
6. **Nilai**: Hanya dosen kelas tersebut yang bisa memberi nilai. Rubrik hanya untuk Tahap 4.
7. **Peer Review**: Aktif di Tahap 4. Sistem assign reviewer secara acak, tidak boleh review diri sendiri.
8. **Auto-save draft**: Khusus `TEKS_LANGSUNG` (Tahap 4), auto-save tiap 30 detik (debounced).
9. **Dosen daftarkan mahasiswa**: Bukan self-register. Dosen input email+nama, sistem generate password sementara.

---

## KOMPONEN KRITIS

### `url-parser.ts`
Mendeteksi tipe URL dan mengkonversi ke embed URL:
- YouTube `watch?v=ID` → `youtube.com/embed/ID`
- GDrive `/view` atau `/edit` → `/preview`
- Canva → tambah `/view?embed`
- Mengembalikan `null` jika tidak bisa di-embed (tampilkan link card saja)

### `KontenCard.tsx`
Logika render:
1. Coba `buildEmbedUrl(url)`
2. Jika berhasil → render `<iframe>` dengan sandbox aman
3. Jika gagal → render LinkCard (judul + ikon + tombol "Buka")
4. Selalu tampilkan link asli sebagai fallback di bawah iframe

### `SubmissionForm.tsx`
Tampilan berubah berdasarkan `tipeSubmisi` tugas. Lihat spesifikasi lengkap di dokumen asli.

---

## FASE IMPLEMENTASI

```
FASE 0 — UI First         : Semua halaman dengan mock data statis (validasi visual dulu)
FASE 1 — Fondasi          : Setup Next.js + Prisma + Neon + NextAuth + Auth UI
FASE 2 — Kelas & Tahap    : CRUD Kelas, enrollment, unlock tahap, CRUD Konten
FASE 3 — Konten Viewer    : url-parser, KontenCard iframe, halaman tahap mahasiswa
FASE 4 — Submission       : SubmissionForm semua tipe, PanduanSubmisi, auto-save
FASE 5 — Asesmen          : RubrikForm, halaman nilai, export CSV
FASE 6 — Forum & Polish   : Forum threaded, peer review, mobile responsive, toast
```

---

## YANG TIDAK BOLEH DIBUAT

- File upload handler (multer, formidable, dll)
- S3 / R2 / Cloudinary / storage SDK apapun
- Email verification flow (pakai manual enrollment)
- Real-time WebSocket (forum pakai polling 30 detik)
- Payment gateway
- CDN untuk media

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
