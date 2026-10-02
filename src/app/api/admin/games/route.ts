import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const games = await prisma.game.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ games });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const g = await req.json().catch(() => null);
  if (!g?.slug || !g?.titleEn || !g?.titleFa)
    return NextResponse.json({ error: "slug, titleEn, titleFa required" }, { status: 400 });
  const game = await prisma.game.upsert({
    where: { slug: g.slug },
    update: g,
    create: g,
  });
  return NextResponse.json({ game }, { status: 201 });
}
