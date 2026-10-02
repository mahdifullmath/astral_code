// Prisma 7 runtime: the client is generated into src/generated/prisma and takes a
// driver adapter. `@prisma/adapter-pg` wraps the `pg` connection pool.
// Run `npx prisma generate` first (see package.json "predev"/"prebuild").
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(
  process.env.DATABASE_URL ??
  "postgresql://postgres:1@localhost:5432/astral_code?schema=public",
);

// ponytail: one client per process; add a pool/reconnect strategy when under load.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.prisma ?? (globalThis.prisma = new PrismaClient({ adapter }));
