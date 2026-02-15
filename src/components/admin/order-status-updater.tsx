"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { VALID_STATUS_TRANSITIONS } from "@/lib/utils";

export function OrderStatusUpdater({
  orderId,
  currentStatus,
  paymentStatus,
}: {
  orderId: string;
  currentStatus: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
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

  async function handlePaymentToggle() {
    const newStatus = paymentStatus === "paid" ? "unpaid" : "paid";
    setPayLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to update payment status");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPayLoading(false);
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold text-warm-brown">
        Update Status
      </h2>

      {/* Payment Status Toggle */}
      <div className="mt-4 flex items-center justify-between rounded-lg border border-warm-brown/10 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-warm-brown">Payment</p>
          <p className="text-xs text-warm-brown/50 capitalize">
            {paymentStatus}
          </p>
        </div>
        <button
          onClick={handlePaymentToggle}
          disabled={payLoading || paymentStatus === "refunded"}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors disabled:opacity-50 ${paymentStatus === "paid"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
        >
          {payLoading
            ? "Updating..."
            : paymentStatus === "paid"
              ? "Mark Unpaid"
              : paymentStatus === "refunded"
                ? "Refunded"
                : "Mark Paid"}
        </button>
      </div>

      {/* Status Transition */}
      {validNextStatuses.length > 0 ? (
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
      ) : (
        <p className="mt-4 text-sm text-warm-brown/50">
          No further status transitions available.
        </p>
      )}
    </div>
  );
}
