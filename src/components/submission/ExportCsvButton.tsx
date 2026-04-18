"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type MockSubmission } from "@/lib/mock/data"

interface ExportCsvButtonProps {
  submissions: MockSubmission[]
  tahapKode: string
}

export default function ExportCsvButton({ submissions, tahapKode }: ExportCsvButtonProps) {
  function handleExport() {
    const headers = ["Nama Mahasiswa", "Status", "Waktu Kumpul", "Nilai"]
    const rows = submissions.map((s) => [
      s.namaMahasiswa,
      s.isDraft ? "Draft" : "Terkumpul",
      s.submittedAt ?? "-",
      s.nilaiTotal !== null ? String(s.nilaiTotal) : "-",
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
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
