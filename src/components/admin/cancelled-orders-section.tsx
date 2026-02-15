"use client";

import { useState } from "react";
import { DashboardOrderCard } from "@/components/admin/dashboard-order-card";

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  createdAt: string;
  status: string;
}

interface CancelledOrdersSectionProps {
  orders: OrderData[];
  count: number;
}

export function CancelledOrdersSection({
  orders,
  count,
}: CancelledOrdersSectionProps) {
  const [open, setOpen] = useState(false);

  if (count === 0) return null;

  return (
    <div className="rounded-xl bg-white shadow-sm">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-display text-sm font-bold text-warm-brown/60">
            Cancelled
          </h3>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-100 px-1.5 text-xs font-medium text-red-800">
            {count}
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-warm-brown/40 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="space-y-2 border-t border-warm-brown/10 p-3">
          {orders.map((order) => (
            <DashboardOrderCard
              key={order.id}
              id={order.id}
              orderNumber={order.orderNumber}
              customerName={order.customerName}
              total={order.total}
              createdAt={order.createdAt}
              status={order.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}
