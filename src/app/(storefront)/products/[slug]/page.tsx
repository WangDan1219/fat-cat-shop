import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import type { Metadata } from "next";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.title,
    description: product.description ?? `Buy ${product.title} at Fat Cat Shop`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      images: { orderBy: (images, { asc }) => [asc(images.sortOrder)] },
      category: true,
    },
  });

  if (!product || product.status !== "active") {
    notFound();
  }

  const mainImage = product.images[0];
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-warm-brown/60">
        <Link href="/" className="hover:text-teal-primary">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-teal-primary">
          Shop
        </Link>
        <span>/</span>
        <span className="text-warm-brown">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-2xl bg-warm-gray">
            {mainImage ? (
              <img
                src={mainImage.url}
                alt={mainImage.altText ?? product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-warm-brown/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
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

          {/* Thumbnail gallery */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className="aspect-square overflow-hidden rounded-lg bg-warm-gray"
                >
                  <img
                    src={img.url}
                    alt={img.altText ?? ""}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.category && (
            <p className="mb-2 text-sm font-medium text-teal-primary">
              {product.category.name}
            </p>
          )}
          <h1 className="font-display text-3xl font-bold text-warm-brown">
            {product.title}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-teal-primary">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-warm-brown/50 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>

          {product.description && (
            <div className="mt-6 text-warm-brown/80 leading-relaxed">
              <p>{product.description}</p>
            </div>
          )}

          <div className="mt-8">
            <AddToCartButton
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                image: mainImage?.url ?? null,
              }}
            />
          </div>

          {product.tags && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.split(",").map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-peach px-3 py-1 text-xs text-warm-brown/70"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
