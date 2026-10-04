"use client";
// Navbar with i18n-aware labels, session-aware auth links, language switcher, and mobile menu.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLang, setLang, t } from "@/lib/i18n-client";
import { signOut } from "next-auth/react";

const links = [
  { key: "nav_home", href: "/" },
  { key: "nav_games", href: "/games" },
  { key: "nav_leaderboard", href: "/leaderboard" },
  { key: "nav_shop", href: "/shop" },
  { key: "nav_about", href: "/about" },
  { key: "nav_contact", href: "/contact" },
] as const;

export default function Navbar({ user }: { user?: { username?: string; isAdmin?: boolean } | null }) {
  const lang = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 glass">
      <nav className="container-page flex items-center justify-between py-3" aria-label="Primary">
        <Link href="/" className="flex items-center gap-2" aria-label="Astral Code home">
          <img
            src="/logo/logo1pirple_trim.png"
            alt="Astral Code"
            width={617}
            height={737}
            className="h-12 w-auto"
            loading="eager"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition hover:text-cyan-glow ${pathname === l.href ? "text-cyan-neon" : "text-ink-soft"}`}
            >
              {t(l.key as any, lang)}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Language switcher */}
          <button
            onClick={() => setLang(lang === "en" ? "fa" : "en")}
            className="text-xs border border-white/20 rounded-lg px-2 py-1 hover:border-cyan-neon/60"
            aria-label="Switch language"
          >
            {lang === "en" ? "فارسی" : "English"}
          </button>

          {mounted && user ? (
            <>
              <Link href="/dashboard" className="btn-ghost !py-1.5 !px-3 text-xs">{t("nav_dashboard", lang)}</Link>
              {user.isAdmin && <Link href="/admin" className="tag">{t("admin", lang)}</Link>}
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-xs text-ink-faint hover:text-white">
                {t("logout", lang)}
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-ghost !py-1.5 !px-3 text-xs">{t("login", lang)}</Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-2xl text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "×" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block py-2 ${pathname === l.href ? "text-cyan-neon" : "text-ink-soft"}`}
            >
              {t(l.key as any, lang)}
            </Link>
          ))}
          <button onClick={() => setLang(lang === "en" ? "fa" : "en")} className="text-sm text-cyan-glow">
            {lang === "en" ? "فارسی" : "English"}
          </button>
          <div className="flex gap-3 pt-2">
            {mounted && user ? (
              <>
                <Link href="/dashboard" className="btn-ghost text-sm">{t("nav_dashboard", lang)}</Link>
                <button onClick={() => signOut()} className="text-sm text-ink-faint">{t("logout", lang)}</button>
              </>
            ) : (
              <Link href="/login" className="btn-ghost text-sm">{t("login", lang)}</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
