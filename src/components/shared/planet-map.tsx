"use client";

import { cn } from "@/lib/utils";
import type { SceneRelic } from "@/lib/scene-types";

function markerColor(relic: SceneRelic) {
  if (relic.operationalStatus === "active") return "bg-teal-bright";
  if (relic.operationalStatus === "passive-operational") return "bg-gold";
  return "bg-[#8799a5]";
}

export function PlanetMap({
  destination,
  relics,
  selectedId,
  onSelect,
  className,
}: {
  destination: "Moon" | "Mars";
  relics: SceneRelic[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const visible = relics.filter((relic) => relic.destination === destination);

  return (
    <div
      className={cn(
        "relative overflow-hidden border border-line bg-[#06121c]",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0",
          destination === "Moon"
            ? "bg-[radial-gradient(ellipse_at_center,rgba(173,180,178,.16),rgba(6,18,28,.2)_55%,#06121c_78%)]"
            : "bg-[radial-gradient(ellipse_at_center,rgba(164,78,50,.22),rgba(6,18,28,.2)_55%,#06121c_78%)]",
        )}
      />
      <svg
        className="absolute inset-0 size-full opacity-50"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id={`grid-${destination}`} width="83.33" height="83.33" patternUnits="userSpaceOnUse">
            <path
              d="M 83.33 0 L 0 0 0 83.33"
              fill="none"
              stroke="rgba(57,185,201,.16)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="1000" height="500" fill={`url(#grid-${destination})`} />
        <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(228,180,76,.24)" strokeDasharray="4 10" />
        <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(228,180,76,.18)" strokeDasharray="4 10" />
        <ellipse cx="500" cy="250" rx="448" ry="228" fill="none" stroke="rgba(43,82,98,.4)" />
        <ellipse cx="500" cy="250" rx="310" ry="228" fill="none" stroke="rgba(43,82,98,.22)" />
        <ellipse cx="500" cy="250" rx="160" ry="228" fill="none" stroke="rgba(43,82,98,.18)" />
        <text x="14" y="484" fill="rgba(126,146,159,.7)" fontSize="8" fontFamily="monospace" letterSpacing="1.2">
          180°W
        </text>
        <text x="476" y="484" fill="rgba(126,146,159,.7)" fontSize="8" fontFamily="monospace" letterSpacing="1.2">
          0°
        </text>
        <text x="942" y="484" fill="rgba(126,146,159,.7)" fontSize="8" fontFamily="monospace" letterSpacing="1.2">
          180°E
        </text>
      </svg>

      <div className="absolute left-3 top-3 z-10 border border-line/70 bg-abyss/70 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.16em] text-muted">
        2D position plot / {destination.toLowerCase()}
      </div>

      {visible.map((relic) => {
        const left = ((relic.longitude + 180) / 360) * 100;
        const top = ((90 - relic.latitude) / 180) * 100;
        const selected = relic.id === selectedId;
        return (
          <button
            key={relic.id}
            onClick={() => onSelect(relic.id)}
            aria-label={`${relic.shortName}, ${relic.latitude.toFixed(2)} degrees latitude, ${relic.longitude.toFixed(2)} degrees longitude`}
            className="group absolute z-10 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-gold"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <span
              className={cn(
                "absolute size-5 rounded-full border opacity-0 transition-opacity group-hover:opacity-100",
                selected ? "border-gold opacity-100" : "border-silver/60",
              )}
            />
            <span
              className={cn(
                "size-1.5 rounded-full shadow-[0_0_10px_currentColor]",
                markerColor(relic),
                selected && "ring-2 ring-gold ring-offset-2 ring-offset-[#06121c]",
              )}
            />
            <span className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 whitespace-nowrap border border-line bg-abyss/95 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.12em] text-silver group-hover:block">
              {relic.shortName}
            </span>
          </button>
        );
      })}

      <p className="absolute bottom-2 right-3 font-mono text-[7px] uppercase tracking-[0.12em] text-muted/60">
        Procedural plot · cited coordinates
      </p>
    </div>
  );
}
