import type { Config } from "tailwindcss";

/**
 * The four background colours carry semantic meaning across every screen.
 * They are load-bearing for usability, not decoration:
 *   people      #D2E0FB  light blue   -> people-say evidence / regional data
 *   documents   #F9F3CC  light yellow -> documents-say evidence / at-risk status
 *   system      #D7E5CA  light green  -> system-shows evidence / on-track status
 *   header      #8EACCD  medium blue  -> structural headers
 *
 * Text uses a near-black ink so every pastel surface clears WCAG AA (>= 4.5:1).
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        people: "#D2E0FB",
        documents: "#F9F3CC",
        system: "#D7E5CA",
        header: "#8EACCD",
        ink: "#14213A",
        "ink-soft": "#3D4A63",
        canvas: "#FBFCFE",
        line: "#D8DEE9",
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { card: "10px" },
      boxShadow: {
        card: "0 1px 2px rgba(20,33,58,0.06), 0 1px 8px rgba(20,33,58,0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
