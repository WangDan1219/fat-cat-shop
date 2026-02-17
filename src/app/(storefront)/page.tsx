import Link from "next/link";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProductCard } from "@/components/storefront/product-card";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [allProducts, settings] = await Promise.all([
    db.query.products.findMany({
      where: eq(products.status, "active"),
      with: { images: true },
      limit: 4,
    }),
    getSiteSettings(),
  ]);

  const headingParts = settings.hero_heading.split(/\b(Cat)\b/i);

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative border-b-3 border-comic-ink bg-comic-yellow"
        style={
          settings.banner_image_url
            ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url(${settings.banner_image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
            : undefined
        }
      >
        <div className="comic-dots pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center">
            <h1
              className={`font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl ${settings.banner_image_url ? "text-white" : "text-white"
                }`}
            >
              {headingParts.length > 1 ? (
                <>
                  {headingParts.map((part, i) =>
                    part.toLowerCase() === "cat" ? (
                      <span key={i} className={settings.banner_image_url ? "text-comic-yellow" : "text-comic-cyan"}>
                        {part}
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </>
              ) : (
                settings.hero_heading
              )}
            </h1>
            <p
              className={`mx-auto mt-6 max-w-2xl text-lg font-bold leading-relaxed ${settings.banner_image_url ? "text-white/90" : "text-white/70"
                }`}
            >
              {settings.hero_subheading}
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/products"
                className="min-h-[44px] cursor-pointer border-3 border-comic-ink bg-comic-red px-8 py-3 font-display text-base font-bold text-white shadow-comic transition-all duration-200 ease-out hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-comic-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-comic-pressed"
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
          <h2 className="font-display text-2xl font-bold text-comic-ink">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="cursor-pointer border-b-2 border-comic-ink font-bold text-comic-ink transition-all duration-200 hover:border-comic-red hover:text-comic-red"
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
          <p className="mt-8 text-center font-bold text-comic-ink/50">
            No products yet. Check back soon!
          </p>
        )}
      </section>
    </>
  );
}
