import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const s = await getSession();
  const cosmetics = await prisma.cosmetic.findMany();
  const owned = s
    ? await prisma.ownedCosmetic.findMany({ where: { userId: s.id } }).then((o) => new Set(o.map((x) => x.cosmeticId)))
    : new Set<string>();
  const items = cosmetics.map((c) => ({
    id: c.id,
    kind: c.kind,
    nameEn: c.nameEn,
    nameFa: c.nameFa,
    price: c.price,
    image: c.image,
    owned: owned.has(c.id),
  }));
  return NextResponse.json({ items });
}
