import { prisma } from "@/lib/db";

// Data-driven game catalog. Server-only: reads Postgres.
// Add a new game by upserting into the `games` table (admin panel or seed).

export interface GameRow {
  id: string;
  slug: string;
  titleEn: string;
  titleFa: string;
  descriptionEn: string;
  descriptionFa: string;
  genre: string;
  coverUrl: string;
  bannerUrl: string | null;
  trailerUrl: string | null;
  screenshots: string[];
  howToPlayEn: string;
  howToPlayFa: string;
  deviceReqs: string[];
  launchUrl: string | null;
  coinsPerSession: number;
  coinsPerLevel: number;
  dailyCapCoins: number;
  dailyLoginBonus: number;
  isActive: boolean;
}

export async function listGames(activeOnly = true): Promise<GameRow[]> {
  const rows = await prisma.game.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: { releasedAt: "asc" },
  });
  return rows;
}

export async function getGameBySlug(slug: string): Promise<GameRow | null> {
  return prisma.game.findUnique({ where: { slug } });
}

// Localized view model consumed by client pages.
export interface GameViewModel {
  id: string;
  slug: string;
  title: string;
  description: string;
  howToPlay: string;
  genre: string;
  coverUrl: string;
  bannerUrl: string | null;
  trailerUrl: string | null;
  screenshots: string[];
  deviceReqs: string[];
  launchUrl: string | null;
  coinsPerSession: number;
  coinsPerLevel: number;
  dailyCapCoins: number;
  dailyLoginBonus: number;
}

export function toGameViewModel(row: GameRow, lang: "en" | "fa"): GameViewModel {
  const L = lang === "fa" ? "Fa" : "En";
  return {
    id: row.id,
    slug: row.slug,
    title: row[(`title${L}`) as "titleEn"],
    description: row[(`description${L}`) as "descriptionEn"],
    howToPlay: row[(`howToPlay${L}`) as "howToPlayEn"],
    genre: row.genre,
    coverUrl: row.coverUrl,
    bannerUrl: row.bannerUrl,
    trailerUrl: row.trailerUrl,
    screenshots: row.screenshots,
    deviceReqs: row.deviceReqs,
    launchUrl: row.launchUrl,
    coinsPerSession: row.coinsPerSession,
    coinsPerLevel: row.coinsPerLevel,
    dailyCapCoins: row.dailyCapCoins,
    dailyLoginBonus: row.dailyLoginBonus,
  };
}
