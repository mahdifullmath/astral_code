// Shop — spend Astral Coins on cosmetics (client calls /api/shop/buy).
"use client";
import { useState, useEffect } from "react";
import { useLang, dict } from "@/lib/i18n-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";

interface Cosmetic { id: string; kind: string; nameEn: string; nameFa: string; price: number; image: string | null; owned: boolean; }

export default function Shop() {
  const lang = useLang();
  const d = dict[lang];
  const router = useRouter();
  const [items, setItems] = useState<Cosmetic[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [authed, setAuthed] = useState<boolean>(null as any);
  const [err, setErr] = useState("");

  async function load() {
    const [itemsRes, meRes] = await Promise.all([
      fetch("/api/shop"),
      fetch("/api/session"),
    ]);
    setAuthed(Boolean((await meRes.json()).user));
    setItems((await itemsRes.json()).items ?? []);
  }
  useEffect(() => { load(); }, []);

  async function buy(id: string) {
    setErr("");
    const res = await fetch("/api/shop/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.status === 401) { router.push("/login"); return; }
    if (!res.ok) { const j = await res.json(); setErr(j.error ?? "Purchase failed"); return; }
    load();
  }

  if (authed === null) return <div className="container-page py-20"><Starfield /><div className="text-center text-ink-faint">Loading…</div></div>;

  return (
    <div className="container-page py-12">
      <Starfield />
      <Reveal>
        <h1 className="heading-display text-4xl mb-2">{d.shop_title}</h1>
        <p className="text-ink-faint mb-8">{d.shop_sub}</p>
      </Reveal>
      {!authed && (
        <div className="mb-6 glass card p-4 text-sm">
          <span className="text-ink-soft">Log in to purchase. </span>
          <Link href="/login" className="text-cyan-glow">{d.login} →</Link>
        </div>
      )}
      {err && <p className="text-fire-glow text-sm mb-4">{err}</p>}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {items.map((it) => (
          <Reveal key={it.id}>
            <div className="glass card p-5 flex flex-col h-full">
              <div className="h-32 rounded-lg bg-space-800 flex items-center justify-center text-4xl mb-3">
                {it.kind === "avatar" ? "👤" : it.kind === "badge" ? "🏅" : "🔥"}
              </div>
              <div className="text-ink-faint text-xs uppercase tracking-wider mb-1">{it.kind}</div>
              <h3 className="font-display font-bold text-white">{lang === "fa" ? it.nameFa : it.nameEn}</h3>
              <div className="flex items-center justify-between mt-3">
                <span className="coin-pill">◈ {it.price}</span>
                {it.owned ? (
                  <span className="text-cyan-glow text-sm">✓ Owned</span>
                ) : (
                  <button onClick={() => buy(it.id)} className="btn-fire !py-1.5 !px-3 text-sm" disabled={!authed}>Buy</button>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
