import type { ThemePreset } from "../types";

export const neonPreset: ThemePreset = {
  id: "neon",
  name: "Neon",
  description: "High-contrast neon glow on dark background",
  colors: {
    "comic-red": "#FF3E6C",
    "comic-red-dark": "#E6355F",
    "comic-cyan": "#00F5D4",
    "comic-cyan-dark": "#00D4B7",
    "comic-yellow": "#0A0A1A",
    "comic-yellow-dark": "#050510",
    "comic-blue": "#7B61FF",
    "comic-pink": "#FF6EFF",
    "comic-ink": "#E0E0FF",
    "comic-paper": "#0F0F23",
    "comic-panel": "#1A1A35",
    "comic-muted": "#6B7094",
    "comic-light-gray": "#252545",
    "comic-error": "#FF4444",
    "comic-on-primary": "#FFFFFF",
    "comic-on-secondary": "#0A0A1A",
    "comic-on-accent": "#FFFFFF",
  },
  shadows: {
    "comic": "4px 4px 0px #FF3E6C66",
    "comic-hover": "6px 6px 0px #FF3E6C88",
    "comic-pressed": "2px 2px 0px #FF3E6C44",
    "comic-sm": "3px 3px 0px #FF3E6C44",
    "comic-color": "4px 4px 0px #7B61FF66",
  },
  fonts: {
    sans: '"Orbitron", ui-sans-serif, system-ui, sans-serif',
    display: '"Orbitron", ui-sans-serif, system-ui, sans-serif',
  },
  googleFonts: {
    families: [{ name: "Orbitron", weights: ["400", "500", "600", "700"] }],
  },
};
