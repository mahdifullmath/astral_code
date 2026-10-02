import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const rec = await prisma.verificationToken.findUnique({ where: { token } });
  if (!rec || rec.expiresAt < new Date())
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

  await prisma.user.update({ where: { id: rec.userId }, data: { emailVerified: new Date() } });
  await prisma.verificationToken.delete({ where: { token } });
  return NextResponse.json({ ok: true });
}
