"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";
import { useEffect, useState } from "react";

export function Header({ shopName = "Fat Cat" }: { shopName?: string }) {
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 border-b-3 border-comic-ink bg-comic-yellow">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-2xl font-bold text-comic-on-accent transition-transform duration-200 hover:rotate-[-2deg]"
        >
          {shopName}
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          <Link
            href="/products"
            className="cursor-pointer text-base font-bold text-comic-on-accent transition-all duration-200 hover:text-comic-red"
          >
            Shop
          </Link>
        </nav>

        <Link
          href="/cart"
          className="relative flex min-h-[44px] cursor-pointer items-center gap-2 border-3 border-comic-ink bg-comic-red px-5 py-2 font-bold text-comic-on-primary shadow-comic transition-all duration-200 ease-out hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-comic-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-comic-pressed"
          aria-label={`Shopping cart${mounted && itemCount > 0 ? `, ${itemCount} items` : ""}`}
        >
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
            aria-hidden="true"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          Cart
          {mounted && itemCount > 0 && (
            <span className="flex h-6 w-6 items-center justify-center border-2 border-comic-ink bg-comic-cyan text-xs font-bold text-comic-on-secondary">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
