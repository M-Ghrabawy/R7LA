"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Crosshair,
  Filter,
  Globe2,
  Map,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { Destination } from "@/lib/schema";
import type { SceneRelic } from "@/lib/scene-types";
import { formatCoordinate } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  OperationalBadge,
  PhysicalBadge,
} from "@/components/shared/status-badge";
import { RexHead } from "@/components/rex/rex-character";
import { PlanetMap } from "@/components/shared/planet-map";
import {
  ObservatoryCanvas,
  SceneBoundary,
} from "@/components/three/scene-loader";

type Stats = {
  relics: number;
  sources: number;
};

type StatusFilter = "all" | "active" | "passive" | "inactive";

export function ExplorerExperience({
  relics,
  initialWorld,
  initialRelicId,
  stats,
}: {
  relics: SceneRelic[];
  initialWorld: Destination;
  initialRelicId: string | null;
  stats: Stats;
}) {
  const [world, setWorld] = useState<Destination>(initialWorld);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialRelicId ??
      relics.find((relic) => relic.destination === initialWorld)?.id ??
      null,
  );
  const [mode, setMode] = useState<"3d" | "2d">("3d");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const worldRelics = useMemo(
    () => relics.filter((relic) => relic.destination === world),
    [relics, world],
  );

  const categories = useMemo(
    () => [...new Set(worldRelics.map((relic) => relic.category))],
    [worldRelics],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return worldRelics.filter((relic) => {
      const matchesQuery =
        !normalizedQuery ||
        [relic.name, relic.mission, relic.category, relic.summary]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = category === "all" || relic.category === category;
      const matchesStatus =
        status === "all" ||
        (status === "active" && relic.operationalStatus === "active") ||
        (status === "passive" &&
          relic.operationalStatus === "passive-operational") ||
        (status === "inactive" &&
          (relic.operationalStatus === "inactive" ||
            relic.operationalStatus === "decommissioned"));
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, query, status, worldRelics]);

  const selected =
    relics.find((relic) => relic.id === selectedId) ??
    filtered[0] ??
    worldRelics[0] ??
    null;

  const chooseWorld = (next: Destination) => {
    setWorld(next);
    setCategory("all");
    setQuery("");
    setStatus("all");
    setSelectedId(
      relics.find((relic) => relic.destination === next)?.id ?? null,
    );
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setStatus("all");
  };

  const hasFilters = Boolean(query || category !== "all" || status !== "all");

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-8 md:px-8 md:py-12">
      <div className="flex flex-col gap-6 border-b border-line/70 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-[9px] text-gold">01</span>
            <span className="h-px w-8 bg-line-bright" />
            <span className="technical-label">Planet explorer / object index</span>
          </div>
          <h1 className="text-balance text-4xl font-medium leading-none tracking-[-0.045em] text-white md:text-6xl">
            Read the surface.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            Select a world, then locate an artifact. All positions are plotted
            from cited coordinates; approximate sites are disclosed.
          </p>
        </div>
        <div className="grid grid-cols-3 border border-line/70">
          <MiniStat value={String(stats.relics).padStart(2, "0")} label="Objects" />
          <MiniStat value={String(worldRelics.length).padStart(2, "0")} label="On world" />
          <MiniStat value={String(stats.sources).padStart(2, "0")} label="Sources" />
        </div>
      </div>

      <div className="grid gap-4 pt-6 xl:grid-cols-[330px_minmax(0,1fr)_370px]">
        <aside className="border border-line/70 bg-panel/20">
          <div className="border-b border-line/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-1">
                {(["Moon", "Mars"] as Destination[]).map((destination) => (
                  <button
                    key={destination}
                    onClick={() => chooseWorld(destination)}
                    className={cn(
                      "border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
                      world === destination
                        ? "border-teal bg-teal/10 text-teal-bright"
                        : "border-line text-muted hover:border-line-bright hover:text-silver",
                    )}
                  >
                    {destination}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setFiltersOpen((open) => !open)}
                className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-muted hover:text-gold lg:hidden"
                aria-expanded={filtersOpen}
              >
                <SlidersHorizontal className="size-3" />
                Filters
              </button>
            </div>

            <div className={cn("mt-4 space-y-3", !filtersOpen && "hidden lg:block")}>
              <label className="relative block">
                <span className="sr-only">Search artifacts</span>
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search objects, missions, categories"
                  className="h-10 w-full border border-line bg-void/60 pl-9 pr-9 font-mono text-[10px] text-silver placeholder:text-muted/70 focus:border-teal focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gold"
                    aria-label="Clear search"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-muted">
                    Category
                  </span>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="h-9 border border-line bg-void/60 px-2 font-mono text-[9px] text-silver focus:border-teal focus:outline-none"
                  >
                    <option value="all">All categories</option>
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-muted">
                    Status
                  </span>
                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value as StatusFilter)
                    }
                    className="h-9 border border-line bg-void/60 px-2 font-mono text-[9px] text-silver focus:border-teal focus:outline-none"
                  >
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="passive">Passive</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>

              {hasFilters && (
                <div className="flex items-center justify-between border border-line/60 px-3 py-2">
                  <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
                    {filtered.length} match{filtered.length === 1 ? "" : "es"}
                  </span>
                  <button
                    onClick={clearFilters}
                    className="font-mono text-[8px] uppercase tracking-[0.12em] text-gold hover:text-white"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-line/50 px-4 py-2.5">
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
              Artifact index
            </span>
            <span className="font-mono text-[8px] text-gold">
              {String(filtered.length).padStart(2, "0")}
            </span>
          </div>

          <div className="max-h-[520px] overflow-y-auto">
            {filtered.map((relic, index) => (
              <button
                key={relic.id}
                onClick={() => setSelectedId(relic.id)}
                className={cn(
                  "group flex w-full items-start gap-3 border-b border-line/40 px-4 py-3.5 text-left transition-colors",
                  selected?.id === relic.id
                    ? "bg-teal/[0.08]"
                    : "hover:bg-white/[0.025]",
                )}
              >
                <span
                  className={cn(
                    "mt-1 font-mono text-[8px]",
                    selected?.id === relic.id ? "text-gold" : "text-muted/70",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-sm",
                      selected?.id === relic.id
                        ? "text-white"
                        : "text-silver/80 group-hover:text-white",
                    )}
                  >
                    {relic.shortName}
                  </span>
                  <span className="mt-1 flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                    {relic.missionShort}
                    <span className="size-0.5 rounded-full bg-muted" />
                    {relic.operationalStatus === "active"
                      ? "Active"
                      : relic.operationalStatus === "passive-operational"
                        ? "Passive"
                        : "Historical"}
                  </span>
                </span>
                <ArrowUpRight className="mt-1 size-3 shrink-0 text-muted/50 transition-colors group-hover:text-gold" />
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="p-6 text-center">
                <Filter className="mx-auto size-5 text-muted/50" />
                <p className="mt-3 text-sm text-muted">No objects match.</p>
                <button
                  onClick={clearFilters}
                  className="mt-3 font-mono text-[8px] uppercase tracking-[0.12em] text-gold"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </aside>

        <section className="min-w-0" aria-label="Planetary artifact map">
          <div className="relative h-[440px] border border-line/70 bg-void md:h-[600px]">
            {mode === "3d" ? (
              <SceneBoundary
                fallback={
                  <PlanetMap
                    destination={world}
                    relics={relics}
                    selectedId={selected?.id ?? null}
                    onSelect={setSelectedId}
                    className="size-full border-0"
                  />
                }
              >
                <ObservatoryCanvas
                  destination={world}
                  relics={relics}
                  selectedId={selected?.id ?? null}
                  onSelect={setSelectedId}
                />
              </SceneBoundary>
            ) : (
              <PlanetMap
                destination={world}
                relics={relics}
                selectedId={selected?.id ?? null}
                onSelect={setSelectedId}
                className="size-full border-0"
              />
            )}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
              <div className="border border-line/70 bg-abyss/70 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.16em] text-muted">
                {world} / orbital survey
              </div>
              <div className="pointer-events-auto flex border border-line bg-abyss/80">
                <button
                  onClick={() => setMode("3d")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.12em]",
                    mode === "3d" ? "bg-teal/15 text-teal-bright" : "text-muted",
                  )}
                >
                  <Globe2 className="size-3" /> 3D
                </button>
                <button
                  onClick={() => setMode("2d")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.12em]",
                    mode === "2d" ? "bg-teal/15 text-teal-bright" : "text-muted",
                  )}
                >
                  <Map className="size-3" /> 2D
                </button>
              </div>
            </div>
            <p className="pointer-events-none absolute bottom-3 left-3 font-mono text-[7px] uppercase tracking-[0.12em] text-muted/70">
              Procedural surface / drag to orbit / select marker
            </p>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
            <CoordinateCell
              label="Latitude"
              value={`${Math.abs(selected?.latitude ?? 0).toFixed(3)}° ${(selected?.latitude ?? 0) >= 0 ? "N" : "S"}`}
            />
            <CoordinateCell
              label="Longitude"
              value={`${Math.abs(selected?.longitude ?? 0).toFixed(3)}° ${(selected?.longitude ?? 0) >= 0 ? "E" : "W"}`}
            />
            <CoordinateCell
              label="Landing"
              value={selected?.landingDate ?? "—"}
            />
            <CoordinateCell
              label="Editorial score"
              value={
                selected ? String(selected.legacyScore).padStart(2, "0") : "—"
              }
            />
          </div>
        </section>

        {selected && (
          <aside className="border border-line/70 bg-panel/20">
            <div className="relative aspect-[16/9] overflow-hidden border-b border-line/70">
              <Image
                src={selected.imageSrc}
                alt={selected.imageAlt}
                fill
                sizes="(max-width: 1280px) 100vw, 370px"
                className="object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-transparent to-transparent" />
              <div className="absolute left-3 top-3 border border-line bg-abyss/80 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.14em] text-gold">
                Selected object
              </div>
            </div>
            <div className="p-5">
              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-teal-bright">
                {selected.mission} / {selected.destination}
              </p>
              <h2 className="mt-3 text-2xl font-medium leading-tight tracking-[-0.03em] text-white">
                {selected.shortName}
              </h2>
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted">
                {selected.summary}
              </p>

              {selected.rexNote && (
                <div className="mt-4 flex gap-2.5 border border-teal/25 bg-teal/[0.035] p-3">
                  <RexHead className="h-9 w-11 shrink-0" expression="curious" />
                  <div>
                    <p className="font-mono text-[7px] uppercase tracking-[0.13em] text-teal-bright">
                      REX / field note
                    </p>
                    <p className="mt-1 line-clamp-3 text-[11px] leading-5 text-muted">
                      {selected.rexNote}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-5 space-y-2 border-y border-line/60 py-4">
                <DataRow label="Location" value={selected.coordinatesLabel} />
                <DataRow
                  label="Coordinates"
                  value={formatCoordinate(
                    selected.latitude,
                    selected.longitude,
                  )}
                  mono
                />
                <DataRow label="Category" value={selected.category} />
                <DataRow label="Landing" value={selected.landingDate} mono />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <OperationalBadge status={selected.operationalStatus} />
                <PhysicalBadge status={selected.physicalStatus} />
              </div>

              <div className="mt-5 border border-line/60 p-3">
                <div className="flex items-end justify-between">
                  <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted">
                    Legacy / editorial
                  </p>
                  <p className="font-mono text-2xl text-gold">
                    {String(selected.legacyScore).padStart(2, "0")}
                  </p>
                </div>
                <div className="mt-3 h-1 bg-line/70">
                  <div
                    className="h-full bg-gold"
                    style={{ width: `${selected.legacyScore}%` }}
                  />
                </div>
              </div>

              <Link
                href={`/relics/${selected.id}`}
                className="mt-5 flex items-center justify-between border border-gold bg-gold px-4 py-3.5 font-mono text-[9px] uppercase tracking-[0.14em] text-abyss transition-colors hover:bg-[#f2c76a]"
              >
                Investigate this relic
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href={`/rex/relic/${selected.id}`}
                className="mt-2 flex items-center justify-between border border-teal/40 px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.12em] text-teal-bright transition-colors hover:border-teal hover:text-white"
              >
                REX field study
                <ArrowRight className="size-3" />
              </Link>
              <p className="mt-3 flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.1em] text-muted/70">
                <Crosshair className="size-2.5" />
                Position precision disclosed on record
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-line/60 px-4 py-3 last:border-r-0">
      <p className="font-mono text-xl text-silver">{value}</p>
      <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
    </div>
  );
}

function CoordinateCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line/60 bg-panel/20 px-3 py-2.5">
      <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="mt-1 truncate font-mono text-[10px] text-silver">{value}</p>
    </div>
  );
}

function DataRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <span className="shrink-0 font-mono text-[7px] uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      <span
        className={cn(
          "text-right text-[11px] leading-5 text-silver/85",
          mono && "font-mono text-[9px]",
        )}
      >
        {value}
      </span>
    </div>
  );
}
