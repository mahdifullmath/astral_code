import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}) as any);
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: String(email).toLowerCase() } });
  // Always return 200 to avoid account enumeration.
  if (user) {
    const token = crypto.randomBytes(16).toString("hex");
    await prisma.passwordReset.create({
      data: { token, userId: user.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60) },
    });
    if (!process.env.SMTP_HOST)
      console.log(`[email] Reset ${user.email}: ${process.env.NEXTAUTH_URL}/reset-password?token=${token}`);
  }
  return NextResponse.json({ ok: true });
}
