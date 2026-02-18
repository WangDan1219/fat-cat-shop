import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { ProductImageGallery } from "@/components/storefront/product-image-gallery";
import { ProductCard } from "@/components/storefront/product-card";
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

  const relatedProducts = product.categoryId
    ? await db.query.products.findMany({
        where: and(
          eq(products.categoryId, product.categoryId),
          eq(products.status, "active"),
          ne(products.id, product.id),
        ),
        with: { images: true },
        limit: 4,
      })
    : [];

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm font-bold text-comic-ink/60">
        <Link href="/" className="hover:text-comic-red">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-comic-red">
          Shop
        </Link>
        <span>/</span>
        <span className="text-comic-ink">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image Gallery */}
        <ProductImageGallery
          images={product.images}
          productTitle={product.title}
        />

        {/* Product Info */}
        <div>
          {product.category && (
            <p className="mb-2 inline-block border-2 border-comic-ink bg-comic-cyan px-2 py-0.5 text-sm font-bold text-comic-on-secondary">
              {product.category.name}
            </p>
          )}
          <h1 className="font-display text-3xl font-bold text-comic-ink">
            {product.title}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="border-3 border-comic-ink bg-comic-yellow px-3 py-1 text-3xl font-bold text-comic-on-accent shadow-comic-sm">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-comic-muted line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>

          {product.description && (
            <div className="mt-6 text-comic-ink/80 leading-relaxed">
              <p>{product.description}</p>
            </div>
          )}

          <div className="mt-8">
            <AddToCartButton
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images[0]?.url ?? null,
              }}
            />
          </div>

          {product.tags && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.split(",").map((tag) => (
                <span
                  key={tag}
                  className="border-2 border-comic-ink bg-comic-light-gray px-3 py-1 text-xs font-bold text-comic-ink/70"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t-3 border-comic-ink pt-12">
          <h2 className="font-display text-2xl font-bold text-comic-ink">More from this category</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  title: p.title,
                  slug: p.slug,
                  price: p.price,
                  compareAtPrice: p.compareAtPrice,
                  images: p.images.map((img) => ({ url: img.url, altText: img.altText })),
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
