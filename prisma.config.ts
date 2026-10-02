// Prisma 7 CLI config (used by `prisma db push` / `migrate` / `studio`).
// The runtime connection string is still read from .env via DATABASE_URL.
import { defineConfig } from "prisma/config";

export default defineConfig({

  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:1@localhost:5432/astral_code?schema=public",
  },
});
