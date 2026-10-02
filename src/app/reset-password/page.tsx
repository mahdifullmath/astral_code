"use client";
// Two modes: /reset-password (request) and ?token= (set new password).
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useLang, dict } from "@/lib/i18n-client";
import Starfield from "@/components/Starfield";

function Inner() {
  const sp = useSearchParams();
  const router = useRouter();
  const lang = useLang();
  const d = dict[lang];
  const token = sp ? sp.get("token") : null;
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ t: "ok" | "err"; text: string } | null>(null);

  async function request(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    await fetch("/api/auth/reset-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    setBusy(false); setMsg({ t: "ok", text: "If that email exists, a reset link was sent." });
  }
  async function setNew(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    const res = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password: pw }) });
    const j = await res.json();
    setBusy(false);
    if (res.ok) router.push("/login");
    else setMsg({ t: "err", text: j.error ?? "Failed" });
  }

  return (
    <div className="container-page py-20">
      <Starfield />
      <div className="max-w-md mx-auto glass card p-8">
        {token ? (
          <form onSubmit={setNew} className="space-y-4">
            <h1 className="heading-display text-2xl">Set new password</h1>
            <input type="password" required minLength={8} className="input" value={pw} onChange={(e) => setPw(e.target.value)} />
            {msg && <p className={msg.t === "ok" ? "text-cyan-glow text-sm" : "text-fire-glow text-sm"}>{msg.text}</p>}
            <button className="btn-primary w-full" disabled={busy}>{busy ? "…" : "Update"}</button>
          </form>
        ) : (
          <form onSubmit={request} className="space-y-4">
            <h1 className="heading-display text-2xl">Reset password</h1>
            <p className="text-ink-faint text-sm">Enter your email and we'll send a reset link.</p>
            <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            {msg && <p className="text-cyan-glow text-sm">{msg.text}</p>}
            <button className="btn-primary w-full" disabled={busy}>{busy ? "…" : "Send link"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
export default function Page() { return <Suspense fallback={null}><Inner /></Suspense>; }
