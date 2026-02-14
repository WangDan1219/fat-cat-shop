import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProductCard } from "@/components/storefront/product-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our collection of premium cat products.",
};

export default async function ProductsPage() {
  const allProducts = await db.query.products.findMany({
    where: eq(products.status, "active"),
    with: { images: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-warm-brown">Shop</h1>
      <p className="mt-2 text-warm-brown/70">
        Browse our collection of premium cat products.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              images: product.images.map((img) => ({
                url: img.url,
                altText: img.altText,
              })),
            }}
          />
        ))}
      </div>

      {allProducts.length === 0 && (
        <p className="mt-16 text-center text-warm-brown/50">
          No products available yet. Check back soon!
        </p>
      )}
    </div>
  );
}
