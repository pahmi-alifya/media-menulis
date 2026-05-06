"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  kelasList: { id: string; nama: string }[];
  selectedKelasId: string | null;
}

const ALL_VALUE = "All";

export default function KelasFilterSelect({
  kelasList,
  selectedKelasId,
}: Props) {
  const router = useRouter();

  function handleChange(value: string) {
    if (value === ALL_VALUE) {
      router.push("/dosen/mahasiswa");
    } else {
      router.push(`/dosen/mahasiswa?k=${value}`);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground shrink-0">
        Filter kelas:
      </span>
      <Select
        value={selectedKelasId ?? ALL_VALUE}
        onValueChange={(v) => v && handleChange(v)}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Pilih kelas..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Semua Kelas</SelectItem>
          {kelasList.map((k) => (
            <SelectItem key={k.id} value={k.id}>
              {k.nama}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
