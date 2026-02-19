"use client";

import { useId } from "react";
import { useModal } from "@/hooks/use-modal";

interface AppearancePreviewModalProps {
  open: boolean;
  onClose: () => void;
  iframeRef: React.RefCallback<HTMLIFrameElement>;
}

export function AppearancePreviewModal({ open, onClose, iframeRef }: AppearancePreviewModalProps) {
  const dialogRef = useModal(open, onClose);
  const titleId = useId();

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-warm-brown/10 bg-white shadow-xl sm:max-w-2xl">
        <div className="flex items-center justify-between border-b border-warm-brown/10 px-4 py-3">
          <h3 id={titleId} className="font-display text-sm font-bold text-warm-brown">
            Live Preview
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-warm-brown/50 transition-colors hover:bg-warm-brown/5 hover:text-warm-brown"
            aria-label="Close preview"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <iframe
            ref={iframeRef}
            src="/"
            className="h-full w-full"
            title="Theme preview"
          />
        </div>
      </div>
    </div>
  );
}
