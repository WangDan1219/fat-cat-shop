import type { ThemePreset } from "../types";

export const comicPreset: ThemePreset = {
  id: "comic",
  name: "Comic",
  description: "Bright pop-art comic book style",
  colors: {
    "comic-red": "#EF4444",
    "comic-red-dark": "#DC2626",
    "comic-cyan": "#06B6D4",
    "comic-cyan-dark": "#0891B2",
    "comic-yellow": "#FACC15",
    "comic-yellow-dark": "#EAB308",
    "comic-blue": "#3B82F6",
    "comic-pink": "#EC4899",
    "comic-ink": "#1A1A2E",
    "comic-paper": "#FFFEF5",
    "comic-panel": "#FFFFFF",
    "comic-muted": "#6B7280",
    "comic-light-gray": "#F3F4F6",
    "comic-error": "#EF4444",
    "comic-on-primary": "#FFFFFF",
    "comic-on-secondary": "#1A1A2E",
    "comic-on-accent": "#1A1A2E",
  },
  shadows: {
    "comic": "4px 4px 0px #1A1A2E",
    "comic-hover": "6px 6px 0px #1A1A2E",
    "comic-pressed": "2px 2px 0px #1A1A2E",
    "comic-sm": "3px 3px 0px #1A1A2E",
    "comic-color": "4px 4px 0px #EF4444",
  },
  fonts: {
    sans: '"Bangers", cursive, system-ui, sans-serif',
    display: '"Bangers", cursive, system-ui, sans-serif',
  },
  googleFonts: {
    families: [{ name: "Bangers", weights: ["400"] }],
  },
};
