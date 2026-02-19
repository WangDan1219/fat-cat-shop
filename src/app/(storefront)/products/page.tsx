import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProductSearch } from "@/components/storefront/product-search";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our collection of premium cat products.",
};

export default async function ProductsPage() {
  const [allProducts, allCategories] = await Promise.all([
    db.query.products.findMany({
      where: eq(products.status, "active"),
      with: { images: true, category: true },
      orderBy: (products, { desc }) => [desc(products.createdAt)],
    }),
    db.query.categories.findMany({
      orderBy: (c, { asc }) => [asc(c.sortOrder)],
    }),
  ]);

  const mappedProducts = allProducts.map((product) => ({
    id: product.id,
    title: product.title,
    slug: product.slug,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    categoryId: product.categoryId,
    categoryName: product.category?.name ?? null,
    images: product.images.map((img) => ({
      url: img.url,
      altText: img.altText,
    })),
  }));

  const mappedCategories = allCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-comic-ink">Shop</h1>
      <p className="mt-2 font-bold text-comic-ink/70">
        Browse our collection of premium cat products.
      </p>

      <ProductSearch products={mappedProducts} categories={mappedCategories} />
    </div>
  );
}
