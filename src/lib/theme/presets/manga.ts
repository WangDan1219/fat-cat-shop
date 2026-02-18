import type { ThemePreset } from "../types";

export const mangaPreset: ThemePreset = {
  id: "manga",
  name: "Manga",
  description: "Dark indigo & neon pink manga aesthetic",
  colors: {
    "comic-red": "#7C3AED",
    "comic-red-dark": "#6D28D9",
    "comic-cyan": "#DB2777",
    "comic-cyan-dark": "#BE185D",
    "comic-yellow": "#1E1B2E",
    "comic-yellow-dark": "#16132A",
    "comic-blue": "#8B5CF6",
    "comic-pink": "#F472B6",
    "comic-ink": "#0F0D1A",
    "comic-paper": "#F0EFF4",
    "comic-panel": "#FFFFFF",
    "comic-muted": "#6B7280",
    "comic-light-gray": "#E8E6F0",
    "comic-error": "#EF4444",
    "comic-on-primary": "#FFFFFF",
    "comic-on-secondary": "#FFFFFF",
    "comic-on-accent": "#FFFFFF",
  },
  shadows: {
    "comic": "4px 4px 0px #0F0D1A",
    "comic-hover": "6px 6px 0px #0F0D1A",
    "comic-pressed": "2px 2px 0px #0F0D1A",
    "comic-sm": "3px 3px 0px #0F0D1A",
    "comic-color": "4px 4px 0px #7C3AED",
  },
  fonts: {
    sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
    display: '"Rajdhani", ui-sans-serif, system-ui, sans-serif',
  },
};
