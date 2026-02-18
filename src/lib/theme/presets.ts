import type { ThemePreset } from "./types";
import { mangaPreset } from "./presets/manga";
import { comicPreset } from "./presets/comic";
import { pastelPreset } from "./presets/pastel";
import { neonPreset } from "./presets/neon";
import { minimalPreset } from "./presets/minimal";

export const PRESETS: Record<string, ThemePreset> = {
  manga: mangaPreset,
  comic: comicPreset,
  pastel: pastelPreset,
  neon: neonPreset,
  minimal: minimalPreset,
};

export const DEFAULT_PRESET_ID = "manga";

export { mangaPreset, comicPreset, pastelPreset, neonPreset, minimalPreset };
