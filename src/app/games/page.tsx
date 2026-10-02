// Games catalog — data-driven grid of GameCards.
import { getLang } from "@/lib/i18n";
import { listGames, toGameViewModel } from "@/lib/games";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";
import GameCard from "@/components/GameCard";
import { dict } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const metadata = { title: "Games" };

export default async function Games() {
  const lang = getLang();
  const d = dict[lang];
  const games = await listGames();
  const view = games.map((g) => toGameViewModel(g, lang));

  return (
    <div className="container-page py-16">
      <Starfield />
      <Reveal>
        <h1 className="heading-display text-4xl mb-2">{d.games_title}</h1>
        <p className="text-ink-faint mb-10">{d.games_sub}</p>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {view.map((g) => (
          <Reveal key={g.id}>
            <GameCard game={g} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
