"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statusFlow = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  async function handleUpdate() {
    if (selectedStatus === currentStatus) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="font-display text-lg font-bold text-warm-brown">
        Update Status
      </h2>
      <div className="mt-4 space-y-3">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown outline-none focus:border-teal-primary"
        >
          {statusFlow.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <button
          onClick={handleUpdate}
          disabled={loading || selectedStatus === currentStatus}
          className="w-full rounded-full bg-teal-primary py-2 text-sm font-bold text-white transition-colors hover:bg-teal-dark disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Status"}
        </button>
      </div>
    </div>
  );
}
