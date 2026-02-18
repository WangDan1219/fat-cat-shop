import type { ThemePreset } from "../types";

export const pastelPreset: ThemePreset = {
  id: "pastel",
  name: "Pastel",
  description: "Soft pastels with a gentle, friendly feel",
  colors: {
    "comic-red": "#F9A8D4",
    "comic-red-dark": "#F472B6",
    "comic-cyan": "#A78BFA",
    "comic-cyan-dark": "#8B5CF6",
    "comic-yellow": "#FDE68A",
    "comic-yellow-dark": "#FCD34D",
    "comic-blue": "#93C5FD",
    "comic-pink": "#FBCFE8",
    "comic-ink": "#4B5563",
    "comic-paper": "#FFF7ED",
    "comic-panel": "#FFFFFF",
    "comic-muted": "#9CA3AF",
    "comic-light-gray": "#F3F4F6",
    "comic-error": "#F87171",
    "comic-on-primary": "#4B5563",
    "comic-on-secondary": "#FFFFFF",
    "comic-on-accent": "#4B5563",
  },
  shadows: {
    "comic": "4px 4px 0px #D1D5DB",
    "comic-hover": "6px 6px 0px #D1D5DB",
    "comic-pressed": "2px 2px 0px #D1D5DB",
    "comic-sm": "3px 3px 0px #D1D5DB",
    "comic-color": "4px 4px 0px #F9A8D4",
  },
  fonts: {
    sans: '"Nunito", ui-sans-serif, system-ui, sans-serif',
    display: '"Nunito", ui-sans-serif, system-ui, sans-serif',
  },
  googleFonts: {
    families: [{ name: "Nunito", weights: ["400", "600", "700", "800"] }],
  },
};
