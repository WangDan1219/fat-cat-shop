import Link from "next/link";

interface SuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center border-3 border-comic-ink bg-comic-cyan shadow-comic">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-comic-on-secondary"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-comic-ink">
        Order Confirmed!
      </h1>
      {order && (
        <p className="mt-2 text-lg font-bold text-comic-ink/70">
          Order number: <span className="border-2 border-comic-ink bg-comic-yellow px-2 py-0.5 text-comic-on-accent">{order}</span>
        </p>
      )}
      <p className="mt-4 font-bold text-comic-ink/60">
        Thank you for your purchase! We&apos;ll get your order ready as soon as
        possible.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-block border-3 border-comic-ink bg-comic-red px-8 py-3 font-display text-base font-bold text-comic-on-primary shadow-comic transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-comic-hover"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
