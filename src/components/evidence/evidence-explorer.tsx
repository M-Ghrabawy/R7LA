"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  Database,
  ExternalLink,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import type { Destination, Verification } from "@/lib/schema";
import { VerificationBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

type EvidenceRecord = {
  id: string;
  assertion: string;
  status: Verification;
  category: string;
  note?: string;
  relicId: string;
  relicName: string;
  mission: string;
  destination: Destination;
  sources: Array<{
    id: string;
    title: string;
    organization: string;
    url: string;
    category: string;
  }>;
};

const statusMeta: Record<
  Verification,
  { label: string; short: string; description: string; color: string }
> = {
  verified: {
    label: "Verified record",
    short: "VER",
    description:
      "Directly supported by a cited mission, technical, historical, or coordinate source.",
    color: "bg-teal-bright",
  },
  interpretation: {
    label: "Scientific interpretation",
    short: "INT",
    description:
      "A conclusion drawn from evidence. It is labeled rather than presented as a raw observation.",
    color: "bg-gold",
  },
  hypothetical: {
    label: "Hypothetical scenario",
    short: "HYP",
    description:
      "A counterfactual or future possibility, not an observed capability or approved plan.",
    color: "bg-[#c9a0dc]",
  },
};

const filters: Array<{ value: "all" | Verification; label: string }> = [
  { value: "all", label: "All claims" },
  { value: "verified", label: "Verified" },
  { value: "interpretation", label: "Interpretation" },
  { value: "hypothetical", label: "Hypothetical" },
];

export function EvidenceExplorer({
  evidence,
}: {
  evidence: EvidenceRecord[];
}) {
  const [status, setStatus] = useState<"all" | Verification>("all");
  const [destination, setDestination] = useState<"all" | Destination>("all");
  const [mission, setMission] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const missions = useMemo(
    () => [...new Set(evidence.map((entry) => entry.mission))].sort(),
    [evidence],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return evidence.filter((entry) => {
      const matchesStatus = status === "all" || entry.status === status;
      const matchesDestination =
        destination === "all" || entry.destination === destination;
      const matchesMission = mission === "all" || entry.mission === mission;
      const matchesQuery =
        !normalized ||
        [entry.assertion, entry.relicName, entry.mission, entry.category]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return (
        matchesStatus &&
        matchesDestination &&
        matchesMission &&
        matchesQuery
      );
    });
  }, [destination, evidence, mission, query, status]);

  const selected =
    filtered.find((entry) => entry.id === selectedId) ??
    filtered[0] ??
    null;

  const counts = {
    verified: evidence.filter((entry) => entry.status === "verified").length,
    interpretation: evidence.filter(
      (entry) => entry.status === "interpretation",
    ).length,
    hypothetical: evidence.filter(
      (entry) => entry.status === "hypothetical",
    ).length,
  };
  const sourceCount = new Set(
    evidence.flatMap((entry) => entry.sources.map((source) => source.id)),
  ).size;
  const hasFilters = Boolean(
    destination !== "all" || mission !== "all" || query || status !== "all",
  );

  const reset = () => {
    setStatus("all");
    setDestination("all");
    setMission("all");
    setQuery("");
    setSelectedId(null);
  };

  const moveSelection = (direction: -1 | 1) => {
    if (!selected) return;
    const index = filtered.findIndex((entry) => entry.id === selected.id);
    const next = filtered[(index + direction + filtered.length) % filtered.length];
    if (next) setSelectedId(next.id);
  };

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-8 md:py-16">
      <header className="relative overflow-hidden border-b border-line/70 pb-8">
        <div className="pointer-events-none absolute -right-10 top-0 select-none font-mono text-[clamp(4rem,12vw,11rem)] leading-none tracking-[-0.08em] text-white/[0.025]">
          EVIDENCE
        </div>
        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-[9px] text-gold">04</span>
              <span className="h-px w-8 bg-line-bright" />
              <span className="technical-label">
                Evidence chain / claim ledger
              </span>
            </div>
            <h1 className="max-w-4xl text-balance text-[clamp(2.8rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.055em] text-white">
              Proof, with
              <span className="text-gold"> provenance.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
              Every important claim in the archive is indexed by type and source.
              Mission records, scientific interpretations, and hypothetical
              scenarios are never presented as interchangeable.
            </p>
          </div>
          <div className="lg:col-span-4">
            <div className="border border-line/70 bg-panel/25 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted">
                  Evidence composition
                </span>
                <span className="font-mono text-[8px] text-silver">
                  {evidence.length} claims
                </span>
              </div>
              <div className="mt-3 flex h-2 overflow-hidden bg-line/50">
                <div
                  className="bg-teal-bright"
                  style={{
                    width: `${(counts.verified / evidence.length) * 100}%`,
                  }}
                />
                <div
                  className="bg-gold"
                  style={{
                    width: `${(counts.interpretation / evidence.length) * 100}%`,
                  }}
                />
                <div
                  className="bg-[#c9a0dc]"
                  style={{
                    width: `${(counts.hypothetical / evidence.length) * 100}%`,
                  }}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["verified", "interpretation", "hypothetical"] as const).map(
                  (key) => (
                    <div key={key}>
                      <p className="font-mono text-lg text-silver">
                        {String(counts[key]).padStart(2, "0")}
                      </p>
                      <p className="font-mono text-[6px] uppercase tracking-[0.1em] text-muted">
                        {statusMeta[key].short}
                      </p>
                    </div>
                  ),
                )}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line/50 pt-2">
                <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                  Unique sources
                </span>
                <span className="font-mono text-[9px] text-gold">
                  {String(sourceCount).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div>
          <section className="border border-line/70 bg-panel/25 p-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-1">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setStatus(filter.value)}
                    className={cn(
                      "border px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] transition-colors",
                      status === filter.value
                        ? filter.value === "verified"
                          ? "border-teal bg-teal/10 text-teal-bright"
                          : filter.value === "interpretation"
                            ? "border-gold bg-gold/10 text-gold"
                            : filter.value === "hypothetical"
                              ? "border-[#c9a0dc]/40 bg-[#c9a0dc]/5 text-[#d7b7e6]"
                              : "border-silver/40 bg-silver/5 text-white"
                        : "border-line text-muted hover:border-line-bright hover:text-silver",
                    )}
                  >
                    {filter.label}
                    <span className="ml-2 text-[7px] opacity-60">
                      {filter.value === "all"
                        ? evidence.length
                        : counts[filter.value]}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={destination}
                  onChange={(event) =>
                    setDestination(event.target.value as "all" | Destination)
                  }
                  className="h-9 border border-line bg-void/50 px-2 font-mono text-[8px] uppercase tracking-[0.1em] text-silver focus:border-teal focus:outline-none"
                  aria-label="Filter by destination"
                >
                  <option value="all">Both worlds</option>
                  <option value="Moon">Moon</option>
                  <option value="Mars">Mars</option>
                </select>
                <select
                  value={mission}
                  onChange={(event) => setMission(event.target.value)}
                  className="h-9 max-w-[190px] border border-line bg-void/50 px-2 font-mono text-[8px] uppercase tracking-[0.1em] text-silver focus:border-teal focus:outline-none"
                  aria-label="Filter by mission"
                >
                  <option value="all">All missions</option>
                  {missions.map((missionName) => (
                    <option key={missionName} value={missionName}>
                      {missionName}
                    </option>
                  ))}
                </select>
                <label className="relative min-w-[190px] flex-1">
                  <span className="sr-only">Search claims</span>
                  <Search className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-muted" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search claims, missions, objects"
                    className="h-9 w-full border border-line bg-void/50 pl-8 pr-8 font-mono text-[9px] text-silver placeholder:text-muted/60 focus:border-teal focus:outline-none"
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
              <div className="flex items-center justify-between border-t border-line/50 pt-2">
                <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
                  {filtered.length} claims in view
                </p>
                {hasFilters && (
                  <button
                    onClick={reset}
                    className="font-mono text-[7px] uppercase tracking-[0.1em] text-gold hover:text-white"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </section>

          <div className="mt-4 space-y-2">
            {filtered.map((entry, index) => {
              const active = selected?.id === entry.id;
              return (
                <button
                  key={`${entry.relicId}-${entry.id}`}
                  onClick={() => setSelectedId(entry.id)}
                  className={cn(
                    "group grid w-full grid-cols-[42px_minmax(0,1fr)_auto] items-start gap-3 border px-3 py-3 text-left transition-colors md:grid-cols-[52px_minmax(0,1fr)_130px] md:px-4",
                    active
                      ? "border-gold/50 bg-gold/[0.045]"
                      : "border-line/60 bg-panel/15 hover:border-line-bright hover:bg-white/[0.018]",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[8px]",
                      active ? "text-gold" : "text-muted/60",
                    )}
                  >
                    E-{String(index + 1).padStart(3, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <VerificationBadge status={entry.status} />
                      <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                        {entry.mission} / {entry.destination}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "mt-1.5 line-clamp-2 block text-sm leading-6",
                        active
                          ? "text-white"
                          : "text-silver/80 group-hover:text-white",
                      )}
                    >
                      {entry.assertion}
                    </span>
                  </span>
                  <span className="hidden items-center justify-end gap-2 pt-0.5 font-mono text-[7px] uppercase tracking-[0.08em] text-muted md:flex">
                    {entry.sources.length} src
                    <ArrowRight className="size-3 text-muted/50 group-hover:text-gold" />
                  </span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="border border-line/60 p-10 text-center">
                <BookOpenCheck className="mx-auto size-5 text-muted/50" />
                <p className="mt-3 text-sm text-muted">
                  No claims match this view.
                </p>
                <button
                  onClick={reset}
                  className="mt-3 font-mono text-[8px] uppercase tracking-[0.12em] text-gold"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-4">
            {selected ? (
              <ClaimDetail
                entry={selected}
                onPrevious={() => moveSelection(-1)}
                onNext={() => moveSelection(1)}
              />
            ) : (
              <div className="border border-line/60 p-6 font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
                Select a claim to inspect its evidence.
              </div>
            )}
            <EvidenceStandard />
          </div>
        </aside>
      </div>

      <div className="mt-6 xl:hidden">
        {selected && <ClaimDetail entry={selected} mobile />}
      </div>

      <section className="mt-16 border-t border-line/60 pt-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-gold" />
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-gold">
                Evidence standard
              </p>
            </div>
            <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em] text-white">
              A claim is only as strong as its source.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3 lg:col-span-8">
            {(["verified", "interpretation", "hypothetical"] as const).map(
              (key) => (
                <div key={key} className="border-t border-line/60 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-silver">
                      {statusMeta[key].label}
                    </span>
                    <span
                      className={cn("size-1.5 rounded-full", statusMeta[key].color)}
                    />
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-muted">
                    {statusMeta[key].description}
                  </p>
                  <p className="mt-3 font-mono text-lg text-silver">
                    {String(counts[key]).padStart(2, "0")}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ClaimDetail({
  entry,
  mobile = false,
  onPrevious,
  onNext,
}: {
  entry: EvidenceRecord;
  mobile?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  const askQuestion = `Explain the evidence for this claim: ${entry.assertion}`;
  return (
    <div
      className={cn(
        "border border-line/80 bg-[linear-gradient(145deg,rgba(13,34,49,.82),rgba(7,19,31,.94))]",
        mobile ? "p-4" : "p-5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Database className="size-3.5 text-gold" />
          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-gold">
            Claim inspector
          </p>
        </div>
        <VerificationBadge status={entry.status} />
      </div>
      <p className="mt-4 font-mono text-[7px] uppercase tracking-[0.12em] text-muted">
        {entry.mission} / {entry.destination} / {entry.category}
      </p>
      <h3 className="mt-2 text-lg font-medium leading-7 tracking-[-0.02em] text-white">
        {entry.assertion}
      </h3>
      {entry.note && (
        <p className="mt-3 border-l border-gold/40 pl-3 text-[11px] leading-5 text-muted">
          {entry.note}
        </p>
      )}
      <div className="mt-4 border-t border-line/50 pt-3">
        <p className="font-mono text-[7px] uppercase tracking-[0.12em] text-muted">
          Supporting records / {entry.sources.length}
        </p>
        <div className="mt-2 space-y-2">
          {entry.sources.map((source, index) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2 border border-line/60 bg-void/20 p-2.5 transition-colors hover:border-teal/40"
            >
              <span className="font-mono text-[7px] text-gold">
                [{index + 1}]
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] leading-5 text-silver/85 group-hover:text-white">
                  {source.title}
                </span>
                <span className="mt-0.5 block font-mono text-[6px] uppercase tracking-[0.1em] text-muted">
                  {source.organization} / {source.category}
                </span>
              </span>
              <ExternalLink className="mt-0.5 size-3 shrink-0 text-muted group-hover:text-gold" />
            </a>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-2">
        <Link
          href={`/relics/${entry.relicId}`}
          className="flex items-center justify-between border border-gold/50 bg-gold/[0.06] px-3 py-2.5 font-mono text-[8px] uppercase tracking-[0.12em] text-gold transition-colors hover:border-gold hover:bg-gold/10"
        >
          Open {entry.relicName}
          <ArrowRight className="size-3" />
        </Link>
        <Link
          href={`/archaeologist?relic=${entry.relicId}&q=${encodeURIComponent(askQuestion)}`}
          className="flex items-center justify-between border border-line px-3 py-2.5 font-mono text-[7px] uppercase tracking-[0.1em] text-muted transition-colors hover:border-teal/40 hover:text-teal-bright"
        >
          Ask REX about this claim
          <ArrowUpRight className="size-3" />
        </Link>
      </div>
      {!mobile && (
        <div className="mt-3 flex items-center justify-between border-t border-line/50 pt-3">
          <button
            onClick={onPrevious}
            className="flex items-center gap-1 font-mono text-[7px] uppercase tracking-[0.1em] text-muted hover:text-gold"
          >
            <ChevronLeft className="size-3" /> Previous
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-1 font-mono text-[7px] uppercase tracking-[0.1em] text-muted hover:text-gold"
          >
            Next <ChevronRight className="size-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function EvidenceStandard() {
  return (
    <div className="border border-line/70 bg-panel/20 p-4">
      <div className="flex items-center gap-2">
        <BookOpenCheck className="size-3.5 text-teal" />
        <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-silver">
          Verification states
        </p>
      </div>
      <div className="mt-3 space-y-3">
        {(["verified", "interpretation", "hypothetical"] as const).map(
          (key) => (
            <div key={key} className="flex gap-2.5">
              <span
                className={cn(
                  "mt-1 size-1.5 shrink-0 rounded-full",
                  statusMeta[key].color,
                )}
              />
              <div>
                <p className="font-mono text-[7px] uppercase tracking-[0.1em] text-silver">
                  {statusMeta[key].label}
                </p>
                <p className="mt-0.5 text-[10px] leading-4 text-muted">
                  {statusMeta[key].description}
                </p>
              </div>
            </div>
          ),
        )}
      </div>
      <p className="mt-3 border-t border-line/50 pt-3 font-mono text-[7px] uppercase leading-4 tracking-[0.1em] text-muted/60">
        No citation is generated by an LLM. AI answers use this same registry.
      </p>
    </div>
  );
}
