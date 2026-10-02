"use client";
// Footer: social links, contact, legal, language switcher.
import Link from "next/link";
import { useLang, setLang, t } from "@/lib/i18n-client";

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Discord", href: "https://discord.com" },
];

export default function Footer() {
  const lang = useLang();
  return (
    <footer className="mt-24 border-t border-white/10 py-10">
      <div className="container-page grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="text-neon font-display text-lg font-black mb-3">✦ Astral Code</div>
          <p className="text-sm text-ink-faint">{t("copyright", lang)}</p>
        </div>
        <div className="text-sm space-y-2">
          <h4 className="font-display text-white">{t("contact_title", lang)}</h4>
          <a href="mailto:hello@astralcode.dev" className="block text-ink-soft hover:text-cyan-glow">hello@astralcode.dev</a>
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="block text-ink-soft hover:text-cyan-glow">
              {s.label}
            </a>
          ))}
        </div>
        <div className="text-sm space-y-2">
          <h4 className="font-display text-white">{t("privacy", lang)}</h4>
          <Link href="/privacy" className="block text-ink-soft hover:text-cyan-glow">{t("privacy", lang)}</Link>
          <Link href="/terms" className="block text-ink-soft hover:text-cyan-glow">{t("terms", lang)}</Link>
          <Link href="/contact" className="block text-ink-soft hover:text-cyan-glow">{t("contact_title", lang)}</Link>
        </div>
        <div className="text-sm">
          <h4 className="font-display text-white mb-2">Language</h4>
          <button onClick={() => setLang(lang === "en" ? "fa" : "en")} className="btn-ghost !px-3 !py-1.5 text-sm">
            {lang === "en" ? "فارسی (RTL)" : "English (LTR)"}
          </button>
        </div>
      </div>
    </footer>
  );
}
