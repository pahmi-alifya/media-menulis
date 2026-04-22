"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { joinKelasAction } from "@/server/actions/enrollment.actions"

export default function JoinKelasForm() {
  const router = useRouter()
  const [kode, setKode] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!kode.trim()) return
    startTransition(async () => {
      const result = await joinKelasAction(kode)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Berhasil bergabung dengan kelas!")
      router.refresh()
    })
  }

  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Bergabung dengan Kelas</CardTitle>
        <CardDescription>Masukkan kode kelas yang diberikan oleh dosen</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kode-kelas">Kode Kelas</Label>
            <Input
              id="kode-kelas"
              placeholder="Contoh: AB1234"
              value={kode}
              onChange={(e) => setKode(e.target.value.toUpperCase())}
              maxLength={6}
              className="text-center text-lg font-mono tracking-widest uppercase"
            />
          </div>
          <Button type="submit" className="w-full gap-2" disabled={kode.trim().length === 0 || isPending}>
            <LogIn className="h-4 w-4" />
            {isPending ? "Bergabung..." : "Gabung Kelas"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
