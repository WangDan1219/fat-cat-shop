"use client";

import { useState } from "react";

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

export function ProductImageGallery({ images, productTitle }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="aspect-square overflow-hidden border-3 border-comic-ink bg-comic-light-gray shadow-comic">
        {activeImage ? (
          <img
            src={activeImage.url}
            alt={activeImage.altText ?? productTitle}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-comic-ink/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={`aspect-square overflow-hidden border-2 bg-comic-light-gray transition-all ${
                index === activeIndex
                  ? "border-comic-red shadow-comic-sm"
                  : "border-comic-ink hover:border-comic-red/60"
              }`}
            >
              <img
                src={img.url}
                alt={img.altText ?? ""}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
