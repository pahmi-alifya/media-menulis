"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { enrollMahasiswaAction } from "@/server/actions/enrollment.actions";

interface EnrollMahasiswaFormProps {
  kelasId: string;
}

export default function EnrollMahasiswaForm({
  kelasId,
}: EnrollMahasiswaFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ nama: "", nim: "", email: "" });
  const [result, setResult] = useState<{
    nama: string;
    password: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.nama.trim() || !form.email.trim()) return;

    startTransition(async () => {
      const res = await enrollMahasiswaAction({
        nama: form.nama,
        nim: form.nim,
        email: form.email,
        kelasId,
      });

      if (res.error) {
        toast.error(res.error);
        return;
      }

      if (res.data!.isNewUser && res.data!.password) {
        setResult({ nama: form.nama, password: res.data!.password });
      } else {
        toast.success(`${form.nama} berhasil ditambahkan ke kelas.`);
      }

      setForm({ nama: "", nim: "", email: "" });
      router.refresh();
    });
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.password);
    setCopied(true);
    toast.success("Kata sandi disalin");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tambah Mahasiswa</CardTitle>
        <CardDescription>
          Sistem akan membuat akun otomatis dan menampilkan kata sandi
          sementara.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enroll-nama">Nama Lengkap</Label>
              <Input
                id="enroll-nama"
                placeholder="Nama mahasiswa"
                value={form.nama}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nama: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enroll-nim">NIM / NPM</Label>
              <Input
                id="enroll-nim"
                placeholder="Nomor Induk Mahasiswa"
                value={form.nim}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nim: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="enroll-email">Email</Label>
              <Input
                id="enroll-email"
                type="email"
                placeholder="email@domain.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="gap-2"
            disabled={
              !form.nama.trim() ||
              !form.email.trim() ||
              !form.nim.trim() ||
              isPending
            }
          >
            <Plus className="h-4 w-4" />
            {isPending ? "Menambahkan..." : "Tambahkan"}
          </Button>
        </form>

        {result && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              Mahasiswa berhasil ditambahkan!
            </p>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
              Kata sandi sementara untuk <strong>{result.nama}</strong>:
            </p>
            <div className="flex items-center gap-2 mt-2">
              <code className="bg-white dark:bg-black/20 border px-3 py-1.5 rounded text-sm font-mono tracking-widest">
                {result.password}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-green-600 dark:text-green-500 mt-2">
              Kata sandi hanya ditampilkan sekali.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-7 text-xs text-green-700"
              onClick={() => setResult(null)}
            >
              Tutup
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
