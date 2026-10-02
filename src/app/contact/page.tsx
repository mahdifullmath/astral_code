"use client";
import { useState } from "react";
import { useLang, dict } from "@/lib/i18n-client";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";

export default function Contact() {
  const lang = useLang();
  const d = dict[lang];
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setBusy(false); setSent(true);
  }

  return (
    <div className="container-page py-16">
      <Starfield />
      <Reveal>
        <h1 className="heading-display text-4xl mb-3">{d.contact_title}</h1>
        <p className="text-ink-faint mb-8">{d.contact_sub}</p>
      </Reveal>
      <Reveal>
        {sent ? (
          <div className="glass card p-8 max-w-md mx-auto text-center text-cyan-glow text-lg">Thanks! We'll get back to you.</div>
        ) : (
          <form onSubmit={submit} className="max-w-lg space-y-4">
            <div><label className="block text-sm text-ink-soft mb-1">{d.name}</label><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="block text-sm text-ink-soft mb-1">{d.email}</label><input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="block text-sm text-ink-soft mb-1">{d.message}</label><textarea required className="input min-h-32" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
            <button className="btn-primary" disabled={busy}>{busy ? "…" : d.send}</button>
          </form>
        )}
      </Reveal>
    </div>
  );
}
