"use client";

import Link from "next/link";
import { useId } from "react";
import { useModal } from "@/hooks/use-modal";

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  const dialogRef = useModal(open, onClose);
  const titleId = useId();

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal={open}
      aria-labelledby={titleId}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r-3 border-comic-ink bg-comic-panel shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        inert={!open}
      >
        <div className="flex h-16 items-center justify-between border-b-3 border-comic-ink bg-comic-yellow px-4">
          <span id={titleId} className="font-display text-lg font-bold text-comic-on-accent">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center text-comic-on-accent"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          <Link
            href="/products"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-4 py-3 font-bold text-comic-ink transition-colors hover:bg-comic-yellow/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
            </svg>
            Shop
          </Link>
          <Link
            href="/orders/track"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-4 py-3 font-bold text-comic-ink transition-colors hover:bg-comic-yellow/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
              <path d="m7.5 4.27 9 5.15" /><path d="M3.29 7 12 12l8.71-5" /><path d="M12 22V12" />
              <circle cx="18.5" cy="15.5" r="2.5" /><path d="M20.27 17.27 22 19" />
            </svg>
            Track Order
          </Link>
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-4 py-3 font-bold text-comic-ink transition-colors hover:bg-comic-yellow/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            Cart
          </Link>
        </nav>
      </div>
    </div>
  );
}
