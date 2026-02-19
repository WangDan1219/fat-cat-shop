"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-500"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
      </div>
      <h2 className="mt-4 font-display text-xl font-bold text-warm-brown">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-center text-sm text-warm-brown/60">
        {process.env.NODE_ENV === "development"
          ? error.message
          : "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="mt-6 cursor-pointer rounded-lg bg-teal-primary px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-dark"
      >
        Try Again
      </button>
    </div>
  );
}
