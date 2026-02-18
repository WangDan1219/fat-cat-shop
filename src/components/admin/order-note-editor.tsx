"use client";

import { useState } from "react";

interface OrderNoteEditorProps {
  orderId: string;
  initialNote: string | null;
}

export function OrderNoteEditor({ orderId, initialNote }: OrderNoteEditorProps) {
  const [note, setNote] = useState(initialNote ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to save note");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError("Failed to save note");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold text-warm-brown">Order Note</h2>
      <div className="mt-4 space-y-3">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Add an internal note..."
          className="w-full rounded-lg border border-warm-brown/20 bg-warm-gray/30 px-3 py-2 text-sm text-warm-brown placeholder:text-warm-brown/40 focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-teal-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-teal-dark disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Note"}
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium">Saved!</span>
          )}
          {error && (
            <span className="text-sm text-red-600">{error}</span>
          )}
        </div>
      </div>
    </div>
  );
}
