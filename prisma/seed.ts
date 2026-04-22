import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // ── Admin ──────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@mediamenulis.id" },
    update: {},
    create: {
      nama: "Admin",
      email: "admin@mediamenulis.id",
      password: adminPassword,
      role: "ADMIN",
    },
  })
  console.log(`✓ Admin: ${admin.email}  (kata sandi: admin123)`)

  // ── Dosen ──────────────────────────────────────────────────────────────────
  const dosenPassword = await bcrypt.hash("dosen123", 12)
  const dosen = await prisma.user.upsert({
    where: { email: "dosen@mediamenulis.id" },
    update: {},
    create: {
      nama: "Dosen Media Menulis",
      email: "dosen@mediamenulis.id",
      password: dosenPassword,
      role: "DOSEN",
    },
  })
  console.log(`✓ Dosen: ${dosen.email}  (kata sandi: dosen123)`)

  console.log("\nSeeding selesai.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
