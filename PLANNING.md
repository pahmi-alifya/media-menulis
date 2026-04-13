# PLANNING.md — Rencana Implementasi Media Menulis LMS

Dokumen ini adalah rencana implementasi teknis yang detail.
Update status setiap fase selesai.

---

## STATUS SAAT INI

- [x] CLAUDE.md & PLANNING.md dibuat
- [x] CLAUDE.md diperbarui sesuai model pedagogis Knows SGM (PDF)
- [ ] FASE 0 — UI First (Mock Data)
- [ ] FASE 1 — Fondasi
- [ ] FASE 2 — Kelas & Tahap
- [ ] FASE 3 — Konten Viewer
- [ ] FASE 4 — Submission
- [ ] FASE 5 — Asesmen
- [ ] FASE 6 — Forum & Polish

---

## KOREKSI PENTING DARI PDF (Model Knows SGM)

Baca sebelum mulai koding apapun:

1. **5 Tahap adalah TETAP** — Dosen TIDAK bisa buat tahap sendiri.
   Saat kelas dibuat, sistem auto-generate 5 tahap ini:
   - Tahap 1: SMKM (Sharing dan Mengkonstruksi Konten Multimodal)
   - Tahap 2: EPM (Eksplorasi dan Penelaahan Multimodal)
   - Tahap 3: KMBM (Kolaborasi dan Menulis Bersama Multimodal)
   - Tahap 4: IMMM (Independensi Menulis Mandiri Multimodal) ← esai mandiri
   - Tahap 5: IMTM (Integrasi dan Mempublikasikan Teks Multimodal)

2. **Rubrik 5 aspek HANYA untuk Tahap 4 (IMMM)**
   Tahap lain tidak dinilai dengan rubrik terstruktur.

3. **Tahap 3 adalah kerja kelompok** — Dosen bentuk kelompok, mahasiswa submit
   link Google Docs bersama (satu link yang sama untuk semua anggota kelompok).

4. **Submission per tahap sudah ditentukan**:
   - Tahap 1 → LINK_SLIDE (mind map)
   - Tahap 2 → LINK_DOKUMEN (ringkasan penelaahan)
   - Tahap 3 → LINK_DOKUMEN (esai kolaboratif)
   - Tahap 4 → TEKS_LANGSUNG (esai mandiri di LMS)
   - Tahap 5 → LINK_SLIDE (infografis/presentasi)

---

## FASE 0 — UI First (dengan Mock Data)

> **Tujuan**: Selesaikan semua halaman & komponen dengan data statis terlebih dahulu.
> Validasi tampilan ke pihak yang memberi tugas SEBELUM menyambung ke backend nyata.
> Pola: import mock data → render UI → setelah disetujui, swap dengan real API call.

### 0.1 Struktur Mock Data

Buat file `src/lib/mock/data.ts` berisi semua data statis:

```typescript
// src/lib/mock/data.ts

export type Role = "DOSEN" | "MAHASISWA"

export type TahapKode = "SMKM" | "EPM" | "KMBM" | "IMMM" | "IMTM"

export type TipeSubmisi =
  | "LINK_SLIDE"
  | "LINK_DOKUMEN"
  | "LINK_VIDEO"
  | "TEKS_LANGSUNG"
  | "CAMPURAN"

export type KontenTipe = "TEKS" | "VIDEO" | "INFOGRAFIS" | "DOKUMEN" | "TEMPLATE"

export type AspekNilai =
  | "ISI_KONTEN"
  | "ORGANISASI"
  | "KOSAKATA"
  | "KEBAHASAAN"
  | "MEKANIK"

// ---- Users ----
export interface MockUser {
  id: string
  nama: string
  email: string
  role: Role
}

export const mockDosen: MockUser = {
  id: "u1",
  nama: "Dr. Rina Rosdiana, M.Pd.",
  email: "rina@unj.ac.id",
  role: "DOSEN",
}

export const mockMahasiswa: MockUser[] = [
  { id: "u2", nama: "Ahmad Fauzi", email: "ahmad@mhs.unj.ac.id", role: "MAHASISWA" },
  { id: "u3", nama: "Budi Santoso", email: "budi@mhs.unj.ac.id", role: "MAHASISWA" },
  { id: "u4", nama: "Citra Lestari", email: "citra@mhs.unj.ac.id", role: "MAHASISWA" },
  { id: "u5", nama: "Dian Permata", email: "dian@mhs.unj.ac.id", role: "MAHASISWA" },
]

// ---- Kelas ----
export interface MockKelas {
  id: string
  nama: string
  deskripsi: string
  kode: string
  jumlahMahasiswa: number
  createdAt: string
}

export const mockKelasList: MockKelas[] = [
  {
    id: "k1",
    nama: "Menulis Esai Ilmiah 2026 A",
    deskripsi: "Kelas menulis esai berbasis model Knows SGM untuk semester genap 2026.",
    kode: "MEI26A",
    jumlahMahasiswa: 28,
    createdAt: "2026-02-10",
  },
  {
    id: "k2",
    nama: "Menulis Esai Ilmiah 2026 B",
    deskripsi: "Kelas menulis esai berbasis model Knows SGM untuk semester genap 2026.",
    kode: "MEI26B",
    jumlahMahasiswa: 25,
    createdAt: "2026-02-10",
  },
]

// ---- Tahap (5 TETAP) ----
export interface MockTahap {
  id: string
  kelasId: string
  urutan: number
  kode: TahapKode
  nama: string
  deskripsi: string
  tujuan: string
  tipeSubmisi: TipeSubmisi
  isUnlocked: boolean
  unlockedAt: string | null
}

export const mockTahapList: MockTahap[] = [
  {
    id: "t1",
    kelasId: "k1",
    urutan: 1,
    kode: "SMKM",
    nama: "Sharing dan Mengkonstruksi Konten Multimodal",
    deskripsi:
      "Mahasiswa berbagi pengetahuan awal dan mengkonstruksi pemahaman bersama melalui konten multimodal.",
    tujuan: "Mengaktifkan pengetahuan awal dan mendorong eksternalisasi ide.",
    tipeSubmisi: "LINK_SLIDE",
    isUnlocked: true,
    unlockedAt: "2026-02-15",
  },
  {
    id: "t2",
    kelasId: "k1",
    urutan: 2,
    kode: "EPM",
    nama: "Eksplorasi dan Penelaahan Multimodal",
    deskripsi:
      "Mahasiswa menelaah berbagai sumber multimodal dan merangkum temuan secara kritis.",
    tujuan: "Internalisasi sumber melalui eksplorasi mandiri dan telaah kritis.",
    tipeSubmisi: "LINK_DOKUMEN",
    isUnlocked: true,
    unlockedAt: "2026-02-22",
  },
  {
    id: "t3",
    kelasId: "k1",
    urutan: 3,
    kode: "KMBM",
    nama: "Kolaborasi dan Menulis Bersama Multimodal",
    deskripsi:
      "Mahasiswa bekerja dalam kelompok untuk menyusun esai bersama menggunakan Google Docs.",
    tujuan: "Kombinasi ide melalui kolaborasi kelompok dan ko-konstruksi teks.",
    tipeSubmisi: "LINK_DOKUMEN",
    isUnlocked: true,
    unlockedAt: "2026-03-01",
  },
  {
    id: "t4",
    kelasId: "k1",
    urutan: 4,
    kode: "IMMM",
    nama: "Independensi Menulis Mandiri Multimodal",
    deskripsi:
      "Mahasiswa menulis esai mandiri secara langsung di platform berdasarkan pembelajaran sebelumnya.",
    tujuan: "Sosialisasi pengetahuan menjadi karya tulis mandiri yang dinilai dengan rubrik.",
    tipeSubmisi: "TEKS_LANGSUNG",
    isUnlocked: false,
    unlockedAt: null,
  },
  {
    id: "t5",
    kelasId: "k1",
    urutan: 5,
    kode: "IMTM",
    nama: "Integrasi dan Mempublikasikan Teks Multimodal",
    deskripsi:
      "Mahasiswa mengintegrasikan karya dan mempublikasikannya dalam bentuk infografis atau presentasi.",
    tujuan: "Publikasi karya sebagai bentuk sosialisasi dan refleksi akhir.",
    tipeSubmisi: "LINK_SLIDE",
    isUnlocked: false,
    unlockedAt: null,
  },
]

// ---- Konten ----
export interface MockKonten {
  id: string
  tahapId: string
  tipe: KontenTipe
  judul: string
  body: string | null
  url: string | null
  urutan: number
}

export const mockKontenList: MockKonten[] = [
  {
    id: "c1",
    tahapId: "t1",
    tipe: "VIDEO",
    judul: "Pengantar Esai Ilmiah — Apa dan Mengapa?",
    body: null,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    urutan: 1,
  },
  {
    id: "c2",
    tahapId: "t1",
    tipe: "INFOGRAFIS",
    judul: "Struktur Esai Ilmiah (Infografis)",
    body: null,
    url: "https://www.canva.com/design/DAFxxxxx/view",
    urutan: 2,
  },
  {
    id: "c3",
    tahapId: "t1",
    tipe: "TEKS",
    judul: "Panduan Membuat Mind Map Awal",
    body: "<p>Buat mind map yang menggambarkan pengetahuan awal Anda tentang topik esai. Gunakan <strong>Canva</strong> atau <strong>Google Slides</strong>, lalu paste link-nya saat submit.</p>",
    url: null,
    urutan: 3,
  },
]

// ---- Submission ----
export interface MockSubmission {
  id: string
  tahapId: string
  userId: string
  isDraft: boolean
  submittedAt: string | null
  isiEsai: string | null
  linkSubmisi: string | null
  nilaiTotal: number | null
  savedAt: string | null
}

export const mockSubmissionList: MockSubmission[] = [
  {
    id: "s1",
    tahapId: "t1",
    userId: "u2",
    isDraft: false,
    submittedAt: "2026-02-18 14:30",
    isiEsai: null,
    linkSubmisi: "https://www.canva.com/design/DAFahmad/view",
    nilaiTotal: null,
    savedAt: null,
  },
  {
    id: "s2",
    tahapId: "t4",
    userId: "u2",
    isDraft: true,
    submittedAt: null,
    isiEsai:
      "Esai ini membahas fenomena literasi digital di kalangan mahasiswa Indonesia. Pada era modern ini, kemampuan membaca dan menulis tidak lagi terbatas pada media cetak...",
    linkSubmisi: null,
    nilaiTotal: null,
    savedAt: "2026-04-13 09:15",
  },
]

// ---- Nilai Aspek ----
export interface MockNilaiAspek {
  aspek: AspekNilai
  skor: 1 | 2 | 3 | 4
  komentar: string
}

export const mockNilaiAspekList: MockNilaiAspek[] = [
  { aspek: "ISI_KONTEN", skor: 4, komentar: "Gagasan sangat kuat dan relevan dengan topik." },
  { aspek: "ORGANISASI", skor: 3, komentar: "Struktur baik, namun transisi antar paragraf perlu diperkuat." },
  { aspek: "KOSAKATA", skor: 4, komentar: "Pilihan kata akademis dan tepat sasaran." },
  { aspek: "KEBAHASAAN", skor: 3, komentar: "Tata bahasa umumnya benar, ada beberapa kalimat majemuk yang rancu." },
  { aspek: "MEKANIK", skor: 4, komentar: "Ejaan dan tanda baca konsisten." },
]

// ---- Forum ----
export interface MockPesan {
  id: string
  forumId: string
  userId: string
  namaPengirim: string
  isi: string
  createdAt: string
  replyTo: string | null
}

export const mockPesanList: MockPesan[] = [
  {
    id: "m1",
    forumId: "f1",
    userId: "u2",
    namaPengirim: "Ahmad Fauzi",
    isi: "Bu, boleh saya bertanya tentang batas minimal kata untuk esai di Tahap 4?",
    createdAt: "2026-04-10 10:05",
    replyTo: null,
  },
  {
    id: "m2",
    forumId: "f1",
    userId: "u1",
    namaPengirim: "Dr. Rina Rosdiana",
    isi: "Boleh Ahmad. Minimal 800 kata ya, dan harus ada referensi minimal 3 sumber akademik.",
    createdAt: "2026-04-10 10:45",
    replyTo: "m1",
  },
  {
    id: "m3",
    forumId: "f1",
    userId: "u3",
    namaPengirim: "Budi Santoso",
    isi: "Kalau sumber dari jurnal online apakah boleh Bu?",
    createdAt: "2026-04-10 11:00",
    replyTo: null,
  },
]
```

### 0.2 Urutan Build UI (Prioritas Tertinggi ke Terendah)

```
Prioritas 1 — Layout & Navigasi
  ✦ Root layout dengan sidebar (dosen) & navbar (mahasiswa)
  ✦ Login page (form saja, belum functional)
  ✦ Register page (form saja, belum functional)

Prioritas 2 — Dashboard
  ✦ Dashboard Dosen: daftar kelas, statistik
  ✦ Dashboard Mahasiswa: kelas yang diikuti, progress tahap

Prioritas 3 — Kelas & Tahap (Dosen)
  ✦ Halaman daftar kelas dosen
  ✦ Halaman detail kelas (daftar 5 tahap + status locked/unlocked)
  ✦ Halaman daftar mahasiswa per kelas
  ✦ Halaman detail tahap dosen (daftar konten + form tambah konten)

Prioritas 4 — Halaman Tahap (Mahasiswa)
  ✦ Halaman daftar tahap mahasiswa (TahapStepper visual)
  ✦ Halaman detail tahap (KontenCard list + info tugas)

Prioritas 5 — Submission
  ✦ SubmissionForm tipe LINK_SLIDE (Tahap 1, 5)
  ✦ SubmissionForm tipe LINK_DOKUMEN (Tahap 2, 3)
  ✦ SubmissionForm tipe TEKS_LANGSUNG (Tahap 4) dengan auto-save UI
  ✦ Halaman list submissions (dosen)

Prioritas 6 — Asesmen
  ✦ RubrikForm — form penilaian 5 aspek (dosen, Tahap 4)
  ✦ Halaman nilai mahasiswa (tampil setelah dinilai)

Prioritas 7 — Forum
  ✦ Forum kelas (daftar pesan + form reply)
  ✦ Forum kelompok Tahap 3
```

### 0.3 Pola Penggunaan Mock Data

Di setiap page/component, import mock data dan langsung render.
Tandai dengan komentar `// TODO: replace with real API` agar mudah di-swap nanti.

```typescript
// Contoh di src/app/(dosen)/dashboard/page.tsx
import { mockKelasList, mockDosen } from "@/lib/mock/data"

export default function DosenDashboardPage() {
  // TODO: replace with real API — getKelasByDosen(session.user.id)
  const kelas = mockKelasList
  const user = mockDosen

  return (
    <div>
      <h1>Selamat datang, {user.nama}</h1>
      {/* render kelas list... */}
    </div>
  )
}
```

### 0.4 Halaman yang Harus Selesai di Fase 0

| Halaman                                               | Route                                              | Mock Data         |
|-------------------------------------------------------|----------------------------------------------------|-------------------|
| Login                                                 | `/login`                                           | -                 |
| Register                                              | `/register`                                        | -                 |
| Dashboard Dosen                                       | `/dosen/dashboard`                                 | mockKelasList     |
| Daftar Kelas Dosen                                    | `/dosen/kelas`                                     | mockKelasList     |
| Detail Kelas Dosen                                    | `/dosen/kelas/[kelasId]`                           | mockTahapList     |
| Daftar Mahasiswa                                      | `/dosen/kelas/[kelasId]/mahasiswa`                 | mockMahasiswa     |
| Detail Tahap Dosen (konten + tugas)                   | `/dosen/kelas/[kelasId]/tahap/[tahapId]`           | mockKontenList    |
| Daftar Submissions per Tahap                          | `/dosen/kelas/[kelasId]/tahap/[tahapId]/submissions`| mockSubmissionList|
| Detail Submission + RubrikForm (Tahap 4)              | `/dosen/kelas/[kelasId]/tahap/[tahapId]/submissions/[subId]` | mockNilaiAspekList|
| Dashboard Mahasiswa                                   | `/mahasiswa/dashboard`                             | mockKelasList     |
| Daftar Tahap Mahasiswa                                | `/mahasiswa/kelas/[kelasId]`                       | mockTahapList     |
| Detail Tahap Mahasiswa (konten + info tugas)          | `/mahasiswa/kelas/[kelasId]/tahap/[tahapId]`       | mockKontenList    |
| Submit Tugas (semua tipe)                             | `/mahasiswa/kelas/[kelasId]/tahap/[tahapId]/submit`| mockSubmissionList|
| Nilai Mahasiswa (setelah dinilai)                     | `/mahasiswa/kelas/[kelasId]/tahap/[tahapId]/nilai` | mockNilaiAspekList|
| Forum Kelas                                           | `/dosen/kelas/[kelasId]/forum`                     | mockPesanList     |
| Forum Kelas (Mahasiswa)                               | `/mahasiswa/kelas/[kelasId]/forum`                 | mockPesanList     |

---

## FASE 1 — Fondasi

### 1.1 Setup Project Next.js 15
```bash
npx create-next-app@latest media-menulis \
  --typescript --tailwind --app --src-dir \
  --import-alias "@/*" --no-eslint
```

### 1.2 Install Dependencies
```bash
# Database & ORM
npm install prisma @prisma/client @prisma/adapter-neon @neondatabase/serverless

# Auth
npm install next-auth@beta @auth/prisma-adapter

# UI
npm install @radix-ui/react-* class-variance-authority clsx tailwind-merge lucide-react
npx shadcn@latest init

# Form & Validation
npm install react-hook-form @hookform/resolvers zod

# State Management
npm install zustand @tanstack/react-query

# Utilities
npm install date-fns sonner bcryptjs
npm install -D @types/bcryptjs
```

### 1.3 Struktur Folder yang Dibuat
```
src/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (auth)/register/page.tsx
│   ├── (dosen)/layout.tsx
│   ├── (dosen)/dashboard/page.tsx
│   ├── (dosen)/kelas/page.tsx
│   ├── (dosen)/kelas/buat/page.tsx
│   ├── (dosen)/kelas/[kelasId]/page.tsx
│   ├── (dosen)/kelas/[kelasId]/mahasiswa/page.tsx
│   ├── (dosen)/kelas/[kelasId]/tahap/[tahapId]/page.tsx
│   ├── (dosen)/kelas/[kelasId]/tahap/[tahapId]/submissions/page.tsx
│   ├── (dosen)/kelas/[kelasId]/tahap/[tahapId]/submissions/[subId]/page.tsx
│   ├── (dosen)/kelas/[kelasId]/forum/page.tsx
│   ├── (mahasiswa)/layout.tsx
│   ├── (mahasiswa)/dashboard/page.tsx
│   ├── (mahasiswa)/kelas/[kelasId]/page.tsx
│   ├── (mahasiswa)/kelas/[kelasId]/tahap/[tahapId]/page.tsx
│   ├── (mahasiswa)/kelas/[kelasId]/tahap/[tahapId]/submit/page.tsx
│   ├── (mahasiswa)/kelas/[kelasId]/tahap/[tahapId]/nilai/page.tsx
│   └── (mahasiswa)/kelas/[kelasId]/forum/page.tsx
├── components/
│   ├── konten/KontenCard.tsx
│   ├── konten/VideoEmbed.tsx
│   ├── konten/LinkPreview.tsx
│   ├── konten/KontenForm.tsx
│   ├── submission/SubmissionForm.tsx
│   ├── submission/SubmissionCard.tsx
│   ├── submission/LinkSubmitField.tsx
│   ├── submission/PanduanSubmisi.tsx
│   ├── assessment/RubrikForm.tsx
│   ├── assessment/NilaiSummary.tsx
│   ├── forum/ThreadList.tsx
│   ├── forum/MessageCard.tsx
│   ├── forum/ReplyForm.tsx
│   ├── tahap/TahapStepper.tsx
│   └── tahap/TahapLockBadge.tsx
├── lib/
│   ├── mock/data.ts               ← mock data untuk Fase 0
│   ├── utils/url-parser.ts
│   ├── utils/embed-builder.ts
│   ├── validations/auth.schema.ts
│   ├── validations/konten.schema.ts
│   ├── validations/submission.schema.ts
│   ├── hooks/useKelas.ts
│   ├── hooks/useTahap.ts
│   ├── hooks/useSubmission.ts
│   └── hooks/useForum.ts
└── server/
    ├── actions/auth.actions.ts
    ├── actions/kelas.actions.ts
    ├── actions/tahap.actions.ts
    ├── actions/submission.actions.ts
    ├── actions/forum.actions.ts
    ├── queries/kelas.queries.ts
    ├── queries/tahap.queries.ts
    ├── queries/submission.queries.ts
    └── queries/forum.queries.ts
```

### 1.4 File Konfigurasi Root
- `prisma/schema.prisma` — schema lengkap
- `auth.ts` — NextAuth v5 config
- `middleware.ts` — route protection per role
- `.env.local` — DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
- `src/lib/prisma.ts` — prisma client singleton

### 1.5 Schema Prisma (Lengkap)

Catatan penting pada schema:
- Model `Tahap` tidak punya field `nama` bebas — punya field `kode: TahapKode` (enum)
- Dosen hanya bisa `update` field `isUnlocked` dan `unlockedAt` pada Tahap
- `Submission.tipeSubmisi` sudah ditentukan oleh tahap, bukan bebas diisi

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  DOSEN
  MAHASISWA
}

enum TahapKode {
  SMKM   // Tahap 1
  EPM    // Tahap 2
  KMBM   // Tahap 3
  IMMM   // Tahap 4 ← rubrik di sini
  IMTM   // Tahap 5
}

enum KontenTipe {
  TEKS
  VIDEO
  INFOGRAFIS
  DOKUMEN
  TEMPLATE
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

enum ForumTipe {
  KELAS
  KELOMPOK
}

model User {
  id           String       @id @default(cuid())
  nama         String
  email        String       @unique
  password     String
  role         Role
  createdAt    DateTime     @default(now())
  kelasDiajar  Kelas[]
  enrollments  Enrollment[]
  submissions  Submission[]
  pesanForum   PesanForum[]
  peerReviewDiberi  PeerReview[] @relation("reviewer")
  peerReviewDiterima PeerReview[] @relation("reviewee")
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
  id       String     @id @default(cuid())
  tahapId  String
  tahap    Tahap      @relation(fields: [tahapId], references: [id])
  tipe     KontenTipe
  judul    String
  body     String?    // hanya untuk tipe TEKS
  url      String?    // untuk semua tipe kecuali TEKS
  urutan   Int
}

model Enrollment {
  id        String   @id @default(cuid())
  kelasId   String
  kelas     Kelas    @relation(fields: [kelasId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  joinedAt  DateTime @default(now())
  kelompok  String?  // nama kelompok untuk Tahap 3

  @@unique([kelasId, userId])
}

model Submission {
  id           String      @id @default(cuid())
  tahapId      String
  tahap        Tahap       @relation(fields: [tahapId], references: [id])
  userId       String
  user         User        @relation(fields: [userId], references: [id])
  isDraft      Boolean     @default(true)
  submittedAt  DateTime?
  isiEsai      String?     // TEKS_LANGSUNG
  linkSubmisi  String?     // LINK_*
  nilaiTotal   Float?
  nilaiAspeks  NilaiAspek[]
  peerReviews  PeerReview[]
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@unique([tahapId, userId])
}

model NilaiAspek {
  id           String      @id @default(cuid())
  submissionId String
  submission   Submission  @relation(fields: [submissionId], references: [id])
  aspek        AspekNilai
  skor         Int         // 1–4
  komentar     String?

  @@unique([submissionId, aspek])
}

model PeerReview {
  id           String     @id @default(cuid())
  submissionId String
  submission   Submission @relation(fields: [submissionId], references: [id])
  reviewerId   String
  reviewer     User       @relation("reviewer", fields: [reviewerId], references: [id])
  revieweeId   String
  reviewee     User       @relation("reviewee", fields: [revieweeId], references: [id])
  komentar     String?
  skorKolaborasi Int?     // 1–3
  createdAt    DateTime   @default(now())
}

model Forum {
  id       String     @id @default(cuid())
  kelasId  String
  kelas    Kelas      @relation(fields: [kelasId], references: [id])
  tahapId  String?
  tahap    Tahap?     @relation("TahapForums", fields: [tahapId], references: [id])
  tipe     ForumTipe  @default(KELAS)
  namaKelompok String? // hanya untuk KELOMPOK
  pesans   PesanForum[]
}

model PesanForum {
  id        String    @id @default(cuid())
  forumId   String
  forum     Forum     @relation(fields: [forumId], references: [id])
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  isi       String
  replyToId String?
  replyTo   PesanForum?  @relation("Replies", fields: [replyToId], references: [id])
  replies   PesanForum[] @relation("Replies")
  createdAt DateTime     @default(now())
}
```

### 1.6 Halaman Auth

**Login** (`/login`):
- Form: email + password
- Server Action: validasi → `signIn()` NextAuth
- Redirect ke `/dosen/dashboard` atau `/mahasiswa/dashboard` sesuai role

**Register** (`/register`):
- Form: nama, email, password, konfirmasi password, role (Dosen/Mahasiswa)
- Server Action: hash password bcrypt → `prisma.user.create()`
- Auto-login setelah register

---

## FASE 2 — Kelas & Tahap

### 2.1 Manajemen Kelas (Dosen)

**Buat Kelas** (`/dosen/kelas/buat`):
- Form: nama kelas, deskripsi
- Server Action `createKelas()`:
  - Generate kode 6 karakter random uppercase unik
  - `prisma.kelas.create()`
  - **Auto-generate 5 tahap TETAP** sekaligus:
    ```typescript
    const TAHAP_DEFINITIONS = [
      { urutan: 1, kode: "SMKM", tipeSubmisi: "LINK_SLIDE" },
      { urutan: 2, kode: "EPM", tipeSubmisi: "LINK_DOKUMEN" },
      { urutan: 3, kode: "KMBM", tipeSubmisi: "LINK_DOKUMEN" },
      { urutan: 4, kode: "IMMM", tipeSubmisi: "TEKS_LANGSUNG" },
      { urutan: 5, kode: "IMTM", tipeSubmisi: "LINK_SLIDE" },
    ]
    // prisma.tahap.createMany() dengan isUnlocked: true hanya untuk urutan 1
    ```
  - Buat Forum KELAS default sekaligus
  - Redirect ke halaman detail kelas

**Daftar Kelas** (`/dosen/kelas`):
- Query semua kelas milik dosen yang login
- Card per kelas: nama, kode, jumlah mahasiswa, progress tahap

**Detail Kelas** (`/dosen/kelas/[kelasId]`):
- Tab: Tahap, Mahasiswa, Forum
- Daftar 5 tahap dengan status locked/unlocked + tombol "Buka Tahap Berikutnya"

### 2.2 Enrollment Mahasiswa

**Dosen daftarkan mahasiswa** (`/dosen/kelas/[kelasId]/mahasiswa`):
- Form: email + nama
- Server Action `enrollMahasiswa()`:
  - Cek apakah email sudah ada di DB
  - Jika belum: buat User baru dengan password sementara random
  - Buat Enrollment
  - Tampilkan password sementara sekali di UI (copy-paste oleh dosen)

**Mahasiswa join via kode** (dari dashboard mahasiswa):
- Form: kode kelas (6 karakter, case-insensitive)
- Server Action `joinKelas()`:
  - Cari kelas by kode (uppercase)
  - Cek belum terdaftar
  - Buat Enrollment

### 2.3 Unlock Tahap

**Unlock tahap** (tombol di halaman detail kelas):
- Server Action `unlockTahap()`:
  - Validasi: hanya dosen pemilik kelas
  - Validasi: tahap sebelumnya sudah unlock
  - `prisma.tahap.update({ isUnlocked: true, unlockedAt: now() })`

### 2.4 CRUD Konten

**Tambah konten** (KontenForm di halaman detail tahap dosen):
- Select tipe (TEKS / VIDEO / INFOGRAFIS / DOKUMEN / TEMPLATE)
- Jika TEKS: tampilkan textarea dengan markdown sederhana
- Jika lainnya: input URL + validasi domain + preview otomatis
- Server Action `createKonten()`

**Edit/Hapus konten**:
- Server Action `updateKonten()` dan `deleteKonten()`

---

## FASE 3 — Konten Viewer

### 3.1 `url-parser.ts`
Fungsi:
- `detectUrlType(url: string): UrlType`
- `buildEmbedUrl(url: string): string | null`

Konversi:
- YouTube `watch?v=ID` → `youtube.com/embed/ID`
- GDrive `/view` atau `/edit` → `/preview`
- Canva → tambah `/view?embed`
- Lainnya → return `null` (tampilkan link card)

### 3.2 `KontenCard.tsx`
- Terima prop `konten` (tipe, judul, body, url)
- Render sesuai tipe:
  - TEKS: `dangerouslySetInnerHTML` dengan DOMPurify sanitasi
  - VIDEO/INFOGRAFIS/DOKUMEN/TEMPLATE: coba embed, fallback link card
- iframe sandbox: `"allow-scripts allow-same-origin allow-popups allow-forms"`
- Aspek rasio iframe: 16:9 untuk video, 4:3 untuk dokumen/slide

### 3.3 Halaman Tahap Mahasiswa
- Cek tahap unlock, redirect ke dashboard jika locked
- TahapStepper di atas (progress 1–5 visual, kode tahap ditampilkan)
- List KontenCard berurutan
- Di bawah konten: info tugas (tipe + deadline jika ada)
- Tombol "Kerjakan Tugas" → ke halaman submit

---

## FASE 4 — Submission

### 4.1 `SubmissionForm.tsx`
Komponen client. Prop `tahap.tipeSubmisi` menentukan tampilan.

**LINK_SLIDE / LINK_DOKUMEN / LINK_VIDEO**:
- Input URL dengan validasi domain sesuai tipe
- Preview link setelah input valid
- Tombol "Kumpulkan" + dialog konfirmasi

**TEKS_LANGSUNG** (Tahap 4):
- Textarea besar (min 800 kata counter)
- Auto-save draft 30 detik (debounced) — tampilkan "Tersimpan otomatis pukul HH:mm"
- Tombol "Kumpulkan" + AlertDialog konfirmasi
- Setelah submit: disabled + badge "Terkumpul"

**CAMPURAN**:
- Keduanya muncul, min 1 harus diisi

### 4.2 `PanduanSubmisi.tsx`
- Accordion/collapsible per tipe submission
- Langkah-langkah cara submit sesuai tipe

---

## FASE 5 — Asesmen

### 5.1 `RubrikForm.tsx` (KHUSUS Tahap 4 — IMMM)
Dosen buka halaman submission detail:
- Tampilkan esai mahasiswa (teks langsung)
- Form: 5 aspek, masing-masing radio 1–4 + textarea komentar
- Nilai total kalkulasi otomatis di UI (rata-rata × 25)
- Server Action `nilaiSubmission()`: simpan NilaiAspek[] + update Submission.nilaiTotal

### 5.2 Halaman Nilai Mahasiswa
- Tampilkan setelah `nilaiTotal !== null`
- Tabel aspek + skor + komentar dosen
- Total nilai final

### 5.3 Export CSV
- Route Handler `/api/kelas/[kelasId]/export-nilai`
- Format: Nama | Email | Tahap | Tugas | Total | ISI | ORG | KOSA | BHS | MEK
- `Content-Disposition: attachment; filename="nilai-kelas-X.csv"`

---

## FASE 6 — Forum & Polish

### 6.1 Forum Threaded
- Forum tipe KELAS per kelas (auto-buat saat kelas dibuat)
- Forum tipe KELOMPOK di Tahap 3 (dosen buat per kelompok)
- Query pesan berurut waktu dengan nested replies
- Polling 30 detik via TanStack Query `refetchInterval: 30000`

### 6.2 Peer Review (Tahap 4)
- Dosen aktifkan peer review setelah deadline
- Server Action `assignPeerReview()` — assign random, tidak boleh self-review
- Mahasiswa lihat tugas review di dashboard
- Form: komentar + skor kolaborasi 1–3
- Mahasiswa lihat semua review yang diterima

### 6.3 Mobile Responsive
- Semua halaman berfungsi di layar 375px (iPhone SE)
- Sidebar dosen: hamburger menu di mobile
- TahapStepper: horizontal scroll di mobile

### 6.4 Polish
- Semua loading state pakai Skeleton
- Semua error state tampilkan pesan ramah + tombol retry
- Toast notifikasi untuk semua aksi berhasil/gagal

---

## CATATAN KEPUTUSAN TEKNIS

### Kenapa JWT bukan Database Session untuk NextAuth?
Neon free tier hanya 0.5GB. Database session akan menambah tabel `Session`
yang terisi cepat. JWT disimpan di cookie sisi client, lebih hemat.

### Kenapa Polling bukan WebSocket untuk Forum?
Vercel free tier tidak support WebSocket persistent. Polling 30 detik
sudah cukup untuk forum diskusi kuliah (bukan live chat).

### Kenapa Tahap TETAP 5, tidak bebas dibuat dosen?
Model pedagogis Knows SGM dari panduan UNJ mendefinisikan 5 tahap terstruktur
dengan tujuan dan artefak spesifik. Fleksibilitas akan merusak integritas pedagogi.

### Kenapa tidak ada model Kelompok tersendiri?
Tahap 3 menggunakan kolom `Enrollment.kelompok` (string nama kelompok) dan
Forum tipe KELOMPOK. Tidak perlu model Kelompok terpisah untuk scope ini.

### Kenapa Rubrik hanya untuk Tahap 4?
Tahap 1–3 dan 5 menghasilkan artefak link (mind map, Google Docs, infografis)
yang dinilai dengan umpan balik kualitatif. Rubrik 5 aspek dirancang khusus
untuk esai mandiri (Tahap 4) sesuai kurikulum.

---

## ENV VARIABLES YANG DIBUTUHKAN

```env
# .env.local
DATABASE_URL="postgresql://..."     # Neon connection string
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-32-chars"
```

Production (Vercel env):
```
DATABASE_URL        → dari Neon dashboard
NEXTAUTH_URL        → https://media-menulis.vercel.app
NEXTAUTH_SECRET     → random string kuat
```
