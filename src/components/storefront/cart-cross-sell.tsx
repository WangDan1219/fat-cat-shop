"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useCartStore } from "@/stores/cart-store";
import { ProductCard } from "@/components/storefront/product-card";

interface CrossSellProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: { url: string; altText: string | null }[];
}

export function CartCrossSell() {
  const items = useCartStore((s) => s.items);
  const [suggestions, setSuggestions] = useState<CrossSellProduct[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const productIds = useMemo(
    () => items.map((i) => i.productId).join(","),
    [items],
  );

  useEffect(() => {
    if (!productIds) {
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      fetch(`/api/cross-sell?ids=${encodeURIComponent(productIds)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.products)) {
            setSuggestions(data.products);
          }
        })
        .catch(() => {});
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [productIds]);

  if (suggestions.length === 0 || items.length === 0) return null;

  return (
    <section className="mt-12 border-t-3 border-comic-ink pt-8">
      <h2 className="font-display text-xl font-bold text-comic-ink">
        You might also like
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {suggestions.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
