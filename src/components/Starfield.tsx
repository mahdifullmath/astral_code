"use client";
// Animated starfield background. Lightweight: fixed layers with CSS drift + a few JS-spawned stars.
// ponytail: CSS-only fallback; add a canvas version if you need parallax density.
export default function Starfield({ density = 60 }: { density?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Two drifting star layers (pure CSS, no JS) */}
      <div
        className="absolute inset-[-50%] animate-star-drift opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, white, transparent), radial-gradient(1px 1px at 70% 60%, #a78bfa, transparent), radial-gradient(1.5px 1.5px at 40% 80%, #67e8f9, transparent), radial-gradient(1px 1px at 85% 25%, white, transparent)",
          backgroundSize: "220px 220px",
        }}
      />
      <div
        className="absolute inset-[-50%] animate-pulse-slow opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(2px 2px at 15% 45%, #fdba74, transparent), radial-gradient(1.5px 1.5px at 60% 15%, white, transparent), radial-gradient(1px 1px at 90% 70%, #a78bfa, transparent)",
          backgroundSize: "300px 300px",
        }}
      />
      {/* Nebula glow accents */}
      <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-violet-neon/20 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-cyan-neon/10 blur-[100px]" />
    </div>
  );
}
