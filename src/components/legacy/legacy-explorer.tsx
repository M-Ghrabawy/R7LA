"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Clock,
  FlaskConical,
  History,
  Landmark,
  Minus,
  Plus,
  RotateCcw,
  Scale,
  SlidersHorizontal,
  Sparkles,
  Trophy,
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

const dimensionIcons = {
  scientific: FlaskConical,
  mission: Landmark,
  historical: History,
  longevity: Clock,
  continued: Activity,
};

const dimensionBar = {
  scientific: "bg-teal-bright",
  mission: "bg-gold",
  historical: "bg-silver",
  longevity: "bg-teal/60",
  continued: "bg-[#c9a0dc]",
};

const presets: Array<{
  id: string;
  label: string;
  description: string;
  weights: LegacyWeights;
}> = [
  {
    id: "balanced",
    label: "Balanced",
    description: "The archive's default editorial weighting.",
    weights: defaultLegacyWeights,
  },
  {
    id: "science",
    label: "Science-led",
    description: "Discovery and continued scientific return lead.",
    weights: {
      scientific: 45,
      mission: 20,
      historical: 10,
      longevity: 10,
      continued: 15,
    },
  },
  {
    id: "heritage",
    label: "Heritage-led",
    description: "History and physical survival lead.",
    weights: {
      scientific: 10,
      mission: 15,
      historical: 40,
      longevity: 25,
      continued: 10,
    },
  },
  {
    id: "active",
    label: "Active value",
    description: "Objects and data still producing science lead.",
    weights: {
      scientific: 30,
      mission: 15,
      historical: 10,
      longevity: 10,
      continued: 35,
    },
  },
];

export function LegacyExplorer({ items }: { items: LegacyItem[] }) {
  const [weights, setWeights] = useState<LegacyWeights>(defaultLegacyWeights);
  const [destination, setDestination] = useState<"all" | Destination>("all");
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const [compareId, setCompareId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState("balanced");

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
    visible.find((item) => item.id === selectedId) ?? visible[0] ?? items[0];
  const comparison =
    visible.find((item) => item.id === compareId) ??
    visible.find((item) => item.id !== selected.id) ??
    null;
  const totalWeight = Object.values(weights).reduce(
    (sum, value) => sum + value,
    0,
  );
  const leader = visible[0];

  const updateWeight = (key: keyof LegacyWeights, value: number) => {
    setWeights((current) => ({
      ...current,
      [key]: Math.max(0, Math.min(50, value)),
    }));
    setActivePreset("custom");
  };

  const normalize = () => {
    if (totalWeight <= 0) {
      setWeights(defaultLegacyWeights);
      setActivePreset("balanced");
      return;
    }
    const scaled = {} as LegacyWeights;
    let allocated = 0;
    legacyDimensionKeys.forEach((key, index) => {
      if (index === legacyDimensionKeys.length - 1) {
        scaled[key] = 100 - allocated;
      } else {
        const value = Math.round((weights[key] / totalWeight) * 100);
        scaled[key] = value;
        allocated += value;
      }
    });
    setWeights(scaled);
    setActivePreset("custom");
  };

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-8 md:py-16">
      <header className="relative overflow-hidden border-b border-line/70 pb-8">
        <div className="pointer-events-none absolute -right-8 top-0 select-none font-mono text-[clamp(4rem,12vw,11rem)] leading-none tracking-[-0.08em] text-white/[0.025]">
          LEGACY
        </div>
        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-[9px] text-gold">06</span>
              <span className="h-px w-8 bg-line-bright" />
              <span className="technical-label">
                Legacy score / editorial instrument
              </span>
            </div>
            <h1 className="max-w-4xl text-balance text-[clamp(2.8rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.055em] text-white">
              What makes an
              <span className="text-gold"> object matter?</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
              Change the weights and watch the ranking respond. This is an
              exploratory AFTERLIGHT assessment, not an official NASA rating or
              a statement of scientific consensus.
            </p>
          </div>
          <div className="lg:col-span-4">
            <div className="border border-gold/30 bg-gold/[0.03] p-4">
              <div className="flex items-center gap-2">
                <Scale className="size-4 text-gold" />
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-gold">
                  Current instrument
                </p>
              </div>
              <div className="mt-3 flex items-end gap-3">
                <p className="font-mono text-4xl leading-none text-white">
                  {String(selected.score).padStart(2, "0")}
                </p>
                <p className="mb-1 font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
                  selected score
                </p>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-muted">
                Leader: {leader.shortName} /{" "}
                <span className="text-gold">{leader.score}</span>
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-gold/20 pt-2 font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                <span>{activePreset === "custom" ? "Custom weights" : activePreset}</span>
                <span>{totalWeight} raw points</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mt-6 border border-line/70 bg-panel/25 p-4 md:p-6">
        <div className="flex flex-col gap-4 border-b border-line/60 pb-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-teal" />
              <h2 className="font-mono text-[9px] uppercase tracking-[0.16em] text-silver">
                Dimension weights
              </h2>
              {activePreset === "custom" && (
                <span className="border border-gold/30 px-1.5 py-1 font-mono text-[6px] uppercase tracking-[0.1em] text-gold">
                  Custom
                </span>
              )}
            </div>
            <p className="mt-2 max-w-2xl text-[11px] leading-5 text-muted">
              Set the relative importance of each dimension. The score uses the
              normalized share, so raw points do not need to total 100. Use{" "}
              <span className="text-silver">Normalize</span> to rescale the
              current ratios to exactly 100 points.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-line/60 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
              Total / <span className="text-silver">{totalWeight} pts</span>
            </span>
            <button
              onClick={normalize}
              className="border border-line px-3 py-2 font-mono text-[7px] uppercase tracking-[0.1em] text-muted transition-colors hover:border-gold/40 hover:text-gold"
            >
              Normalize
            </button>
            <button
              onClick={() => {
                setWeights(defaultLegacyWeights);
                setActivePreset("balanced");
              }}
              className="flex items-center gap-1.5 border border-line px-3 py-2 font-mono text-[7px] uppercase tracking-[0.1em] text-muted transition-colors hover:border-gold/40 hover:text-gold"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
          </div>
        </div>

        <div className="mt-4 flex h-2 overflow-hidden bg-line/50">
          {legacyDimensionKeys.map((key) => (
            <div
              key={key}
              className={dimensionBar[key]}
              style={{
                width: `${(weights[key] / Math.max(totalWeight, 1)) * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {legacyDimensionKeys.map((key, index) => {
            const meta = legacyDimensionMeta[key];
            const Icon = dimensionIcons[key];
            const share = Math.round(
              (weights[key] / Math.max(totalWeight, 1)) * 100,
            );
            return (
              <div
                key={key}
                className="border border-line/60 bg-void/20 p-3 transition-colors focus-within:border-teal/50"
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-3 text-muted" />
                  <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-silver">
                    {meta.short}
                  </span>
                  <span className="ml-auto font-mono text-[7px] text-muted/50">
                    0{index + 1}
                  </span>
                </div>
                <p className="mt-2 min-h-8 text-[11px] leading-4 text-silver/85">
                  {meta.label}
                </p>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <div>
                    <p className="font-mono text-2xl leading-none text-gold">
                      {share}%
                    </p>
                    <p className="mt-1 font-mono text-[6px] uppercase tracking-[0.1em] text-muted">
                      normalized share
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateWeight(key, weights[key] - 5)}
                      className="flex size-6 items-center justify-center border border-line text-muted hover:border-gold/40 hover:text-gold"
                      aria-label={`Decrease ${meta.label} weight`}
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-6 text-center font-mono text-[9px] text-silver">
                      {weights[key]}
                    </span>
                    <button
                      onClick={() => updateWeight(key, weights[key] + 5)}
                      className="flex size-6 items-center justify-center border border-line text-muted hover:border-gold/40 hover:text-gold"
                      aria-label={`Increase ${meta.label} weight`}
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={weights[key]}
                  onChange={(event) =>
                    updateWeight(key, Number(event.target.value))
                  }
                  className="mt-3 h-1 w-full cursor-pointer appearance-none bg-line-bright accent-gold"
                  aria-label={`${meta.label} weight`}
                />
                <p className="mt-2 text-[9px] leading-4 text-muted/80">
                  {meta.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-line/50 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setWeights(preset.weights);
                  setActivePreset(preset.id);
                }}
                className={cn(
                  "border px-3 py-2 text-left font-mono text-[7px] uppercase tracking-[0.1em] transition-colors",
                  activePreset === preset.id
                    ? "border-teal bg-teal/10 text-teal-bright"
                    : "border-line/60 text-muted hover:border-line-bright hover:text-silver",
                )}
                title={preset.description}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <p className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted/60">
            Weights change the rank, not the underlying evidence.
          </p>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,.88fr)]">
        <div>
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
            <div className="flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
              <Sparkles className="size-3 text-gold" />
              {visible.length} objects / live ranking
            </div>
          </div>

          <div className="mt-2 border border-line/70 bg-panel/20">
            {visible.map((item, index) => (
              <motion.button
                key={item.id}
                layout
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  "group grid w-full grid-cols-[34px_minmax(0,1fr)_54px] items-center gap-3 border-b border-line/40 px-3 py-3 text-left transition-colors last:border-b-0 md:grid-cols-[44px_minmax(0,1fr)_68px] md:px-4",
                  selected.id === item.id
                    ? "bg-gold/[0.055]"
                    : "hover:bg-white/[0.02]",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-sm",
                    index === 0
                      ? "text-gold"
                      : index < 3
                        ? "text-silver"
                        : "text-muted/60",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "truncate text-sm",
                        selected.id === item.id
                          ? "text-white"
                          : "text-silver/80 group-hover:text-white",
                      )}
                    >
                      {item.shortName}
                    </span>
                    <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                      {item.destination}
                    </span>
                    {index === 0 && <Trophy className="size-3 text-gold" />}
                  </span>
                  <span className="mt-1 flex h-1 gap-0.5">
                    {legacyDimensionKeys.map((key) => (
                      <span key={key} className="h-full flex-1 bg-line/50">
                        <span
                          className={cn(
                            "block h-full",
                            dimensionBar[key],
                            "opacity-70",
                          )}
                          style={{
                            width: `${(item.legacy.dimensions[key] * weights[key]) / Math.max(1, totalWeight)}%`,
                          }}
                        />
                      </span>
                    ))}
                  </span>
                </span>
                <span className="text-right font-mono text-lg text-gold">
                  {String(item.score).padStart(2, "0")}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {selected && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <section className="border border-line/70 bg-panel/25 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-gold">
                    Selected assessment
                  </p>
                  <h2 className="mt-2 text-2xl font-medium tracking-[-0.03em] text-white">
                    {selected.shortName}
                  </h2>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
                    {selected.mission} · {selected.destination}
                  </p>
                </div>
                <ScoreRing score={selected.score} size="small" />
              </div>

              <div className="mt-5 space-y-4">
                {legacyDimensionKeys.map((key) => (
                  <div key={key}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[7px] uppercase tracking-[0.09em] text-silver">
                        {legacyDimensionMeta[key].label}
                      </span>
                      <span className="font-mono text-[8px] text-silver">
                        {selected.legacy.dimensions[key]}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1 bg-line/60">
                      <div
                        className={cn("h-full", dimensionBar[key])}
                        style={{
                          width: `${selected.legacy.dimensions[key]}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] leading-4 text-muted">
                      {selected.legacy.rationales[key]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 border-t border-line/50 pt-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="size-3 text-teal" />
                    <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-silver">
                      Compare
                    </p>
                  </div>
                  <select
                    value={comparison?.id ?? ""}
                    onChange={(event) => setCompareId(event.target.value)}
                    className="h-9 w-full border border-line bg-void/50 px-2 font-mono text-[8px] uppercase tracking-[0.1em] text-silver focus:border-teal focus:outline-none"
                    aria-label="Compare selected object with"
                  >
                    {visible
                      .filter((item) => item.id !== selected.id)
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.shortName} / {item.score}
                        </option>
                      ))}
                  </select>
                </div>

                {comparison && (
                  <div className="mt-3 space-y-1.5">
                    {[selected, comparison].map((item, index) => (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-center gap-2 border px-2 py-2",
                          index === 0
                            ? "border-gold/30 bg-gold/[0.03]"
                            : "border-line/50",
                        )}
                      >
                        <span className="min-w-0 flex-1 truncate font-mono text-[7px] uppercase tracking-[0.08em] text-silver/80">
                          {item.shortName}
                        </span>
                        <span className="font-mono text-sm text-gold">
                          {item.score}
                        </span>
                        <span className="font-mono text-[6px] text-muted">
                          {item.destination}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {selected.sources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 border border-line/60 px-2 py-1.5 font-mono text-[6px] uppercase tracking-[0.08em] text-muted hover:text-silver"
                  >
                    {source.organization}
                    <ArrowUpRight className="size-2.5" />
                  </a>
                ))}
              </div>

              <Link
                href={`/relics/${selected.id}`}
                className="mt-4 flex items-center justify-between border border-gold/50 bg-gold/[0.06] px-3 py-2.5 font-mono text-[8px] uppercase tracking-[0.12em] text-gold transition-colors hover:border-gold hover:bg-gold/10"
              >
                Investigate record
                <ArrowRight className="size-3" />
              </Link>
              <p className="mt-3 font-mono text-[6px] uppercase tracking-[0.1em] text-muted/60">
                Editorial assessment · not a NASA rating
              </p>
            </section>
          </aside>
        )}
      </div>

      <section className="mt-14 border-t border-line/60 pt-8">
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
            <p className="mt-4 max-w-sm text-[11px] leading-5 text-muted">
              Each object receives a score from 0–100 in five dimensions. The
              weights define how much each dimension contributes to the final
              editorial assessment.
            </p>
            <EditorialDisclosure className="mt-4" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
            {legacyDimensionKeys.map((key) => {
              const meta = legacyDimensionMeta[key];
              const Icon = dimensionIcons[key];
              return (
                <div key={key} className="border-t border-line/60 pt-4">
                  <div className="flex items-center gap-2">
                    <Icon className="size-3.5 text-teal" />
                    <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-silver">
                      {meta.label}
                    </span>
                    <span className="ml-auto font-mono text-[8px] text-gold">
                      {defaultLegacyWeights[key]}%
                    </span>
                  </div>
                  <p className="mt-2 text-[10px] leading-5 text-muted">
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

function ScoreRing({
  score,
  size = "default",
}: {
  score: number;
  size?: "default" | "small";
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center",
        size === "small" ? "size-20" : "size-28",
      )}
    >
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#1b3542"
          strokeWidth="3"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e4b44c"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute text-center">
        <p
          className={cn(
            "font-mono leading-none text-gold",
            size === "small" ? "text-2xl" : "text-3xl",
          )}
        >
          {score}
        </p>
        <p className="mt-1 font-mono text-[6px] uppercase tracking-[0.12em] text-muted">
          editorial
        </p>
      </div>
    </div>
  );
}
