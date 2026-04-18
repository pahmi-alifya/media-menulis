import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  mockMahasiswaAktif,
  mockTahapList,
  TAHAP_LABEL,
} from "@/lib/mock/data";

// TODO: replace with real API
const user = mockMahasiswaAktif;
const tahapList = mockTahapList.filter((t) => t.kelasId === "k1");
const tahapAktif = tahapList.filter((t) => t.isUnlocked).length;

const pertemuan = [
  {
    ke: 1,
    topik: "Pengantar Esai Argumentatif",
    deskripsi:
      "Mengenal pengertian, karakteristik, dan struktur esai argumentatif.",
  },
  {
    ke: 2,
    topik: "Korupsi dan Komikus",
    deskripsi:
      "Menelaah esai model bertopik isu sosial dan menulis esai mandiri.",
  },
];

export default function MahasiswaDashboardPage() {
  return (
    <div className="space-y-6">
      {/* <div>
        <h1 className="text-2xl font-bold">Halo, {user.nama.split(" ")[0]}!</h1>
        <p className="text-muted-foreground mt-1">
          Tahap aktif:{" "}
          <span className="font-medium text-foreground">
            {tahapAktif}/5 — {TAHAP_LABEL[tahapList[Math.min(tahapAktif - 1, 4)].kode].singkat}
          </span>
        </p>
      </div> */}

      {/* Stepper mini */}
      {/* <div className="flex items-center gap-1">
        {tahapList.map((t, idx) => (
          <div key={t.id} className="flex items-center gap-1 flex-1">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold border-2 shrink-0 ${
                t.isUnlocked
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-muted"
              }`}
            >
              {t.urutan}
            </div>
            {idx < tahapList.length - 1 && (
              <div
                className={`h-0.5 flex-1 ${tahapList[idx + 1].isUnlocked ? "bg-primary/40" : "bg-muted"}`}
              />
            )}
          </div>
        ))}
      </div> */}

      {/* Pertemuan cards */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Pertemuan</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {pertemuan.map((p) => (
            <Card key={p.ke} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">Pertemuan {p.ke}</CardTitle>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {p.topik}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">{p.deskripsi}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Link href={`/mahasiswa/pertemuan/${p.ke}`} className="w-full">
                  <Button className="w-full gap-2" size="sm">
                    Masuk Pertemuan {p.ke}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
