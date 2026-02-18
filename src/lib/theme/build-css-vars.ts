import type { ThemePreset, ThemeColors } from "./types";
import type { CSSProperties } from "react";

export function buildCssVars(
  preset: ThemePreset,
  customOverrides?: Partial<ThemeColors>,
): CSSProperties {
  const colors = customOverrides
    ? { ...preset.colors, ...customOverrides }
    : preset.colors;

  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(colors)) {
    vars[`--color-${key}`] = value;
  }

  for (const [key, value] of Object.entries(preset.shadows)) {
    vars[`--shadow-${key}`] = value;
  }

  vars["--font-sans"] = preset.fonts.sans;
  vars["--font-display"] = preset.fonts.display;

  return vars as CSSProperties;
}
