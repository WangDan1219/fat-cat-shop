"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewDiscountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    maxUses: "",
    perCustomerLimit: "1",
    expiresAt: "",
    active: true,
  });

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        type: form.type,
        // For percentage: stored as integer 1-100 (API converts to basis points)
        // For fixed: stored in pence (user enters pounds, we multiply by 100)
        value:
          form.type === "percentage"
            ? parseInt(form.value, 10)
            : Math.round(parseFloat(form.value) * 100),
        maxUses: form.maxUses ? parseInt(form.maxUses, 10) : null,
        perCustomerLimit: parseInt(form.perCustomerLimit, 10),
        expiresAt: form.expiresAt
          ? new Date(form.expiresAt).toISOString()
          : null,
        active: form.active,
      };

      const res = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to create discount code");
      }

      router.push("/admin/discounts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/discounts"
          className="text-sm text-warm-brown/60 hover:text-teal-primary"
        >
          ← Discount Codes
        </Link>
        <h1 className="font-display text-2xl font-bold text-warm-brown">
          New Discount Code
        </h1>
      </div>

      <div className="max-w-lg rounded-xl bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-warm-brown/70">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => update("code", e.target.value.toUpperCase())}
              required
              placeholder="SAVE10"
              maxLength={50}
              className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 font-mono text-sm font-bold uppercase text-warm-brown focus:border-teal-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-warm-brown/70">
              Discount Type <span className="text-red-500">*</span>
            </label>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown focus:border-teal-primary focus:outline-none"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (£)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-warm-brown/70">
              {form.type === "percentage" ? "Percentage (1–100)" : "Amount (£)"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.value}
              onChange={(e) => update("value", e.target.value)}
              required
              min={1}
              max={form.type === "percentage" ? 100 : undefined}
              step={form.type === "percentage" ? 1 : 0.01}
              placeholder={form.type === "percentage" ? "10" : "5.00"}
              className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown focus:border-teal-primary focus:outline-none"
            />
            {form.type === "percentage" && (
              <p className="mt-1 text-xs text-warm-brown/50">
                Enter a whole number, e.g. 10 for 10% off
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-warm-brown/70">
                Max Total Uses
              </label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => update("maxUses", e.target.value)}
                min={1}
                placeholder="Unlimited"
                className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown focus:border-teal-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-warm-brown/70">
                Uses Per Customer
              </label>
              <input
                type="number"
                value={form.perCustomerLimit}
                onChange={(e) => update("perCustomerLimit", e.target.value)}
                min={1}
                required
                className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown focus:border-teal-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-warm-brown/70">
              Expiry Date
            </label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(e) => update("expiresAt", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-lg border border-warm-brown/20 px-4 py-2 text-sm text-warm-brown focus:border-teal-primary focus:outline-none"
            />
            <p className="mt-1 text-xs text-warm-brown/50">
              Leave blank for no expiry
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={form.active}
              onChange={(e) => update("active", e.target.checked)}
              className="h-4 w-4 accent-teal-primary"
            />
            <label
              htmlFor="active"
              className="text-sm font-semibold text-warm-brown/70"
            >
              Active (customers can use this code immediately)
            </label>
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-teal-primary px-6 py-2 text-sm font-bold text-white hover:bg-teal-dark disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Code"}
            </button>
            <Link
              href="/admin/discounts"
              className="rounded-full border border-warm-brown/20 px-6 py-2 text-sm font-bold text-warm-brown/70 hover:bg-warm-gray"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
