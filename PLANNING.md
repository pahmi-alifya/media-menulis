# PLANNING.md — Rencana Implementasi Media Menulis LMS

Dokumen ini adalah rencana implementasi teknis yang detail.
Update status setiap fase selesai.

---

## STATUS SAAT INI

- [x] CLAUDE.md & PLANNING.md dibuat dan diperbarui
- [x] FASE 0 — UI First (Mock Data) — selesai
- [x] FASE 1 — Fondasi — selesai
- [x] FASE 2 — Kelas & Tahap — selesai
- [ ] FASE 3 — Konten Viewer
- [ ] FASE 4 — Submission
- [ ] FASE 5 — Asesmen
- [ ] FASE 6 — Forum & Polish

---

## KOREKSI PENTING DARI PDF (Model Knows SGM)

Baca sebelum mulai koding apapun:

1. **5 Tahap adalah TETAP** — Dosen TIDAK bisa buat tahap sendiri.
   - Tahap 1: SMKM (Sharing dan Mengkonstruksi Konten Multimodal)
   - Tahap 2: EPM (Eksplorasi dan Penelaahan Multimodal)
   - Tahap 3: KMBM (Kolaborasi dan Menulis Bersama Multimodal)
   - Tahap 4: IMMM (Independensi Menulis Mandiri Multimodal) ← esai mandiri + Tiptap
   - Tahap 5: IMTM (Integrasi dan Mempublikasikan Teks Multimodal)

2. **Rubrik per tahap:**
   - Tahap 3 (KMBM): rubrik kolaborasi 2 aspek, skala 1–3
   - Tahap 4 (IMMM): rubrik esai 5 aspek, skala 1–4
   - Tahap lain: tidak ada rubrik terstruktur

3. **Tahap 3 adalah kerja kelompok** — Dosen bentuk kelompok, satu link Google Docs bersama per kelompok.

4. **Submission per tahap sudah ditentukan**:
   - Tahap 1 → LINK_SLIDE (mind map)
   - Tahap 2 → LINK_DOKUMEN (ringkasan penelaahan)
   - Tahap 3 → LINK_DOKUMEN (esai kolaboratif)
   - Tahap 4 → TEKS_LANGSUNG (esai mandiri via Tiptap)
   - Tahap 5 → LINK_SLIDE (infografis/presentasi)

---

## FASE 0 — UI First ✅ SELESAI

Semua halaman dan komponen sudah dibuat dengan mock data statis.
Tipe data dan data contoh ada di `src/lib/mock/data.ts`.

### Halaman yang sudah dibangun

| Halaman | Route |
|---|---|
| Login | `/login` |
| Register (mahasiswa) | `/register` |
| Dashboard Dosen | `/dosen/dashboard` |
| Daftar Mahasiswa | `/dosen/mahasiswa` |
| Daftar Tahap per Pertemuan (Dosen) | `/dosen/pertemuan/[pertemuanKe]` |
| Detail Tahap Dosen (KontenManager) | `/dosen/pertemuan/[pertemuanKe]/tahap/[tahapId]` |
| Daftar Submissions | `/dosen/pertemuan/[pertemuanKe]/tahap/[tahapId]/submissions` |
| Detail Submission + RubrikForm | `/dosen/pertemuan/[pertemuanKe]/tahap/[tahapId]/submissions/[subId]` |
| Kelola Akun Dosen (Admin) | `/admin/dosen` |
| Ganti Kata Sandi | `/dosen/akun/ganti-sandi`, `/mahasiswa/akun/ganti-sandi` |
| Dashboard Mahasiswa | `/mahasiswa/dashboard` |
| Daftar Tahap per Pertemuan (Mahasiswa) | `/mahasiswa/pertemuan/[pertemuanKe]` |
| Detail Tahap Mahasiswa (konten + info tugas) | `/mahasiswa/pertemuan/[pertemuanKe]/tahap/[tahapId]` |
| Submit Tugas | `/mahasiswa/pertemuan/[pertemuanKe]/tahap/[tahapId]/submit` |
| Nilai Mahasiswa | `/mahasiswa/pertemuan/[pertemuanKe]/tahap/[tahapId]/nilai` |

> **Catatan**: Halaman `/mahasiswa/forum` dan `/dosen/forum` (global) **dihapus dari scope**.
> Forum akan diimplementasikan per-tahap di Fase 6 (lihat keterangan di bawah).

### Komponen yang sudah dibangun
- `KontenCard.tsx`, `KontenManager.tsx`, `RichTextEditor.tsx`
- `TahapStepper.tsx`, `TahapKelasPanel.tsx`
- `SubmissionForm.tsx`, `PanduanSubmisi.tsx`
- `RubrikForm.tsx` (Tahap 4), `RubrikKolaborasiForm.tsx` (Tahap 3)
- `MahasiswaList.tsx`, `DosenList.tsx`, `GantiSandiForm.tsx`
- `MessageCard.tsx` (akan diintegrasikan ke `ForumSection.tsx` di Fase 6)
- shadcn/ui components: Button, Card, Badge, Dialog, Input, Textarea, Select, dll.

---

## FASE 1 — Fondasi

### 1.1 Install Dependencies Tambahan
```bash
# Database & ORM
npm install prisma @prisma/client @prisma/adapter-neon @neondatabase/serverless

# Auth
npm install next-auth@beta @auth/prisma-adapter

# Utilities
npm install bcryptjs
npm install -D @types/bcryptjs
```

### 1.2 File Konfigurasi Root
- `prisma/schema.prisma` — schema lengkap (lihat 1.3)
- `auth.ts` — NextAuth v5 config
- `middleware.ts` — route protection per role
- `.env.local` — DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
- `src/lib/prisma.ts` — prisma client singleton

### 1.3 Schema Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  DOSEN
  MAHASISWA
}

enum TahapKode {
  SMKM
  EPM
  KMBM
  IMMM
  IMTM
}

enum KontenTipe {
  TEKS
  VIDEO
  INFOGRAFIS
  DOKUMEN
  TEMPLATE
}

enum KategoriKonten {
  LIHAT          // hanya tampil materi
  SERAHKAN       // materi + submission section
  BERKONTRIBUSI  // materi + forum diskusi
}

enum TipeSubmisi {
  TEKS_LANGSUNG
  LINK_DOKUMEN
  LINK_VIDEO
  LINK_SLIDE
  CAMPURAN
}

enum AspekNilai {
  ISI_KONTEN
  ORGANISASI
  KOSAKATA
  KEBAHASAAN
  MEKANIK
}

enum AspekKolaborasi {
  MENULIS_KOLABORASI
  UMPAN_BALIK_KOLABORASI
}

enum ForumTipe {
  KELAS
  KELOMPOK
}

model User {
  id                  String       @id @default(cuid())
  nama                String
  email               String       @unique
  password            String
  role                Role
  nim                 String?
  createdAt           DateTime     @default(now())
  kelasDiajar         Kelas[]
  enrollments         Enrollment[]
  submissions         Submission[]
  pesanForum          PesanForum[]
  peerReviewDiberi    PeerReview[] @relation("reviewer")
  peerReviewDiterima  PeerReview[] @relation("reviewee")
}

model Kelas {
  id          String       @id @default(cuid())
  nama        String
  deskripsi   String?
  kode        String       @unique
  dosenId     String
  dosen       User         @relation(fields: [dosenId], references: [id])
  createdAt   DateTime     @default(now())
  tahaps      Tahap[]
  enrollments Enrollment[]
  forums      Forum[]
}

model Tahap {
  id          String      @id @default(cuid())
  kelasId     String
  kelas       Kelas       @relation(fields: [kelasId], references: [id])
  urutan      Int         // 1–5
  kode        TahapKode
  tipeSubmisi TipeSubmisi
  isUnlocked  Boolean     @default(false)
  unlockedAt  DateTime?
  konten      Konten[]
  submissions Submission[]
  forums      Forum[]     @relation("TahapForums")

  @@unique([kelasId, urutan])
  @@unique([kelasId, kode])
}

model Konten {
  id          String     @id @default(cuid())
  tahapId     String
  tahap       Tahap      @relation(fields: [tahapId], references: [id])
  tipe        KontenTipe
  judul       String
  body        String?    // hanya untuk tipe TEKS (HTML dari RichTextEditor/Tiptap)
  url         String?    // untuk semua tipe kecuali TEKS
  urutan      Int
  pertemuanKe Int             @default(1)  // 1 atau 2
  kategori    KategoriKonten  @default(LIHAT)
}

model Enrollment {
  id        String   @id @default(cuid())
  kelasId   String
  kelas     Kelas    @relation(fields: [kelasId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  nim       String?
  joinedAt  DateTime @default(now())
  kelompok  String?  // nama kelompok untuk Tahap 3

  @@unique([kelasId, userId])
}

model Submission {
  id          String       @id @default(cuid())
  tahapId     String
  tahap       Tahap        @relation(fields: [tahapId], references: [id])
  userId      String
  user        User         @relation(fields: [userId], references: [id])
  isDraft     Boolean      @default(true)
  submittedAt DateTime?
  isiEsai     String?      // TEKS_LANGSUNG — HTML dari Tiptap
  linkSubmisi String?      // LINK_*
  nilaiTotal  Float?
  nilaiAspeks NilaiAspek[]
  peerReviews PeerReview[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@unique([tahapId, userId])
}

model NilaiAspek {
  id           String         @id @default(cuid())
  submissionId String
  submission   Submission     @relation(fields: [submissionId], references: [id])
  aspek        AspekNilai
  skor         Int            // 1–4
  komentar     String?

  @@unique([submissionId, aspek])
}

model NilaiKolaborasi {
  id           String          @id @default(cuid())
  submissionId String
  submission   Submission      @relation(fields: [submissionId], references: [id])
  aspek        AspekKolaborasi
  skor         Int             // 1–3
  komentar     String?

  @@unique([submissionId, aspek])
}

model PeerReview {
  id             String     @id @default(cuid())
  submissionId   String
  submission     Submission @relation(fields: [submissionId], references: [id])
  reviewerId     String
  reviewer       User       @relation("reviewer", fields: [reviewerId], references: [id])
  revieweeId     String
  reviewee       User       @relation("reviewee", fields: [revieweeId], references: [id])
  komentar       String?
  createdAt      DateTime   @default(now())
}

model Forum {
  id           String       @id @default(cuid())
  kelasId      String
  kelas        Kelas        @relation(fields: [kelasId], references: [id])
  tahapId      String?
  tahap        Tahap?       @relation("TahapForums", fields: [tahapId], references: [id])
  tipe         ForumTipe    @default(KELAS)
  namaKelompok String?      // hanya untuk KELOMPOK
  pesans       PesanForum[]
}

model PesanForum {
  id        String       @id @default(cuid())
  forumId   String
  forum     Forum        @relation(fields: [forumId], references: [id])
  userId    String
  user      User         @relation(fields: [userId], references: [id])
  isi       String       // HTML dari Tiptap (mendukung embed preview)
  replyToId String?
  replyTo   PesanForum?  @relation("Replies", fields: [replyToId], references: [id])
  replies   PesanForum[] @relation("Replies")
  createdAt DateTime     @default(now())
}
```

### 1.4 Auth Setup

**Login** (`/login`):
- Form: email + password
- Server Action: validasi → `signIn()` NextAuth
- Redirect ke `/dosen/dashboard` atau `/mahasiswa/dashboard` sesuai role

**Register** (`/register`) — khusus mahasiswa:
- Form: nama, NIM (opsional), email, kata sandi, konfirmasi kata sandi
- Server Action `registerMahasiswa()`: hash password bcrypt → `prisma.user.create({ role: "MAHASISWA" })`
- Auto-login setelah register → redirect ke `/mahasiswa/dashboard`

**Ganti Kata Sandi** (`/[role]/akun/ganti-sandi`):
- Server Action `changePassword()`: verifikasi sandi lama → hash sandi baru → update

### 1.5 Middleware Route Protection
```typescript
// middleware.ts
// /dosen/* → hanya DOSEN
// /mahasiswa/* → hanya MAHASISWA
// /admin/* → hanya ADMIN
// /login, /register → redirect ke dashboard jika sudah login
```

---

## FASE 2 — Kelas & Tahap

### 2.1 Buat Kelas (Dosen)
- Form: nama kelas, deskripsi
- Server Action `createKelas()`:
  - Generate kode 6 karakter random uppercase unik
  - `prisma.kelas.create()`
  - Auto-generate 5 tahap TETAP:
    ```typescript
    const TAHAP_DEFINITIONS = [
      { urutan: 1, kode: "SMKM", tipeSubmisi: "LINK_SLIDE",   isUnlocked: true,  hasForum: false },
      { urutan: 2, kode: "EPM",  tipeSubmisi: "LINK_DOKUMEN", isUnlocked: false, hasForum: false },
      { urutan: 3, kode: "KMBM", tipeSubmisi: "LINK_DOKUMEN", isUnlocked: false, hasForum: true  },
      { urutan: 4, kode: "IMMM", tipeSubmisi: "TEKS_LANGSUNG",isUnlocked: false, hasForum: false },
      { urutan: 5, kode: "IMTM", tipeSubmisi: "LINK_SLIDE",   isUnlocked: false, hasForum: false },
    ]
    ```
  - Buat Forum tipe KELAS untuk kelas ini (untuk dipakai sebagai forum KELOMPOK Tahap 3 nanti)

### 2.2 Kelola Akun Dosen — Admin Only (`/admin/dosen`)
- Full CRUD: tambah, edit, hapus, reset sandi
- Server Actions: `createDosenAccount()`, `updateDosenAccount()`, `deleteDosenAccount()`, `resetPassword()`

### 2.3 Enrollment Mahasiswa
- **Dosen daftarkan**: form nama + NIM + email, tampilkan password sementara sekali
- **Mahasiswa join via kode**: Server Action `joinKelas()` — cari kelas by kode uppercase

### 2.4 Unlock Tahap
- Server Action `unlockTahap()`: validasi urutan → `prisma.tahap.update({ isUnlocked: true })`

### 2.5 CRUD Konten

**`KontenManager.tsx`** terdiri dari dua bagian:

**Bagian 1 — Preview + Form** (layout grid, sudah ada di Fase 0):
- Kiri: daftar KontenCard full-width + tombol Edit/Hapus (hover)
- Kanan: form tambah/edit (pertemuan, tipe, judul, URL atau RichTextEditor)
- Server Actions: `createKonten()`, `updateKonten()`, `deleteKonten()`

**Bagian 2 — Section "Urutan Materi"** (card baru di bawah Bagian 1, BARU):
- Compact list semua materi: nomor urut + nama + badge tipe
- Drag-and-drop **hanya di section ini** untuk mengatur posisi tampil ke mahasiswa
- Saat drop selesai → re-number `urutan` dan panggil Server Action `reorderKonten(ids[])`
- Urutan ini yang dipakai `KontenViewer` mahasiswa saat navigasi Sebelumnya/Selanjutnya

---

## FASE 3 — Konten Viewer

### 3.1 `url-parser.ts` (`src/lib/utils/url-parser.ts`)
Fungsi:
- `detectUrlType(url: string): UrlType`
- `buildEmbedUrl(url: string): string | null`
- `isImageUrl(url: string): boolean`

Konversi (semua embed full-width):
```
YouTube watch?v=ID   → youtube.com/embed/ID
youtu.be/ID          → youtube.com/embed/ID
GDrive /view|/edit   → /preview
GDrive PDF langsung  → tambah /preview
Canva design URL     → URL + /view?embed
photos.google.com    → URL langsung (img tag)
imgur.com            → URL langsung (img tag)
Lainnya              → null (tampilkan link card)
```

### 3.2 `KontenCard.tsx` (full-width)
- Tidak ada card dengan aspek rasio tetap — semua embed mengisi lebar penuh container
- VIDEO (`aspect-video`) → `<iframe>` embed YouTube/GDrive full-width
- DOKUMEN/TEMPLATE (`min-h-[600px]`) → `<iframe>` embed GDrive/Docs full-width
- INFOGRAFIS → `<img>` full-width jika gambar langsung, atau `<iframe>` jika Canva
- TEKS → `dangerouslySetInnerHTML` dengan DOMPurify sanitasi
- Fallback: `<a>` tombol "Buka [tipe]" jika tidak bisa di-embed
- iframe sandbox: `"allow-scripts allow-same-origin allow-popups allow-forms"`

### 3.3 Halaman Tahap Mahasiswa
- Redirect ke dashboard jika `tahap.isUnlocked === false`
- TahapStepper visual di atas (progress 1–5)
- **`KontenViewer`** — tampilkan konten satu per satu (bukan list scroll):
  - Item diurutkan berdasarkan `urutan` (sesuai yang diset dosen di section "Urutan Materi")
  - Dot navigator + counter "n dari total"
  - Tombol **Sebelumnya** / **Selanjutnya** di bawah konten
- Info tugas (tipe submission + status mahasiswa) + tombol "Kerjakan Tugas"
- Jika `tahap.hasForum === true`: tampilkan `<ForumSection>` di bawah konten

---

## FASE 4 — Submission

### 4.1 `SubmissionForm.tsx` (update dari Phase 0)

**LINK_SLIDE / LINK_DOKUMEN / LINK_VIDEO**:
- Input URL dengan validasi domain sesuai tipe
- Preview link setelah input valid
- Tombol "Kumpulkan" + AlertDialog konfirmasi

**TEKS_LANGSUNG** (Tahap 4):
- **Gunakan `RichTextEditor` (Tiptap)** — bukan `<Textarea>` biasa
- Word counter (hitung teks, bukan HTML tags)
- Auto-save draft 30 detik (debounced) — simpan HTML ke `isiEsai`
- Tombol "Simpan Draft" manual + tombol "Kumpulkan"
- Setelah submit: read-only view + badge "Terkumpul"

**CAMPURAN**:
- RichTextEditor untuk esai (opsional) + input URL (opsional), min 1 harus diisi

### 4.2 RubrikPreview (read-only) di halaman submit
Untuk Tahap 3 (KMBM) dan Tahap 4 (IMMM), tampilkan tabel rubrik read-only di atas form:
- KMBM: 2 aspek kolaborasi, skala 1–3, dengan deskripsi per skor
- IMMM: 5 aspek esai, skala 1–4, dengan deskripsi per skor
- Komponen: `RubrikPreview.tsx` — hanya menampilkan, tidak interaktif

### 4.3 `PanduanSubmisi.tsx`
Tetap sebagai accordion per tipe — langkah-langkah cara submit. Tidak ada perubahan.

---

## FASE 5 — Asesmen

### 5.1 Form Penilaian (Dosen)

**`RubrikForm.tsx`** (Tahap 4 — IMMM):
- Render HTML esai mahasiswa (dari Tiptap) dengan sanitasi DOMPurify
- Form: 5 aspek (`AspekNilai`), tombol 1–4 + deskripsi skor + textarea komentar
- Nilai total kalkulasi otomatis: rata-rata × 25
- Server Action `nilaiSubmission()`: simpan `NilaiAspek[]` + update `Submission.nilaiTotal`

**`RubrikKolaborasiForm.tsx`** (Tahap 3 — KMBM):
- Tampilkan link Google Docs kolaboratif
- Form: 2 aspek (`AspekKolaborasi`), tombol 1–3 + deskripsi + textarea komentar
- Nilai total = rata-rata / 3 × 100
- Server Action `nilaiSubmissionKolaborasi()`: simpan `NilaiKolaborasi[]` + update `Submission.nilaiTotal`

### 5.2 Halaman Nilai Mahasiswa
- Tampilkan setelah `submission.nilaiTotal !== null`
- Tabel aspek + skor + komentar dosen per aspek
- Total nilai final + badge predikat

### 5.3 Export CSV
- Route Handler `/api/kelas/[kelasId]/export-nilai`
- Format: Nama | NIM | Email | Tahap | Nilai Total | per-Aspek
- `Content-Disposition: attachment; filename="nilai-[namaKelas].csv"`

---

## FASE 6 — Forum & Polish

### 6.1 `ForumSection.tsx` — Forum Per-Tahap

**Tidak ada halaman forum global.** Forum hanya muncul di halaman tahap jika `tahap.hasForum === true`.

Struktur komponen:
```
ForumSection
├── ForumHeader (judul + info kelompok jika KELOMPOK)
├── ThreadList
│   └── MessageCard (avatar, nama, badge Dosen, timestamp, isi HTML)
│       └── MessageCard (nested reply, 1 level)
└── ReplyForm
    └── RichTextEditor (Tiptap) — input komentar
    └── Tombol "Kirim"
```

**Untuk Tahap 3 (KMBM)**: tampilkan forum per kelompok. Mahasiswa hanya melihat forum kelompoknya sendiri (filter by `enrollment.kelompok`).

**Polling**: `TanStack Query` dengan `refetchInterval: 30000` (30 detik).

**Server Actions**:
- `sendPesan(forumId, isi, replyToId?)` — simpan `PesanForum` dengan isi HTML Tiptap
- `getPesanList(forumId)` — query pesan berurut waktu dengan nested replies

### 6.2 Peer Review (Tahap 4)
- Dosen aktifkan peer review setelah deadline
- Server Action `assignPeerReview()` — assign random, tidak boleh self-review
- Mahasiswa lihat tugas review di halaman Tahap 4
- Form review: komentar teks + submit
- Mahasiswa lihat semua review yang diterima di halaman nilai

### 6.3 Mobile Responsive
- Semua halaman berfungsi di layar 375px (iPhone SE)
- Sidebar dosen: hamburger menu di mobile
- TahapStepper: horizontal scroll di mobile

### 6.4 Polish
- Semua loading state → Skeleton (sudah ada komponen)
- Semua error state → pesan ramah + tombol retry
- Toast `sonner` untuk semua aksi berhasil/gagal
- Sanitasi HTML output Tiptap dengan `DOMPurify` sebelum `dangerouslySetInnerHTML`

---

## CATATAN KEPUTUSAN TEKNIS

### Kenapa JWT bukan Database Session untuk NextAuth?
Neon free tier hanya 0.5GB. Database session menambah tabel `Session` yang terisi cepat.
JWT disimpan di cookie sisi client, lebih hemat kuota.

### Kenapa Polling bukan WebSocket untuk Forum?
Vercel free tier tidak support WebSocket persistent. Polling 30 detik cukup untuk forum diskusi kuliah.

### Kenapa Tahap TETAP 5?
Model pedagogis Knows SGM dari panduan UNJ mendefinisikan 5 tahap terstruktur. Fleksibilitas akan merusak integritas pedagogi.

### Kenapa tidak ada model Kelompok tersendiri?
Tahap 3 menggunakan `Enrollment.kelompok` (string nama kelompok) dan Forum tipe `KELOMPOK`.
Tidak perlu model terpisah untuk scope ini.

### Kenapa Forum tidak global?
Berdasarkan referensi LMS kampus, forum hanya relevan dalam konteks konten/tahap tertentu
(kategori "Berkontribusi"). Forum global mengakibatkan diskusi tanpa konteks dan sulit dipantau.
`tahap.hasForum` memberi fleksibilitas kepada dosen untuk mengaktifkan forum hanya di tahap yang relevan.

### Kenapa TEKS_LANGSUNG pakai Tiptap?
Plain `<textarea>` tidak mendukung formatting (bold, heading, list) yang dibutuhkan untuk esai akademik.
Tiptap sudah terpasang di project (dipakai untuk konten TEKS dosen), sehingga tidak menambah dependency baru.
Output HTML disimpan di kolom `isiEsai` dan di-render kembali dengan sanitasi DOMPurify.

### Kenapa KontenCard full-width?
Referensi LMS kampus menampilkan konten (PDF, dokumen, video) full-width agar mudah dibaca.
Card kecil dengan `aspect-[4/3]` membuat dokumen terlalu kecil untuk dibaca nyaman.

---

## ENV VARIABLES YANG DIBUTUHKAN

```env
# .env.local
DATABASE_URL="postgresql://..."     # Neon connection string dengan ?sslmode=require
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-32-chars"
```

Production (Vercel env):
```
DATABASE_URL   → dari Neon dashboard
NEXTAUTH_URL   → https://media-menulis.vercel.app
NEXTAUTH_SECRET → random string kuat
```
