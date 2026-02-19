"use client";

import { useEffect, useId, useRef } from "react";
import { useModal } from "@/hooks/use-modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useModal(open, onCancel);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  // Focus the cancel button (least destructive) when dialog opens
  useEffect(() => {
    if (open) {
      cancelBtnRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  const confirmClasses =
    variant === "danger"
      ? "bg-red-500 text-white hover:bg-red-600"
      : "bg-teal-primary text-white hover:bg-teal-dark";

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-warm-brown/10 bg-white p-6 shadow-xl">
        <h3 id={titleId} className="font-display text-lg font-bold text-warm-brown">{title}</h3>
        <p id={descId} className="mt-2 text-sm text-warm-brown/70">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-warm-brown/20 px-4 py-2 text-sm font-medium text-warm-brown/70 transition-colors hover:bg-warm-brown/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-bold transition-colors ${confirmClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
