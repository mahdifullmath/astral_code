import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },

    select: {
      id: true,
      username: true,
      email: true,
      isAdmin: true,
      emailVerified: true,
      createdAt: true,
      wallet: { select: { balance: true } },
    },
  });
  return NextResponse.json({ users });
}
