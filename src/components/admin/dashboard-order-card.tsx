"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice, timeAgo, VALID_STATUS_TRANSITIONS } from "@/lib/utils";

interface DashboardOrderCardProps {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  createdAt: string;
  status: string;
}

const ACTION_LABELS: Record<string, string> = {
  pending: "Confirm",
  confirmed: "Ship",
  shipped: "Deliver",
};

const NEXT_STATUS: Record<string, string> = {
  pending: "confirmed",
  confirmed: "shipped",
  shipped: "delivered",
};

export function DashboardOrderCard({
  id,
  orderNumber,
  customerName,
  total,
  createdAt,
  status,
}: DashboardOrderCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const actionLabel = ACTION_LABELS[status];
  const nextStatus = NEXT_STATUS[status];

  async function handleQuickAction(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!nextStatus || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link
      href={`/admin/orders/${id}`}
      className="block rounded-lg border border-warm-brown/10 p-3 transition-colors hover:bg-warm-gray/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-teal-primary">{orderNumber}</p>
          <p className="mt-0.5 truncate text-xs text-warm-brown/70">
            {customerName}
          </p>
        </div>
        <p className="whitespace-nowrap text-sm font-medium text-warm-brown">
          {formatPrice(total)}
        </p>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-warm-brown/50">{timeAgo(createdAt)}</span>
        {actionLabel && (
          <button
            onClick={handleQuickAction}
            disabled={loading}
            className="rounded-full bg-teal-primary px-3 py-0.5 text-xs font-medium text-white transition-colors hover:bg-teal-dark disabled:opacity-50"
          >
            {loading ? "..." : actionLabel}
          </button>
        )}
      </div>
    </Link>
  );
}
