import Link from "next/link";
import { ArrowLeft, Crosshair } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-[1600px] flex-col items-center justify-center px-5 py-20 text-center md:px-8">
      <div className="mb-6 flex size-16 items-center justify-center border border-gold/40 bg-gold/[0.04] text-gold">
        <Crosshair className="size-7" />
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold">
        Archive coordinate unresolved
      </p>
      <h1 className="mt-4 text-4xl font-medium tracking-[-0.04em] text-white md:text-6xl">
        This relic is not in the index.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-muted">
        The record may have moved, or the identifier is incomplete. Return to
        the Observatory or search the planet explorer.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 border border-gold bg-gold px-5 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-abyss"
        >
          Open the explorer
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-line-bright px-5 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-silver"
        >
          <ArrowLeft className="size-3.5" />
          Observatory
        </Link>
      </div>
    </div>
  );
}
