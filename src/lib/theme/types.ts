export interface ThemeColors {
  "comic-red": string;
  "comic-red-dark": string;
  "comic-cyan": string;
  "comic-cyan-dark": string;
  "comic-yellow": string;
  "comic-yellow-dark": string;
  "comic-blue": string;
  "comic-pink": string;
  "comic-ink": string;
  "comic-paper": string;
  "comic-panel": string;
  "comic-muted": string;
  "comic-light-gray": string;
  "comic-error": string;
  "comic-on-primary": string;
  "comic-on-secondary": string;
  "comic-on-accent": string;
}

export interface ThemeShadows {
  "comic": string;
  "comic-hover": string;
  "comic-pressed": string;
  "comic-sm": string;
  "comic-color": string;
}

export interface ThemeFonts {
  sans: string;
  display: string;
}

export interface ThemeGoogleFonts {
  families: { name: string; weights: string[] }[];
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  shadows: ThemeShadows;
  fonts: ThemeFonts;
  googleFonts?: ThemeGoogleFonts;
}

export interface StoredThemeConfig {
  preset: string;
  customOverrides?: Partial<ThemeColors>;
}
