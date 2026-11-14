"use client";

import { RexCharacter } from "@/components/rex/rex-character";
import { useAppStore } from "../store/useAppStore";

/**
 * REX in the R7LA story player.
 * Uses the exact same vector character as the archive, so the guide is
 * visually identical across both experiences.
 */
export function R7LARex() {
  const journeyPlaying = useAppStore((s) => s.journeyPlaying);

  return (
    <div className="relative flex h-full w-full items-end justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_32%,rgba(57,185,201,0.22),transparent_62%)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#39b9c9]/60 to-transparent" />
      <div className="absolute inset-x-0 top-2 flex justify-center">
        <span className="h-1 w-1 animate-pulse rounded-full bg-[#62ecff]/70" />
      </div>
      <RexCharacter
        pose={journeyPlaying ? "transmit" : "idle"}
        expression={journeyPlaying ? "focused" : "content"}
        className="relative h-[148px] w-auto pb-3 drop-shadow-[0_0_18px_rgba(57,185,201,0.35)]"
      />
      <span className="absolute inset-x-0 bottom-1 text-center font-mono text-[7px] uppercase tracking-[0.24em] text-[#62ecff]/80">
        {journeyPlaying ? "Transmitting" : "Standing by"}
      </span>
    </div>
  );
}
