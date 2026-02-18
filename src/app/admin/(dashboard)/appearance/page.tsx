"use client";

import { useEffect, useState } from "react";
import { ThemePresetCard } from "@/components/admin/theme-preset-card";
import { ThemeColorEditor } from "@/components/admin/theme-color-editor";
import { ThemeAiGenerator } from "@/components/admin/theme-ai-generator";
import { PRESETS } from "@/lib/theme/presets";
import type { ThemeColors } from "@/lib/theme/types";

const presetList = Object.values(PRESETS);

export default function AppearancePage() {
  const [activePreset, setActivePreset] = useState("manga");
  const [customOverrides, setCustomOverrides] = useState<Partial<ThemeColors>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/theme");
        if (res.ok) {
          const data = await res.json();
          setActivePreset(data.preset ?? "manga");
          setCustomOverrides(data.customOverrides ?? {});
        }
      } catch {
        // use defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preset: activePreset,
          customOverrides: Object.keys(customOverrides).length > 0 ? customOverrides : undefined,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      // handle silently
    } finally {
      setSaving(false);
    }
  }

  function handlePresetSelect(id: string) {
    setActivePreset(id);
    setCustomOverrides({});
  }

  function handleAiPalette(colors: Partial<ThemeColors>) {
    setCustomOverrides(colors);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-warm-brown">
          Appearance
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-xl border-2 border-warm-brown/10 bg-warm-brown/5"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-warm-brown">
            Appearance
          </h1>
          <p className="mt-1 text-sm text-warm-brown/60">
            Choose a theme preset or customize colors for your storefront.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="cursor-pointer rounded-full bg-teal-primary px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-dark disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Publish Theme"}
        </button>
      </div>

      {/* Preset grid */}
      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-warm-brown">
          Theme Presets
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {presetList.map((preset) => (
            <ThemePresetCard
              key={preset.id}
              preset={preset}
              isActive={activePreset === preset.id}
              onSelect={handlePresetSelect}
            />
          ))}
        </div>
      </section>

      {/* Color editor */}
      <section className="rounded-xl border border-warm-brown/10 bg-white p-6">
        <ThemeColorEditor
          baseColors={PRESETS[activePreset].colors}
          overrides={customOverrides}
          onChange={setCustomOverrides}
        />
      </section>

      {/* AI Generator */}
      <section className="rounded-xl border border-warm-brown/10 bg-white p-6">
        <ThemeAiGenerator onPaletteGenerated={handleAiPalette} />
      </section>

      {/* Live preview */}
      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-warm-brown">
          Preview
        </h2>
        <div
          className="overflow-hidden rounded-xl border border-warm-brown/10"
          style={{ height: "500px" }}
        >
          <iframe
            src={`/?_preview=1&_t=${Date.now()}`}
            className="h-full w-full"
            title="Theme preview"
          />
        </div>
      </section>
    </div>
  );
}
