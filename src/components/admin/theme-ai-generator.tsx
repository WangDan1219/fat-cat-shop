"use client";

import type { ThemeColors } from "@/lib/theme/types";
import { useState, useRef } from "react";

interface ThemeAiGeneratorProps {
  onPaletteGenerated: (colors: Partial<ThemeColors>) => void;
}

export function ThemeAiGenerator({ onPaletteGenerated }: ThemeAiGeneratorProps) {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [prompt, setPrompt] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result.split(",")[1]);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleGenerate() {
    if (mode === "text" && !prompt.trim()) {
      setError("Enter a description");
      return;
    }
    if (mode === "image" && !imageBase64) {
      setError("Upload an image first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/theme/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          prompt: mode === "text" ? prompt.trim() : undefined,
          image: mode === "image" ? imageBase64 : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Generation failed");
      }

      onPaletteGenerated(data.colors);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold text-warm-brown">
        AI Palette Generator
      </h3>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "text"
              ? "bg-teal-primary text-white"
              : "bg-warm-brown/5 text-warm-brown/70 hover:bg-warm-brown/10"
          }`}
        >
          Describe a style
        </button>
        <button
          type="button"
          onClick={() => setMode("image")}
          className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "image"
              ? "bg-teal-primary text-white"
              : "bg-warm-brown/5 text-warm-brown/70 hover:bg-warm-brown/10"
          }`}
        >
          Upload reference image
        </button>
      </div>

      {/* Text mode */}
      {mode === "text" && (
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder='e.g. "Ocean calm with teal waves", "Warm autumn forest", "Cyberpunk neon city"...'
            className="w-full rounded-lg border border-warm-brown/20 px-4 py-3 text-sm text-warm-brown outline-none transition-colors focus:border-teal-primary"
          />
        </div>
      )}

      {/* Image mode */}
      {mode === "image" && (
        <div>
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Reference"
                className="h-48 w-full rounded-lg border border-warm-brown/20 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute right-2 top-2 cursor-pointer rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-warm-brown/20 py-8 transition-colors hover:border-teal-primary/40">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-warm-brown/30">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span className="mt-2 text-sm text-warm-brown/50">
                Click to upload a reference image
              </span>
              <span className="mt-1 text-xs text-warm-brown/30">
                PNG, JPG up to 5MB
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm font-medium text-red-600">{error}</p>
      )}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="w-full cursor-pointer rounded-lg bg-teal-primary py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-dark disabled:opacity-50"
      >
        {loading ? "Generating palette..." : "Generate Palette"}
      </button>
    </div>
  );
}
