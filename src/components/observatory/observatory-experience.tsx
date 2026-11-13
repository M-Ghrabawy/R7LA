"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Boxes,
  Crosshair,
  Globe2,
  Layers3,
  Map,
  Radio,
} from "lucide-react";
import type { Destination } from "@/lib/schema";
import type { SceneRelic } from "@/lib/scene-types";
import { cn } from "@/lib/utils";
import { formatCoordinate } from "@/lib/data";
import { OperationalBadge, PhysicalBadge } from "@/components/shared/status-badge";
import { PlanetMap } from "@/components/shared/planet-map";
import { ObservatoryCanvas, SceneBoundary } from "@/components/three/scene-loader";

type HeroStats = {
  relics: number;
  worlds: number;
  missions: number;
  active: number;
};

export function ObservatoryExperience({
  relics,
  stats,
}: {
  relics: SceneRelic[];
  stats: HeroStats;
}) {
  const [destination, setDestination] = useState<Destination>("Moon");
  const [selectedId, setSelectedId] = useState<string | null>(
    relics.find((relic) => relic.destination === "Moon")?.id ?? null,
  );
  const [mode, setMode] = useState<"3d" | "2d">("3d");

  const selected = relics.find((relic) => relic.id === selectedId) ?? null;
  const destinationRelics = useMemo(
    () => relics.filter((relic) => relic.destination === destination),
    [destination, relics],
  );

  const switchDestination = (next: Destination) => {
    setDestination(next);
    setSelectedId(
      relics.find((relic) => relic.destination === next)?.id ?? null,
    );
  };

  return (
    <section
      className="relative isolate min-h-[860px] overflow-hidden border-b border-line/60 md:min-h-[calc(100svh-68px)]"
      aria-label="Observatory planetary archive"
    >
      <div className="absolute inset-0">
        {mode === "3d" ? (
          <SceneBoundary
            fallback={
              <PlanetMap
                destination={destination}
                relics={relics}
                selectedId={selectedId}
                onSelect={setSelectedId}
                className="size-full border-0"
              />
            }
          >
            <ObservatoryCanvas
              destination={destination}
              relics={relics}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </SceneBoundary>
        ) : (
          <PlanetMap
            destination={destination}
            relics={relics}
            selectedId={selectedId}
            onSelect={setSelectedId}
            className="size-full border-0"
          />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,10,16,.96)_0%,rgba(3,10,16,.72)_27%,rgba(3,10,16,.08)_58%,rgba(3,10,16,.28)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,16,.55),transparent_22%,transparent_72%,rgba(3,10,16,.94))]" />
      <div className="grain pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-[860px] max-w-[1600px] flex-col px-5 pb-8 pt-5 md:min-h-[calc(100svh-68px)] md:px-8 md:pb-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-bright opacity-40" />
              <span className="relative inline-flex size-2 rounded-full bg-teal-bright" />
            </span>
            REX online / archive verified
            <span className="hidden h-px w-12 bg-line-bright sm:block" />
            <span className="hidden text-silver/60 sm:block">
              Lat 0.674° N · Lon 23.473° E
            </span>
          </div>

          <div className="pointer-events-auto flex border border-line bg-abyss/70 p-0.5">
            <button
              onClick={() => setMode("3d")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-2 font-mono text-[8px] uppercase tracking-[0.12em] transition-colors",
                mode === "3d"
                  ? "bg-teal/15 text-teal-bright"
                  : "text-muted hover:text-silver",
              )}
              aria-pressed={mode === "3d"}
            >
              <Globe2 className="size-3" />
              3D orbit
            </button>
            <button
              onClick={() => setMode("2d")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-2 font-mono text-[8px] uppercase tracking-[0.12em] transition-colors",
                mode === "2d"
                  ? "bg-teal/15 text-teal-bright"
                  : "text-muted hover:text-silver",
              )}
              aria-pressed={mode === "2d"}
            >
              <Map className="size-3" />
              2D plot
            </button>
          </div>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="pointer-events-auto max-w-[650px] animate-[fade-up_0.8s_cubic-bezier(0.2,0.7,0.2,1)_120ms_both]">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold">
                Space archaeology / 1967—present
              </span>
            </div>
            <h1 className="text-balance text-[clamp(2.9rem,6.7vw,6.6rem)] font-medium leading-[0.91] tracking-[-0.055em] text-white">
              Humanity&apos;s
              <br />
              footprints
              <br />
              <span className="text-gold">beyond Earth.</span>
            </h1>
            <p className="mt-7 max-w-md text-sm leading-7 text-silver/75 md:text-base md:leading-8">
              An interactive archive of the machines, instruments, and traces we
              left on the Moon and Mars. Every relic is a place. Every claim has
              a source.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/explore"
                className="group inline-flex min-h-12 items-center gap-3 border border-gold bg-gold px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-abyss transition-colors hover:bg-[#f2c76a]"
              >
                Enter the Observatory
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/rex"
                className="inline-flex min-h-12 items-center gap-2 border border-line-bright bg-abyss/50 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.14em] text-silver transition-colors hover:border-teal-bright hover:text-white"
              >
                <Radio className="size-4 text-teal-bright" />
                Begin REX briefing
              </Link>
            </div>
            <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.14em] text-muted">
              {stats.relics} object records · {stats.worlds} worlds ·{" "}
              {stats.missions} missions · sources attached
            </p>
          </div>

          <div className="pointer-events-auto lg:justify-self-end">
            <p className="mb-3 font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
              Select destination
            </p>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {(["Moon", "Mars"] as Destination[]).map((world, index) => {
                const count = relics.filter(
                  (relic) => relic.destination === world,
                ).length;
                const active = destination === world;
                return (
                  <button
                    key={world}
                    onClick={() => switchDestination(world)}
                    className={cn(
                      "group border p-3 text-left transition-colors duration-300 lg:min-w-[220px]",
                      active
                        ? "border-teal bg-teal/10"
                        : "border-line bg-abyss/55 hover:border-line-bright hover:bg-abyss/80",
                    )}
                    aria-pressed={active}
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted">
                        0{index + 1} / {world === "Moon" ? "Lunar" : "Martian"}
                      </span>
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          active ? "bg-teal-bright shadow-[0_0_10px_#39b9c9]" : "bg-muted/40",
                        )}
                      />
                    </span>
                    <span className="mt-5 flex items-end justify-between gap-3">
                      <span
                        className={cn(
                          "text-lg font-medium tracking-[-0.025em]",
                          active ? "text-white" : "text-silver",
                        )}
                      >
                        {world}
                      </span>
                      <span className="font-mono text-[8px] text-muted">
                        {String(count).padStart(2, "0")} RELICS
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 hidden max-w-[220px] font-mono text-[7px] uppercase leading-5 tracking-[0.12em] text-muted/70 lg:block">
              Drag to orbit. Select a glowing marker to open its archive entry.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div className="pointer-events-auto">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line/60 pt-4 sm:grid-cols-4">
              <Stat icon={<Boxes />} label="Object records" value={String(stats.relics).padStart(2, "0")} />
              <Stat icon={<Globe2 />} label="Worlds mapped" value={String(stats.worlds).padStart(2, "0")} />
              <Stat icon={<Layers3 />} label="Missions" value={String(stats.missions).padStart(2, "0")} />
              <Stat icon={<Crosshair />} label="Still detectable" value={String(stats.active).padStart(2, "0")} />
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[8px] uppercase tracking-[0.14em] text-muted/70">
              <span className="flex items-center gap-2">
                <ArrowDown className="size-3 text-gold" />
                Scroll to descend into the archive
              </span>
              <span className="text-muted/50">
                Surface rendering / procedural AFTERLIGHT visualization
              </span>
            </p>
          </div>

          {selected && (
            <aside
              key={selected.id}
              className="pointer-events-auto animate-[fade-up_0.35s_ease-out_both] border border-line-bright bg-abyss/92 p-4 backdrop-blur-sm lg:p-5"
            >
              <div className="flex gap-4">
                <div className="relative hidden size-20 shrink-0 overflow-hidden border border-line sm:block">
                  <Image
                    src={selected.imageSrc}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover grayscale-[10%]"
                  />
                  <div className="absolute inset-0 bg-teal/10" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-gold">
                      Selected relic / {selected.missionShort}
                    </p>
                    <span className="font-mono text-[8px] text-muted">
                      {selected.destination.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="mt-2 truncate text-lg font-medium tracking-[-0.02em] text-white">
                    {selected.shortName}
                  </h2>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
                    {formatCoordinate(selected.latitude, selected.longitude)}
                  </p>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-xs leading-5 text-silver/65">
                {selected.summary}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  <OperationalBadge status={selected.operationalStatus} />
                  <PhysicalBadge status={selected.physicalStatus} />
                </div>
                <Link
                  href={`/relics/${selected.id}`}
                  className="group inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-gold transition-colors hover:text-white"
                >
                  Investigate
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </aside>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block">
        <div className="flex flex-col items-center gap-4">
          <span className="h-16 w-px bg-gradient-to-b from-transparent via-line-bright to-transparent" />
          <span className="font-mono text-[7px] uppercase tracking-[0.25em] text-muted [writing-mode:vertical-rl]">
            Orbital archive / {destinationRelics.length} objects
          </span>
          <span className="h-16 w-px bg-gradient-to-b from-transparent via-line-bright to-transparent" />
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-teal">
        <span className="[&_svg]:size-3">{icon}</span>
        <span className="font-mono text-[7px] uppercase tracking-[0.13em] text-muted">
          {label}
        </span>
      </div>
      <p className="font-mono text-xl text-silver">{value}</p>
    </div>
  );
}
