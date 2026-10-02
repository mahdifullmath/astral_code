// Player dashboard — profile, balance, stats, achievements, coin history.
import { getSession } from "@/lib/session";
import { getLang, dict } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const s = await getSession();
  if (!s) redirect("/login");
  const lang = getLang();
  const d = dict[lang];

  const user = await prisma.user.findUnique({
    where: { id: s.id },
    include: {
      wallet: true,
      achievements: { include: { achievement: true } },
      ownedCosmetics: true,
    },
  });
  if (!user) redirect("/login");

  // Stats
  const [playSessions, txs] = await Promise.all([
    prisma.playSession.findMany({ where: { awardedBy: s.id } }),
    prisma.coinTransaction.findMany({ where: { userId: s.id }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  const totalPlayTimeSec = playSessions.reduce((a, b) => a + b.durationSec, 0);
  const gamesPlayed = new Set(playSessions.map((p) => p.gameId)).size;

  const fmtTime = (sec: number) =>
    sec >= 3600 ? `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m` : `${Math.floor(sec / 60)}m`;

  return (
    <div className="container-page py-12">
      <Starfield />
      <Reveal>
        <div className="flex items-center gap-4 mb-10">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-neon to-cyan-neon flex items-center justify-center text-2xl font-display font-black text-space-950">
            {user.username[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="heading-display text-3xl">{user.username}</h1>
            <p className="text-ink-faint text-sm">{user.email}</p>
            {user.emailVerified ? <span className="tag mt-1">{d.verified}</span> : <span className="tag mt-1 border-fire-neon/40 text-fire-glow">{d.unverified}</span>}
          </div>
        </div>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal>
          <div className="glass card p-6 h-full">
            <div className="text-ink-faint text-sm mb-1">{d.balance}</div>
            <div className="coin-pill text-2xl">◈ {user.wallet?.balance ?? 0}</div>
          </div>
        </Reveal>
        <Reveal>
          <div className="glass card p-6 h-full">
            <div className="text-ink-faint text-sm mb-1">{d.games_played}</div>
            <div className="text-3xl font-display font-black text-cyan-glow">{gamesPlayed}</div>
          </div>
        </Reveal>
        <Reveal>
          <div className="glass card p-6 h-full">
            <div className="text-ink-faint text-sm mb-1">{d.play_time}</div>
            <div className="text-3xl font-display font-black text-cyan-glow">{fmtTime(totalPlayTimeSec)}</div>
          </div>
        </Reveal>
        <Reveal>
          <div className="glass card p-6 h-full">
            <div className="text-ink-faint text-sm mb-1">{d.achievements}</div>
            <div className="text-3xl font-display font-black text-cyan-glow">{user.achievements.length}</div>
          </div>
        </Reveal>
      </div>

      {/* Achievements */}
      <Reveal>
        <h2 className="heading-display text-2xl mt-10 mb-4">{d.achievements}</h2>
        {user.achievements.length === 0 ? (
          <p className="text-ink-faint">None yet — play a game to earn one.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {user.achievements.map((a) => (
              <div key={a.achievementId} className="glass rounded-xl px-4 py-2 text-sm">
                {a.achievement?.icon ?? "🏆"} {a.achievement?.[lang === "fa" ? "nameFa" : "nameEn"]}
              </div>
            ))}
          </div>
        )}
      </Reveal>

      {/* Coin history */}
      <Reveal>
        <h2 className="heading-display text-2xl mt-10 mb-4">{d.tx_history}</h2>
        {txs.length === 0 ? (
          <p className="text-ink-faint">No transactions yet.</p>
        ) : (
          <div className="glass card divide-y divide-white/5">
            {txs.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <span className="text-ink-soft capitalize">{tx.kind.replace("_", " ")}</span>
                  <span className="text-ink-faint ml-2">{new Date(tx.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={tx.amount >= 0 ? "text-cyan-glow" : "text-fire-glow"}>
                    {tx.amount >= 0 ? "+" : ""}{tx.amount} ◈
                  </span>
                  <span className="text-ink-faint">→ {tx.balanceAfter}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Reveal>

      <div className="mt-10">
        <Link href="/shop" className="btn-ghost">🛒 {d.nav_shop}</Link>
      </div>
    </div>
  );
}
