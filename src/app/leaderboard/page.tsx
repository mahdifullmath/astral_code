// Global + per-game leaderboards.
import { getLang, dict } from "@/lib/i18n";
import { listGames, toGameViewModel } from "@/lib/games";
import { prisma } from "@/lib/db";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leaderboard" };

export default async function Leaderboard() {
  const lang = getLang();
  const d = dict[lang];
  const games = await listGames();

  // Global: aggregate each user's best score across all games, top 20.
  const global = await prisma.leaderboardScore.groupBy({
    by: ["userId"],
    _sum: { score: true },
    _count: {},
  });
  const globalTop = await prisma.user.findMany({
    where: { id: { in: global.map((g) => g.userId) } },
    select: { username: true, avatar: true, wallet: true },
    take: 20,
  });

  return (
    <div className="container-page py-12">
      <Starfield />
      <Reveal>
        <h1 className="heading-display text-4xl mb-2">{d.global_lb}</h1>
      </Reveal>

      <Reveal>
        <div className="glass card my-8 divide-y divide-white/5">
          {globalTop.length === 0 ? (
            <p className="p-5 text-ink-faint text-sm">No scores yet.</p>
          ) : (
            globalTop.map((u, i) => (
              <div key={u.username} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg text-ink-faint w-8">{i + 1}</span>
                  <span className="font-semibold text-white">{u.username}</span>
                </div>
                <span className="text-cyan-glow">◈ {u.wallet?.balance ?? 0}</span>
              </div>
            ))
          )}
        </div>
      </Reveal>

      <Reveal>
        <h2 className="heading-display text-2xl mb-6">{d.per_game}</h2>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-3">
        {games.map((g) => <PerGameBoard key={g.id} game={g} lang={lang} />)}
      </div>
    </div>
  );
}

async function PerGameBoard({ game, lang }: { game: Awaited<ReturnType<typeof toGameViewModel>> extends infer T ? any : never; lang: "en" | "fa" }) {
  const row = await prisma.game.findUnique({ where: { slug: game.slug } });
  if (!row) return null;
  const top = await prisma.leaderboardScore.findMany({
    where: { gameId: row.id },
    orderBy: { score: "desc" },
    take: 5,
    include: { user: { select: { username: true } } },
  });
  const title = lang === "fa" ? row.titleFa : row.titleEn;
  return (
    <div className="glass card p-5">
      <h3 className="font-display font-bold text-white mb-3">{title}</h3>
      {top.length === 0 ? (
        <p className="text-ink-faint text-sm">No scores.</p>
      ) : (
        <ol className="space-y-1 text-sm">
          {top.map((s, i) => (
            <li key={s.id} className="flex justify-between">
              <span className="text-ink-soft">{i + 1}. {s.user.username}</span>
              <span className="text-cyan-glow">{s.score.toLocaleString()}</span>
            </li>
          ))}
        </ol>
      )}
      <Link href={`/games/${row.slug}`} className="text-cyan-glow text-sm mt-3 inline-block">View game →</Link>
    </div>
  );
}
