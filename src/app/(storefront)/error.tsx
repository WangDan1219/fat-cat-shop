"use client";

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center border-3 border-comic-ink bg-comic-red shadow-comic">
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
          className="text-comic-on-primary"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-comic-ink">
        Something went wrong!
      </h1>
      <p className="mt-4 font-bold text-comic-ink/60">
        {process.env.NODE_ENV === "development"
          ? error.message
          : "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-block cursor-pointer border-3 border-comic-ink bg-comic-red px-8 py-3 font-display text-base font-bold text-comic-on-primary shadow-comic transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-comic-hover"
      >
        Try Again
      </button>
    </div>
  );
}
