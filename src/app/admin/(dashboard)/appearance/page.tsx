"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ThemePresetCard } from "@/components/admin/theme-preset-card";
import { ThemeColorEditor } from "@/components/admin/theme-color-editor";
import { ThemeAiGenerator } from "@/components/admin/theme-ai-generator";
import { AppearanceTabs, type AppearanceTab } from "@/components/admin/appearance-tabs";
import { AppearancePreviewModal } from "@/components/admin/appearance-preview-modal";
import { PRESETS } from "@/lib/theme/presets";
import { buildCssVars } from "@/lib/theme/build-css-vars";
import type { ThemeColors } from "@/lib/theme/types";

const presetList = Object.values(PRESETS);

export default function AppearancePage() {
  const [activePreset, setActivePreset] = useState("manga");
  const [customOverrides, setCustomOverrides] = useState<Partial<ThemeColors>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AppearanceTab>("presets");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const overrideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desktopIframeRef = useRef<HTMLIFrameElement | null>(null);
  const modalIframeRef = useRef<HTMLIFrameElement | null>(null);

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

  const pushThemeToPreview = useCallback((preset: string, overrides: Partial<ThemeColors>) => {
    const presetObj = PRESETS[preset];
    if (!presetObj) return;
    const cssVars = buildCssVars(presetObj, overrides);
    const message = { type: "theme-update", cssVars };
    const origin = window.location.origin;
    desktopIframeRef.current?.contentWindow?.postMessage(message, origin);
    modalIframeRef.current?.contentWindow?.postMessage(message, origin);
  }, []);

  const saveTheme = useCallback(async (preset: string, overrides: Partial<ThemeColors>) => {
    setSaving(true);
    setSaved(false);
    pushThemeToPreview(preset, overrides);

    try {
      const res = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preset,
          customOverrides: Object.keys(overrides).length > 0 ? overrides : undefined,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // handle silently
    } finally {
      setSaving(false);
    }
  }, [pushThemeToPreview]);

  function handlePresetSelect(id: string) {
    setActivePreset(id);
    setCustomOverrides({});
    saveTheme(id, {});
  }

  function handleOverridesChange(overrides: Partial<ThemeColors>) {
    setCustomOverrides(overrides);
    pushThemeToPreview(activePreset, overrides);

    if (overrideTimerRef.current) {
      clearTimeout(overrideTimerRef.current);
    }
    overrideTimerRef.current = setTimeout(() => {
      saveTheme(activePreset, overrides);
    }, 600);
  }

  function handleAiPalette(colors: Partial<ThemeColors>) {
    setCustomOverrides(colors);
    saveTheme(activePreset, colors);
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
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-warm-brown">
            Appearance
          </h1>
          <p className="mt-1 text-sm text-warm-brown/60">
            Choose a theme preset or customize colors for your storefront.
          </p>
        </div>
        <span className="text-sm text-warm-brown/50" aria-live="polite">
          {saving ? "Saving..." : saved ? "Saved!" : ""}
        </span>
      </div>

      {/* Split-pane layout on lg+, stacked on smaller */}
      <div className="flex gap-6" style={{ height: "calc(100vh - 160px)" }}>
        {/* Left panel: tabbed controls */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-warm-brown/10 bg-white lg:max-w-[55%]">
          <AppearanceTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div id={`tabpanel-${activeTab}`} role="tabpanel" className="flex-1 overflow-y-auto p-6">
            {activeTab === "presets" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {presetList.map((preset) => (
                  <ThemePresetCard
                    key={preset.id}
                    preset={preset}
                    isActive={activePreset === preset.id}
                    onSelect={handlePresetSelect}
                  />
                ))}
              </div>
            )}
            {activeTab === "colors" && (
              <ThemeColorEditor
                baseColors={PRESETS[activePreset].colors}
                overrides={customOverrides}
                onChange={handleOverridesChange}
              />
            )}
            {activeTab === "ai" && (
              <ThemeAiGenerator onPaletteGenerated={handleAiPalette} />
            )}
          </div>
        </div>

        {/* Right panel: live preview (desktop only) */}
        <div className="hidden flex-1 overflow-hidden rounded-xl border border-warm-brown/10 lg:block">
          <iframe
            ref={desktopIframeRef}
            src="/"
            className="h-full w-full"
            title="Theme preview"
          />
        </div>
      </div>

      {/* Floating preview button (mobile/tablet only) */}
      <button
        type="button"
        onClick={() => setPreviewModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex cursor-pointer items-center gap-2 rounded-full bg-teal-primary px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 lg:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Preview
      </button>

      {/* Preview modal (mobile/tablet) */}
      <AppearancePreviewModal
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        iframeRef={(el) => { modalIframeRef.current = el; }}
      />
    </>
  );
}
