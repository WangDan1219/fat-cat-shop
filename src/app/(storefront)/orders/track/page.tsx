"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";

interface ShippingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

interface LineItem {
  title: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface StatusEntry {
  fromStatus: string | null;
  toStatus: string;
  createdAt: string;
}

interface OrderResult {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt: string;
  lineItems: LineItem[];
  statusHistory: StatusEntry[];
  shippingAddress: ShippingAddress | null;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "border-comic-yellow bg-comic-yellow text-comic-on-accent",
  confirmed: "border-comic-blue bg-comic-blue text-comic-on-accent",
  shipped: "border-comic-pink bg-comic-pink text-comic-on-accent",
  delivered: "border-comic-cyan bg-comic-cyan text-comic-on-secondary",
  completed: "border-comic-cyan bg-comic-cyan text-comic-on-secondary",
  returned: "border-comic-yellow bg-comic-yellow text-comic-on-accent",
  cancelled: "border-comic-red bg-comic-red text-comic-on-primary",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderTrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: orderNumber.trim(), email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to track order");
      }

      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-comic-ink">
        Track Your Order
      </h1>
      <p className="mt-2 font-bold text-comic-ink/60">
        Enter your order number and email to check the status of your order.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 border-3 border-comic-ink bg-comic-panel p-6 shadow-comic">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-bold text-comic-ink/70">
              Order Number <span className="text-comic-error">*</span>
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
              placeholder="e.g. FC-20260215-ABC1"
              className="w-full border-2 border-comic-ink px-4 py-2 text-sm font-bold text-comic-ink outline-none transition-colors focus:border-comic-cyan"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-comic-ink/70">
              Email <span className="text-comic-error">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border-2 border-comic-ink px-4 py-2 text-sm font-bold text-comic-ink outline-none transition-colors focus:border-comic-cyan"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 border-2 border-comic-error bg-comic-error/10 p-3 text-sm font-bold text-comic-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full cursor-pointer border-3 border-comic-ink bg-comic-red py-3 font-display text-base font-bold text-comic-on-primary shadow-comic transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-comic-hover disabled:opacity-50 sm:w-auto sm:px-12"
        >
          {loading ? "Tracking..." : "Track Order"}
        </button>
      </form>

      {order && <OrderDetails order={order} />}
    </div>
  );
}

function OrderDetails({ order }: { order: OrderResult }) {
  return (
    <div className="mt-8 space-y-6">
      {/* Order Header */}
      <div className="border-3 border-comic-ink bg-comic-panel p-6 shadow-comic">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-comic-ink">
              Order {order.orderNumber}
            </h2>
            <p className="mt-1 text-sm font-bold text-comic-ink/60">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <span
            className={`border-2 px-3 py-1 text-xs font-bold capitalize ${STATUS_COLORS[order.status] ?? "border-comic-ink bg-comic-light-gray text-comic-ink"}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="border-3 border-comic-ink bg-comic-panel p-6 shadow-comic">
        <h3 className="font-display text-lg font-bold text-comic-ink">
          Items Ordered
        </h3>
        <div className="mt-4 divide-y-2 divide-comic-ink/10">
          {order.lineItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 text-sm">
              <div>
                <span className="font-bold text-comic-ink">{item.title}</span>
                <span className="ml-2 font-bold text-comic-ink/60">x{item.quantity}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-comic-ink/60">
                  {formatPrice(item.unitPrice)} each
                </span>
                <span className="ml-4 font-bold text-comic-ink">
                  {formatPrice(item.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t-2 border-comic-ink pt-4">
          <div className="flex justify-between text-sm font-bold text-comic-ink/70">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-comic-ink/70">
            <span>Shipping</span>
            <span>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span className="text-comic-ink">Total</span>
            <span className="border-2 border-comic-ink bg-comic-yellow px-2 py-0.5 text-comic-on-accent">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      {order.statusHistory.length > 0 && (
        <div className="border-3 border-comic-ink bg-comic-panel p-6 shadow-comic">
          <h3 className="font-display text-lg font-bold text-comic-ink">
            Order Timeline
          </h3>
          <div className="mt-4 space-y-0">
            {order.statusHistory.map((entry, i) => (
              <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Timeline line */}
                {i < order.statusHistory.length - 1 && (
                  <div className="absolute left-[7px] top-4 h-full w-0.5 bg-comic-ink/20" />
                )}
                {/* Dot */}
                <div className="relative mt-1.5 h-4 w-4 flex-shrink-0 border-2 border-comic-ink bg-comic-panel">
                  {i === order.statusHistory.length - 1 && (
                    <div className="absolute inset-0.5 bg-comic-red" />
                  )}
                </div>
                {/* Content */}
                <div>
                  <p className="text-sm font-bold capitalize text-comic-ink">
                    {entry.toStatus}
                  </p>
                  <p className="text-xs font-bold text-comic-ink/50">
                    {formatDate(entry.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="border-3 border-comic-ink bg-comic-panel p-6 shadow-comic">
          <h3 className="font-display text-lg font-bold text-comic-ink">
            Shipping Address
          </h3>
          <div className="mt-3 text-sm font-bold leading-relaxed text-comic-ink/70">
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && (
              <p>{order.shippingAddress.addressLine2}</p>
            )}
            <p>
              {order.shippingAddress.city}
              {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""}
              {order.shippingAddress.postalCode ? ` ${order.shippingAddress.postalCode}` : ""}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
      )}
    </div>
  );
}
