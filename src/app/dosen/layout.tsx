import DosenSidebar from "@/components/layout/DosenSidebar"

export default function DosenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DosenSidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        {children}
      </main>
    </div>
  )
}
