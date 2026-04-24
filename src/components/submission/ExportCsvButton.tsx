"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

type SubmissionRow = {
  isDraft: boolean
  submittedAt: Date | null
  nilaiTotal: number | null
  user: { nama: string; nim: string | null; email: string }
}

interface ExportCsvButtonProps {
  submissions: SubmissionRow[]
  tahapKode: string
}

export default function ExportCsvButton({ submissions, tahapKode }: ExportCsvButtonProps) {
  function handleExport() {
    const headers = ["Nama Mahasiswa", "NIM", "Email", "Status", "Waktu Kumpul", "Nilai"]
    const rows = submissions.map((s) => [
      s.user.nama,
      s.user.nim ?? "-",
      s.user.email,
      s.isDraft ? "Draft" : "Terkumpul",
      s.submittedAt
        ? s.submittedAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
        : "-",
      s.nilaiTotal !== null ? s.nilaiTotal.toFixed(1) : "-",
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `submissions-${tahapKode}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  )
}
