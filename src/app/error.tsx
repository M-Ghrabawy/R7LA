"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-[1600px] flex-col items-center justify-center px-5 py-20 text-center md:px-8">
      <div className="mb-6 flex size-16 items-center justify-center border border-[#c9867c]/40 bg-[#c9867c]/5 text-[#c9867c]">
        <AlertTriangle className="size-7" />
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#c9867c]">
        Archive signal interrupted
      </p>
      <h1 className="mt-4 text-4xl font-medium tracking-[-0.04em] text-white md:text-6xl">
        This record could not be rendered.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-muted">
        {error.message || "An unexpected error occurred while loading the archive."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 border border-gold bg-gold px-5 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-abyss"
        >
          <RotateCcw className="size-3.5" />
          Retry
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-line-bright px-5 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-silver"
        >
          Observatory
        </Link>
      </div>
    </div>
  );
}
