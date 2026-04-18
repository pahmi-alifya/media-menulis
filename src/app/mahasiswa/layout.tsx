import MahasiswaNavbar from "@/components/layout/MahasiswaNavbar"

export default function MahasiswaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <MahasiswaNavbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
