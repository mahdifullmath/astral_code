"use client";
// Login page with credentials + optional Google. Redirects to /dashboard on success.
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLang, dict, t } from "@/lib/i18n-client";
import Link from "next/link";
import Starfield from "@/components/Starfield";

export default function Login() {
  const lang = useLang();
  const d = dict[lang];
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setBusy(false);
    if (res?.ok) router.push("/dashboard");
    else setErr(d.unverified ? "Invalid email or password." : "Login failed.");
  }

  return (
    <div className="container-page py-20">
      <Starfield />
      <div className="max-w-md mx-auto glass card p-8">
        <h1 className="heading-display text-3xl mb-6 text-center">{d.login}</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-ink-soft mb-1">{d.email}</label>
            <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-ink-soft mb-1">Password</label>
            <input id="password" type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {err && <p className="text-fire-glow text-sm">{err}</p>}
          <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? "…" : d.login}</button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <div className="relative flex justify-center"><span className="bg-space-950 px-2 text-xs text-ink-faint">or</span></div>
        </div>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="btn-ghost w-full"
        >
          <span>Google</span>
        </button>
        <div className="text-center mt-4 text-sm text-ink-faint">
          No account? <Link href="/register" className="text-cyan-glow">{d.register}</Link>
        </div>
        <div className="text-center mt-2 text-sm">
          <Link href="/reset-password" className="text-ink-faint hover:text-cyan-glow">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}
