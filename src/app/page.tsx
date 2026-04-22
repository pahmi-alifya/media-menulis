import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await auth();

  if (!session) redirect("/login");

  switch (session.user.role) {
    case "DOSEN":
      redirect("/dosen/dashboard");
    case "ADMIN":
      redirect("/admin/dosen");
    case "MAHASISWA":
      redirect("/mahasiswa/dashboard");
    default:
      redirect("/404");
  }
}
