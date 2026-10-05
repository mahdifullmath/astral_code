# Astral Code — AR Game Studio

Play the Real World. Build with your phone's camera. Earn Astral Coins.

## Tech Stack
- **Next.js 16** (App Router) + React 18
- **Tailwind CSS** — cosmic dark design system (violet / cyan / fire-orange neon)
- **Prisma + PostgreSQL** — users, games, play sessions, wallet, coin ledger, achievements, shop, leaderboards
- **next-auth v4** — credentials + optional Google, JWT sessions
- **i18n** — English + Persian (Farsi) with full RTL support

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env:
#   DATABASE_URL — your Postgres connection string
#   NEXTAUTH_SECRET — openssl rand -base64 32
#   GAME_API_MASTER_KEY — any long random string
#   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET — optional, hides Google button if blank
npx prisma generate

# 3. Create + seed the database
npm run db:push    # creates all tables
npm run db:seed    # inserts demo admin, demo player, 3 games, achievements, shop items

# 4. Run
npm run dev        # http://localhost:3000
```

**Demo accounts (after seeding):**
| Role  | Email                   | Password          |
|-------|-------------------------|-------------------|
| Admin | admin@astralcode.dev    | astral-admin-123  |
| Player| player@astralcode.dev   | demo-1234         |

## Project Structure

```
prisma/
  schema.prisma      # Full DB schema (13 models)
  seed.ts            # Demo data: admin, player, 3 games, achievements, shop
src/
  lib/
    db.ts            # Prisma singleton
    auth.ts          # next-auth config + Prisma credentials provider
    i18n.ts          # en/fa dictionary, useLang hook, RTL toggle
    session.ts       # Server-side session helper
    games.ts         # Data-driven game catalog (add a game → add a DB row)
  components/
    Starfield.tsx    # Animated cosmic background
    Navbar.tsx       # Session-aware nav + language switcher
    Footer.tsx       # Socials, contact, legal, language
    GameCard.tsx     # Tilt + hover-glow game card
    Reveal.tsx       # Scroll-reveal wrapper
  app/
    page.tsx         # Home: hero, featured carousel, how-it-works, coin explainer
    games/           # Catalog grid (data-driven)
    games/[slug]/    # Game detail: banner, how-to-play, device reqs, leaderboard
    login/           # Credentials + Google login
    register/        # Sign-up → verification email
    verify-email/    # ?token= verification
    reset-password/  # Request + set new password
    dashboard/       # Profile, balance, stats, achievements, coin history
    leaderboard/     # Global + per-game
    shop/            # Buy cosmetics with Astral Coins
    about/           # Studio story + team
    contact/         # Contact form (dev: logs to console)
    privacy/         # Privacy Policy
    terms/           # Terms of Service (coin disclaimer included)
    admin/           # Add/edit games, view users (isAdmin only)
    api/
      auth/          # register, verify, reset-request, reset-password, [...nextauth]
      session/       # GET current user
      shop/          # GET list, POST /buy
      coins/award/   # Anti-cheat coin award (game client API)
      admin/games/   # GET/POST (admin only)
      admin/users/   # GET (admin only)
      contact/       # POST (dev: logs)
```

## Astral Coin System

- **Earn**: server-side only, via `POST /api/coins/award` after a validated game session.
  - `coinsPerSession` + `coinsPerLevel × levelsCleared`, capped at `dailyCapCoins`/day.
  - Idempotent: one award per `clientNonce`.
  - Optional per-game HMAC: if `Game.apiKeyHash` is set, clients must sign
    `nonce:userId:gameSlug` with that key.
- **Spend**: `POST /api/shop/buy` — atomic check-and-deduct transaction.
- **Wallet**: `Wallet.balance` updated in a Prisma `$transaction` alongside
  the immutable `CoinTransaction` ledger (no UPDATE/DELETE on transactions).
- **Disclaimer**: Astral Coins have no cash value. Stated in Terms of Service.

## Game Client API (Unity / AR apps)

```
POST /api/coins/award
Authorization: Bearer <GAME_API_MASTER_KEY>
Content-Type: application/json

{
  "gameSlug": "fire-trace",
  "userId": "cuid-of-player",
  "nonce": "uuid-v4-unique",
  "durationSec": 120,
  "levelsCleared": 3,
  "clientMeta": { "locationHash": "…" },
  "hmac": "<sha256-hmac-if-apiKeyHash-set>"
}

→ 201 { "ok": true, "coinsAwarded": 80, "sessionId": "…" }
```

Rate-limit and cap enforcement are server-side. Reject sessions where
`durationSec < SESSION_MIN_DURATION_SEC` or `> SESSION_MAX_DURATION_SEC`.

## Deployment

### Docker (optional)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci && npx prisma generate
CMD ["npm", "run", "start"]
```
Provide `DATABASE_URL`, `NEXTAUTH_SECRET`, and `GAME_API_MASTER_KEY` as env vars.
Point nginx at the port and add HTTPS.

### Environment variables (`.env`)
| Variable                | Required | Notes                                    |
|--------------------------|----------|------------------------------------------|
| `DATABASE_URL`           | yes      | Postgres connection string              |
| `NEXTAUTH_SECRET`       | yes      | 32+ char random                          |
| `NEXTAUTH_URL`          | yes      | `http://localhost:3000` in dev          |
| `GOOGLE_CLIENT_ID`      | no       | Leave blank to hide Google login        |
| `GAME_API_MASTER_KEY`   | yes      | Shared secret for game client calls     |
| `DAILY_COIN_CAP_PER_GAME`| no      | Default 500                             |
| `SESSION_MIN_DURATION_SEC` | no   | Default 30                              |
| `SESSION_MAX_DURATION_SEC` | no   | Default 7200                            |

## Adding a New Game

All game data lives in the `Game` table. Use the admin panel (`/admin`) or
`prisma/seed.ts` — no code changes needed. Set `isActive: true` to show it
in the catalog; `false` to hide without deleting.
