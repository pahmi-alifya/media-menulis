// src/lib/mock/data.ts
// Mock data untuk Fase 0 — UI First
// TODO: Setiap penggunaan mock data ditandai "// TODO: replace with real API"

export type Role = "ADMIN" | "DOSEN" | "MAHASISWA"

export type TahapKode = "SMKM" | "EPM" | "KMBM" | "IMMM" | "IMTM"

export type TipeSubmisi =
  | "LINK_SLIDE"
  | "LINK_DOKUMEN"
  | "LINK_VIDEO"
  | "TEKS_LANGSUNG"
  | "CAMPURAN"

export type KontenTipe = "TEKS" | "VIDEO" | "INFOGRAFIS" | "DOKUMEN" | "TEMPLATE"

export type KategoriKonten = "LIHAT" | "SERAHKAN" | "BERKONTRIBUSI"

export const KATEGORI_LABEL: Record<KategoriKonten, string> = {
  LIHAT: "Lihat",
  SERAHKAN: "Serahkan",
  BERKONTRIBUSI: "Berkontribusi",
}

export type AspekNilai =
  | "ISI_KONTEN"
  | "ORGANISASI"
  | "KOSAKATA"
  | "KEBAHASAAN"
  | "MEKANIK"

export type AspekKolaborasi =
  | "MENULIS_KOLABORASI"
  | "UMPAN_BALIK_KOLABORASI"

// ─── Label helpers ───────────────────────────────────────────────────────────

export const TAHAP_LABEL: Record<TahapKode, { singkat: string; panjang: string }> = {
  SMKM: {
    singkat: "SMKM",
    panjang: "Sharing dan Mengkonstruksi Konten Multimodal",
  },
  EPM: {
    singkat: "EPM",
    panjang: "Eksplorasi dan Penelaahan Multimodal",
  },
  KMBM: {
    singkat: "KMBM",
    panjang: "Kolaborasi dan Menulis Bersama Multimodal",
  },
  IMMM: {
    singkat: "IMMM",
    panjang: "Independensi Menulis Mandiri Multimodal",
  },
  IMTM: {
    singkat: "IMTM",
    panjang: "Integrasi dan Mempublikasikan Teks Multimodal",
  },
}

export const TIPE_SUBMISI_LABEL: Record<TipeSubmisi, string> = {
  LINK_SLIDE: "Link Slide / Infografis",
  LINK_DOKUMEN: "Link Dokumen",
  LINK_VIDEO: "Link Video",
  TEKS_LANGSUNG: "Tulis Esai Langsung",
  CAMPURAN: "Teks + Link",
}

export const ASPEK_LABEL: Record<AspekNilai, string> = {
  ISI_KONTEN: "Isi/Konten",
  ORGANISASI: "Organisasi",
  KOSAKATA: "Kosakata",
  KEBAHASAAN: "Kebahasaan",
  MEKANIK: "Mekanik",
}

// Sub-deskripsi per aspek — dari Rubrik Esai Argumentatif (Kriteria Penulisan Esai, Rina Rosdiana)
export const ASPEK_SUBDESKRIPSI: Record<AspekNilai, string> = {
  ISI_KONTEN: "Gagasan utama dan pernyataan tesis",
  ORGANISASI: "Pengembangan argumen dan bukti pendukung",
  KOSAKATA: "Ketepatan dan variasi pemilihan diksi",
  KEBAHASAAN: "Ketepatan tata bahasa dan leksikal",
  MEKANIK: "Ejaan, tanda baca, dan kaidah penulisan",
}

// Deskripsi per skor (1–4) untuk setiap aspek — dari Rubrik Esai Argumentatif (Kriteria Penulisan Esai, Rina Rosdiana)
export const RUBRIK_SKOR_DESKRIPSI: Record<AspekNilai, Record<1 | 2 | 3 | 4, string>> = {
  ISI_KONTEN: {
    4: "Topik dikembangkan dengan baik. Pernyataan tesis menyatakan topik spesifik esai. Kalimat topik jelas dan fokus. Ide-ide utama didukung oleh detail dan/atau contoh yang kuat dan meyakinkan. Tidak ada dukungan yang tidak relevan atau berlebihan.",
    3: "Topik dikembangkan secara memadai. Kadang-kadang ada masalah kecil dengan kedalaman perkembangan dan persatuan. Pernyataan tesis harus lebih tajam. Kalimat topik hadir tetapi ide yang mengendalikan tidak tepat. Ide-ide utama didukung oleh sebagian besar detail dan/atau contoh yang kuat. Dukungan sebagian besar relevan dan sesuai.",
    2: "Topik (pernyataan tesis) kurang dikembangkan. Pernyataan tesisnya tidak jelas. Kalimat topik tidak ada/sesuai atau gagasan pengendalian tidak terlihat dalam kalimat topik. Ide-ide utama entah bagaimana didukung oleh detail dan/atau contoh. Namun, beberapa dukungan tidak relevan, berlebihan, tidak jelas, atau tidak mencukupi.",
    1: "Topik tidak dikembangkan secara memadai. Esai tidak berisi satu pun atau lebih dari satu pernyataan tesis. Tidak ada pusat yang jelas; kalimat topik sulit untuk dinilai. Ada terlalu banyak detail/contoh yang tidak relevan, berlebihan, tidak jelas, dan/atau tidak memadai.",
  },
  ORGANISASI: {
    4: "Informasi (argumen dan bukti pendukung) diatur secara logis dan diurutkan secara efektif dengan penggunaan transisi yang efektif.",
    3: "Informasi (argumen dan bukti pendukung) sebagian besar diatur dan diurutkan dengan sebagian besar penggunaan transisi yang efektif.",
    2: "Informasi (argumen dan bukti pendukung) diatur dan diurutkan secara longgar. Ada beberapa masalah dengan kohesi, pengurutan, dan aliran ide. Hubungan antar ide terkadang tidak jelas.",
    1: "Kurangnya organisasi yang jelas. Hubungan antar ide tidak jelas. Sulit untuk diikuti.",
  },
  KOSAKATA: {
    4: "Pemilihan diksi secara keseluruhan tepat.",
    3: "Terdapat beberapa pemilihan diksi yang kurang tepat.",
    2: "Terdapat banyak pemilihan diksi yang tidak tepat.",
    1: "Terdapat banyak sekali pemilihan diksi yang tidak tepat dan mengurangi pemahaman kalimat.",
  },
  KEBAHASAAN: {
    4: "Esai ini tidak mengandung kesalahan tata bahasa dan leksikal.",
    3: "Esai ini terdapat beberapa kesalahan tata bahasa dan leksikal, tetapi kesalahan ini tidak mengurangi maknanya.",
    2: "Esai ini berisi banyak kesalahan tata bahasa dan leksikal, dan beberapa kesalahan ini mengurangi maknanya.",
    1: "Esai ini berisi banyak kesalahan tata bahasa dan leksikal, dan kesalahan ini sepenuhnya mengurangi maknanya.",
  },
  MEKANIK: {
    4: "Esai ini menggunakan kaidah penulisan ejaan dan tanda baca dengan tepat.",
    3: "Esai ini terdapat beberapa penggunaan kaidah penulisan ejaan dan tanda baca yang kurang tepat.",
    2: "Esai ini terdapat banyak kesalahan dalam menggunakan kaidah penulisan ejaan dan tanda baca, tetapi tidak mengganggu pemahaman makna.",
    1: "Esai ini terdapat sangat banyak kesalahan dalam menggunakan kaidah penulisan ejaan dan tanda baca sehingga mengganggu pemahaman makna.",
  },
}

// Rubrik Kolaborasi (KMBM — Tahap 3) — skala 1–3, dari Kriteria Penulisan Esai, Rina Rosdiana
export const ASPEK_KOLABORASI_LABEL: Record<AspekKolaborasi, string> = {
  MENULIS_KOLABORASI: "Menulis",
  UMPAN_BALIK_KOLABORASI: "Pemberian dan Tanggapan Umpan Balik",
}

export const ASPEK_KOLABORASI_SUBDESKRIPSI: Record<AspekKolaborasi, string> = {
  MENULIS_KOLABORASI: "Kontribusi dalam proses penulisan kolaboratif",
  UMPAN_BALIK_KOLABORASI: "Partisipasi dalam diskusi, umpan balik rekan kerja, dan revisi",
}

export const RUBRIK_KOLABORASI_DESKRIPSI: Record<AspekKolaborasi, Record<1 | 2 | 3, string>> = {
  MENULIS_KOLABORASI: {
    3: "Memberikan perhatian yang baik ke dalam proses kolaboratif.",
    2: "Memberikan sedikit perhatian dan upaya ke dalam proses kolaboratif.",
    1: "Sedikit usaha yang ditunjukkan dalam proses kolaboratif.",
  },
  UMPAN_BALIK_KOLABORASI: {
    3: "Secara aktif memberikan perhatian dan upaya yang baik ke dalam proses kolaboratif, berpasangan, umpan balik rekan kerja, serta revisi/penyuntingan.",
    2: "Kurang berpartisipasi baik dalam diskusi berpasangan, umpan balik rekan kerja, dan revisi/penyuntingan.",
    1: "Sedikit partisipasi dalam diskusi berpasangan, umpan balik rekan kerja, dan revisi/penyuntingan.",
  },
}

// ─── Users ───────────────────────────────────────────────────────────────────

export interface MockUser {
  id: string
  nama: string
  email: string
  role: Role
}

export const mockDosen: MockUser = {
  id: "u1",
  nama: "Rina Rosdiana, M.Pd.",
  email: "rina@unj.ac.id",
  role: "DOSEN",
}

export const mockDosenList: MockUser[] = [
  { id: "u1",  nama: "Rina Rosdiana, M.Pd.",    email: "rina@unj.ac.id",    role: "DOSEN" },
  { id: "ud2", nama: "Budi Hermawan, M.Hum.",    email: "budi.h@unj.ac.id",  role: "DOSEN" },
  { id: "ud3", nama: "Dewi Kusumawati, M.Pd.",   email: "dewi.k@unj.ac.id",  role: "DOSEN" },
]

export const mockMahasiswaAktif: MockUser = {
  id: "u2",
  nama: "Ahmad Fauzi",
  email: "ahmad@mhs.unj.ac.id",
  role: "MAHASISWA",
}

export const mockMahasiswa: MockUser[] = [
  { id: "u2", nama: "Ahmad Fauzi", email: "ahmad@mhs.unj.ac.id", role: "MAHASISWA" },
  { id: "u3", nama: "Budi Santoso", email: "budi@mhs.unj.ac.id", role: "MAHASISWA" },
  { id: "u4", nama: "Citra Lestari", email: "citra@mhs.unj.ac.id", role: "MAHASISWA" },
  { id: "u5", nama: "Dian Permata", email: "dian@mhs.unj.ac.id", role: "MAHASISWA" },
  { id: "u6", nama: "Eko Prasetyo", email: "eko@mhs.unj.ac.id", role: "MAHASISWA" },
  { id: "u7", nama: "Fitri Handayani", email: "fitri@mhs.unj.ac.id", role: "MAHASISWA" },
]

// ─── Kelas ────────────────────────────────────────────────────────────────────

export interface MockKelas {
  id: string
  nama: string
  deskripsi: string
  kode: string
  jumlahMahasiswa: number
  tahapAktif: number // urutan tahap yang sedang berjalan (1–5)
  createdAt: string
}

export const mockKelasList: MockKelas[] = [
  {
    id: "k1",
    nama: "Menulis Esai Ilmiah 2026 A",
    deskripsi: "Kelas menulis esai berbasis model Knows SGM untuk semester genap 2026.",
    kode: "MEI26A",
    jumlahMahasiswa: 28,
    tahapAktif: 3,
    createdAt: "2026-02-10",
  },
  {
    id: "k2",
    nama: "Menulis Esai Ilmiah 2026 B",
    deskripsi: "Kelas menulis esai berbasis model Knows SGM untuk semester genap 2026.",
    kode: "MEI26B",
    jumlahMahasiswa: 25,
    tahapAktif: 2,
    createdAt: "2026-02-10",
  },
  {
    id: "k3",
    nama: "Penulisan Karya Ilmiah 2025",
    deskripsi: "Kelas semester ganjil 2025.",
    kode: "PKI25A",
    jumlahMahasiswa: 30,
    tahapAktif: 5,
    createdAt: "2025-08-05",
  },
]

// Kelas yang diikuti mahasiswa
export const mockKelasMahasiswa: MockKelas[] = [mockKelasList[0], mockKelasList[1]]

// ─── Tahap (5 tetap per kelas) ───────────────────────────────────────────────

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
  jumlahSubmisi?: number
  jumlahDinilai?: number
}

export const mockTahapList: MockTahap[] = [
  {
    id: "t1",
    kelasId: "k1",
    urutan: 1,
    kode: "SMKM",
    nama: "Sharing dan Mengkonstruksi Konten Multimodal",
    deskripsi:
      "Mahasiswa diperkenalkan pada konsep esai argumentatif: pengertian, karakteristik, dan tujuannya. Tahap ini membangun konteks belajar melalui materi multimodal, kemudian mahasiswa mengekspresikan pemahaman awal dalam bentuk peta konsep.",
    tujuan: "Membangun konteks (sosialisasi) tentang pengertian dan karakteristik esai argumentatif sebagai fondasi pembelajaran menulis.",
    tipeSubmisi: "LINK_SLIDE",
    isUnlocked: true,
    unlockedAt: "2026-02-15",
    jumlahSubmisi: 26,
    jumlahDinilai: 0,
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
    jumlahSubmisi: 25,
    jumlahDinilai: 0,
  },
  {
    id: "t3",
    kelasId: "k1",
    urutan: 3,
    kode: "KMBM",
    nama: "Kolaborasi dan Menulis Bersama Multimodal",
    deskripsi:
      "Mahasiswa bekerja dalam kelompok untuk menyusun esai bersama menggunakan Google Docs kondivisi.",
    tujuan: "Kombinasi ide melalui kolaborasi kelompok dan ko-konstruksi teks.",
    tipeSubmisi: "LINK_DOKUMEN",
    isUnlocked: true,
    unlockedAt: "2026-03-01",
    jumlahSubmisi: 20,
    jumlahDinilai: 0,
  },
  {
    id: "t4",
    kelasId: "k1",
    urutan: 4,
    kode: "IMMM",
    nama: "Independensi Menulis Mandiri Multimodal",
    deskripsi:
      "Mahasiswa menulis esai argumentatif mandiri secara langsung di platform, menerapkan seluruh pengetahuan dari tahap-tahap sebelumnya. Esai dinilai dengan rubrik 5 aspek: Isi/Konten, Organisasi, Kosakata, Kebahasaan, dan Mekanik.",
    tujuan: "Menginternalisasi kemampuan menulis menjadi karya mandiri yang diukur dengan rubrik penilaian esai argumentatif (Brown & Oshima, 2007).",
    tipeSubmisi: "TEKS_LANGSUNG",
    isUnlocked: false,
    unlockedAt: null,
    jumlahSubmisi: 0,
    jumlahDinilai: 0,
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
    jumlahSubmisi: 0,
    jumlahDinilai: 0,
  },
]

// ─── Konten ───────────────────────────────────────────────────────────────────

export interface MockKonten {
  id: string
  tahapId: string
  tipe: KontenTipe
  kategori: KategoriKonten  // default: LIHAT
  judul: string
  body: string | null
  url: string | null
  urutan: number
  pertemuanKe: number
}

export const mockKontenList: MockKonten[] = [
  // ─── Tahap 1 — SMKM — Pertemuan 1 ───────────────────────────────────────────
  // Materi bersumber dari: "Esai: Suatu Pengantar" oleh Rina Rosdiana
  {
    id: "c10",
    tahapId: "t1",
    tipe: "TEKS",
    kategori: "LIHAT",
    judul: "Esai Argumentatif: Suatu Pengantar",
    body: "<p>Menulis esai argumentatif bukanlah kegiatan yang dilakukan secara spontan, melainkan melalui serangkaian <strong>tahapan yang saling berkaitan</strong>. Setiap langkah berpikir yang dilalui penulis bertujuan agar esai yang dihasilkan memiliki argumen yang jelas, logis, dan dapat meyakinkan pembaca.</p><p>Esai argumentatif pada dasarnya adalah tulisan yang bertujuan <strong>meyakinkan pembaca</strong> terhadap suatu pendapat dengan disertai alasan, data, dan fakta yang relevan. Penulisan esai tidak cukup hanya dengan menyampaikan pendapat, tetapi harus didukung oleh bukti, disusun secara terstruktur, serta ditulis dengan bahasa yang efektif.</p><h2>A. Pengertian Esai</h2><p>Esai merupakan salah satu <strong>genre penulisan akademis</strong> yang berfungsi untuk mengekspresikan pemahaman tentang suatu topik. Esai juga merupakan sekelompok paragraf yang ditulis tentang satu topik atau ide utama. Sebuah esai harus memiliki setidaknya <strong>tiga paragraf</strong>, tetapi esai lima paragraf merupakan latihan yang umum untuk penulisan akademis.</p><p>Esai memiliki karakteristik berupa:</p><ol><li>Karangan singkat yang berisi <strong>pendapat atau opini</strong> yang ditujukan penulis terhadap suatu bahasan tertentu, terutama yang sedang aktual dibicarakan</li><li>Karangan dalam bentuk prosa yang memaparkan suatu permasalahan dari <strong>sudut pandang pribadi</strong> penulisnya secara jelas dan sistematis</li></ol>",
    url: null,
    urutan: 1,
    pertemuanKe: 1,
  },
  {
    id: "c1",
    tahapId: "t1",
    tipe: "VIDEO",
    kategori: "LIHAT",
    judul: "Pengantar Esai Argumentatif — Apa dan Mengapa?",
    body: null,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    urutan: 2,
    pertemuanKe: 1,
  },
  {
    id: "c2",
    tahapId: "t1",
    tipe: "INFOGRAFIS",
    kategori: "LIHAT",
    judul: "Struktur Esai Argumentatif (Infografis)",
    body: null,
    url: "https://www.canva.com/design/DAFxxxxx/view",
    urutan: 3,
    pertemuanKe: 1,
  },
  {
    id: "c3",
    tahapId: "t1",
    tipe: "TEMPLATE",
    kategori: "LIHAT",
    judul: "Template Peta Konsep — Salin dan Isi",
    body: null,
    url: "https://docs.google.com/presentation/d/1abc123/edit",
    urutan: 4,
    pertemuanKe: 1,
  },
  {
    id: "c4",
    tahapId: "t1",
    tipe: "TEKS",
    kategori: "SERAHKAN",
    judul: "Panduan Tugas: Membuat Peta Konsep",
    body: "<p>Setelah mempelajari materi pengantar di atas, buat <strong>peta konsep</strong> yang menggambarkan pemahaman awal Anda tentang esai argumentatif. Gunakan <strong>Canva</strong> atau <strong>Google Slides</strong>, lalu paste link-nya saat submit.</p><p>Peta konsep dapat mencakup: pengertian esai, karakteristik, tujuan, dan contoh topik yang ingin Anda tulis.</p><p>Pastikan link <strong>dapat diakses oleh siapa saja</strong> (bukan private).</p>",
    url: null,
    urutan: 5,
    pertemuanKe: 1,
  },
  // ─── Tahap 1 — SMKM — Pertemuan 2 ───────────────────────────────────────────
  // Topik: Korupsi dan Komikus — membangun konteks isu sosial sebagai bahan esai
  {
    id: "c11",
    tahapId: "t1",
    tipe: "TEKS",
    kategori: "LIHAT",
    judul: "Membangun Konteks: Korupsi sebagai Isu Sosial",
    body: "<p>Pada pertemuan kedua, kita akan mempraktikkan menulis esai argumentatif dengan menggunakan <strong>isu sosial nyata</strong> sebagai topik. Topik yang dipilih adalah <em>korupsi</em> — sebuah isu yang kompleks, aktual, dan kaya argumen.</p><h2>Mengapa Korupsi sebagai Topik?</h2><p>Topik yang baik untuk esai argumentatif memiliki ciri-ciri:</p><ol><li><strong>Kontroversial</strong> — ada lebih dari satu sudut pandang yang bisa diperdebatkan</li><li><strong>Faktual</strong> — dapat didukung oleh data, laporan, atau penelitian</li><li><strong>Relevan</strong> — menyentuh kehidupan nyata pembaca</li></ol><p>Isu korupsi memenuhi semua kriteria tersebut. Berbagai lembaga seperti KPK, Transparency International, dan media massa menyediakan data yang dapat dijadikan bukti dalam esai.</p><h2>Koruptor dan Komikus: Perspektif Melalui Seni</h2><p>Salah satu cara unik mengkritisi korupsi adalah melalui <strong>komik dan karikatur</strong>. Seniman dan komikus menggunakan medium visual untuk menyampaikan kritik sosial yang tajam namun mudah dicerna publik. Hal ini merupakan contoh teks multimodal — perpaduan antara teks verbal dan visual untuk menyampaikan argumen.</p><p>Perhatikan bagaimana kartunis menggunakan simbol, ekspresi, dan teks singkat untuk membangun argumen yang kuat. Ini adalah keterampilan yang sama yang ingin kita kembangkan dalam esai argumentatif — membangun argumen yang meyakinkan dengan bukti yang tepat.</p>",
    url: null,
    urutan: 1,
    pertemuanKe: 2,
  },
  {
    id: "c12",
    tahapId: "t1",
    tipe: "INFOGRAFIS",
    kategori: "LIHAT",
    judul: "Infografis: Fenomena Korupsi di Indonesia",
    body: null,
    url: "https://www.canva.com/design/DAFkorupsi/view",
    urutan: 2,
    pertemuanKe: 2,
  },
  {
    id: "c13",
    tahapId: "t1",
    tipe: "TEMPLATE",
    kategori: "SERAHKAN",
    judul: "Template Peta Konsep — Topik Korupsi dan Masyarakat",
    body: null,
    url: "https://docs.google.com/presentation/d/1korupsi-template/edit",
    urutan: 3,
    pertemuanKe: 2,
  },
  // ─── Tahap 2 — EPM — Pertemuan 1 ─────────────────────────────────────────────
  // (Pertemuan 1 belum ada konten di EPM — tahap ini hanya punya pertemuan 2 dalam mock)
  // ─── Tahap 2 — EPM — Pertemuan 2 ─────────────────────────────────────────────
  // Topik: Menelaah esai model "Koruptor dan Komikus"
  {
    id: "c14",
    tahapId: "t2",
    tipe: "TEKS",
    kategori: "BERKONTRIBUSI",
    judul: "Esai Model: Koruptor dan Komikus",
    body: "<p>Bacalah esai berikut sebagai <strong>contoh model</strong> esai argumentatif yang akan Anda telaah. Perhatikan bagaimana penulis membangun argumen, memilih bukti, dan menyusun paragraf secara efektif.</p><blockquote><p><strong>Koruptor dan Komikus</strong></p><p>Di tengah berita korupsi yang tak kunjung usai, muncul sebuah fenomena menarik: para komikus dan kartunis mengangkat pena mereka sebagai senjata kritik sosial. Mereka tidak sekadar menggambar, melainkan membangun argumen visual yang menohok.</p><p>Komik dan karikatur politik telah lama menjadi medium demokrasi. Sejak zaman kolonial, gambar-gambar satir digunakan untuk mengkritisi kekuasaan tanpa risiko pemenjaraan langsung. Kini, di era digital, kritik visual menyebar lebih cepat dari artikel opini mana pun. Sebuah karikatur yang tajam bisa ditonton jutaan orang dalam hitungan jam.</p><p>Namun, apakah seni benar-benar efektif mengubah perilaku koruptor? Tentu tidak secara langsung. Yang berubah adalah <em>kesadaran publik</em>. Ketika korupsi dikritisi melalui humor dan satir, masyarakat yang tadinya apatis mulai ikut berbicara. Kritik yang dikemas dalam seni lebih mudah dicerna dan lebih sulit dibantah.</p><p>Dengan demikian, koruptor dan komikus berada dalam hubungan yang paradoks: semakin banyak koruptor, semakin subur pula kreativitas komikus. Dan selama komikus terus berkarya, harapan untuk budaya antikorupsi tidak pernah padam.</p></blockquote>",
    url: null,
    urutan: 1,
    pertemuanKe: 2,
  },
  {
    id: "c15",
    tahapId: "t2",
    tipe: "DOKUMEN",
    kategori: "LIHAT",
    judul: "Esai Model Kedua: Derita Rakyat Bukan Ladang Konten",
    body: null,
    url: "https://docs.google.com/document/d/1derita-rakyat/edit",
    urutan: 2,
    pertemuanKe: 2,
  },
  {
    id: "c16",
    tahapId: "t2",
    tipe: "TEKS",
    kategori: "SERAHKAN",
    judul: "Panduan Mengidentifikasi Struktur Esai",
    body: "<p>Setelah membaca esai model di atas, gunakan panduan berikut untuk mengidentifikasi struktur dan teknik penulisannya. Jawab pertanyaan-pertanyaan ini dalam dokumen Google Docs Anda.</p><h2>Pertanyaan Analisis Struktur</h2><ol><li><strong>Tesis</strong> — Di paragraf mana pernyataan tesis ditemukan? Tuliskan kalimat tesis tersebut. Apakah tesis menyatakan posisi penulis dengan jelas?</li><li><strong>Argumen Utama</strong> — Sebutkan minimal 2 argumen utama yang diajukan penulis. Bukti apa yang digunakan untuk mendukung setiap argumen?</li><li><strong>Organisasi</strong> — Bagaimana penulis menyusun paragraf? Apakah ada transisi yang jelas antar paragraf? Sebutkan contoh kalimat transisi yang digunakan.</li><li><strong>Kosakata</strong> — Identifikasi 5 kata atau frasa yang menunjukkan pilihan diksi akademis. Mengapa pilihan kata tersebut tepat dalam konteks esai argumentatif?</li><li><strong>Kesimpulan</strong> — Bagaimana penulis menutup esai? Apakah kesimpulan memperkuat tesis awal?</li></ol><h2>Format Ringkasan Penelaahan</h2><p>Tulis ringkasan hasil penelaahan Anda dalam <strong>Google Docs</strong> dengan format:</p><ul><li>Judul esai yang ditelaah</li><li>Tesis (kutip langsung)</li><li>Argumen-argumen utama (minimal 2)</li><li>Teknik penulisan yang efektif (minimal 3)</li><li>Refleksi: apa yang akan Anda terapkan dalam esai Anda sendiri?</li></ul>",
    url: null,
    urutan: 3,
    pertemuanKe: 2,
  },
  // ─── Tahap 3 — KMBM — Pertemuan 1 ────────────────────────────────────────────
  {
    id: "c5",
    tahapId: "t3",
    tipe: "VIDEO",
    kategori: "LIHAT",
    judul: "Tutorial Kolaborasi Google Docs secara Bersamaan",
    body: null,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    urutan: 1,
    pertemuanKe: 1,
  },
  {
    id: "c7",
    tahapId: "t3",
    tipe: "TEKS",
    kategori: "BERKONTRIBUSI",
    judul: "Panduan Menulis Esai Kolaboratif",
    body: "<p>Pada tahap ini Anda bekerja dalam kelompok untuk menyusun satu esai bersama. Langkah-langkah:</p><ol><li>Buka Google Docs yang sudah dibagikan dosen</li><li>Diskusikan pembagian tugas penulisan di forum kelompok</li><li>Setiap anggota mengerjakan bagiannya</li><li>Review bersama sebelum dikumpulkan</li></ol>",
    url: null,
    urutan: 2,
    pertemuanKe: 1,
  },
  {
    id: "c8",
    tahapId: "t3",
    tipe: "DOKUMEN",
    kategori: "LIHAT",
    judul: "Rubrik Penilaian Esai Kolaboratif",
    body: null,
    url: "https://docs.google.com/document/d/1xyz456/edit",
    urutan: 3,
    pertemuanKe: 1,
  },
  {
    id: "c9",
    tahapId: "t3",
    tipe: "TEMPLATE",
    kategori: "SERAHKAN",
    judul: "Template Esai Kolaboratif — Salin untuk Kelompok Anda",
    body: null,
    url: "https://docs.google.com/document/d/1template/edit",
    urutan: 4,
    pertemuanKe: 1,
  },
  // ─── Tahap 3 — KMBM — Pertemuan 2 ────────────────────────────────────────────
  // Topik kolaboratif: Jurnalis dan Netizen
  {
    id: "c17",
    tahapId: "t3",
    tipe: "TEKS",
    kategori: "BERKONTRIBUSI",
    judul: "Topik Esai Kolaboratif: Jurnalis dan Netizen",
    body: "<p>Pada pertemuan kedua, kelompok Anda akan menulis esai argumentatif bersama dengan topik <strong>\"Jurnalis dan Netizen: Siapa yang Lebih Dipercaya?\"</strong></p><h2>Latar Belakang Topik</h2><p>Di era media sosial, batas antara jurnalis profesional dan netizen semakin kabur. Siapa pun dapat memproduksi dan menyebarkan informasi. Hal ini memunculkan perdebatan: apakah jurnalisme profesional masih relevan, ataukah netizen yang lebih cepat dan lebih dekat dengan peristiwa justru lebih dipercaya?</p><h2>Panduan Penulisan Kelompok</h2><ol><li><strong>Tentukan posisi kelompok</strong> — Apakah kelompok Anda berpihak pada jurnalis profesional, netizen, atau menawarkan pandangan ketiga?</li><li><strong>Bagi tugas penulisan</strong>:<ul><li>Anggota 1: Paragraf pendahuluan + tesis</li><li>Anggota 2: Argumen utama 1 + bukti</li><li>Anggota 3: Argumen utama 2 + bukti</li><li>Semua anggota: Review dan revisi bersama</li></ul></li><li><strong>Gunakan Google Docs</strong> yang dibagikan dosen. Pastikan semua anggota memiliki akses edit.</li><li><strong>Cantumkan nama semua anggota</strong> di bagian atas dokumen.</li></ol><h2>Sumber Referensi yang Disarankan</h2><ul><li>Laporan Reuters Institute Digital News Report</li><li>Artikel jurnal tentang citizen journalism</li><li>Data survei kepercayaan media di Indonesia</li></ul>",
    url: null,
    urutan: 1,
    pertemuanKe: 2,
  },
  {
    id: "c18",
    tahapId: "t3",
    tipe: "TEMPLATE",
    kategori: "SERAHKAN",
    judul: "Template Esai Kolaboratif — Topik Jurnalis dan Netizen",
    body: null,
    url: "https://docs.google.com/document/d/1jurnalis-template/edit",
    urutan: 2,
    pertemuanKe: 2,
  },
  // ─── Tahap 4 — IMMM — Pertemuan 1 ────────────────────────────────────────────
  // Rubrik bersumber dari: "Kriteria Penulisan Esai" oleh Rina Rosdiana
  {
    id: "c6",
    tahapId: "t4",
    tipe: "TEKS",
    kategori: "SERAHKAN",
    judul: "Panduan dan Rubrik Penilaian Esai Mandiri",
    body: "<p>Tulis esai argumentatif mandiri Anda <strong>minimal 800 kata</strong> dengan referensi minimal 3 sumber akademik. Esai akan dinilai berdasarkan <strong>5 aspek rubrik</strong> berikut (skor 1–4 per aspek):</p><ol><li><strong>Isi/Konten</strong> — Pengembangan gagasan utama dan pernyataan tesis; dukungan ide dengan detail dan/atau contoh yang kuat dan relevan</li><li><strong>Organisasi</strong> — Keteraturan argumen dan bukti pendukung; penggunaan transisi antar paragraf yang efektif</li><li><strong>Kosakata</strong> — Ketepatan dan variasi pemilihan diksi sesuai konteks akademis</li><li><strong>Kebahasaan</strong> — Ketepatan tata bahasa dan penggunaan leksikal dalam penyusunan kalimat</li><li><strong>Mekanik</strong> — Ejaan, tanda baca, dan kaidah penulisan yang tepat</li></ol><p><strong>Rumus Nilai:</strong> (Jumlah skor / 5) × 25 = Nilai total (skala 100)</p><ul><li>Esai ditulis langsung di kolom teks yang tersedia</li><li>Draf tersimpan otomatis setiap 30 detik</li><li>Setelah dikumpulkan, esai <strong>tidak dapat diubah</strong> lagi</li></ul>",
    url: null,
    urutan: 1,
    pertemuanKe: 1,
  },
  // ─── Tahap 4 — IMMM — Pertemuan 2 ────────────────────────────────────────────
  // Topik esai mandiri: Media Sosial dan Kualitas Berpikir Kritis
  {
    id: "c19",
    tahapId: "t4",
    tipe: "TEKS",
    kategori: "SERAHKAN",
    judul: "Topik Esai Mandiri: Media Sosial dan Berpikir Kritis",
    body: "<p>Untuk pertemuan kedua, Anda diminta menulis esai argumentatif mandiri dengan topik:</p><blockquote><p><strong>\"Apakah Media Sosial Meningkatkan atau Menurunkan Kualitas Berpikir Kritis Mahasiswa?\"</strong></p></blockquote><h2>Panduan Memilih Posisi</h2><p>Anda bebas memilih salah satu posisi:</p><ul><li><strong>Posisi A:</strong> Media sosial <em>meningkatkan</em> berpikir kritis (paparan informasi beragam, diskusi lintas perspektif)</li><li><strong>Posisi B:</strong> Media sosial <em>menurunkan</em> berpikir kritis (filter bubble, hoaks, distraksi)</li><li><strong>Posisi C:</strong> Dampak bergantung pada <em>cara penggunaan</em> (tidak hitam-putih)</li></ul><h2>Sumber Referensi yang Disarankan</h2><ol><li>Penelitian tentang efek media sosial pada kemampuan kognitif mahasiswa</li><li>Laporan We Are Social: Digital 2025 Indonesia</li><li>Artikel jurnal tentang critical thinking di era digital</li></ol><h2>Ketentuan</h2><ul><li>Minimal <strong>800 kata</strong></li><li>Minimal <strong>3 sumber akademik</strong></li><li>Gunakan format sitasi <strong>APA 7th edition</strong></li><li>Tulis langsung di kolom teks yang tersedia di halaman tugas</li></ul>",
    url: null,
    urutan: 2,
    pertemuanKe: 2,
  },
  // ─── Tahap 5 — IMTM — Pertemuan 2 ────────────────────────────────────────────
  // Petunjuk integrasi dan publikasi multimodal
  {
    id: "c20",
    tahapId: "t5",
    tipe: "TEKS",
    kategori: "SERAHKAN",
    judul: "Panduan Integrasi dan Publikasi Teks Multimodal",
    body: "<p>Pada tahap akhir ini, Anda mengintegrasikan karya tulis yang telah dibuat sepanjang perkuliahan dan mempresentasikannya dalam format <strong>multimodal</strong> — menggabungkan teks, gambar, dan elemen visual.</p><h2>Apa yang Perlu Diintegrasikan?</h2><ul><li>Gagasan utama dari esai mandiri (Tahap 4)</li><li>Temuan dari penelaahan sumber (Tahap 2)</li><li>Perspektif kolaboratif dari esai kelompok (Tahap 3)</li></ul><h2>Format Publikasi yang Diterima</h2><ol><li><strong>Infografis</strong> — Gunakan Canva untuk membuat infografis yang merangkum argumen utama esai Anda. Minimal 2 halaman/slide.</li><li><strong>Presentasi Slide</strong> — Google Slides atau Canva Presentation, minimal 8 slide.</li></ol><h2>Kriteria Penilaian Multimodal</h2><ul><li><strong>Koherensi konten</strong> — Apakah pesan visual selaras dengan argumen teks?</li><li><strong>Desain visual</strong> — Keterbacaan, pemilihan warna, dan tata letak yang efektif</li><li><strong>Kelengkapan informasi</strong> — Tesis, argumen, bukti, dan kesimpulan tersaji dengan jelas</li><li><strong>Orisinalitas</strong> — Karya merupakan hasil kerja sendiri, bukan sekadar template tanpa modifikasi</li></ul><h2>Cara Mengumpulkan</h2><p>Setelah selesai, pastikan link Canva atau Google Slides Anda <strong>dapat diakses oleh siapa saja</strong> (pilih \"Anyone with the link can view\"), lalu paste link tersebut di halaman tugas.</p>",
    url: null,
    urutan: 1,
    pertemuanKe: 2,
  },
  {
    id: "c21",
    tahapId: "t5",
    tipe: "TEMPLATE",
    kategori: "LIHAT",
    judul: "Template Infografis Multimodal — Salin di Canva",
    body: null,
    url: "https://www.canva.com/design/DAFimtm-template/view",
    urutan: 2,
    pertemuanKe: 2,
  },
]

// ─── Submission ───────────────────────────────────────────────────────────────

export interface MockSubmission {
  id: string
  tahapId: string
  tahapKode: TahapKode
  userId: string
  namaMahasiswa: string
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
    tahapKode: "SMKM",
    userId: "u2",
    namaMahasiswa: "Ahmad Fauzi",
    isDraft: false,
    submittedAt: "2026-02-18 14:30",
    isiEsai: null,
    linkSubmisi: "https://www.canva.com/design/DAFahmad/view",
    nilaiTotal: null,
    savedAt: null,
  },
  {
    id: "s2",
    tahapId: "t1",
    tahapKode: "SMKM",
    userId: "u3",
    namaMahasiswa: "Budi Santoso",
    isDraft: false,
    submittedAt: "2026-02-19 09:15",
    isiEsai: null,
    linkSubmisi: "https://www.canva.com/design/DAFbudi/view",
    nilaiTotal: null,
    savedAt: null,
  },
  {
    id: "s3",
    tahapId: "t1",
    tahapKode: "SMKM",
    userId: "u4",
    namaMahasiswa: "Citra Lestari",
    isDraft: false,
    submittedAt: "2026-02-17 16:45",
    isiEsai: null,
    linkSubmisi: "https://slides.google.com/presentation/d/1abc/edit",
    nilaiTotal: null,
    savedAt: null,
  },
  {
    id: "s_k1",
    tahapId: "t3",
    tahapKode: "KMBM",
    userId: "u2",
    namaMahasiswa: "Ahmad Fauzi",
    isDraft: false,
    submittedAt: "2026-03-05 13:20",
    isiEsai: null,
    linkSubmisi: "https://docs.google.com/document/d/1ahmad_kolaborasi/edit",
    nilaiTotal: null,
    savedAt: null,
  },
  {
    id: "s_k2",
    tahapId: "t3",
    tahapKode: "KMBM",
    userId: "u3",
    namaMahasiswa: "Budi Santoso",
    isDraft: false,
    submittedAt: "2026-03-05 14:10",
    isiEsai: null,
    linkSubmisi: "https://docs.google.com/document/d/1budi_kolaborasi/edit",
    nilaiTotal: 83.3,
    savedAt: null,
  },
  {
    id: "s_k3",
    tahapId: "t3",
    tahapKode: "KMBM",
    userId: "u4",
    namaMahasiswa: "Citra Lestari",
    isDraft: false,
    submittedAt: "2026-03-06 09:45",
    isiEsai: null,
    linkSubmisi: "https://docs.google.com/document/d/1citra_kolaborasi/edit",
    nilaiTotal: null,
    savedAt: null,
  },
  {
    id: "s4",
    tahapId: "t4",
    tahapKode: "IMMM",
    userId: "u2",
    namaMahasiswa: "Ahmad Fauzi",
    isDraft: true,
    submittedAt: null,
    isiEsai:
      "Esai ini membahas fenomena literasi digital di kalangan mahasiswa Indonesia. Pada era modern ini, kemampuan membaca dan menulis tidak lagi terbatas pada media cetak. Perkembangan teknologi informasi telah membawa perubahan mendasar dalam cara manusia mengakses, memproses, dan memproduksi teks. Mahasiswa sebagai generasi digital native seharusnya memiliki kompetensi literasi yang lebih tinggi, namun kenyataannya menunjukkan paradoks yang menarik untuk diteliti lebih lanjut.",
    linkSubmisi: null,
    nilaiTotal: null,
    savedAt: "2026-04-13 09:15",
  },
  {
    id: "s5",
    tahapId: "t4",
    tahapKode: "IMMM",
    userId: "u3",
    namaMahasiswa: "Budi Santoso",
    isDraft: false,
    submittedAt: "2026-04-10 11:30",
    isiEsai:
      "Media sosial telah menjadi bagian tak terpisahkan dari kehidupan generasi muda Indonesia. Penetrasi internet yang mencapai 77% populasi pada tahun 2025 menjadi katalis percepatan adopsi berbagai platform digital. Dalam konteks pendidikan, fenomena ini membawa peluang sekaligus tantangan yang memerlukan kajian mendalam...",
    linkSubmisi: null,
    nilaiTotal: 87.5,
    savedAt: null,
  },
]

// ─── Nilai Aspek ─────────────────────────────────────────────────────────────

export interface MockNilaiAspek {
  aspek: AspekNilai
  skor: 1 | 2 | 3 | 4
  komentar: string
}

export const mockNilaiAspekList: MockNilaiAspek[] = [
  { aspek: "ISI_KONTEN", skor: 4, komentar: "Gagasan sangat kuat dan relevan dengan topik." },
  {
    aspek: "ORGANISASI",
    skor: 3,
    komentar: "Struktur baik, namun transisi antar paragraf perlu diperkuat.",
  },
  { aspek: "KOSAKATA", skor: 4, komentar: "Pilihan kata akademis dan tepat sasaran." },
  {
    aspek: "KEBAHASAAN",
    skor: 3,
    komentar: "Tata bahasa umumnya benar, ada beberapa kalimat majemuk yang rancu.",
  },
  { aspek: "MEKANIK", skor: 4, komentar: "Ejaan dan tanda baca konsisten." },
]

// ─── Forum ────────────────────────────────────────────────────────────────────

export interface MockPesan {
  id: string
  forumId: string
  userId: string
  namaPengirim: string
  rolePengirim: Role
  isi: string
  createdAt: string
  replyToId: string | null
  replies?: MockPesan[]
}

export const mockPesanList: MockPesan[] = [
  {
    id: "m1",
    forumId: "f1",
    userId: "u2",
    namaPengirim: "Ahmad Fauzi",
    rolePengirim: "MAHASISWA",
    isi: "Bu, boleh saya bertanya tentang batas minimal kata untuk esai di Tahap 4?",
    createdAt: "2026-04-10 10:05",
    replyToId: null,
    replies: [
      {
        id: "m2",
        forumId: "f1",
        userId: "u1",
        namaPengirim: "Dr. Rina Rosdiana",
        rolePengirim: "DOSEN",
        isi: "Boleh Ahmad. Minimal 800 kata ya, dan harus ada referensi minimal 3 sumber akademik.",
        createdAt: "2026-04-10 10:45",
        replyToId: "m1",
      },
    ],
  },
  {
    id: "m3",
    forumId: "f1",
    userId: "u3",
    namaPengirim: "Budi Santoso",
    rolePengirim: "MAHASISWA",
    isi: "Kalau sumber dari jurnal online apakah boleh Bu?",
    createdAt: "2026-04-10 11:00",
    replyToId: null,
    replies: [
      {
        id: "m4",
        forumId: "f1",
        userId: "u1",
        namaPengirim: "Dr. Rina Rosdiana",
        rolePengirim: "DOSEN",
        isi: "Boleh, selama jurnal tersebut terindeks dan dapat diakses. Cantumkan DOI-nya jika ada.",
        createdAt: "2026-04-10 11:20",
        replyToId: "m3",
      },
    ],
  },
  {
    id: "m5",
    forumId: "f1",
    userId: "u4",
    namaPengirim: "Citra Lestari",
    rolePengirim: "MAHASISWA",
    isi: "Apakah format sitasi yang digunakan APA atau Chicago Bu?",
    createdAt: "2026-04-11 08:30",
    replyToId: null,
    replies: [],
  },
  {
    id: "m6",
    forumId: "f1",
    userId: "u1",
    namaPengirim: "Dr. Rina Rosdiana",
    rolePengirim: "DOSEN",
    isi: "Gunakan format APA 7th edition. Panduan lengkapnya sudah ada di materi Tahap 2.",
    createdAt: "2026-04-11 09:00",
    replyToId: null,
    replies: [],
  },
  // ─── Forum Tahap 2 (EPM — Penelaahan) ───────────────────────────────────────
  {
    id: "m_t2_1",
    forumId: "f-t2",
    userId: "u2",
    namaPengirim: "Ahmad Fauzi",
    rolePengirim: "MAHASISWA",
    isi: "Bu, untuk analisis struktur esai model, apakah perlu mencantumkan kutipan langsung dari teksnya?",
    createdAt: "2026-02-28 10:15",
    replyToId: null,
    replies: [
      {
        id: "m_t2_2",
        forumId: "f-t2",
        userId: "u1",
        namaPengirim: "Dr. Rina Rosdiana",
        rolePengirim: "DOSEN",
        isi: "Ya Ahmad, sebaiknya cantumkan kutipan langsung untuk mendukung analisis Anda. Ini akan memperkuat argumen dalam ringkasan penelaahan.",
        createdAt: "2026-02-28 11:00",
        replyToId: "m_t2_1",
      },
    ],
  },
  {
    id: "m_t2_3",
    forumId: "f-t2",
    userId: "u4",
    namaPengirim: "Citra Lestari",
    rolePengirim: "MAHASISWA",
    isi: "Menurut saya esai \"Koruptor dan Komikus\" menarik karena menggunakan pendekatan paradoks. Penulis tidak langsung menghakimi tapi membawa pembaca ke kesimpulan sendiri.",
    createdAt: "2026-02-28 13:20",
    replyToId: null,
    replies: [],
  },
  // ─── Forum Tahap 3 (KMBM — Kolaborasi Kelompok) ──────────────────────────────
  {
    id: "m_t3_1",
    forumId: "f-t3",
    userId: "u2",
    namaPengirim: "Ahmad Fauzi",
    rolePengirim: "MAHASISWA",
    isi: "Halo kelompok! Untuk topik esai kolaboratif, saya usul kita ambil posisi bahwa jurnalis profesional masih lebih dipercaya. Gimana pendapat kalian?",
    createdAt: "2026-03-02 09:30",
    replyToId: null,
    replies: [
      {
        id: "m_t3_2",
        forumId: "f-t3",
        userId: "u3",
        namaPengirim: "Budi Santoso",
        rolePengirim: "MAHASISWA",
        isi: "Setuju! Saya bisa handle bagian argumen pertama + data statistik kepercayaan media.",
        createdAt: "2026-03-02 10:15",
        replyToId: "m_t3_1",
      },
    ],
  },
  {
    id: "m_t3_3",
    forumId: "f-t3",
    userId: "u1",
    namaPengirim: "Dr. Rina Rosdiana",
    rolePengirim: "DOSEN",
    isi: "Bagus! Pastikan setiap argumen didukung minimal satu sumber akademik. Gunakan data dari Reuters Institute Digital News Report untuk statistik kepercayaan media.",
    createdAt: "2026-03-02 11:00",
    replyToId: null,
    replies: [],
  },
]

// ─── Enrollment dengan kelompok (untuk Tahap 3) ──────────────────────────────

export interface MockEnrollment {
  id: string
  kelasId: string
  userId: string
  namaMahasiswa: string
  nim: string | null
  email: string
  joinedAt: string
  kelompok: string | null
}

export const mockEnrollmentList: MockEnrollment[] = [
  { id: "e1", kelasId: "k1", userId: "u2", namaMahasiswa: "Ahmad Fauzi",    nim: "1501621001", email: "ahmad@mhs.unj.ac.id",  joinedAt: "2026-02-12", kelompok: "Kelompok A" },
  { id: "e2", kelasId: "k1", userId: "u3", namaMahasiswa: "Budi Santoso",   nim: "1501621002", email: "budi@mhs.unj.ac.id",   joinedAt: "2026-02-12", kelompok: "Kelompok A" },
  { id: "e3", kelasId: "k1", userId: "u4", namaMahasiswa: "Citra Lestari",  nim: "1501621003", email: "citra@mhs.unj.ac.id",  joinedAt: "2026-02-13", kelompok: "Kelompok B" },
  { id: "e4", kelasId: "k1", userId: "u5", namaMahasiswa: "Dian Permata",   nim: "1501621004", email: "dian@mhs.unj.ac.id",   joinedAt: "2026-02-13", kelompok: "Kelompok B" },
  { id: "e5", kelasId: "k1", userId: "u6", namaMahasiswa: "Eko Prasetyo",   nim: "1501621005", email: "eko@mhs.unj.ac.id",    joinedAt: "2026-02-14", kelompok: "Kelompok C" },
  { id: "e6", kelasId: "k1", userId: "u7", namaMahasiswa: "Fitri Handayani",nim: null,         email: "fitri@mhs.unj.ac.id",  joinedAt: "2026-02-14", kelompok: "Kelompok C" },
]
