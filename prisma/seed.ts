import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

// Sample/seed data. Run: npm run db:seed
// Idempotent upserts by unique keys — safe to re-run.

const adapter = new PrismaPg(
  process.env.DATABASE_URL ??
  "postgresql://postgres:1@localhost:5432/astral_code?schema=public",
);
const prisma = new PrismaClient({ adapter });

const C = {
  violet: "#8b5cf6",
  cyan: "#22d3ee",
  fire: "#fb923c",
};

async function main() {
  // --- Admin user (change password in production) ---
  const adminPass = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD ?? "astral-admin-123", 10);
  await prisma.user.upsert({
    where: { email: "admin@astralcode.dev" },
    update: { isAdmin: true },
    create: {
      username: "admin",
      email: "admin@astralcode.dev",
      passwordHash: adminPass,
      emailVerified: new Date(),
      isAdmin: true,
      wallet: { create: { balance: 0 } },
    },
  });

  // --- Demo player ---
  const demoPass = await bcrypt.hash("demo-1234", 10);
  const demo = await prisma.user.upsert({
    where: { email: "player@astralcode.dev" },
    update: {},
    create: {
      username: "stardust",
      email: "player@astralcode.dev",
      passwordHash: demoPass,
      emailVerified: new Date(),
      wallet: { create: { balance: 1250 } },
    },
  });

  // --- Games (data-driven; add more here or via admin panel) ---
  const games = [
    {
      slug: "fire-trace",
      titleEn: "Fire Trace",
      titleFa: "رد آتش",
      descriptionEn:
        "Follow a blazing AR trail through real-world locations. Solve fire-based puzzles to light the path and reach the source.",
      descriptionFa:
        "در یک مسیر آتشین واقعیت افزوده در مکان‌های واقعی پیاده شو؛ معماهای آتش را حل کن تا مسیر را روشن کنی و به سرچشمه برسی.",
      genre: "adventure, puzzle, trail",
      coverUrl: "/covers/fire-trace.svg",
      bannerUrl: "/covers/fire-trace-banner.svg",
      screenshots: ["/covers/fire-trace.svg"],
      howToPlayEn: "Open your camera, align the on-screen flame, and follow it. Solve each fire puzzle to advance the trail.",
      howToPlayFa: "دوربین را باز کن، شعله را با تصویر هم‌تراز کن و پشتش برو؛ برای پیشروی در مسیر هر معمای آتش را حل کن.",
      deviceReqs: ["camera", "gyroscope", "gps"],
      launchUrl: "https://webar.astralcode.dev/fire-trace",
      coinsPerSession: 50,
      coinsPerLevel: 10,
      dailyCapCoins: 500,
      dailyLoginBonus: 20,
      isActive: true,
    },
    {
      slug: "cicada",
      titleEn: "Cicada",
      titleFa: "سیکادا",
      descriptionEn:
        "An audio-first AR experience: follow the cicada's song as it moves through your surroundings, unlocking hidden rooms of sound.",
      descriptionFa:
        "تجربه‌ی صوتی واقعیت افزوده: آواز سیکادا را در محیط خود دنبال کن تا اتاق‌های پنهان صدا را باز کنی.",
      genre: "audio, exploration, narrative",
      coverUrl: "/covers/cicada.svg",
      bannerUrl: "/covers/cicada-banner.svg",
      screenshots: ["/covers/cicada.svg"],
      howToPlayEn: "Enable your microphone and camera. Track the cicada's chirp direction to discover each hidden node.",
      howToPlayFa: "میکروفن و دوربین را فعال کن. با دنبال کردن جهت آواز سیکادا هر گره پنهان را کشف کن.",
      deviceReqs: ["camera", "gyroscope", "gps", "microphone"],
      launchUrl: "https://webar.astralcode.dev/cicada",
      coinsPerSession: 40,
      coinsPerLevel: 8,
      dailyCapCoins: 400,
      dailyLoginBonus: 15,
      isActive: true,
    },
    {
      slug: "miras-e-ghajar",
      titleEn: "Miras-e Ghajar (The Qajar Legacy)",
      titleFa: "میراث قاجار",
      descriptionEn:
        "A historical AR adventure set in Qajar-era Iran. Walk real streets and see the era's people, artifacts and stories layered over the world.",
      descriptionFa:
        "ماجراجویی تاریخی واقعیت افزوده در دوران قاجار. در خیابان‌های واقعی قدم بزن و مردم، آثار و داستان‌های آن دوره را روی جهان واقعی ببینی.",
      genre: "history, narrative, edutainment",
      coverUrl: "/covers/miras-e-ghajar.svg",
      bannerUrl: "/covers/miras-e-ghajar-banner.svg",
      screenshots: ["/covers/miras-e-ghajar.svg"],
      howToPlayEn: "Scan your location, then step through each era chapter as AR figures and objects appear around you.",
      howToPlayFa: "مکان خود را اسکن کن و با عبور از هر فصل، شخصیت‌ها و اشیای افزوده را دور خود ببین.",
      deviceReqs: ["camera", "gps"],
      launchUrl: "https://webar.astralcode.dev/miras-e-ghajar",
      coinsPerSession: 60,
      coinsPerLevel: 12,
      dailyCapCoins: 600,
      dailyLoginBonus: 25,
      isActive: true,
    },
  ];

  for (const g of games) {
    await prisma.game.upsert({
      where: { slug: g.slug },
      update: g,
      create: g,
    });
  }

  // --- Achievements ---
  const ach = [
    { code: "first-play", nameEn: "First Play", nameFa: "اولین بازی", icon: "🎮" },
    { code: "fire-trace-master", nameEn: "Fire Trace Master", nameFa: "استاد رد آتش", icon: "🔥" },
    { code: "cicada-ear", nameEn: "Cicada's Ear", nameFa: "گوش سیکادا", icon: "🦗" },
    { code: "time-traveler", nameEn: "Time Traveler", nameFa: "مسیح زمان", icon: "🏛️" },
    { code: "coin-collector", nameEn: "Coin Collector", nameFa: "جامعه‌بان سکه", icon: "🪙" },
  ];
  for (const a of ach) {
    await prisma.achievement.upsert({ where: { code: a.code }, update: a, create: a });
  }
  // Grant a couple to the demo player
  const a1 = await prisma.achievement.findUnique({ where: { code: "first-play" } });
  const a2 = await prisma.achievement.findUnique({ where: { code: "coin-collector" } });
  if (a1) await prisma.userAchievement.upsert({ where: { userId_achievementId: { userId: demo.id, achievementId: a1.id } }, update: {}, create: { userId: demo.id, achievementId: a1.id } });
  if (a2) await prisma.userAchievement.upsert({ where: { userId_achievementId: { userId: demo.id, achievementId: a2.id } }, update: {}, create: { userId: demo.id, achievementId: a2.id } });

  // --- Shop cosmetics ---
  const cosmetics = [
    { kind: "avatar", nameEn: "Comet Avatar", nameFa: "آواتار شهاب", price: 300, image: "/covers/avatar-comet.svg" },
    { kind: "trail", nameEn: "Ember Trail", nameFa: "رد خرسنگ", price: 500, image: "/covers/trail-ember.svg" },
    { kind: "badge", nameEn: "Pioneer Badge", nameFa: "نشان پیشرو", price: 100, image: null },
  ];
  for (const c of cosmetics) {
    await prisma.cosmetic.create({ data: c });
  }

  // --- Coin ledger for demo player ---
  const wallet = await prisma.wallet.findUnique({ where: { userId: demo.id } });
  if (wallet) {
    await prisma.coinTransaction.createMany({
      data: [
        { userId: demo.id, amount: 1200, kind: "session", balanceAfter: 1200, createdAt: new Date() },
        { userId: demo.id, amount: -50, kind: "shop_spend", balanceAfter: 1150, createdAt: new Date() },
        { userId: demo.id, amount: 100, kind: "daily_bonus", balanceAfter: 1250, createdAt: new Date() },
      ],
    });
  }

  // --- Leaderboard sample ---
  const fire = await prisma.game.findUnique({ where: { slug: "fire-trace" } });
  if (fire) {
    await prisma.leaderboardScore.upsert({
      where: { userId_gameId: { userId: demo.id, gameId: fire.id } },
      update: { score: 4200 },
      create: { userId: demo.id, gameId: fire.id, score: 4200 },
    });
  }

  console.log("Seed complete: admin@astralcode.dev / player@astralcode.dev");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
