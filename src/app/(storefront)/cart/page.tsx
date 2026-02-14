"use client";

import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-warm-brown">
          Your Cart
        </h1>
        <div className="mt-8 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-warm-gray" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-warm-brown">
          Your Cart
        </h1>
        <div className="mt-12 text-center">
          <p className="text-warm-brown/60">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-6 inline-block min-h-[44px] cursor-pointer rounded-full border-2 border-teal-dark/10 bg-teal-primary px-8 py-3 font-display text-sm font-bold text-white shadow-clay transition-all duration-200 ease-out hover:bg-teal-dark hover:shadow-clay-hover"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-warm-brown">
        Your Cart
      </h1>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-2xl border-2 border-white/60 bg-white p-4 shadow-clay"
          >
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-warm-gray">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-warm-brown/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    aria-hidden="true"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-display text-sm font-semibold text-warm-brown">
                {item.title}
              </h3>
              <p className="mt-1 text-sm font-bold text-teal-primary">
                {formatPrice(item.price)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity - 1)
                }
                className="flex h-9 w-9 min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border-2 border-warm-brown/15 text-warm-brown transition-all duration-200 hover:border-teal-primary hover:text-teal-primary active:bg-teal-primary/10"
                aria-label={`Decrease quantity of ${item.title}`}
              >
                -
              </button>
              <span className="w-8 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
                className="flex h-9 w-9 min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border-2 border-warm-brown/15 text-warm-brown transition-all duration-200 hover:border-teal-primary hover:text-teal-primary active:bg-teal-primary/10"
                aria-label={`Increase quantity of ${item.title}`}
              >
                +
              </button>
            </div>

            <div className="w-20 text-right text-sm font-bold text-warm-brown">
              {formatPrice(item.price * item.quantity)}
            </div>

            <button
              onClick={() => removeItem(item.productId)}
              className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center text-warm-brown/40 transition-colors duration-200 hover:text-red-500"
              aria-label={`Remove ${item.title} from cart`}
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 rounded-2xl border-2 border-white/60 bg-white p-6 shadow-clay">
        <div className="flex items-center justify-between text-lg font-bold text-warm-brown">
          <span>Total</span>
          <span className="text-teal-primary">{formatPrice(totalPrice())}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-6 block min-h-[44px] w-full cursor-pointer rounded-full border-2 border-teal-dark/10 bg-teal-primary py-3 text-center font-display text-sm font-bold text-white shadow-clay transition-all duration-200 ease-out hover:bg-teal-dark hover:shadow-clay-hover active:shadow-clay-pressed"
        >
          Proceed to Checkout
        </Link>
        <Link
          href="/products"
          className="mt-3 block cursor-pointer text-center text-sm text-warm-brown/60 transition-colors duration-200 hover:text-teal-primary"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
