// Server-side coin award. Game clients (Unity/AR) call this after a validated
// session with a per-game API key + idempotency nonce.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const DAILY_CAP = parseInt(process.env.DAILY_COIN_CAP_PER_GAME ?? "500", 10);
const MIN_DUR = parseInt(process.env.SESSION_MIN_DURATION_SEC ?? "30", 10);
const MAX_DUR = parseInt(process.env.SESSION_MAX_DURATION_SEC ?? "7200", 10);

export async function POST(req: Request) {
  // Game API key check (master or per-game).
  const auth = req.headers.get("authorization") ?? "";
  const master = process.env.GAME_API_MASTER_KEY;
  if (!master || !auth.startsWith("Bearer "))
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  const key = auth.slice(7);

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const { gameSlug, nonce, userId, durationSec, levelsCleared = 0, clientMeta } = body as any;
  if (!gameSlug || !nonce) return NextResponse.json({ error: "gameSlug and nonce required" }, { status: 400 });

  const game = await prisma.game.findUnique({ where: { slug: gameSlug } });
  if (!game || !game.isActive) return NextResponse.json({ error: "Unknown game" }, { status: 404 });

  // Verify per-game API key (HMAC of nonce+userId+gameSlug with game.apiKeyHash salt).
  if (game.apiKeyHash) {
    const expected = crypto.createHmac("sha256", game.apiKeyHash).update(`${nonce}:${userId}:${gameSlug}`).digest("hex");
    if ((body as any).hmac !== expected) return NextResponse.json({ error: "Bad signature" }, { status: 401 });
  } else if (key !== master) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  // Idempotency: one award per nonce.
  const existing = await prisma.playSession.findUnique({ where: { clientNonce: nonce } });
  if (existing) return NextResponse.json({ ok: true, coinsAwarded: existing.coinsAwarded, duplicate: true });

  // Duration sanity.
  if (typeof durationSec !== "number" || durationSec < MIN_DUR || durationSec > MAX_DUR)
    return NextResponse.json({ error: "Invalid session duration" }, { status: 400 });

  // Compute reward, respecting the daily cap per game.
  const raw = game.coinsPerSession + game.coinsPerLevel * levelsCleared;
  const capLeft = await (async () => {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    const today = await prisma.coinTransaction.findMany({
      where: { userId: userId ?? "guest", kind: "session", createdAt: { gte: since } },
      select: { amount: true },
    });
    const earnedToday = today.reduce((a, b) => a + b.amount, 0);
    return Math.max(0, game.dailyCapCoins - earnedToday);
  })();
  const award = Math.min(raw, capLeft);

  // Record session + ledger atomically (wallet lazy-created).
  const res = await prisma.$transaction(async (tx) => {
    const session = await tx.playSession.create({
      data: {
        gameId: game.id,
        awardedBy: userId ?? null,
        durationSec,
        levelsCleared,
        coinsAwarded: award,
        clientNonce: nonce,
        clientMeta: clientMeta ?? undefined,
      },
    });
    if (award > 0 && userId) {
      await tx.wallet.upsert({ where: { userId }, update: {}, create: { userId, balance: 0 } });
      const w = await tx.wallet.findUniqueOrThrow({ where: { userId } });
      const newBalance = w.balance + award;
      await tx.wallet.update({ where: { userId }, data: { balance: newBalance } });
      await tx.coinTransaction.create({
        data: { userId, amount: award, kind: "session", refId: session.id, balanceAfter: newBalance },
      });
    }
    // Leaderboard: store total time+levels as the score.
    await tx.leaderboardScore.upsert({
      where: { userId_gameId: { userId: userId ?? "guest", gameId: game.id } },
      update: { score: durationSec + levelsCleared * 100 },
      create: { userId: userId ?? "guest", gameId: game.id, score: durationSec + levelsCleared * 100 },
    });
    return session;
  });

  return NextResponse.json({ ok: true, coinsAwarded: award, sessionId: res.id }, { status: 201 });
}
