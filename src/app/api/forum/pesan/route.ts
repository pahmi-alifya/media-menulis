import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const kontenId = searchParams.get("kontenId")
  const kelasId = searchParams.get("kelasId")
  const kelompok = searchParams.get("kelompok") // null jika bukan kelompok

  if (!kontenId || !kelasId) {
    return NextResponse.json({ error: "Parameter kontenId dan kelasId wajib ada" }, { status: 400 })
  }

  const forum = await prisma.forum.findFirst({
    where: { kontenId, kelasId, namaKelompok: kelompok ?? null },
  })

  if (!forum) {
    return NextResponse.json({ pesans: [] })
  }

  const pesans = await prisma.pesanForum.findMany({
    where: { forumId: forum.id, replyToId: null },
    include: {
      user: { select: { nama: true, role: true } },
      replies: {
        include: {
          user: { select: { nama: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({ pesans })
}
