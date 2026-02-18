"use client";

import { useState } from "react";
import { ProductCard } from "@/components/storefront/product-card";

interface ProductSearchProps {
  products: {
    id: string;
    title: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    images: { url: string; altText: string | null }[];
  }[];
}

export function ProductSearch({ products }: ProductSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? products.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()),
      )
    : products;

  return (
    <>
      <div className="mt-6">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-comic-ink/30"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="w-full border-3 border-comic-ink bg-comic-panel py-3 pl-12 pr-4 font-bold text-comic-ink placeholder:text-comic-ink/30 focus:outline-none focus:ring-2 focus:ring-comic-red/30 sm:max-w-sm"
          />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && query.trim() && (
        <p className="mt-16 text-center font-bold text-comic-ink/50">
          No products match &ldquo;{query}&rdquo;. Try a different search.
        </p>
      )}

      {filtered.length === 0 && !query.trim() && (
        <p className="mt-16 text-center font-bold text-comic-ink/50">
          No products available yet. Check back soon!
        </p>
      )}
    </>
  );
}
