"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarRange,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import type { TimelineEvent, Destination } from "@/lib/schema";
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
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return events
      .filter((event) => Number(event.date.slice(0, 4)) <= year)
      .filter(
        (event) =>
          destination === "all" || event.destination === destination,
      )
      .filter((event) => type === "all" || event.type === type)
      .slice()
      .reverse();
  }, [destination, events, type, year]);

  const visibleYears = useMemo(() => {
    return [...new Set(filtered.map((event) => event.date.slice(0, 4)))];
  }, [filtered]);

  const reset = () => {
    setYear(endYear);
    setDestination("all");
    setType("all");
    setExpanded(null);
  };

  return (
    <div className="mt-8">
      <div className="border border-line/70 bg-panel/25 p-5 md:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CalendarRange className="size-3.5 text-gold" />
                <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-gold">
                  Time cursor
                </p>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-gold"
              >
                <RotateCcw className="size-3" />
                All time
              </button>
            </div>
            <div className="mt-4 flex items-end gap-4">
              <p className="font-mono text-4xl leading-none text-white md:text-5xl">
                {year}
              </p>
              <p className="mb-1 font-mono text-[8px] uppercase leading-4 tracking-[0.1em] text-muted">
                {filtered.length} events
                <br />
                up to this year
              </p>
            </div>
            <input
              type="range"
              min={startYear}
              max={endYear}
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="mt-5 h-1 w-full cursor-pointer appearance-none bg-line-bright accent-gold"
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

          <div className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end">
            <div className="flex gap-1">
              {(["all", "Moon", "Mars"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setDestination(item)}
                  className={cn(
                    "border px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] transition-colors",
                    destination === item
                      ? "border-teal bg-teal/10 text-teal-bright"
                      : "border-line text-muted hover:text-silver",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value as "all" | TimelineEvent["type"])
              }
              className="h-9 border border-line bg-void/50 px-2 font-mono text-[8px] uppercase tracking-[0.1em] text-silver focus:border-teal focus:outline-none"
              aria-label="Filter by event type"
            >
              {eventTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          {visibleYears.length === 0 && (
            <div className="border border-line/60 p-10 text-center">
              <p className="text-sm text-muted">No events match this view.</p>
              <button
                onClick={reset}
                className="mt-4 font-mono text-[8px] uppercase tracking-[0.12em] text-gold"
              >
                Reset the timeline
              </button>
            </div>
          )}

          {visibleYears.map((eventYear) => (
            <div key={eventYear} className="relative mb-10 last:mb-0">
              <div
                id={`year-${eventYear}`}
                className="sticky top-[68px] z-10 mb-4 flex items-center gap-3 bg-abyss/90 py-2 backdrop-blur-sm"
              >
                <span className="font-mono text-xl text-gold">{eventYear}</span>
                <span className="h-px flex-1 bg-line/70" />
                <span className="font-mono text-[7px] uppercase tracking-[0.12em] text-muted">
                  {filtered.filter((event) => event.date.startsWith(eventYear)).length} records
                </span>
              </div>
              <div className="space-y-2">
                {filtered
                  .filter((event) => event.date.startsWith(eventYear))
                  .map((event, index) => {
                    const isExpanded = expanded === event.id;
                    return (
                      <motion.article
                        key={`${event.relicId}-${event.id}`}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.18) }}
                        className="group border border-line/60 bg-panel/20 transition-colors hover:border-line-bright"
                      >
                        <button
                          onClick={() =>
                            setExpanded(isExpanded ? null : event.id)
                          }
                          className="w-full p-4 text-left md:p-5"
                          aria-expanded={isExpanded}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                "border px-2 py-1 font-mono text-[7px] uppercase tracking-[0.12em]",
                                typeTone[event.type],
                              )}
                            >
                              {typeLabel[event.type]}
                            </span>
                            <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                              {event.dateLabel}
                            </span>
                            <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                              {event.destination} / {event.mission}
                            </span>
                            <ArrowUpRight className="ml-auto size-3.5 text-muted transition-colors group-hover:text-gold" />
                          </div>
                          <h2 className="mt-3 text-lg font-medium leading-tight tracking-[-0.02em] text-white">
                            {event.title}
                          </h2>
                          <p className="mt-2 max-w-3xl text-xs leading-6 text-muted">
                            {event.summary}
                          </p>
                        </button>
                        {isExpanded && (
                          <div className="border-t border-line/50 px-4 pb-4 pt-3 md:px-5">
                            <div className="flex flex-wrap items-center gap-3">
                              <Link
                                href={`/relics/${event.relicId}`}
                                className="inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-gold hover:text-white"
                              >
                                Open object record
                                <ArrowRight className="size-3" />
                              </Link>
                              <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                                {event.relicName}
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {event.sources.map((source) => (
                                <a
                                  key={source.id}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 border border-line/60 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-teal/50 hover:text-silver"
                                >
                                  {source.organization}
                                  <ArrowUpRight className="size-2.5" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.article>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 border border-line/70 bg-panel/20 p-4">
            <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-muted">
              Timeline index
            </p>
            <div className="mt-4 space-y-2">
              {visibleYears.map((eventYear) => (
                <button
                  key={eventYear}
                  onClick={() =>
                    document
                      .getElementById(`year-${eventYear}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="flex w-full items-center justify-between border-b border-line/40 py-2 font-mono text-[8px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-gold"
                >
                  <span>{eventYear}</span>
                  <span>
                    {String(
                      filtered.filter((event) =>
                        event.date.startsWith(eventYear),
                      ).length,
                    ).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-5 border-t border-line/50 pt-4 font-mono text-[7px] uppercase leading-5 tracking-[0.1em] text-muted/70">
              Expand any event to inspect its source records.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
