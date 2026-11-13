"use client";

import dynamic from "next/dynamic";
import { Box, Move3d, Rotate3d } from "lucide-react";
import { SceneBoundary, SceneLoading } from "@/components/three/scene-loader";
import type { SchematicKind } from "@/components/three/schematic-canvas";

const SchematicCanvas = dynamic(
  () => import("@/components/three/schematic-canvas"),
  { ssr: false, loading: () => <SceneLoading /> },
);

export function schematicKindForCategory(category: string): SchematicKind {
  const value = category.toLowerCase();
  if (value.includes("module")) return "lunar-module";
  if (value.includes("roving") || value.includes("rover")) return "rover";
  if (value.includes("lander")) return "lander";
  if (value.includes("retroreflector")) return "retroreflector";
  return "instrument";
}

function SchematicFallback({ kind }: { kind: SchematicKind }) {
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden bg-[#06121c]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(43,82,98,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(43,82,98,.18)_1px,transparent_1px)] bg-[size:28px_28px] opacity-50" />
      <svg viewBox="0 0 400 280" className="relative w-[76%] max-w-md" aria-hidden="true">
        <g fill="none" stroke="#3e6877" strokeWidth="1.2">
          <ellipse cx="200" cy="236" rx="118" ry="24" />
          <ellipse cx="200" cy="236" rx="74" ry="15" strokeDasharray="3 5" />
          {kind === "rover" ? (
            <>
              <rect x="126" y="132" width="148" height="48" />
              <rect x="150" y="112" width="88" height="20" />
              <circle cx="144" cy="195" r="18" />
              <circle cx="200" cy="195" r="18" />
              <circle cx="256" cy="195" r="18" />
              <line x1="226" y1="112" x2="226" y2="66" />
              <circle cx="226" cy="58" r="8" stroke="#e4b44c" />
            </>
          ) : kind === "retroreflector" ? (
            <>
              <rect x="126" y="112" width="148" height="100" />
              {[0, 1, 2].map((row) =>
                [0, 1, 2].map((col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={140 + col * 44}
                    y={124 + row * 28}
                    width="32"
                    height="20"
                    stroke="#e4b44c"
                  />
                )),
              )}
            </>
          ) : (
            <>
              <path d="M140 128 L182 108 L254 112 L265 146 L238 184 L162 181 L132 154 Z" />
              <rect x="174" y="136" width="56" height="32" />
              <line x1="150" y1="180" x2="126" y2="230" />
              <line x1="244" y1="181" x2="270" y2="230" />
              <line x1="200" y1="184" x2="200" y2="232" />
              <circle cx="286" cy="110" r="7" stroke="#e4b44c" />
              <line x1="252" y1="118" x2="278" y2="110" />
            </>
          )}
        </g>
        <text x="18" y="262" fill="#7e929f" fontSize="7" fontFamily="monospace" letterSpacing="1.2">
          AFTERLIGHT / SCHEMATIC PLATE / NOT FLIGHT HARDWARE
        </text>
      </svg>
      <p className="absolute bottom-3 right-3 font-mono text-[7px] uppercase tracking-[0.12em] text-muted/60">
        WebGL unavailable · 2D schematic
      </p>
    </div>
  );
}

export function SchematicViewer({ category }: { category: string }) {
  const kind = schematicKindForCategory(category);

  return (
    <div className="relative h-[420px] overflow-hidden border border-line/70 bg-[#06121c] md:h-[500px]">
      <SceneBoundary fallback={<SchematicFallback kind={kind} />}>
        <SchematicCanvas kind={kind} />
      </SceneBoundary>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <div className="border border-line/70 bg-abyss/80 px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-[0.16em] text-teal-bright">
          Interactive schematic / {kind.replace("-", " ")}
        </div>
        <div className="flex items-center gap-1.5 border border-line/70 bg-abyss/80 px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-[0.12em] text-muted">
          <Move3d className="size-3" />
          Drag · zoom
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.12em] text-muted">
          <Rotate3d className="size-3 text-gold" /> Auto orbit
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.12em] text-muted">
          <Box className="size-3 text-teal" /> Procedural geometry
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 border border-teal/10" />
    </div>
  );
}
