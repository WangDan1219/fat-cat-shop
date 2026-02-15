"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { VALID_STATUS_TRANSITIONS } from "@/lib/utils";

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const validNextStatuses = VALID_STATUS_TRANSITIONS[currentStatus] ?? [];
  const [selectedStatus, setSelectedStatus] = useState(
    validNextStatuses[0] ?? currentStatus,
  );

  async function handleUpdate() {
    if (!validNextStatuses.includes(selectedStatus)) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          note: note.trim() || undefined,
        }),
      });

      if (res.ok) {
        setNote("");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to update status");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (validNextStatuses.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-warm-brown">
          Update Status
        </h2>
        <p className="mt-3 text-sm text-warm-brown/50">
          No further status transitions available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold text-warm-brown">
        Update Status
      </h2>
      <div className="mt-4 space-y-3">
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setError(null);
          }}
          className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown outline-none focus:border-teal-primary"
        >
          {validNextStatuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)"
          className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown outline-none placeholder:text-warm-brown/40 focus:border-teal-primary"
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full rounded-full bg-teal-primary py-2 text-sm font-bold text-white transition-colors hover:bg-teal-dark disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Status"}
        </button>
      </div>
    </div>
  );
}
