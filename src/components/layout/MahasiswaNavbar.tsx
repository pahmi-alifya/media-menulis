"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  KeyRound,
  LogIn,
  ChevronsUpDown,
} from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { makeInitials } from "@/lib/utils/forum-helpers";
import { logoutAction } from "@/server/actions/auth.actions";
import {
  setActiveMahasiswaKelasAction,
  joinKelasAction,
} from "@/server/actions/enrollment.actions";
import { toast } from "sonner";

const navItems = [
  { href: "/mahasiswa/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

interface MahasiswaNavbarProps {
  userName: string;
  kelasList: { id: string; nama: string; kode: string }[];
  activeKelasId: string | null;
}

export default function MahasiswaNavbar({
  userName,
  kelasList,
  activeKelasId,
}: MahasiswaNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [kode, setKode] = useState("");
  const [isPending, startTransition] = useTransition();

  const activeKelas = kelasList.find((k) => k.id === activeKelasId) ?? kelasList[0];

  function handleKelasChange(kelasId: string) {
    if (kelasId === activeKelasId) return;
    startTransition(async () => {
      await setActiveMahasiswaKelasAction(kelasId);
      router.push("/mahasiswa/dashboard");
    });
  }

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  function handleJoin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!kode.trim()) return;
    startTransition(async () => {
      const result = await joinKelasAction(kode);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Berhasil bergabung dengan kelas!");
      setKode("");
      setJoinOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">

          {/* Left: logo + nav */}
          <div className="flex items-center gap-6">
            <Link href="/mahasiswa/dashboard" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Media Menulis" width={100} height={100} className="rounded-md" />
            </Link>

            <nav className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">

            {/* Kelas switcher — desktop */}
            {kelasList.length > 0 && (
              <div className="hidden md:block">
                {kelasList.length === 1 ? (
                  <span className="text-sm font-medium px-2.5 py-1.5 rounded-md bg-muted text-foreground">
                    {activeKelas?.nama}
                  </span>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      disabled={isPending}
                      className="flex items-center gap-1.5 text-sm font-medium px-2.5 py-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors cursor-pointer max-w-45"
                    >
                      <span className="truncate">{activeKelas?.nama ?? "Pilih Kelas"}</span>
                      <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <p className="px-2 py-1.5 text-xs text-muted-foreground">Ganti Kelas</p>
                      <DropdownMenuSeparator />
                      {kelasList.map((k) => (
                        <DropdownMenuItem
                          key={k.id}
                          onClick={() => handleKelasChange(k.id)}
                          className={cn(
                            "flex items-center justify-between",
                            k.id === activeKelasId && "bg-primary/10 text-primary font-medium",
                          )}
                        >
                          <span className="truncate">{k.nama}</span>
                          <code className="text-[10px] text-muted-foreground font-mono ml-2 shrink-0">
                            {k.kode}
                          </code>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}

            {/* Gabung Kelas — desktop */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={() => setJoinOpen(true)}
            >
              <LogIn className="h-4 w-4" />
              Gabung Kelas
            </Button>

            {/* User avatar → dropdown (Ganti Sandi & Keluar) — desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden md:flex w-8 h-8 rounded-full bg-primary/10 items-center justify-center text-xs font-bold text-primary cursor-pointer hover:bg-primary/20 transition-colors shrink-0">
                {makeInitials(userName)}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium leading-none truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Mahasiswa</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/mahasiswa/akun/ganti-sandi")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <KeyRound className="h-4 w-4" />
                  Ganti Sandi
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Hamburger — mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-card px-4 py-3 space-y-1 shadow-md">

            {/* Nav items */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* Kelas switcher */}
            {kelasList.length > 0 && (
              <div className="pt-1 pb-0.5">
                <p className="text-xs text-muted-foreground px-3 mb-1">Kelas</p>
                {kelasList.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => { handleKelasChange(k.id); setMobileOpen(false); }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm",
                      k.id === activeKelasId
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <span>{k.nama}</span>
                    <code className="text-[10px] font-mono">{k.kode}</code>
                  </button>
                ))}
              </div>
            )}

            {/* Gabung Kelas */}
            <button
              onClick={() => { setMobileOpen(false); setJoinOpen(true); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              <LogIn className="h-4 w-4" />
              Gabung Kelas
            </button>

            <div className="pt-2 mt-1 border-t space-y-1">
              <div className="flex items-center gap-2.5 px-3 py-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {makeInitials(userName)}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Mahasiswa</p>
                </div>
              </div>
              <Link
                href="/mahasiswa/akun/ganti-sandi"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                <KeyRound className="h-4 w-4" />
                Ganti Sandi
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Dialog Gabung Kelas */}
      <Dialog open={joinOpen} onOpenChange={(v) => { setJoinOpen(v); if (!v) setKode(""); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Gabung Kelas</DialogTitle>
            <DialogDescription>
              Masukkan kode kelas yang diberikan oleh dosen.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleJoin} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="kode-join">Kode Kelas</Label>
              <Input
                id="kode-join"
                placeholder="Contoh: AB1234"
                value={kode}
                onChange={(e) => setKode(e.target.value.toUpperCase())}
                maxLength={6}
                className="text-center text-lg font-mono tracking-widest uppercase"
              />
            </div>
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={kode.trim().length === 0 || isPending}
            >
              <LogIn className="h-4 w-4" />
              {isPending ? "Bergabung..." : "Gabung Kelas"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
