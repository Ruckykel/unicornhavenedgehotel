import type { Config } from "tailwindcss";

// Tokens from blueprint §2. Two extra text tokens keep muted copy WCAG AA:
// `stone` (#8B908D) is only 3.1:1 on porcelain, so it is reserved for borders
// and large captions; `stone-deep` and `sage` carry small muted text.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" },
    extend: {
      colors: {
        ink: "#14171A",
        porcelain: "#FAFAF7",
        mangrove: { DEFAULT: "#1F3A33", deep: "#17302A" },
        brass: { DEFAULT: "#A8844F", light: "#C4A274" },
        stone: { DEFAULT: "#8B908D", deep: "#5B605D" },
        mist: "#E9ECE8",
        sage: "#B9C2BC",
      },
      fontFamily: {
        display: ["var(--font-bodoni)", "Georgia", "serif"],
        sans: ["var(--font-hanken)", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["0.8rem", { lineHeight: "1.5" }],
        sm: ["0.9rem", { lineHeight: "1.55" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.25rem", { lineHeight: "1.5" }],
        xl: ["1.6rem", { lineHeight: "1.2" }],
        "2xl": ["2.1rem", { lineHeight: "1.1" }],
        "3xl": ["2.8rem", { lineHeight: "1.1" }],
        "4xl": ["3.75rem", { lineHeight: "1.05" }],
        hero: ["clamp(2.75rem, 7vw, 6rem)", { lineHeight: "1.02" }],
      },
      maxWidth: { site: "1280px", prose: "70ch" },
      borderRadius: { DEFAULT: "2px", sm: "2px" },
      spacing: { section: "96px", "section-sm": "64px" },
      transitionTimingFunction: { quiet: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
};

export default config;
