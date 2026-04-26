"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  GraduationCap,
  KeyRound,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { makeInitials } from "@/lib/utils/forum-helpers";

const navItems = [
  { href: "/dosen/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dosen/mahasiswa", label: "Mahasiswa", icon: Users },
];

function NavContent({ onClose, userName }: { onClose?: () => void; userName: string }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-indigo-400/20 flex items-center justify-center shrink-0">
          <GraduationCap className="h-5 w-5 text-indigo-200" />
        </div>
        <div>
          <span className="font-bold text-white text-[15px] leading-tight block">
            Media Menulis
          </span>
          <span className="text-indigo-300/70 text-[11px]">
            LMS Menulis Esai
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-indigo-400/60 text-[10px] font-semibold uppercase tracking-wider px-3 mb-2">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-indigo-500/25 text-white shadow-sm"
                  : "text-indigo-200/70 hover:bg-white/8 hover:text-indigo-100",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-indigo-300" : "text-indigo-400/60",
                )}
              />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 mb-1">
          <div className="w-7 h-7 rounded-full bg-indigo-400/30 flex items-center justify-center text-xs font-bold text-indigo-200 shrink-0">
            {makeInitials(userName)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white leading-none truncate">
              {userName}
            </p>
            <p className="text-xs text-indigo-300/60 mt-0.5">Dosen</p>
          </div>
        </div>
        <Link
          href="/dosen/akun/ganti-sandi"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-indigo-300/60 hover:bg-white/8 hover:text-indigo-200 transition-all"
        >
          <KeyRound className="h-4 w-4 shrink-0" />
          Ganti Sandi
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-indigo-300/60 hover:bg-white/8 hover:text-indigo-200 transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Keluar
        </Link>
      </div>
    </div>
  );
}

interface DosenSidebarProps {
  userName: string;
}

export default function DosenSidebar({ userName }: DosenSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex md:flex-col w-60 min-h-screen shrink-0"
        style={{ background: "var(--sidebar)" }}
      >
        <NavContent userName={userName} />
      </aside>

      {/* Mobile topbar */}
      <div
        className="md:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-30"
        style={{
          background: "var(--sidebar)",
          borderColor: "var(--sidebar-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-indigo-300" />
          <span className="font-semibold text-white">Media Menulis</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-indigo-200 hover:bg-white/10"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="relative flex flex-col w-64 h-full shadow-2xl z-10"
            style={{ background: "var(--sidebar)" }}
          >
            <NavContent userName={userName} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
