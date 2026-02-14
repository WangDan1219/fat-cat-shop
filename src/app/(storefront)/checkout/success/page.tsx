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
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-primary/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-teal-primary"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-warm-brown">
        Order Confirmed!
      </h1>
      {order && (
        <p className="mt-2 text-lg text-warm-brown/70">
          Order number: <span className="font-bold text-teal-primary">{order}</span>
        </p>
      )}
      <p className="mt-4 text-warm-brown/60">
        Thank you for your purchase! We&apos;ll get your order ready as soon as
        possible.
      </p>
      <Link
        href="/products"
        className="mt-8 inline-block rounded-full bg-teal-primary px-8 py-3 font-display text-sm font-bold text-white transition-colors hover:bg-teal-dark"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
