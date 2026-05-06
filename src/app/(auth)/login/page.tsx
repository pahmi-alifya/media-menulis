import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left panel — branding */}
      <div
        className="hidden md:flex flex-col justify-between p-10"
        style={{ background: "var(--sidebar)" }}
      >
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Media Menulis" width={36} height={36} className="rounded-xl" />
          <span className="font-bold text-white text-lg">Media Menulis</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white leading-snug">
            Platform Pembelajaran
            <br />
            Menulis Esai Ilmiah
          </h2>
          <p className="text-indigo-200/70 text-sm leading-relaxed max-w-xs">
            Berbasis model pedagogis{" "}
            <strong className="text-indigo-200">Knows SGM</strong> — Knowledge
            Sharing, Genre-Based, dan Multimodal dari Universitas Negeri
            Jakarta.
          </p>

          <div className="pt-2 space-y-2.5">
            {[
              "5 tahap pembelajaran terstruktur",
              "Materi multimodal (video, slide, dokumen)",
              "Penilaian esai dengan rubrik 5 aspek",
              "Forum diskusi per kelas",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 text-sm text-indigo-200/80"
              >
                <div className="w-4 h-4 rounded-full bg-indigo-400/30 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-indigo-400/40 text-xs">© 2026 Media Menulis</p>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 md:hidden">
            <Image src="/logo.png" alt="Media Menulis" width={32} height={32} className="rounded-lg" />
            <span className="font-bold text-lg">Media Menulis</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold">Masuk ke akun Anda</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Masukkan email dan kata sandi untuk melanjutkan
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            Mahasiswa belum punya akun?{" "}
            <Link
              href="/register"
              className="text-primary font-medium hover:underline underline-offset-4"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
