'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-dark-blue px-4">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-white">Something went wrong</h2>
        <button
          onClick={reset}
          className="rounded-xl bg-brand-pink px-6 py-3 font-bold text-white transition-all hover:shadow-[0_0_30px_rgba(208,0,111,0.4)]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
