"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  RotateCcw,
  Scale,
  SlidersHorizontal,
} from "lucide-react";
import type { Destination, LegacyAssessment } from "@/lib/schema";
import {
  computeLegacyTotal,
  defaultLegacyWeights,
  legacyDimensionKeys,
  legacyDimensionMeta,
  type LegacyWeights,
} from "@/lib/legacy";
import { EditorialDisclosure } from "@/components/shared/disclosures";
import { cn } from "@/lib/utils";

type LegacyItem = {
  id: string;
  shortName: string;
  mission: string;
  destination: Destination;
  category: string;
  landingDate: string;
  operationalStatus: string;
  legacy: LegacyAssessment;
  score: number;
  sources: Array<{
    id: string;
    title: string;
    organization: string;
    url: string;
  }>;
};

export function LegacyExplorer({ items }: { items: LegacyItem[] }) {
  const [weights, setWeights] = useState<LegacyWeights>(defaultLegacyWeights);
  const [destination, setDestination] = useState<"all" | Destination>("all");
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");

  const visible = useMemo(() => {
    return items
      .filter(
        (item) => destination === "all" || item.destination === destination,
      )
      .map((item) => ({
        ...item,
        score: computeLegacyTotal(item.legacy, weights),
      }))
      .sort((a, b) => b.score - a.score);
  }, [destination, items, weights]);

  const selected =
    visible.find((item) => item.id === selectedId) ??
    visible[0] ??
    items[0];
  const totalWeight = Object.values(weights).reduce(
    (sum, value) => sum + value,
    0,
  );

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-8 md:py-16">
      <div className="flex flex-col gap-6 border-b border-line/70 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-[9px] text-gold">06</span>
            <span className="h-px w-8 bg-line-bright" />
            <span className="technical-label">
              Legacy score / editorial methodology
            </span>
          </div>
          <h1 className="max-w-4xl text-balance text-4xl font-medium leading-[0.95] tracking-[-0.05em] text-white md:text-7xl">
            What makes an
            <span className="text-gold"> object matter?</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
            An exploratory educational assessment. Change the weights and watch
            the ranking respond. This is an AFTERLIGHT editorial framework, not
            an official NASA rating or a statement of scientific consensus.
          </p>
        </div>
        <div className="flex items-center gap-2 border border-gold/30 bg-gold/[0.03] px-4 py-3">
          <Scale className="size-4 text-gold" />
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-gold">
              Editorial instrument
            </p>
            <p className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
              Not a NASA score
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="border border-line/70 bg-panel/25 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-3.5 text-teal" />
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-silver">
                  Dimension weights
                </p>
              </div>
              <button
                onClick={() => setWeights(defaultLegacyWeights)}
                className="flex items-center gap-1 font-mono text-[7px] uppercase tracking-[0.1em] text-muted hover:text-gold"
              >
                <RotateCcw className="size-2.5" />
                Reset
              </button>
            </div>
            <p className="mt-2 font-mono text-[7px] uppercase leading-4 tracking-[0.1em] text-muted/70">
              Values are normalized. Total weight: {totalWeight}
            </p>

            <div className="mt-5 space-y-5">
              {legacyDimensionKeys.map((key) => {
                const meta = legacyDimensionMeta[key];
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between gap-4">
                      <label
                        htmlFor={`weight-${key}`}
                        className="font-mono text-[8px] uppercase tracking-[0.1em] text-silver"
                      >
                        {meta.label}
                      </label>
                      <span className="font-mono text-[9px] text-gold">
                        {weights[key]}
                      </span>
                    </div>
                    <input
                      id={`weight-${key}`}
                      type="range"
                      min={0}
                      max={40}
                      step={5}
                      value={weights[key]}
                      onChange={(event) =>
                        setWeights((current) => ({
                          ...current,
                          [key]: Number(event.target.value),
                        }))
                      }
                      className="mt-2 h-1 w-full cursor-pointer appearance-none bg-line-bright accent-gold"
                    />
                    <p className="mt-1 text-[10px] leading-4 text-muted">
                      {meta.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <EditorialDisclosure className="mt-4" />

          <div className="mt-4 border border-line/70 bg-panel/20 p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-teal-bright">
              How to read this
            </p>
            <ul className="mt-4 space-y-3 text-[11px] leading-5 text-muted">
              <li>
                <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-silver">
                  Not a measurement.
                </span>{" "}
                Scores are editorial judgments informed by the sourced record.
              </li>
              <li>
                <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-silver">
                  Not a ranking of people.
                </span>{" "}
                The object and mission are assessed, not the crews.
              </li>
              <li>
                <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-silver">
                  Weight-sensitive.
                </span>{" "}
                Adjusting the sliders changes the total. That is the point.
              </li>
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border border-line/70 bg-panel/25 px-4 py-3">
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
                  {item === "all" ? "Both worlds" : item}
                </button>
              ))}
            </div>
            <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
              {visible.length} objects · ranking updates live
            </p>
          </div>

          <div className="mt-2 border border-line/70 bg-panel/20">
            {visible.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  "group grid w-full grid-cols-[34px_minmax(0,1fr)_64px] items-center gap-3 border-b border-line/40 px-4 py-3.5 text-left transition-colors last:border-b-0",
                  selected?.id === item.id
                    ? "bg-gold/[0.045]"
                    : "hover:bg-white/[0.02]",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-sm",
                    index === 0 ? "text-gold" : "text-muted/60",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "truncate text-sm",
                        selected?.id === item.id
                          ? "text-white"
                          : "text-silver/80 group-hover:text-white",
                      )}
                    >
                      {item.shortName}
                    </span>
                    <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                      {item.destination}
                    </span>
                  </div>
                  <div className="mt-2 flex h-1 gap-0.5">
                    {legacyDimensionKeys.map((key) => (
                      <div key={key} className="h-full flex-1 bg-line/50">
                        <div
                          className="h-full bg-gold/70"
                          style={{
                            width: `${(item.legacy.dimensions[key] * weights[key]) / Math.max(1, totalWeight)}%`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <span className="text-right font-mono text-lg text-gold">
                  {String(item.score).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>

          {selected && (
            <div className="mt-4 border border-line/70 bg-panel/25 p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-gold">
                    Selected assessment / {selected.destination}
                  </p>
                  <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em] text-white">
                    {selected.shortName}
                  </h2>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.11em] text-muted">
                    {selected.mission} · {selected.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-5xl leading-none text-gold">
                    {String(selected.score).padStart(2, "0")}
                  </p>
                  <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.14em] text-muted">
                    weighted / 100
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {legacyDimensionKeys.map((key) => (
                  <div key={key}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-silver">
                        {legacyDimensionMeta[key].label}
                      </span>
                      <span className="font-mono text-[9px] text-silver">
                        {selected.legacy.dimensions[key]}
                      </span>
                    </div>
                    <div className="mt-2 h-1 bg-line/60">
                      <div
                        className="h-full bg-teal-bright/80"
                        style={{ width: `${selected.legacy.dimensions[key]}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[11px] leading-5 text-muted">
                      {selected.legacy.rationales[key]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line/50 pt-4">
                <div className="flex flex-wrap gap-1.5">
                  {selected.sources.map((source) => (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border border-line/60 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.1em] text-muted transition-colors hover:border-teal/50 hover:text-silver"
                    >
                      {source.organization}
                      <ArrowUpRight className="size-2.5" />
                    </a>
                  ))}
                </div>
                <Link
                  href={`/relics/${selected.id}`}
                  className="inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-gold transition-colors hover:text-white"
                >
                  Investigate record
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="mt-16 border-t border-line/60 pt-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold">
              Methodology / v1.0
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-white">
              Five dimensions.
              <br />
              <span className="text-muted">One editorial lens.</span>
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
            {legacyDimensionKeys.map((key) => {
              const meta = legacyDimensionMeta[key];
              return (
                <div key={key} className="border-t border-line/60 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-silver">
                      {meta.label}
                    </span>
                    <span className="font-mono text-[8px] text-gold">
                      {defaultLegacyWeights[key]}%
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-muted">
                    {meta.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
