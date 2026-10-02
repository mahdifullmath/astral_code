import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({ token: z.string().min(16), password: z.string().min(8) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { token, password } = parsed.data;

  const rec = await prisma.passwordReset.findUnique({ where: { token } });
  if (!rec || rec.expiresAt < new Date())
    return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: rec.userId }, data: { passwordHash: hash } });
  await prisma.passwordReset.delete({ where: { token } });
  return NextResponse.json({ ok: true });
}
