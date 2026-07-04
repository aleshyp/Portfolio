import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        ink: {
          DEFAULT: "#0b1220",
          soft: "#1e293b",
          muted: "#475569",
          // faint darkened from #94a3b8 → slate-500 so small de-emphasized text
          // still clears WCAG AA 4.5:1 on white (4.76:1). Pair with dark:text-slate-400
          // in dark mode, where slate-400 clears 7.3:1 on the ink background.
          faint: "#64748b",
        },
        accent: {
          // sparing warm highlight
          DEFAULT: "#f59e0b",
          soft: "#fbbf24",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(2, 44, 34, 0.04), 0 8px 24px rgba(2, 44, 34, 0.06)",
        lift: "0 12px 40px rgba(2, 44, 34, 0.12)",
        glow: "0 0 0 1px rgba(16, 185, 129, 0.15), 0 12px 40px rgba(16, 185, 129, 0.18)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
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
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
