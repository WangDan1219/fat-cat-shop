"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";
import { useEffect, useState } from "react";

export function Header() {
  const totalItems = useCartStore((s) => s.totalItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-peach-dark/50 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-2xl font-bold text-teal-primary transition-colors duration-200 hover:text-teal-dark"
        >
          Fat Cat
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          <Link
            href="/products"
            className="cursor-pointer text-sm font-medium text-warm-brown transition-colors duration-200 hover:text-teal-primary"
          >
            Shop
          </Link>
        </nav>

        <Link
          href="/cart"
          className="relative flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border-2 border-teal-dark/10 bg-teal-primary px-5 py-2 text-sm font-medium text-white shadow-clay transition-all duration-200 ease-out hover:bg-teal-dark hover:shadow-clay-hover active:shadow-clay-pressed"
          aria-label={`Shopping cart${mounted && totalItems() > 0 ? `, ${totalItems()} items` : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          Cart
          {mounted && totalItems() > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-teal-primary">
              {totalItems()}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
