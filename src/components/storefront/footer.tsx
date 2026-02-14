import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-peach-dark/50 bg-peach">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/"
            className="font-display text-xl font-bold text-teal-primary transition-colors duration-200 hover:text-teal-dark"
          >
            Fat Cat
          </Link>
          <p className="text-center text-sm leading-relaxed text-warm-brown/70">
            Your one-stop shop for happy cats.
          </p>
          <nav className="flex gap-6">
            <Link
              href="/products"
              className="cursor-pointer text-sm text-warm-brown/70 transition-colors duration-200 hover:text-teal-primary"
            >
              Shop
            </Link>
          </nav>
          <p className="text-xs text-warm-brown/50">
            &copy; {new Date().getFullYear()} Fat Cat Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
