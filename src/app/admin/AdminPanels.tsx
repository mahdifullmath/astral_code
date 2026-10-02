"use client";
import { useState, useEffect } from "react";

export function AdminGames() {
  const [games, setGames] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/admin/games").then((r) => r.json()).then((j) => setGames(j.games ?? []));
  }, []);

  async function save() {
    setBusy(true); setErr("");
    const res = await fetch("/api/admin/games", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setBusy(false);
    if (!res.ok) { const j = await res.json(); setErr(j.error ?? "Failed"); return; }
    setForm({});
    setGames((prev) => [...prev, { ...form, _new: true }]);
  }

  const fields: [string, string][] = [
    ["slug", "text"], ["titleEn", "text"], ["titleFa", "text"], ["genre", "text"],
    ["coverUrl", "text"], ["launchUrl", "text"],
    ["coinsPerSession", "number"], ["coinsPerLevel", "number"],
    ["dailyCapCoins", "number"], ["dailyLoginBonus", "number"],
  ];
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {games.map((g) => (
          <span key={g.id ?? g.slug} className="tag">{g.slug}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {fields.map(([k]) => (
          <input
            key={k}
            className="input !text-sm"
            placeholder={k}
            type={fields.find((f) => f[0] === k)?.[1] ?? "text"}
            value={form[k] ?? ""}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          />
        ))}
      </div>
      {err && <p className="text-fire-glow text-sm mb-2">{err}</p>}
      <button onClick={save} disabled={busy} className="btn-primary !py-2 text-sm">{busy ? "…" : "Add / Update game"}</button>
    </div>
  );
}

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/admin/users").then((r) => r.json()).then((j) => setUsers(j.users ?? []));
  }, []);
  return (
    <div className="max-h-96 overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-ink-faint text-left">
            <th className="pb-2">User</th><th>Email</th><th>Coins</th><th>Admin</th><th>Verified</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-white/5">
              <td className="py-2 text-white">{u.username}</td>
              <td className="text-ink-faint">{u.email}</td>
              <td className="text-fire-glow">◈ {u.wallet?.balance ?? 0}</td>
              <td>{u.isAdmin ? "✓" : ""}</td>
              <td>{u.emailVerified ? "✓" : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
