"use client";

import { useCartStore } from "@/stores/cart-store";
import { useState } from "react";

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    price: number;
    image: string | null;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      className="min-h-[44px] w-full cursor-pointer rounded-full border-2 border-teal-dark/10 bg-teal-primary px-6 py-3 font-display text-sm font-bold text-white shadow-clay transition-all duration-200 ease-out hover:bg-teal-dark hover:shadow-clay-hover hover:-translate-y-0.5 active:shadow-clay-pressed active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
      disabled={added}
      aria-label={added ? `${product.title} added to cart` : `Add ${product.title} to cart`}
    >
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}
