"use client";

import { useEffect } from "react";

export function ThemeHotReload() {
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type !== "theme-update") return;
      const vars: Record<string, string> = e.data.cssVars ?? {};
      const root = document.documentElement;
      for (const [key, value] of Object.entries(vars)) {
        root.style.setProperty(key, value);
      }
    }

    window.addEventListener("message", handleMessage);

    // Also poll for changes from other tabs
    let lastSnapshot = "";
    let active = true;

    async function poll() {
      if (!active) return;
      try {
        const res = await fetch("/api/theme", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const vars: Record<string, string> = data.cssVars ?? {};
        const snapshot = JSON.stringify(vars);

        if (lastSnapshot && lastSnapshot !== snapshot) {
          const root = document.documentElement;
          for (const [key, value] of Object.entries(vars)) {
            root.style.setProperty(key, value);
          }
        }
        lastSnapshot = snapshot;
      } catch {
        // ignore
      }
    }

    poll();
    const id = setInterval(poll, 2000);

    return () => {
      active = false;
      clearInterval(id);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return null;
}
