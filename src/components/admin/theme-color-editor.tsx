"use client";

import type { ThemeColors } from "@/lib/theme/types";

interface ThemeColorEditorProps {
  baseColors: ThemeColors;
  overrides: Partial<ThemeColors>;
  onChange: (overrides: Partial<ThemeColors>) => void;
}

const COLOR_GROUPS = [
  {
    label: "Primary Colors",
    tokens: [
      { key: "comic-red" as const, label: "Primary (buttons)" },
      { key: "comic-red-dark" as const, label: "Primary dark" },
      { key: "comic-cyan" as const, label: "Secondary (footer)" },
      { key: "comic-cyan-dark" as const, label: "Secondary dark" },
    ],
  },
  {
    label: "Accent & Highlights",
    tokens: [
      { key: "comic-yellow" as const, label: "Accent (header/prices)" },
      { key: "comic-yellow-dark" as const, label: "Accent dark" },
      { key: "comic-blue" as const, label: "Blue" },
      { key: "comic-pink" as const, label: "Pink" },
    ],
  },
  {
    label: "Base Colors",
    tokens: [
      { key: "comic-ink" as const, label: "Ink (text/borders)" },
      { key: "comic-paper" as const, label: "Paper (background)" },
      { key: "comic-panel" as const, label: "Panel (cards)" },
      { key: "comic-light-gray" as const, label: "Light gray" },
      { key: "comic-muted" as const, label: "Muted text" },
    ],
  },
  {
    label: "Contrast Text",
    tokens: [
      { key: "comic-on-primary" as const, label: "Text on primary" },
      { key: "comic-on-secondary" as const, label: "Text on secondary" },
      { key: "comic-on-accent" as const, label: "Text on accent" },
    ],
  },
];

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return null;
  return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) };
}

export function ThemeColorEditor({ baseColors, overrides, onChange }: ThemeColorEditorProps) {
  const merged = { ...baseColors, ...overrides };

  function handleColorChange(key: keyof ThemeColors, value: string) {
    if (value === baseColors[key]) {
      const rest = Object.fromEntries(
        Object.entries(overrides).filter(([k]) => k !== key),
      );
      onChange(rest);
    } else {
      onChange({ ...overrides, [key]: value });
    }
  }

  function handleReset(key: keyof ThemeColors) {
    const rest = Object.fromEntries(
      Object.entries(overrides).filter(([k]) => k !== key),
    );
    onChange(rest);
  }

  const contrastPairs: { bg: keyof ThemeColors; fg: keyof ThemeColors; label: string }[] = [
    { bg: "comic-red", fg: "comic-on-primary", label: "Primary button" },
    { bg: "comic-cyan", fg: "comic-on-secondary", label: "Footer/badges" },
    { bg: "comic-yellow", fg: "comic-on-accent", label: "Header/prices" },
  ];

  return (
    <div className="space-y-6">
      {/* Contrast warnings */}
      <div className="space-y-2">
        {contrastPairs.map(({ bg, fg, label }) => {
          const ratio = getContrastRatio(merged[bg], merged[fg]);
          const passes = ratio >= 4.5;
          return (
            <div
              key={label}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                passes ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              <span
                className="inline-block h-4 w-4 rounded border"
                style={{ backgroundColor: merged[bg] }}
              />
              <span
                className="inline-block h-4 w-4 rounded border"
                style={{ backgroundColor: merged[fg] }}
              />
              <span>{label}: {ratio.toFixed(1)}:1</span>
              <span>{passes ? "WCAG AA pass" : "WCAG AA fail"}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-6">
        {COLOR_GROUPS.map((group) => (
          <div key={group.label}>
            <h4 className="mb-3 text-sm font-bold text-warm-brown/70">
              {group.label}
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {group.tokens.map(({ key, label }) => {
                const isOverridden = key in overrides;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 rounded-lg border border-warm-brown/10 px-3 py-2"
                  >
                    <input
                      type="color"
                      value={merged[key]}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="h-8 w-8 cursor-pointer rounded border-0"
                      aria-label={`Pick color for ${label}`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-warm-brown">{label}</p>
                      <p className="font-mono text-xs text-warm-brown/50">
                        {merged[key]}
                      </p>
                    </div>
                    {isOverridden && (
                      <button
                        type="button"
                        onClick={() => handleReset(key)}
                        className="cursor-pointer text-xs text-warm-brown/40 hover:text-red-500"
                        title="Reset to preset default"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(overrides).length > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-2 text-sm">
          <span className="font-medium text-amber-800">
            {Object.keys(overrides).length} color override(s) active
          </span>
          <button
            type="button"
            onClick={() => onChange({})}
            className="cursor-pointer text-xs font-medium text-amber-600 hover:text-amber-800"
          >
            Clear all overrides
          </button>
        </div>
      )}
    </div>
  );
}
