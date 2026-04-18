import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import TahapStepper from "@/components/tahap/TahapStepper"
import KontenViewer from "@/components/konten/KontenViewer"
import {
  mockTahapList,
  mockKontenList,
  mockSubmissionList,
  mockPesanList,
  mockEnrollmentList,
  TAHAP_LABEL,
} from "@/lib/mock/data"

// TODO: replace with real API
const tahapList = mockTahapList.filter((t) => t.kelasId === "k1")

export default async function MahasiswaTahapDetailPage({
  params,
}: {
  params: Promise<{ pertemuanKe: string; tahapId: string }>
}) {
  const { pertemuanKe, tahapId } = await params
  const p = Number(pertemuanKe)

  const tahap = tahapList.find((t) => t.id === tahapId) ?? tahapList[0]
  const kontenList = mockKontenList.filter(
    (k) => k.tahapId === tahap.id && k.pertemuanKe === p
  )
  const mySubmission = mockSubmissionList.find(
    (s) => s.tahapId === tahap.id && s.userId === "u2"
  ) ?? null

  // Pesan forum untuk tahap ini (difilter per tahap, TODO: filter per konten di DB)
  const pesanList = mockPesanList.filter((m) => m.forumId === `f-${tahap.id}`)

  // Kelompok mahasiswa — untuk ditampilkan di forum Tahap 3 (KMBM)
  const myEnrollment = mockEnrollmentList.find(
    (e) => e.kelasId === "k1" && e.userId === "u2"
  )
  const kelompokName = myEnrollment?.kelompok ?? null

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`/mahasiswa/pertemuan/${p}`} className="hover:text-foreground">
          Pertemuan {p}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">
          Tahap {tahap.urutan}: {TAHAP_LABEL[tahap.kode].singkat}
        </span>
      </div>

      {/* Stepper */}
      <Card>
        <CardContent className="pt-4">
          <TahapStepper
            tahapList={tahapList}
            activeTahapId={tahap.id}
            kelasId="k1"
            baseHref={`/mahasiswa/pertemuan/${p}/tahap`}
          />
        </CardContent>
      </Card>

      {/* Deskripsi tahap */}
      <div>
        <h1 className="text-xl font-bold mb-1">
          Tahap {tahap.urutan}: {TAHAP_LABEL[tahap.kode].singkat}
        </h1>
        <p className="text-muted-foreground text-sm">{tahap.nama}</p>
        <p className="text-sm mt-2">{tahap.tujuan}</p>
      </div>

      {/* Konten viewer — satu item per layar */}
      <div>
        <h2 className="font-semibold mb-3">Materi Pertemuan {p}</h2>
        <KontenViewer
          kontenList={kontenList}
          tahap={tahap}
          pertemuanKe={p}
          mySubmission={mySubmission}
          pesanList={pesanList}
          kelompokName={kelompokName}
        />
      </div>
    </div>
  )
}
