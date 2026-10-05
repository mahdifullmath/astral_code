// Home — hero, featured carousel, how-it-works, coin explainer.
import Link from "next/link";
import { getLang, dict } from "@/lib/i18n";

import { listGames, toGameViewModel } from "@/lib/games";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";
import GameCard from "@/components/GameCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const lang = getLang();
  const games = await listGames();
  const featured = games.slice(0, 3).map((g) => toGameViewModel(g, lang));
  const T = (k: string) => dict[lang][k] ?? dict.en[k] ?? k;

  return (
    <>
      <Starfield />
      {/* Hero */}
      <section className="relative container-page py-24 md:py-32 text-center">
        <Reveal>
          <img
            src="/logo/logo.svg"
            alt="Astral Code"
            width={617}
            height={737}
            className="mx-auto mb-8 h-36 w-auto md:h-44"
          />
          <h1 className="font-display text-5xl md:text-7xl font-black mb-4">
            <span className="text-neon">Astral Code</span>
          </h1>
          <p className="text-xl md:text-2xl text-ink-soft max-w-2xl mx-auto mb-8">{T("hero_tag")}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/games" className="btn-primary">{T("play_now")}</Link>
            <Link href="/register" className="btn-ghost">{T("register")}</Link>
          </div>
        </Reveal>
      </section>

      {/* Featured carousel */}
      <section className="container-page py-16">
        <Reveal>
          <h2 className="heading-display text-3xl mb-2">{T("games_title")}</h2>
          <p className="text-ink-faint mb-8">{T("games_sub")}</p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((g) => (
            <Reveal key={g.id} className="h-full">
              <GameCard game={g} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/games" className="btn-ghost">
            {T("games_title")} →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-16">
        <Reveal>
          <h2 className="heading-display text-3xl text-center mb-10">{T("how_title")}</h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <Reveal key={n} className="h-full">
              <div className="card card-hover p-5 h-full">
                <div className="text-3xl mb-3">{["📝", "📱", "◈", "🛒"][n - 1]}</div>
                <h3 className="font-display font-bold text-white mb-1">{T(`how_${n}_t` as any)}</h3>
                <p className="text-sm text-ink-faint">{T(`how_${n}` as any)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Coin explainer */}
      <section className="container-page py-16">
        <Reveal>
          <div className="glass card p-8 md:p-12 text-center max-w-3xl mx-auto">
            <div className="coin-pill text-2xl mb-4 mx-auto w-fit">◈ Astral Coin</div>
            <h2 className="heading-display text-3xl mb-4">{T("coin_title")}</h2>
            <p className="text-ink-soft max-w-xl mx-auto">{T("coin_body")}</p>
            <Link href="/shop" className="btn-fire mt-6 inline-flex">🛒 {T("nav_shop")}</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}


