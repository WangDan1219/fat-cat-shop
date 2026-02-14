import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    images: { url: string; altText: string | null }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0];
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block cursor-pointer overflow-hidden rounded-2xl border-2 border-white/60 bg-white shadow-clay transition-all duration-200 ease-out hover:shadow-clay-hover hover:-translate-y-1 active:shadow-clay-pressed active:translate-y-0"
    >
      <div className="aspect-square overflow-hidden bg-warm-gray">
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={mainImage.altText ?? product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-warm-brown/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-sm font-semibold text-warm-brown transition-colors duration-200 group-hover:text-teal-primary">
          {product.title}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-teal-primary">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-warm-brown/50 line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
