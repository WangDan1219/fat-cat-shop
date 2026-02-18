import type { ThemePreset, StoredThemeConfig, ThemeColors } from "./types";
import { PRESETS, DEFAULT_PRESET_ID } from "./presets";
import { getSiteSettings } from "@/lib/site-settings";

export interface ActiveTheme {
  preset: ThemePreset;
  customOverrides?: Partial<ThemeColors>;
}

export async function getActiveTheme(): Promise<ActiveTheme> {
  try {
    const settings = await getSiteSettings();
    const raw = settings.theme_config;

    if (!raw) {
      return { preset: PRESETS[DEFAULT_PRESET_ID] };
    }

    const config: StoredThemeConfig = JSON.parse(raw);
    const preset = PRESETS[config.preset] ?? PRESETS[DEFAULT_PRESET_ID];

    return {
      preset,
      customOverrides: config.customOverrides,
    };
  } catch {
    return { preset: PRESETS[DEFAULT_PRESET_ID] };
  }
}
