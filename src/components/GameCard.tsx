"use client";
// Game catalog card with tilt, glow hover, genre tags, and Astral Coin reward.
import Link from "next/link";
import { useLang, t } from "@/lib/i18n-client";
import type { GameViewModel } from "@/lib/games";

export default function GameCard({ game }: { game: GameViewModel }) {
  const lang = useLang();
  const handleTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${y * -10}deg)`;
  };
  const reset = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
  };

  return (
    <Link href={`/games/${game.slug}`} className="group block focus:outline-none">
      <div
        className="tilt card card-hover overflow-hidden"
        onMouseMove={handleTilt}
        onMouseLeave={reset}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={game.coverUrl}
            alt={game.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-space-950 to-transparent" />
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {game.genre.split(",").map((g) => (
              <span key={g} className="tag">{g.trim()}</span>
            ))}
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-bold text-white mb-1 group-hover:text-cyan-glow transition">
            {game.title}
          </h3>
          <p className="text-sm text-ink-faint line-clamp-2 mb-3">{game.description}</p>
          <div className="flex items-center justify-between">
            <span className="coin-pill">
              <span aria-hidden>◈</span> {game.coinsPerSession} {t("coins_per_session", lang)}
            </span>
            <span className="text-cyan-neon text-sm font-semibold group-hover:translate-x-1 transition inline-flex items-center gap-1">
              {t("learn_more", lang)} →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
