"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/storefront/product-card";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string | null;
  categoryName: string | null;
  images: { url: string; altText: string | null }[];
}

interface ProductSearchProps {
  products: Product[];
  categories: { id: string; name: string; slug: string }[];
}

export function ProductSearch({ products, categories }: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filtered = useMemo(() => {
    const afterCategory = selectedCategory
      ? products.filter((p) => p.categoryId === selectedCategory)
      : products;

    const afterSearch = query.trim()
      ? afterCategory.filter((p) =>
          p.title.toLowerCase().includes(query.toLowerCase()),
        )
      : afterCategory;

    const sorted = [...afterSearch].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-az":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, query, selectedCategory, sortBy]);

  return (
    <>
      {/* Category filter pills */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setSelectedCategory("")}
          className={
            selectedCategory === ""
              ? "shrink-0 border-3 border-comic-ink bg-comic-cyan px-4 py-2 font-bold text-comic-on-secondary"
              : "shrink-0 border-3 border-comic-ink bg-comic-panel px-4 py-2 font-bold hover:bg-comic-light-gray"
          }
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={
              selectedCategory === cat.id
                ? "shrink-0 border-3 border-comic-ink bg-comic-cyan px-4 py-2 font-bold text-comic-on-secondary"
                : "shrink-0 border-3 border-comic-ink bg-comic-panel px-4 py-2 font-bold hover:bg-comic-light-gray"
            }
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search + sort row */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort products"
          className="border-3 border-comic-ink bg-comic-panel px-4 py-3 font-bold"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-az">Name: A to Z</option>
        </select>
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
