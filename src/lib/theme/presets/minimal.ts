import type { ThemePreset } from "../types";

export const minimalPreset: ThemePreset = {
  id: "minimal",
  name: "Minimal",
  description: "Near-monochrome with a single accent color",
  colors: {
    "comic-red": "#2563EB",
    "comic-red-dark": "#1D4ED8",
    "comic-cyan": "#2563EB",
    "comic-cyan-dark": "#1D4ED8",
    "comic-yellow": "#1F2937",
    "comic-yellow-dark": "#111827",
    "comic-blue": "#3B82F6",
    "comic-pink": "#93C5FD",
    "comic-ink": "#111827",
    "comic-paper": "#FAFAFA",
    "comic-panel": "#FFFFFF",
    "comic-muted": "#9CA3AF",
    "comic-light-gray": "#F3F4F6",
    "comic-error": "#EF4444",
    "comic-on-primary": "#FFFFFF",
    "comic-on-secondary": "#FFFFFF",
    "comic-on-accent": "#FFFFFF",
  },
  shadows: {
    "comic": "0 1px 3px rgba(0,0,0,0.12)",
    "comic-hover": "0 4px 6px rgba(0,0,0,0.12)",
    "comic-pressed": "0 1px 2px rgba(0,0,0,0.08)",
    "comic-sm": "0 1px 2px rgba(0,0,0,0.08)",
    "comic-color": "0 1px 3px rgba(37,99,235,0.3)",
  },
  fonts: {
    sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
    display: '"Inter", ui-sans-serif, system-ui, sans-serif',
  },
};
