import Link from "next/link";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProductCard } from "@/components/storefront/product-card";

export default async function HomePage() {
  const allProducts = await db.query.products.findMany({
    where: eq(products.status, "active"),
    with: { images: true },
    limit: 4,
  });

  return (
    <>
      {/* Hero Section */}
      <section className="bg-peach">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-warm-brown sm:text-5xl md:text-6xl">
              Everything Your{" "}
              <span className="text-teal-primary">Cat</span> Needs
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-warm-brown/70">
              Premium toys, treats, and accessories curated for your feline
              friends. Because happy cats make happy homes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/products"
                className="min-h-[44px] cursor-pointer rounded-full border-2 border-teal-dark/10 bg-teal-primary px-8 py-3 font-display text-sm font-bold text-white shadow-clay transition-all duration-200 ease-out hover:bg-teal-dark hover:shadow-clay-hover hover:-translate-y-0.5 active:shadow-clay-pressed active:translate-y-0"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-warm-brown">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="cursor-pointer text-sm font-medium text-teal-primary transition-colors duration-200 hover:text-teal-dark"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
          <p className="mt-8 text-center text-warm-brown/50">
            No products yet. Check back soon!
          </p>
        )}
      </section>
    </>
  );
}
