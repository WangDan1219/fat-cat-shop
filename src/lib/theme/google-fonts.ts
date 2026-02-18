import type { ThemePreset } from "./types";

export function buildGoogleFontsUrl(preset: ThemePreset): string | null {
  if (!preset.googleFonts || preset.googleFonts.families.length === 0) {
    return null;
  }

  const families = preset.googleFonts.families.map((f) => {
    const weights = f.weights.join(";");
    return `family=${encodeURIComponent(f.name)}:wght@${weights}`;
  });

  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}
