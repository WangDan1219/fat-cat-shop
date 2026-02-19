"use client";

import { useId } from "react";
import { useModal } from "@/hooks/use-modal";

interface MobileSidebarDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileSidebarDrawer({ open, onClose, children }: MobileSidebarDrawerProps) {
  const dialogRef = useModal(open, onClose);
  const titleId = useId();

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal={open}
      aria-label="Admin navigation"
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

      {/* Sidebar overlay */}
      <div
        id={titleId}
        className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        inert={!open}
      >
        {children}
      </div>
    </div>
  );
}
