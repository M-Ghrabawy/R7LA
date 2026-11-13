"use client";

import Link from "next/link";
import { useSyncExternalStore, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  ExternalLink,
  Radio,
  Trash2,
} from "lucide-react";
import { sourceMap } from "@/data/sources";
import {
  clearJournal,
  emptyJournal,
  getJournalSnapshot,
  subscribeJournal,
} from "@/lib/story/journal";
import { cn } from "@/lib/utils";
import { RexHead } from "@/components/rex/rex-character";

const kindLabel = {
  chapter: "Chapter record",
  study: "Field study",
  discovery: "Discovery log",
} as const;

export function JournalView() {
  const entries = useSyncExternalStore(
    subscribeJournal,
    getJournalSnapshot,
    () => emptyJournal,
  );
  const [filter, setFilter] = useState<"all" | keyof typeof kindLabel>("all");

  const filtered =
    filter === "all"
      ? entries
      : entries.filter((entry) => entry.kind === filter);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 md:px-8 md:py-16">
      <div className="flex flex-col gap-6 border-b border-line/70 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-[9px] text-gold">REX</span>
            <span className="h-px w-8 bg-line-bright" />
            <span className="technical-label">
              Field journal / local archive
            </span>
          </div>
          <h1 className="max-w-4xl text-balance text-4xl font-medium leading-[0.94] tracking-[-0.05em] text-white md:text-7xl">
            REX&apos;s field
            <span className="text-teal-bright"> journal.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
            A persistent record of completed scenes and verified interactions.
            Entries are stored locally in this browser and link back to the
            archive sources.
          </p>
        </div>
        <div className="flex items-end gap-4">
          <div className="border border-line/70 bg-panel/25 px-5 py-3 text-right">
            <p className="font-mono text-3xl text-silver">
              {String(entries.length).padStart(2, "0")}
            </p>
            <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
              journal entries
            </p>
          </div>
          <RexHead className="h-16 w-20" expression="content" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {(["all", "chapter", "study", "discovery"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={cn(
                "border px-3 py-2 font-mono text-[8px] uppercase tracking-[0.1em] transition-colors",
                filter === item
                  ? "border-teal bg-teal/10 text-teal-bright"
                  : "border-line text-muted hover:text-silver",
              )}
            >
              {item === "all" ? "All entries" : kindLabel[item]}
              <span className="ml-2 text-[6px] opacity-60">
                {item === "all"
                  ? entries.length
                  : entries.filter((entry) => entry.kind === item).length}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/rex"
            className="inline-flex items-center gap-1.5 border border-line px-3 py-2 font-mono text-[7px] uppercase tracking-[0.1em] text-muted hover:text-gold"
          >
            Expedition hub
            <ArrowRight className="size-3" />
          </Link>
          {entries.length > 0 && (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Erase all locally stored REX journal entries? This cannot be undone.",
                  )
                ) {
                  clearJournal();
                }
              }}
              className="inline-flex items-center gap-1.5 border border-line px-3 py-2 font-mono text-[7px] uppercase tracking-[0.1em] text-muted hover:border-[#c9867c]/50 hover:text-[#dba197]"
            >
              <Trash2 className="size-3" />
              Clear local journal
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center border border-line/60 bg-panel/15 px-6 py-16 text-center">
          <BookOpenCheck className="size-7 text-muted/50" />
          <h2 className="mt-4 text-2xl font-medium text-white">
            The journal is still empty.
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted">
            Complete a REX chapter, field study, or interaction to record a
            source-linked discovery here.
          </p>
          <Link
            href="/rex"
            className="mt-6 inline-flex items-center gap-2 border border-gold bg-gold px-5 py-3 font-mono text-[8px] uppercase tracking-[0.12em] text-abyss"
          >
            Begin an expedition
            <ArrowRight className="size-3" />
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {filtered.map((entry) => {
            const sources = entry.sourceIds
              .map((id) => sourceMap.get(id))
              .filter(
                (source): source is NonNullable<typeof source> => Boolean(source),
              )
              .slice(0, 4);
            return (
              <article
                key={entry.id}
                className="border border-line/70 bg-panel/20 p-4 md:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.12em] text-gold">
                    <Radio className="size-3" />
                    {kindLabel[entry.kind]}
                  </span>
                  <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                    {new Date(entry.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-medium leading-6 text-white">
                  {entry.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-xs leading-6 text-muted">
                  {entry.body}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line/40 pt-3">
                  {sources.map((source) => (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 border border-line/50 px-2 py-1.5 font-mono text-[6px] uppercase tracking-[0.08em] text-muted hover:text-silver"
                    >
                      {source.organization}
                      <ExternalLink className="size-2.5" />
                    </a>
                  ))}
                </div>
                {entry.relicId && (
                  <Link
                    href={`/relics/${entry.relicId}`}
                    className="mt-3 inline-flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.1em] text-teal-bright hover:text-gold"
                  >
                    Open artifact record
                    <ArrowUpRight className="size-3" />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
