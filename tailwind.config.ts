import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Astral Code design tokens
        space: {
          950: "#050510",
          900: "#080818",
          850: "#0a0a1f",
          800: "#0e0e28",
          700: "#151538",
          600: "#1e1e4a",
        },
        violet: {
          neon: "#8b5cf6",
          glow: "#a78bfa",
          deep: "#6d28d9",
        },
        cyan: {
          neon: "#22d3ee",
          glow: "#67e8f9",
        },
        fire: {
          neon: "#fb923c",
          glow: "#fdba74",
          deep: "#ea580c",
        },
        ink: {
          soft: "#c4c4e0",
          faint: "#8b8bb0",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-violet": "0 0 24px rgba(139, 92, 246, 0.45)",
        "glow-cyan": "0 0 24px rgba(34, 211, 238, 0.4)",
        "glow-fire": "0 0 24px rgba(251, 146, 60, 0.45)",
        "card": "0 8px 32px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "star-drift": "starDrift 120s linear infinite",
        "pulse-slow": "pulseSlow 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        starDrift: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "neon-text":
          "linear-gradient(90deg, #8b5cf6, #22d3ee, #fb923c, #8b5cf6)",
      },
    },
  },
  plugins: [],
};

export default config;
