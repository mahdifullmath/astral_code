import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { username, email, password } = parsed.data;
  const lowerEmail = email.toLowerCase();

  const exists = await prisma.user.findUnique({ where: { email: lowerEmail } });
  if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email: lowerEmail,
      passwordHash,
      wallet: { create: {} },
    },
  });

  // Verification email (dev: console only)
  const token = crypto.randomBytes(16).toString("hex");
  await prisma.verificationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });
  if (!process.env.SMTP_HOST) {
    // Dev mode: print verification link to console instead of sending email.
    console.log(`[email] Verify ${lowerEmail}: ${process.env.NEXTAUTH_URL}/verify-email?token=${token}`);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
