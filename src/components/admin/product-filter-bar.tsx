"use client";

import { useSearchParams, useRouter } from "next/navigation";

interface ProductFilterBarProps {
  categories: { id: string; name: string }[];
}

export function ProductFilterBar({ categories }: ProductFilterBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "";
  const category = searchParams.get("category") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/products?${params.toString()}`);
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {/* Search input */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-brown/40"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          defaultValue={q}
          placeholder="Search products..."
          aria-label="Search products"
          className="rounded-lg border border-warm-brown/20 bg-white py-1.5 pl-9 pr-3 text-sm text-warm-brown placeholder:text-warm-brown/40 focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary shadow-sm"
          onChange={(e) => updateParam("q", e.target.value)}
        />
      </div>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => updateParam("status", e.target.value)}
        className="rounded-lg border border-warm-brown/20 bg-white px-3 py-1.5 text-sm text-warm-brown focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary shadow-sm"
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>

      {/* Category filter */}
      {categories.length > 0 && (
        <select
          value={category}
          onChange={(e) => updateParam("category", e.target.value)}
          className="rounded-lg border border-warm-brown/20 bg-white px-3 py-1.5 text-sm text-warm-brown focus:border-teal-primary focus:outline-none focus:ring-1 focus:ring-teal-primary shadow-sm"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      )}

      {/* Clear filters link */}
      {(q || status || category) && (
        <button
          onClick={() => router.push("/admin/products")}
          className="text-sm text-warm-brown/60 hover:text-teal-primary transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
