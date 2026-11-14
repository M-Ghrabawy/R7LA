"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  CalendarRange,
  ChevronDown,
  CircleStop,
  Crosshair,
  RadioOff,
  Rocket,
  RotateCcw,
  Satellite,
  Search,
  Telescope,
  Trophy,
  Wrench,
  X,
} from "lucide-react";
import type { Destination, TimelineEvent } from "@/lib/schema";
import { cn } from "@/lib/utils";

type TimelineEventWithSources = TimelineEvent & {
  relicId: string;
  relicName: string;
  mission: string;
  destination: Destination;
  sources: Array<{
    id: string;
    title: string;
    organization: string;
    url: string;
  }>;
};

const eventTypes: Array<{ value: "all" | TimelineEvent["type"]; label: string }> = [
  { value: "all", label: "All" },
  { value: "launch", label: "Launch" },
  { value: "arrival", label: "Arrival" },
  { value: "landing", label: "Landing" },
  { value: "deployment", label: "Deployment" },
  { value: "discovery", label: "Discovery" },
  { value: "record", label: "Record" },
  { value: "loss", label: "Loss" },
  { value: "end", label: "End" },
  { value: "legacy", label: "Aftermath" },
];

const typeLabel: Record<TimelineEvent["type"], string> = {
  launch: "Launch",
  arrival: "Arrival",
  landing: "Landing",
  deployment: "Deployment",
  discovery: "Discovery",
  record: "Record",
  loss: "Loss",
  end: "End",
  legacy: "Aftermath",
};

const typeIcon: Record<TimelineEvent["type"], typeof Rocket> = {
  launch: Rocket,
  arrival: Satellite,
  landing: Crosshair,
  deployment: Wrench,
  discovery: Telescope,
  record: Trophy,
  loss: RadioOff,
  end: CircleStop,
  legacy: Archive,
};

const typeTone: Record<TimelineEvent["type"], string> = {
  launch: "text-teal-bright border-teal/40 bg-teal/5",
  arrival: "text-teal-bright border-teal/40 bg-teal/5",
  landing: "text-gold border-gold/40 bg-gold/5",
  deployment: "text-gold border-gold/40 bg-gold/5",
  discovery: "text-teal-bright border-teal/40 bg-teal/5",
  record: "text-gold border-gold/40 bg-gold/5",
  loss: "text-[#d19489] border-[#d19489]/40 bg-[#d19489]/5",
  end: "text-muted border-line-bright bg-panel/30",
  legacy: "text-silver border-line-bright bg-panel/30",
};

export function TimelineExperience({
  events,
  startYear,
  endYear,
}: {
  events: TimelineEventWithSources[];
  startYear: number;
  endYear: number;
}) {
  const [query, setQuery] = useState("");
  const [destination, setDestination] = useState<"all" | Destination>("all");
  const [type, setType] = useState<"all" | TimelineEvent["type"]>("all");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = events.filter((event) => {
      if (destination !== "all" && event.destination !== destination) return false;
      if (type !== "all" && event.type !== type) return false;
      if (!q) return true;
      return [event.title, event.summary, event.mission, event.relicName, event.dateLabel]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    return list.sort((a, b) =>
      sort === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date),
    );
  }, [events, destination, type, query, sort]);

  const decades = useMemo(() => {
    const map = new Map<number, number>();
    for (const event of filtered) {
      const decade = Math.floor(Number(event.date.slice(0, 4)) / 10) * 10;
      map.set(decade, (map.get(decade) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) =>
      sort === "asc" ? a[0] - b[0] : b[0] - a[0],
    );
  }, [filtered, sort]);

  const grouped = useMemo(() => {
    const map = new Map<number, TimelineEventWithSources[]>();
    for (const event of filtered) {
      const decade = Math.floor(Number(event.date.slice(0, 4)) / 10) * 10;
      const list = map.get(decade) ?? [];
      list.push(event);
      map.set(decade, list);
    }
    return [...map.entries()].sort((a, b) =>
      sort === "asc" ? a[0] - b[0] : b[0] - a[0],
    );
  }, [filtered, sort]);

  const yearCounts = useMemo(() => {
    const years = new Map<number, { moon: number; mars: number }>();
    for (let year = startYear; year <= endYear; year += 1) {
      years.set(year, { moon: 0, mars: 0 });
    }
    for (const event of filtered) {
      const year = Number(event.date.slice(0, 4));
      const entry = years.get(year);
      if (!entry) continue;
      if (event.destination === "Moon") entry.moon += 1;
      else entry.mars += 1;
    }
    return years;
  }, [filtered, startYear, endYear]);

  const maxYear = Math.max(
    1,
    ...[...yearCounts.values()].map((entry) => entry.moon + entry.mars),
  );

  const objectCount = new Set(filtered.map((event) => event.relicId)).size;
  const missionCount = new Set(filtered.map((event) => event.mission)).size;

  const moonCount = events.filter((event) => event.destination === "Moon").length;
  const marsCount = events.length - moonCount;

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Deep links from the home page and elsewhere.
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash.startsWith("event-")) return;
    const event = events.find((item) => `event-${item.id}` === hash);
    if (!event) return;
    setDestination("all");
    setType("all");
    setQuery("");
    setExpandedId(event.id);
    const timer = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [events]);

  const reset = () => {
    setQuery("");
    setDestination("all");
    setType("all");
    setSort("asc");
    setExpandedId(null);
  };

  return (
    <div className="mt-8">
      {/* Density chronograph */}
      <div className="border border-line/60 bg-abyss/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
            Event density
          </p>
          <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted/70">
            {startYear} — {endYear}
          </p>
        </div>
        <div className="mt-3 flex h-16 items-end gap-[2px]">
          {[...yearCounts.entries()].map(([year, counts]) => {
            const total = counts.moon + counts.mars;
            const height = total === 0 ? 2 : Math.max(6, (total / maxYear) * 100);
            const background =
              counts.moon > 0 && counts.mars > 0
                ? "linear-gradient(180deg, #e4b44c 0%, #e4b44c 50%, #39b9c9 50%, #39b9c9 100%)"
                : counts.mars > 0
                  ? "#e4b44c"
                  : "#39b9c9";
            return (
              <button
                key={year}
                type="button"
                onClick={() => scrollToId(`era-${Math.floor(year / 10) * 10}`)}
                title={`${year} · ${total} event${total === 1 ? "" : "s"}`}
                aria-label={`Jump to ${year}, ${total} events`}
                className="group relative flex-1 rounded-t-[1px] transition-opacity hover:opacity-100"
                style={{ height: "100%" }}
              >
                <span
                  className="absolute inset-x-0 bottom-0 opacity-60 transition-opacity group-hover:opacity-100"
                  style={{ height: `${height}%`, background }}
                />
              </button>
            );
          })}
        </div>
        <div className="relative mt-1 h-3">
          {[1970, 1980, 1990, 2000, 2010, 2020].map((year) => {
            const left = ((year - startYear) / Math.max(1, endYear - startYear)) * 100;
            return (
              <span
                key={year}
                className="absolute top-0 -translate-x-1/2 font-mono text-[7px] tracking-[0.1em] text-muted/70"
                style={{ left: `${left}%` }}
              >
                {year}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Controls */}
        <aside className="space-y-4 lg:sticky lg:top-[92px] lg:h-fit">
          <div className="border border-line/70 bg-panel/25 p-4">
            <div className="grid grid-cols-3 gap-px border border-line/60 bg-line/50">
              <Stat value={filtered.length} label="Events" />
              <Stat value={objectCount} label="Objects" />
              <Stat value={missionCount} label="Missions" />
            </div>

            <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
              World
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1">
              {[
                { value: "all" as const, label: "All" },
                { value: "Moon" as const, label: `Moon ${moonCount}` },
                { value: "Mars" as const, label: `Mars ${marsCount}` },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDestination(option.value)}
                  className={cn(
                    "border px-2 py-2 font-mono text-[8px] uppercase tracking-[0.1em] transition-colors",
                    destination === option.value
                      ? "border-teal-bright/60 bg-teal/10 text-teal-bright"
                      : "border-line/60 text-muted hover:border-line-bright hover:text-silver",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <label className="mt-5 block">
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
                Search
              </span>
              <span className="mt-2 flex items-center gap-2 border border-line/70 bg-abyss/60 px-2.5 py-2">
                <Search className="size-3.5 text-muted" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Mission, object, event…"
                  className="w-full bg-transparent text-xs text-silver outline-none placeholder:text-muted/60"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="text-muted hover:text-silver"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </span>
            </label>

            <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
              Event type
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {eventTypes.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={cn(
                    "border px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.1em] transition-colors",
                    type === option.value
                      ? "border-gold/60 bg-gold/10 text-gold"
                      : "border-line/60 text-muted hover:border-line-bright hover:text-silver",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
                className="flex flex-1 items-center justify-center gap-2 border border-line/60 px-2 py-2 font-mono text-[8px] uppercase tracking-[0.1em] text-muted transition-colors hover:border-line-bright hover:text-silver"
              >
                <ArrowDownUp className="size-3" />
                {sort === "asc" ? "Oldest first" : "Newest first"}
              </button>
              <button
                type="button"
                onClick={reset}
                aria-label="Reset timeline filters"
                className="flex size-9 items-center justify-center border border-line/60 text-muted transition-colors hover:border-gold hover:text-gold"
              >
                <RotateCcw className="size-3.5" />
              </button>
            </div>
          </div>

          {decades.length > 0 && (
            <div className="hidden border border-line/70 bg-panel/25 p-4 lg:block">
              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
                Eras
              </p>
              <div className="mt-2 space-y-1">
                {decades.map(([decade, count]) => (
                  <button
                    key={decade}
                    type="button"
                    onClick={() => scrollToId(`era-${decade}`)}
                    className="flex w-full items-center justify-between border border-transparent px-2 py-1.5 font-mono text-[9px] text-muted transition-colors hover:border-line/60 hover:text-silver"
                  >
                    <span>{decade}s</span>
                    <span className="text-muted/60">{count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Timeline */}
        <div className="min-w-0">
          {filtered.length === 0 ? (
            <div className="border border-line/70 bg-panel/20 p-10 text-center">
              <CalendarRange className="mx-auto size-8 text-muted" />
              <p className="mt-4 text-sm text-silver">No events match those filters.</p>
              <button
                type="button"
                onClick={reset}
                className="mt-5 inline-flex items-center gap-2 border border-gold/60 px-4 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-gold"
              >
                Reset timeline
                <ArrowRight className="size-3" />
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {grouped.map(([decade, decadeEvents]) => (
                <section key={decade} id={`era-${decade}`} className="scroll-mt-24">
                  <div className="sticky top-[68px] z-10 -ml-[9px] mb-3 flex items-baseline gap-3 border-b border-line/60 bg-abyss/95 py-3 pl-[9px] backdrop-blur-sm">
                    <span className="font-mono text-2xl leading-none text-white">
                      {decade}s
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted">
                      {decadeEvents.length} event{decadeEvents.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <ol className="relative ml-[7px] border-l border-line/60">
                    {decadeEvents.map((event) => {
                      const expanded = expandedId === event.id;
                      const Icon = typeIcon[event.type];
                      const primary = event.significance === "primary";
                      return (
                        <li
                          key={event.id}
                          id={`event-${event.id}`}
                          className="relative scroll-mt-28 pb-3 pl-6 sm:pl-8"
                        >
                          <span
                            className={cn(
                              "absolute -left-[4.5px] top-5 size-2 rounded-full border",
                              event.destination === "Moon"
                                ? "border-teal-bright bg-abyss"
                                : "border-gold bg-abyss",
                              expanded && "bg-current",
                            )}
                          />
                          <div className="grid gap-2 sm:grid-cols-[86px_minmax(0,1fr)]">
                            <div className="pt-4 font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
                              {event.dateLabel}
                            </div>
                            <article
                              className={cn(
                                "border bg-panel/25 transition-colors",
                                expanded
                                  ? "border-teal/50"
                                  : "border-line/70 hover:border-line-bright",
                              )}
                            >
                              <button
                                type="button"
                                aria-expanded={expanded}
                                onClick={() =>
                                  setExpandedId(expanded ? null : event.id)
                                }
                                className="w-full p-4 text-left"
                              >
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={cn(
                                      "inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[7px] uppercase tracking-[0.12em]",
                                      typeTone[event.type],
                                    )}
                                  >
                                    <Icon className="size-3" />
                                    {typeLabel[event.type]}
                                  </span>
                                  <span
                                    className={cn(
                                      "font-mono text-[7px] uppercase tracking-[0.12em]",
                                      event.destination === "Moon"
                                        ? "text-teal-bright"
                                        : "text-gold",
                                    )}
                                  >
                                    {event.destination}
                                  </span>
                                  {primary && (
                                    <span className="border border-gold/40 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.1em] text-gold/80">
                                      Primary
                                    </span>
                                  )}
                                </div>
                                <h3 className="mt-3 text-base font-medium leading-snug text-white">
                                  {event.title}
                                </h3>
                                <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
                                  {event.mission}
                                  {event.relicName !== event.mission
                                    ? ` · ${event.relicName}`
                                    : ""}
                                </p>
                                <p
                                  className={cn(
                                    "mt-3 text-xs leading-6 text-silver/70",
                                    !expanded && "line-clamp-2",
                                  )}
                                >
                                  {event.summary}
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-teal-bright">
                                  {expanded ? "Close record" : "Inspect event"}
                                  <ChevronDown
                                    className={cn(
                                      "size-3 transition-transform",
                                      expanded && "rotate-180",
                                    )}
                                  />
                                </span>
                              </button>

                              {expanded && (
                                <div className="animate-fade-up border-t border-line/60 p-4">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Link
                                      href={`/relics/${event.relicId}`}
                                      className="inline-flex items-center gap-2 border border-gold bg-gold px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-abyss transition-colors hover:bg-[#f2c76a]"
                                    >
                                      Open object record
                                      <ArrowUpRight className="size-3" />
                                    </Link>
                                    <Link
                                      href={`/rex/relic/${event.relicId}`}
                                      className="inline-flex items-center gap-2 border border-line-bright px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-silver transition-colors hover:border-teal-bright hover:text-white"
                                    >
                                      REX field study
                                      <ArrowRight className="size-3" />
                                    </Link>
                                  </div>
                                  <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
                                    Sources
                                  </p>
                                  <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                                    {event.sources.map((source) => (
                                      <li key={source.id}>
                                        <a
                                          href={source.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-start justify-between gap-3 border border-line/60 px-3 py-2 text-[11px] leading-5 text-silver/80 transition-colors hover:border-teal/50 hover:text-white"
                                        >
                                          <span>
                                            {source.title}
                                            <span className="mt-0.5 block font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                                              {source.organization}
                                            </span>
                                          </span>
                                          <ArrowUpRight className="mt-0.5 size-3 shrink-0 text-muted" />
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </article>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-panel/70 px-2 py-2.5 text-center">
      <p className="font-mono text-lg leading-none text-silver">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-1.5 font-mono text-[6px] uppercase tracking-[0.1em] text-muted">
        {label}
      </p>
    </div>
  );
}
