"use client";
// Sign-up: create account, send verification email (server-side), redirect to login.
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLang, dict } from "@/lib/i18n-client";
import Link from "next/link";
import Starfield from "@/components/Starfield";

export default function Register() {
  const lang = useLang();
  const d = dict[lang];
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setErr(json.error ?? "Registration failed.");
      return;
    }
    setOk(true);
    setTimeout(() => router.push("/verify-email"), 800);
  }

  if (ok)
    return (
      <div className="container-page py-20 text-center">
        <Starfield />
        <div className="glass card p-8 mx-auto max-w-md">
          <p className="text-cyan-glow text-lg">Account created. Check your inbox to verify your email.</p>
        </div>
      </div>
    );

  return (
    <div className="container-page py-20">
      <Starfield />
      <div className="max-w-md mx-auto glass card p-8">
        <h1 className="heading-display text-3xl mb-6 text-center">{d.register}</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink-soft mb-1">{d.name}</label>
            <input required className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-ink-soft mb-1">{d.email}</label>
            <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-ink-soft mb-1">Password</label>
            <input type="password" required minLength={8} className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          {err && <p className="text-fire-glow text-sm">{err}</p>}
          <button className="btn-primary w-full" disabled={busy}>{busy ? "…" : d.register}</button>
        </form>
        <p className="text-xs text-ink-faint mt-4">
          By registering you agree to our <Link href="/terms" className="text-cyan-glow">Terms</Link> and <Link href="/privacy" className="text-cyan-glow">Privacy Policy</Link>.
        </p>
        <div className="text-center mt-4 text-sm text-ink-faint">
          Have an account? <Link href="/login" className="text-cyan-glow">{d.login}</Link>
        </div>
      </div>
    </div>
  );
}
