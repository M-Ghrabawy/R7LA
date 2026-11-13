"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Search,
  ShieldCheck,
  TriangleAlert,
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
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return evidence.filter((entry) => {
      const matchesStatus = status === "all" || entry.status === status;
      const matchesDestination =
        destination === "all" || entry.destination === destination;
      const matchesQuery =
        !normalized ||
        [entry.assertion, entry.relicName, entry.mission, entry.category]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return matchesStatus && matchesDestination && matchesQuery;
    });
  }, [destination, evidence, query, status]);

  const counts = {
    verified: evidence.filter((entry) => entry.status === "verified").length,
    interpretation: evidence.filter(
      (entry) => entry.status === "interpretation",
    ).length,
    hypothetical: evidence.filter(
      (entry) => entry.status === "hypothetical",
    ).length,
  };

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-8 md:py-16">
      <div className="flex flex-col gap-6 border-b border-line/70 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-[9px] text-gold">04</span>
            <span className="h-px w-8 bg-line-bright" />
            <span className="technical-label">Evidence chain / claim ledger</span>
          </div>
          <h1 className="max-w-4xl text-balance text-4xl font-medium leading-[0.95] tracking-[-0.05em] text-white md:text-7xl">
            What can we
            <span className="text-gold"> actually prove?</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
            Every important claim in the archive is indexed by type and source.
            Mission records, scientific interpretations, and hypothetical
            scenarios are not presented as interchangeable.
          </p>
        </div>
        <div className="grid grid-cols-3 border border-line/70">
          <CountStat value={counts.verified} label="Verified" />
          <CountStat value={counts.interpretation} label="Interpretation" />
          <CountStat value={counts.hypothetical} label="Hypothetical" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="border border-line/70 bg-panel/25 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-1">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setStatus(filter.value)}
                    className={cn(
                      "border px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] transition-colors",
                      status === filter.value
                        ? filter.value === "interpretation"
                          ? "border-gold bg-gold/10 text-gold"
                          : filter.value === "hypothetical"
                            ? "border-purple-300/40 bg-purple-300/5 text-purple-200"
                            : "border-teal bg-teal/10 text-teal-bright"
                        : "border-line text-muted hover:text-silver",
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
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
                <label className="relative block">
                  <span className="sr-only">Search claims</span>
                  <Search className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-muted" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search claims"
                    className="h-9 w-40 border border-line bg-void/50 pl-8 pr-2 font-mono text-[9px] text-silver placeholder:text-muted/60 focus:border-teal focus:outline-none"
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
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line/50 pt-3">
              <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
                {filtered.length} claims in view
              </p>
              <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted/60">
                Evidence categories: record · scientific · historical · engineering
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {filtered.map((entry, index) => (
              <article
                key={`${entry.relicId}-${entry.id}`}
                className={cn(
                  "border p-4 md:p-5",
                  entry.status === "interpretation"
                    ? "border-gold/25 bg-gold/[0.02]"
                    : entry.status === "hypothetical"
                      ? "border-purple-300/20 bg-purple-300/[0.02]"
                      : "border-line/70 bg-panel/20",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[8px] text-muted">
                      E-{String(index + 1).padStart(3, "0")}
                    </span>
                    <VerificationBadge status={entry.status} />
                    <span className="border border-line/60 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                      {entry.category}
                    </span>
                  </div>
                  <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                    {entry.destination} / {entry.mission}
                  </span>
                </div>
                <p className="mt-4 max-w-4xl text-sm leading-7 text-silver/90">
                  {entry.assertion}
                </p>
                {entry.note && (
                  <p className="mt-2 max-w-3xl border-l border-gold/40 pl-3 text-[11px] leading-5 text-muted">
                    {entry.note}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line/40 pt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {entry.sources.map((source, sourceIndex) => (
                      <a
                        key={source.id}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex max-w-full items-center gap-1.5 border border-line/60 bg-void/30 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-teal/50 hover:text-silver"
                        title={`${source.title} — ${source.organization}`}
                      >
                        <span className="text-gold">[{sourceIndex + 1}]</span>
                        <span className="max-w-[220px] truncate">
                          {source.title}
                        </span>
                        <ArrowUpRight className="size-2.5 shrink-0 opacity-50 group-hover:opacity-100" />
                      </a>
                    ))}
                  </div>
                  <Link
                    href={`/relics/${entry.relicId}`}
                    className="inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-gold transition-colors hover:text-white"
                  >
                    {entry.relicName}
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="border border-line/60 p-10 text-center">
                <BookOpenCheck className="mx-auto size-5 text-muted/50" />
                <p className="mt-3 text-sm text-muted">
                  No claims match this view.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="border border-line/70 bg-panel/25 p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-gold">
              Verification states
            </p>
            <div className="mt-4 space-y-4">
              <Legend
                icon={<ShieldCheck />}
                label="Verified record"
                text="Directly supported by a cited mission, technical, or historical source."
              />
              <Legend
                icon={<TriangleAlert />}
                label="Scientific interpretation"
                text="A conclusion drawn from evidence. The archive labels it rather than presenting it as a raw observation."
              />
              <Legend
                icon={<span className="font-mono">?</span>}
                label="Hypothetical scenario"
                text="A counterfactual or future possibility. Not an observed capability or approved plan."
              />
            </div>
          </div>

          <div className="border border-line/70 bg-panel/20 p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-teal-bright">
              Source policy
            </p>
            <p className="mt-3 text-[11px] leading-5 text-muted">
              Citations resolve to NASA mission pages, NSSDCA records,
              coordinate references, the Apollo Lunar Surface Journal, NASA
              laser-ranging material, or the NASA Image and Video Library.
              Editorial scores are not evidence claims.
            </p>
            <p className="mt-3 border-t border-line/50 pt-3 font-mono text-[7px] uppercase leading-4 tracking-[0.1em] text-muted/60">
              No citation is generated by an LLM. AI answers cite this same
              registry.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CountStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="border-r border-line/60 px-4 py-3 last:border-r-0">
      <p className="font-mono text-xl text-silver">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.11em] text-muted">
        {label}
      </p>
    </div>
  );
}

function Legend({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center border border-line text-teal [&_svg]:size-3">
        {icon}
      </span>
      <div>
        <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-silver">
          {label}
        </p>
        <p className="mt-1 text-[11px] leading-5 text-muted">{text}</p>
      </div>
    </div>
  );
}
