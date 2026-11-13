"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Archive,
  ArrowRight,
  ArrowUpRight,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  CircleStop,
  Crosshair,
  Orbit,
  Radio,
  RadioOff,
  Rocket,
  Search,
  RotateCcw,
  Satellite,
  Telescope,
  Trophy,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";
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
  { value: "all", label: "All events" },
  { value: "launch", label: "Launch" },
  { value: "landing", label: "Landing" },
  { value: "discovery", label: "Discovery" },
  { value: "loss", label: "Loss" },
  { value: "end", label: "Mission end" },
  { value: "legacy", label: "Legacy" },
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
  legacy: "Legacy",
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
  launch: "text-teal-bright border-teal/30",
  arrival: "text-teal-bright border-teal/30",
  landing: "text-gold border-gold/30",
  deployment: "text-gold border-gold/30",
  discovery: "text-teal-bright border-teal/30",
  record: "text-gold border-gold/30",
  loss: "text-[#c9867c] border-[#c9867c]/30",
  end: "text-muted border-line-bright",
  legacy: "text-silver border-line-bright",
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
  const [year, setYear] = useState(endYear);
  const [destination, setDestination] = useState<"all" | Destination>("all");
  const [type, setType] = useState<"all" | TimelineEvent["type"]>("all");
  const [mission, setMission] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const missions = useMemo(
    () => [...new Set(events.map((event) => event.mission))].sort(),
    [events],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return events
      .filter((event) => Number(event.date.slice(0, 4)) <= year)
      .filter(
        (event) =>
          destination === "all" || event.destination === destination,
      )
      .filter((event) => type === "all" || event.type === type)
      .filter((event) => mission === "all" || event.mission === mission)
      .filter(
        (event) =>
          !normalizedQuery ||
          [event.title, event.summary, event.mission, event.relicName]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
      )
      .slice()
      .reverse();
  }, [destination, events, mission, query, type, year]);

  const decades = useMemo(() => {
    const groups = new Map<string, TimelineEventWithSources[]>();
    for (const event of filtered) {
      const decade = `${event.date.slice(0, 3)}0s`;
      groups.set(decade, [...(groups.get(decade) ?? []), event]);
    }
    return [...groups.entries()];
  }, [filtered]);

  const selected =
    filtered.find((event) => event.id === selectedId) ?? filtered[0] ?? null;

  const density = useMemo(() => {
    const counts = new Map<number, number>();
    for (const event of events) {
      const eventYear = Number(event.date.slice(0, 4));
      counts.set(eventYear, (counts.get(eventYear) ?? 0) + 1);
    }
    const max = Math.max(...counts.values(), 1);
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, index) => {
        const eventYear = startYear + index;
        return {
          year: eventYear,
          count: counts.get(eventYear) ?? 0,
          height: Math.max(2, ((counts.get(eventYear) ?? 0) / max) * 42),
          active: eventYear <= year,
        };
      },
    );
  }, [endYear, events, startYear, year]);

  const reset = () => {
    setYear(endYear);
    setDestination("all");
    setType("all");
    setMission("all");
    setQuery("");
    setSelectedId(null);
  };

  return (
    <div className="mt-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div>
          <section className="relative overflow-hidden border border-line/70 bg-[linear-gradient(120deg,rgba(9,28,40,.92),rgba(5,16,25,.92))]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(43,82,98,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(43,82,98,.1)_1px,transparent_1px)] bg-[size:36px_36px] opacity-30" />
            <div className="relative p-5 md:p-7">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2.5">
                    <CalendarRange className="size-4 text-gold" />
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-gold">
                      Temporal instrument / cursor
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-end gap-4">
                    <span className="font-mono text-[clamp(3.5rem,7vw,6.5rem)] leading-none text-white">
                      {year}
                    </span>
                    <div className="mb-2 flex items-center gap-1">
                      <button
                        onClick={() => setYear((current) => Math.max(startYear, current - 1))}
                        className="flex size-8 items-center justify-center border border-line text-muted hover:border-gold/50 hover:text-gold"
                        aria-label="Previous year"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <button
                        onClick={() => setYear((current) => Math.min(endYear, current + 1))}
                        className="flex size-8 items-center justify-center border border-line text-muted hover:border-gold/50 hover:text-gold"
                        aria-label="Next year"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                    <span className="mb-2 border-l border-line-bright pl-3 font-mono text-[8px] uppercase leading-5 tracking-[0.12em] text-muted">
                      {filtered.length} events
                      <br />
                      in view
                    </span>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 border border-line px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-gold/40 hover:text-gold"
                >
                  <RotateCcw className="size-3" />
                  Reset view
                </button>
              </div>

              <div className="mt-6">
                <div className="flex h-16 items-end gap-[3px]">
                  {density.map((bar) => (
                    <button
                      key={bar.year}
                      onClick={() => setYear(bar.year)}
                      className="group relative flex h-full flex-1 items-end"
                      title={`Jump to ${bar.year}: ${bar.count} event${bar.count === 1 ? "" : "s"}`}
                      aria-label={`Jump to ${bar.year}, ${bar.count} events`}
                    >
                      <span
                        className={cn(
                          "w-full transition-colors",
                          bar.year === year
                            ? "bg-gold"
                            : bar.active
                              ? "bg-teal/55 group-hover:bg-teal-bright"
                              : "bg-line/50",
                        )}
                        style={{ height: `${bar.height}px` }}
                      />
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min={startYear}
                  max={endYear}
                  value={year}
                  onChange={(event) => setYear(Number(event.target.value))}
                  className="mt-3 h-1 w-full cursor-pointer appearance-none bg-line-bright accent-gold"
                  aria-label="Timeline year"
                />
                <div className="mt-2 flex justify-between font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                  <span>{startYear}</span>
                  <span>1980</span>
                  <span>2000</span>
                  <span>2020</span>
                  <span>{endYear}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-line/60 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {(["all", "Moon", "Mars"] as const).map((item) => (
                      <button
                        key={item}
                        onClick={() => setDestination(item)}
                        className={cn(
                          "border px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] transition-colors",
                          destination === item
                            ? "border-teal bg-teal/10 text-teal-bright"
                            : "border-line text-muted hover:border-line-bright hover:text-silver",
                        )}
                      >
                        {item === "all" ? "Both worlds" : item}
                      </button>
                    ))}
                  </div>
                  <select
                    value={mission}
                    onChange={(event) => setMission(event.target.value)}
                    className="h-9 max-w-[210px] border border-line bg-void/50 px-2.5 font-mono text-[8px] uppercase tracking-[0.1em] text-silver focus:border-teal focus:outline-none"
                    aria-label="Filter by mission"
                  >
                    <option value="all">All missions</option>
                    {missions.map((missionName) => (
                      <option key={missionName} value={missionName}>
                        {missionName}
                      </option>
                    ))}
                  </select>
                  <select
                    value={type}
                    onChange={(event) =>
                      setType(
                        event.target.value as "all" | TimelineEvent["type"],
                      )
                    }
                    className="h-9 border border-line bg-void/50 px-2.5 font-mono text-[8px] uppercase tracking-[0.1em] text-silver focus:border-teal focus:outline-none"
                    aria-label="Filter by event type"
                  >
                    {eventTypes.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <label className="relative ml-auto block">
                    <span className="sr-only">Search events</span>
                    <Search className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-muted" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search events"
                      className="h-9 w-44 border border-line bg-void/50 pl-8 pr-2 font-mono text-[9px] text-silver placeholder:text-muted/60 focus:border-teal focus:outline-none"
                    />
                  </label>
                </div>
                {(destination !== "all" || type !== "all" || mission !== "all" || query) && (
                  <div className="flex items-center justify-between border border-line/50 px-3 py-2">
                    <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                      {filtered.length} matching records
                    </span>
                    <button
                      onClick={reset}
                      className="font-mono text-[7px] uppercase tracking-[0.1em] text-gold hover:text-white"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="mt-3 flex items-center justify-between border border-line/50 px-4 py-2.5">
            <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
              Chronological record / {decades.length} decades
            </p>
            <p className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted/60">
              Select a record to inspect its sources
            </p>
          </div>

          <div className="mt-8 lg:hidden">
            <SelectedPanel event={selected} mobile />
          </div>

          {decades.length === 0 && (
            <div className="mt-4 border border-line/60 p-10 text-center">
              <p className="text-sm text-muted">No events match this view.</p>
              <button
                onClick={reset}
                className="mt-4 font-mono text-[8px] uppercase tracking-[0.12em] text-gold"
              >
                Reset the timeline
              </button>
            </div>
          )}

          <div className="mt-10 space-y-14">
            {decades.map(([decade, decadeEvents]) => (
              <section
                key={decade}
                id={`decade-${decade}`}
                className="scroll-mt-28"
              >
                <div className="flex items-end gap-4 border-b border-line/70 pb-3">
                  <h2 className="font-mono text-4xl leading-none text-silver/80 md:text-5xl">
                    {decade}
                  </h2>
                  <span className="mb-1 font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
                    {decadeEvents.length} records
                  </span>
                  <span className="mb-1 h-px flex-1 bg-line/50" />
                </div>

                <div className="relative mt-1">
                  <div className="absolute bottom-0 left-[8px] top-0 w-px bg-line/60 md:left-[10px]" />
                  {decadeEvents.map((event, index) => {
                    const Icon = typeIcon[event.type];
                    const active = selected?.id === event.id;
                    return (
                      <motion.button
                        key={`${event.relicId}-${event.id}`}
                        onClick={() => setSelectedId(event.id)}
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{
                          duration: 0.3,
                          delay: Math.min(index * 0.02, 0.14),
                        }}
                        className={cn(
                          "group relative grid w-full grid-cols-[52px_minmax(0,1fr)] gap-4 py-2 text-left md:grid-cols-[70px_minmax(0,1fr)]",
                        )}
                      >
                        <div className="relative pt-1">
                          <span
                            className={cn(
                              "absolute left-[4px] top-3 z-10 size-[9px] rounded-full border md:left-[6px]",
                              active
                                ? "border-gold bg-gold shadow-[0_0_10px_rgba(228,180,76,.55)]"
                                : "border-line-bright bg-abyss group-hover:border-teal",
                            )}
                          />
                          <span className="block pl-6 font-mono text-[10px] text-muted group-hover:text-gold md:pl-7">
                            {event.date.slice(0, 4)}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "flex items-start gap-3 border-b border-line/40 pb-4 pl-2 pr-2 transition-colors",
                            active
                              ? "bg-gold/[0.035]"
                              : "group-hover:bg-white/[0.018]",
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex size-7 shrink-0 items-center justify-center border",
                              typeTone[event.type],
                            )}
                          >
                            <Icon className="size-3" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[7px] uppercase tracking-[0.1em]">
                              <span className={typeTone[event.type].split(" ")[0]}>
                                {typeLabel[event.type]}
                              </span>
                              <span className="text-muted/40">/</span>
                              <span className="text-muted">{event.mission}</span>
                              <span className="text-muted/40">/</span>
                              <span className="text-muted">
                                {event.destination}
                              </span>
                              <span className="text-muted/40">/</span>
                              <span className="text-muted/70">
                                {event.dateLabel}
                              </span>
                            </span>
                            <span
                              className={cn(
                                "mt-1.5 block text-base font-medium leading-6 tracking-[-0.015em] transition-colors",
                                active
                                  ? "text-white"
                                  : "text-silver/85 group-hover:text-white",
                              )}
                            >
                              {event.title}
                            </span>
                            <span className="mt-1 block line-clamp-2 text-xs leading-5 text-muted">
                              {event.summary}
                            </span>
                          </span>
                          <ArrowRight
                            className={cn(
                              "mt-1 size-3.5 shrink-0 transition-all",
                              active
                                ? "text-gold"
                                : "text-muted/30 group-hover:translate-x-0.5 group-hover:text-gold",
                            )}
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <SelectedPanel event={selected} />
            <div className="border border-line/70 bg-panel/20 p-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
                Decade index
              </p>
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {[
                  "1960s",
                  "1970s",
                  "1980s",
                  "1990s",
                  "2000s",
                  "2010s",
                  "2020s",
                ].map((decade) => {
                  const available = decades.some(
                    ([label]) => label === decade,
                  );
                  return (
                    <button
                      key={decade}
                      disabled={!available}
                      onClick={() =>
                        document
                          .getElementById(`decade-${decade}`)
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          })
                      }
                      className={cn(
                        "flex items-center justify-between border px-2.5 py-2 font-mono text-[8px] uppercase tracking-[0.1em] transition-colors",
                        available
                          ? "border-line/60 text-muted hover:border-teal/40 hover:text-teal-bright"
                          : "border-line/30 text-muted/30",
                      )}
                    >
                      {decade}
                      <span>
                        {String(
                          events.filter(
                            (event) =>
                              event.date.startsWith(decade.slice(0, 3)) &&
                              Number(event.date.slice(0, 4)) <= year,
                          ).length,
                        ).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="border border-line/60 px-4 py-3">
              <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-gold" /> Moon
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-teal-bright" /> Mars
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[#c9867c]" /> Loss
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SelectedPanel({
  event,
  mobile = false,
}: {
  event: TimelineEventWithSources | null;
  mobile?: boolean;
}) {
  if (!event) {
    return (
      <div className="border border-line/60 bg-panel/20 p-5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
        No record selected.
      </div>
    );
  }
  return (
    <div
      className={cn(
        "border border-line/80 bg-[linear-gradient(145deg,rgba(13,34,49,.8),rgba(7,19,31,.92))]",
        mobile ? "p-4" : "p-5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Orbit className="size-3.5 text-gold" />
          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-gold">
            Selected record
          </p>
        </div>
        <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
          {event.dateLabel}
        </span>
      </div>
      <h3 className="mt-4 text-xl font-medium leading-tight tracking-[-0.025em] text-white">
        {event.title}
      </h3>
      <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.11em] text-muted">
        {event.mission} / {event.destination} / {typeLabel[event.type]}
      </p>
      <p className="mt-4 text-xs leading-6 text-silver/70">{event.summary}</p>
      <div className="mt-4 space-y-2 border-t border-line/50 pt-4">
        <p className="font-mono text-[7px] uppercase tracking-[0.12em] text-muted">
          Source records
        </p>
        {event.sources.map((source) => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-2 border border-line/50 p-2.5 transition-colors hover:border-teal/40"
          >
            <Radio className="mt-0.5 size-3 shrink-0 text-teal" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[10px] leading-4 text-silver/80 group-hover:text-white">
                {source.title}
              </span>
              <span className="mt-0.5 block font-mono text-[6px] uppercase tracking-[0.1em] text-muted">
                {source.organization}
              </span>
            </span>
            <ArrowUpRight className="mt-0.5 size-3 shrink-0 text-muted group-hover:text-gold" />
          </a>
        ))}
      </div>
      <Link
        href={`/relics/${event.relicId}`}
        className="mt-4 flex items-center justify-between border border-gold/50 bg-gold/[0.06] px-3 py-2.5 font-mono text-[8px] uppercase tracking-[0.12em] text-gold transition-colors hover:border-gold hover:bg-gold/10"
      >
        Open {event.relicName}
        <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}
