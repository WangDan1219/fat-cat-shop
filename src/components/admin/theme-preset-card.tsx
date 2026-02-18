"use client";

import type { ThemePreset } from "@/lib/theme/types";
import { cn } from "@/lib/utils";

interface ThemePresetCardProps {
  preset: ThemePreset;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function ThemePresetCard({ preset, isActive, onSelect }: ThemePresetCardProps) {
  const swatches = [
    { label: "Primary", color: preset.colors["comic-red"] },
    { label: "Secondary", color: preset.colors["comic-cyan"] },
    { label: "Accent", color: preset.colors["comic-yellow"] },
    { label: "Blue", color: preset.colors["comic-blue"] },
    { label: "Pink", color: preset.colors["comic-pink"] },
    { label: "Ink", color: preset.colors["comic-ink"] },
    { label: "Paper", color: preset.colors["comic-paper"] },
  ];

  return (
    <button
      type="button"
      onClick={() => onSelect(preset.id)}
      className={cn(
        "w-full cursor-pointer rounded-xl border-2 p-4 text-left transition-all hover:shadow-md",
        isActive
          ? "border-teal-primary bg-teal-primary/5 ring-2 ring-teal-primary/20"
          : "border-warm-brown/20 hover:border-teal-primary/40",
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-warm-brown">
          {preset.name}
        </h3>
        {isActive && (
          <span className="rounded-full bg-teal-primary px-2.5 py-0.5 text-xs font-bold text-white">
            Active
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-warm-brown/60">{preset.description}</p>

      {/* Color swatches */}
      <div className="mt-3 flex gap-1.5">
        {swatches.map((s) => (
          <div
            key={s.label}
            className="h-6 w-6 rounded-full border border-warm-brown/20"
            style={{ backgroundColor: s.color }}
            title={`${s.label}: ${s.color}`}
          />
        ))}
      </div>

      {/* Mini preview bar */}
      <div className="mt-3 flex h-8 overflow-hidden rounded-md border border-warm-brown/10">
        <div
          className="flex flex-1 items-center justify-center text-[10px] font-bold"
          style={{
            backgroundColor: preset.colors["comic-yellow"],
            color: preset.colors["comic-on-accent"],
          }}
        >
          Header
        </div>
        <div
          className="flex flex-[2] items-center justify-center text-[10px] font-bold"
          style={{
            backgroundColor: preset.colors["comic-paper"],
            color: preset.colors["comic-ink"],
          }}
        >
          Content
        </div>
        <div
          className="flex flex-1 items-center justify-center text-[10px] font-bold"
          style={{
            backgroundColor: preset.colors["comic-cyan"],
            color: preset.colors["comic-on-secondary"],
          }}
        >
          Footer
        </div>
      </div>
    </button>
  );
}
