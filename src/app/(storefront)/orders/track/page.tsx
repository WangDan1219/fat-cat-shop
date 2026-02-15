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
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
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
      <h1 className="font-display text-3xl font-bold text-warm-brown">
        Track Your Order
      </h1>
      <p className="mt-2 text-warm-brown/60">
        Enter your order number and email to check the status of your order.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 rounded-xl bg-white p-6 shadow-clay">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-warm-brown/70">
              Order Number <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
              placeholder="e.g. FC-20260215-ABC1"
              className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown outline-none transition-colors focus:border-teal-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-warm-brown/70">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown outline-none transition-colors focus:border-teal-primary"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-teal-primary py-3 font-display text-sm font-bold text-white transition-colors hover:bg-teal-dark disabled:opacity-50 sm:w-auto sm:px-12"
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
      <div className="rounded-xl bg-white p-6 shadow-clay">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-warm-brown">
              Order {order.orderNumber}
            </h2>
            <p className="mt-1 text-sm text-warm-brown/60">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-800"}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-xl bg-white p-6 shadow-clay">
        <h3 className="font-display text-lg font-bold text-warm-brown">
          Items Ordered
        </h3>
        <div className="mt-4 divide-y divide-warm-brown/10">
          {order.lineItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 text-sm">
              <div>
                <span className="font-medium text-warm-brown">{item.title}</span>
                <span className="ml-2 text-warm-brown/60">x{item.quantity}</span>
              </div>
              <div className="text-right">
                <span className="text-warm-brown/60">
                  {formatPrice(item.unitPrice)} each
                </span>
                <span className="ml-4 font-medium text-warm-brown">
                  {formatPrice(item.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-warm-brown/10 pt-4">
          <div className="flex justify-between text-sm text-warm-brown/70">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-warm-brown/70">
            <span>Shipping</span>
            <span>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span className="text-warm-brown">Total</span>
            <span className="text-teal-primary">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      {order.statusHistory.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-clay">
          <h3 className="font-display text-lg font-bold text-warm-brown">
            Order Timeline
          </h3>
          <div className="mt-4 space-y-0">
            {order.statusHistory.map((entry, i) => (
              <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Timeline line */}
                {i < order.statusHistory.length - 1 && (
                  <div className="absolute left-[7px] top-4 h-full w-0.5 bg-warm-brown/10" />
                )}
                {/* Dot */}
                <div className="relative mt-1.5 h-4 w-4 flex-shrink-0 rounded-full border-2 border-teal-primary bg-white">
                  {i === order.statusHistory.length - 1 && (
                    <div className="absolute inset-1 rounded-full bg-teal-primary" />
                  )}
                </div>
                {/* Content */}
                <div>
                  <p className="text-sm font-medium capitalize text-warm-brown">
                    {entry.toStatus}
                  </p>
                  <p className="text-xs text-warm-brown/50">
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
        <div className="rounded-xl bg-white p-6 shadow-clay">
          <h3 className="font-display text-lg font-bold text-warm-brown">
            Shipping Address
          </h3>
          <div className="mt-3 text-sm leading-relaxed text-warm-brown/70">
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
