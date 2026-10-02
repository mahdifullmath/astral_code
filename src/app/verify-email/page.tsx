// Client page that reads ?token= and calls /api/auth/verify.
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Starfield from "@/components/Starfield";

function Inner() {
  const sp = useSearchParams();
  const token = sp ? (sp.get("token") ?? "") : "";
  const [status, setStatus] = useState<"loading"|"ok"|"err">("loading");
  useEffect(() => {
    if (!token) { setStatus("err"); return; }
    fetch(`/api/auth/verify?token=${token}`)
      .then((r) => setStatus(r.ok ? "ok" : "err"))
      .catch(() => setStatus("err"));
  }, [token]);
  return (
    <div className="container-page py-24 text-center">
      <Starfield />
      <div className="glass card p-8 mx-auto max-w-md">
        {status === "loading" && <p className="text-ink-faint">Verifying…</p>}
        {status === "ok" && <p className="text-cyan-glow text-lg">Email verified. You can now log in.</p>}
        {status === "err" && <p className="text-fire-glow">Verification failed or link expired. Request a new email.</p>}
      </div>
    </div>
  );
}
export default function Page() {
  return <Suspense fallback={null}><Inner /></Suspense>;
}
