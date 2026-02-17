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
      className="min-h-[44px] w-full cursor-pointer border-3 border-comic-ink bg-comic-red px-6 py-3 font-display text-base font-bold text-white shadow-comic transition-all duration-200 ease-out hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-comic-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-comic-pressed disabled:translate-x-0 disabled:translate-y-0 disabled:opacity-70 disabled:shadow-comic-pressed"
      disabled={added}
      aria-label={added ? `${product.title} added to cart` : `Add ${product.title} to cart`}
    >
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}
