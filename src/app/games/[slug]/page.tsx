// Game detail page — banner, description, how-to-play, device requirements,
// play button, coin reward, and per-game leaderboard.
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLang, dict } from "@/lib/i18n";
import { getGameBySlug, toGameViewModel, type GameRow } from "@/lib/games";
import { prisma } from "@/lib/db";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export default async function GameDetail({ params }: Props) {
  const lang = getLang();
  const d = dict[lang];
  const row = await getGameBySlug(params.slug);
  if (!row) notFound();
  const g = toGameViewModel(row, lang);

  // Per-game top 10
  const top = await prisma.leaderboardScore
    .findMany({
      where: { gameId: row.id },
      orderBy: { score: "desc" },
      take: 10,
      include: { user: { select: { username: true, avatar: true } } },
    });

  return (
    <div>
      <Starfield />
      {/* Banner */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        {g.bannerUrl ? (
          <img src={g.bannerUrl} alt={g.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-space-800 to-space-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-transparent" />
        <div className="absolute bottom-6 container-page">
          <h1 className="heading-display text-4xl md:text-6xl">{g.title}</h1>
          <p className="text-ink-soft mt-2 max-w-2xl">{g.description}</p>
          <div className="flex flex-wrap gap-1 mt-3">
            {g.genre.split(",").map((t) => (
              <span key={t} className="tag">{t.trim()}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page py-12 grid gap-8 md:grid-cols-3">
        {/* Left: main content */}
        <div className="md:col-span-2 space-y-10">
          <Reveal>
            <h2 className="heading-display text-2xl mb-3">{d.how_to_play}</h2>
            <p className="text-ink-soft">{g.howToPlay}</p>
          </Reveal>

          <Reveal>
            <h2 className="heading-display text-2xl mb-3">{d.device_req}</h2>
            <div className="flex flex-wrap gap-2">
              {g.deviceReqs.map((r) => (
                <span key={r} className="glass rounded-lg px-3 py-1 text-sm text-ink-soft">
                  {r === "camera" ? "📷" : r === "gyroscope" ? "🧭" : r === "gps" ? "📍" : "🎤"}{" "}
                  {d[r === "camera" ? "cam" : r === "gyroscope" ? "gyro" : r === "gps" ? "gps" : "message"]}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Screenshots / trailer placeholder */}
          <Reveal>
            <h2 className="heading-display text-2xl mb-3">Screenshots</h2>
            <div className="grid grid-cols-3 gap-3">
              {(g.screenshots.length ? g.screenshots : [g.coverUrl, g.coverUrl, g.coverUrl]).map((s, i) => (
                <div key={i} className="aspect-video card overflow-hidden">
                  <img src={s} alt={`${g.title} ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right: play + leaderboard */}
        <div className="space-y-6">
          <Reveal>
            <div className="glass card p-6 space-y-4">
              <div>
                <div className="text-ink-faint text-sm mb-1">{d.coins_per_session}</div>
                <div className="coin-pill text-lg">◈ {g.coinsPerSession}</div>
                <div className="text-ink-faint text-xs mt-1">
                  +{g.coinsPerLevel} / level · cap {g.dailyCapCoins} / day
                </div>
              </div>
              {g.launchUrl ? (
                <a href={g.launchUrl} target="_blank" rel="noreferrer" className="btn-fire w-full">
                  ▶ {d.play}
                </a>
              ) : (
                <button className="btn-ghost w-full" disabled>
                  WebAR coming soon
                </button>
              )}
            </div>
          </Reveal>

          <Reveal>
            <div className="glass card p-6">
              <h3 className="font-display font-bold text-white mb-4">{d.leaderboard} — {g.title}</h3>
              {top.length === 0 ? (
                <p className="text-ink-faint text-sm">No scores yet. Be the first!</p>
              ) : (
                <ol className="space-y-2">
                  {top.map((s, i) => (
                    <li key={s.id} className="flex items-center gap-3 text-sm">
                      <span className="w-5 text-ink-faint font-display">{i + 1}.</span>
                      <span className="flex-1 text-ink-soft">{s.user.username}</span>
                      <span className="text-cyan-glow font-semibold">{s.score.toLocaleString()}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
