"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { ExtendedObject } from "@/data/extended-catalog";
import { cn } from "@/lib/utils";

const groups = ["All", "Moon", "Mars", "Small bodies", "Deep space"] as const;

const kindLabel = {
  photograph: "NASA photograph",
  "artist-concept": "NASA artist concept",
  data: "NASA mission data",
} as const;

export function CatalogExplorer({ objects }: { objects: ExtendedObject[] }) {
  const [group, setGroup] = useState<(typeof groups)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return objects.filter((object) => {
      const matchesGroup = group === "All" || object.group === group;
      const matchesQuery =
        !normalized ||
        [
          object.name,
          object.mission,
          object.destination,
          object.category,
          object.summary,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return matchesGroup && matchesQuery;
    });
  }, [group, objects, query]);

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-8 md:py-16">
      <div className="flex flex-col gap-6 border-b border-line/70 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-[9px] text-gold">08</span>
            <span className="h-px w-8 bg-line-bright" />
            <span className="technical-label">
              Extended NASA catalogue / beyond the primary investigations
            </span>
          </div>
          <h1 className="max-w-5xl text-balance text-4xl font-medium leading-[0.94] tracking-[-0.05em] text-white md:text-7xl">
            More traces.
            <span className="text-muted"> Same responsibility.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
            The primary archive holds 14 full investigations. This catalogue adds
            further NASA objects that belong to the same story: lunar
            experiments, Mars landers, a helicopter, and spacecraft still
            drifting beyond the worlds they studied.
          </p>
        </div>
        <div className="grid grid-cols-2 border border-line/70">
          <div className="border-r border-line/60 px-4 py-3">
            <p className="font-mono text-xl text-silver">
              {String(objects.length).padStart(2, "0")}
            </p>
            <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
              Extended records
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="font-mono text-xl text-gold">06</p>
            <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
              Destinations
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border border-line/70 bg-panel/25 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-1">
          {groups.map((item) => (
            <button
              key={item}
              onClick={() => setGroup(item)}
              className={cn(
                "border px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] transition-colors",
                group === item
                  ? "border-teal bg-teal/10 text-teal-bright"
                  : "border-line text-muted hover:text-silver",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="relative block">
          <span className="sr-only">Search extended catalogue</span>
          <Search className="absolute left-3 top-1/2 size-3 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search catalogue"
            className="h-9 w-full border border-line bg-void/50 pl-8 pr-8 font-mono text-[9px] text-silver placeholder:text-muted/60 focus:border-teal focus:outline-none md:w-60"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-gold"
              aria-label="Clear search"
            >
              <X className="size-3" />
            </button>
          )}
        </label>
      </div>

      <div className="mt-2 flex items-center justify-between border-b border-line/50 pb-2">
        <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
          {filtered.length} records in view
        </p>
        <p className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted/60">
          Full primary investigations: /explore
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {filtered.map((object, index) => (
          <article
            key={object.id}
            className="group grid border border-line/70 bg-panel/20 transition-colors hover:border-line-bright sm:grid-cols-[210px_minmax(0,1fr)]"
          >
            <div className="relative min-h-[210px] overflow-hidden bg-void">
              <Image
                src={object.image.src}
                alt={object.image.alt}
                fill
                sizes="(max-width: 640px) 100vw, 210px"
                className="object-cover opacity-80 grayscale-[12%] transition duration-700 group-hover:scale-[1.03] group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-abyss/65 via-transparent to-transparent" />
              <span className="absolute left-2 top-2 border border-line/60 bg-abyss/85 px-1.5 py-1 font-mono text-[6px] uppercase tracking-[0.1em] text-gold">
                {object.destination}
              </span>
              <span className="absolute bottom-2 left-2 border border-line/60 bg-abyss/85 px-1.5 py-1 font-mono text-[6px] uppercase tracking-[0.1em] text-silver/75">
                {kindLabel[object.image.kind]}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-teal-bright">
                    {object.mission} / {object.group}
                  </p>
                  <h2 className="mt-1 text-lg font-medium leading-tight text-white">
                    {object.name}
                  </h2>
                </div>
                <span className="font-mono text-[8px] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.08em] text-muted">
                {object.category}
              </p>
              <p className="mt-3 text-xs leading-5 text-silver/75">
                {object.summary}
              </p>
              <div className="mt-3 grid gap-1 border-y border-line/40 py-2 font-mono text-[7px] uppercase tracking-[0.08em]">
                <span className="flex justify-between gap-3">
                  <span className="text-muted">Location</span>
                  <span className="text-right text-silver/75">
                    {object.location}
                  </span>
                </span>
                <span className="flex justify-between gap-3">
                  <span className="text-muted">Status</span>
                  <span className="text-right text-gold/80">
                    {object.operationalStatus}
                  </span>
                </span>
                <span className="flex justify-between gap-3">
                  <span className="text-muted">Date</span>
                  <span className="text-right text-silver/75">
                    {object.dateLabel}
                  </span>
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {object.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 border border-line/60 px-2 py-1.5 font-mono text-[6px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-teal/50 hover:text-silver"
                  >
                    {source.organization}
                    <ArrowUpRight className="size-2.5" />
                  </a>
                ))}
                <a
                  href={object.image.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 border border-line/60 px-2 py-1.5 font-mono text-[6px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-teal/50 hover:text-silver"
                >
                  NASA image
                  <ArrowUpRight className="size-2.5" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="border border-line/60 p-10 text-center">
          <p className="text-sm text-muted">No catalogue records match.</p>
          <button
            onClick={() => {
              setGroup("All");
              setQuery("");
            }}
            className="mt-3 font-mono text-[8px] uppercase tracking-[0.12em] text-gold"
          >
            Reset
          </button>
        </div>
      )}

      <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-line/60 pt-6 md:flex-row md:items-end">
        <p className="max-w-2xl text-xs leading-6 text-muted">
          These objects are catalogued and sourced but do not yet have full
          playable REX field studies. NASA imagery is credited and linked.
          Artist concepts are labeled and are not presented as photographs.
        </p>
        <div className="flex gap-2">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 border border-gold bg-gold px-4 py-3 font-mono text-[8px] uppercase tracking-[0.12em] text-abyss"
          >
            Primary archive
            <ArrowUpRight className="size-3" />
          </Link>
          <Link
            href="/rex"
            className="inline-flex items-center gap-2 border border-line-bright px-4 py-3 font-mono text-[8px] uppercase tracking-[0.12em] text-silver hover:border-teal"
          >
            REX expedition
          </Link>
        </div>
      </div>
    </div>
  );
}
