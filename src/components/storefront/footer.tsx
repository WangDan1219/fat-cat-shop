import Link from "next/link";

export function Footer({
  shopName = "Fat Cat",
  tagline = "Your one-stop shop for happy cats.",
  copyrightName = "Fat Cat Shop",
}: {
  shopName?: string;
  tagline?: string;
  copyrightName?: string;
}) {
  return (
    <footer className="border-t-3 border-comic-ink bg-comic-cyan">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/"
            className="font-display text-xl font-bold text-white transition-transform duration-200 hover:rotate-[-2deg]"
          >
            {shopName}
          </Link>
          <p className="text-center text-sm font-bold leading-relaxed text-white/70">
            {tagline}
          </p>
          <nav className="flex gap-6">
            <Link
              href="/products"
              className="cursor-pointer border-b-2 border-transparent text-sm font-bold text-white/70 transition-all duration-200 hover:border-white hover:text-white"
            >
              Shop
            </Link>
          </nav>
          <p className="text-xs font-bold text-white/50">
            &copy; {new Date().getFullYear()} {copyrightName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
