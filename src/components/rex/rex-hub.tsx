"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDot,
  Headphones,
  LockKeyhole,
  Map,
  NotebookPen,
  Volume2,
} from "lucide-react";
import {
  emptyProgress,
  getProgressSnapshot,
  subscribeProgress,
} from "@/lib/story/progress";
import {
  emptyJournal,
  getJournalSnapshot,
  subscribeJournal,
} from "@/lib/story/journal";
import { cn } from "@/lib/utils";
import { RexCharacter, RexHead } from "@/components/rex/rex-character";

type ChapterSummary = {
  slug: string;
  order: number;
  title: string;
  subtitle: string;
  summary: string;
  scenes: number;
};

type StudySummary = {
  slug: string;
  relicId: string;
  title: string;
  subtitle: string;
  scenes: number;
  destination: "Moon" | "Mars";
  image: string;
  imageAlt: string;
  status: string;
};

export function RexHub({
  chapters,
  studies,
}: {
  chapters: ChapterSummary[];
  studies: StudySummary[];
}) {
  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    () => emptyProgress,
  );
  const journal = useSyncExternalStore(
    subscribeJournal,
    getJournalSnapshot,
    () => emptyJournal,
  );
  const [world, setWorld] = useState<"all" | "Moon" | "Mars">("all");

  const filteredStudies = useMemo(
    () =>
      studies.filter(
        (study) => world === "all" || study.destination === world,
      ),
    [studies, world],
  );

  const nextChapter =
    chapters.find(
      (chapter) => !progress.chapters.includes(chapter.slug),
    ) ?? chapters[0];

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-8 md:px-8 md:py-12">
      <section className="grain relative overflow-hidden border border-line/70 bg-[radial-gradient(ellipse_at_70%_40%,rgba(11,122,143,.16),transparent_58%),linear-gradient(120deg,#06111b,#07131f_55%,#0a1b27)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(43,82,98,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(43,82,98,.12)_1px,transparent_1px)] bg-[size:42px_42px] opacity-40" />
        <div className="relative grid gap-8 p-6 md:grid-cols-12 md:p-10 lg:p-14">
          <div className="md:col-span-7 lg:col-span-8">
            <div className="flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.18em] text-teal-bright">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal-bright opacity-40" />
                <span className="relative inline-flex size-2 rounded-full bg-teal-bright" />
              </span>
              REX online / archaeological explorer
            </div>
            <h1 className="mt-6 text-balance text-[clamp(3rem,7vw,7rem)] font-medium leading-[0.9] tracking-[-0.06em] text-white">
              The REX
              <br />
              <span className="text-gold">Expedition.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-silver/70 md:text-base md:leading-8">
              Humanity has left thousands of objects across the Solar System.
              Some were designed to last decades. Others worked for only a few
              days. REX is here to find what remains, understand why it was left
              behind, and preserve the record.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/rex/chapter/${nextChapter.slug}`}
                className="group inline-flex items-center gap-3 border border-gold bg-gold px-5 py-3.5 font-mono text-[9px] uppercase tracking-[0.14em] text-abyss transition-colors hover:bg-[#f2c76a]"
              >
                {progress.chapters.length > 0 ? "Continue expedition" : "Begin expedition"}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 border border-line-bright px-5 py-3.5 font-mono text-[9px] uppercase tracking-[0.14em] text-silver transition-colors hover:border-teal hover:text-teal-bright"
              >
                <Map className="size-3.5" />
                Open the archive
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 border-t border-line/60 pt-4 font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
              <span className="flex items-center gap-1.5">
                <Headphones className="size-3 text-gold" />
                Scene ambience + interaction cues
              </span>
              <span className="flex items-center gap-1.5">
                <Volume2 className="size-3 text-teal" />
                Audio activates on your first choice
              </span>
            </div>
          </div>

          <div className="relative flex items-end justify-center md:col-span-5 lg:col-span-4">
            <div className="absolute inset-8 rounded-full border border-teal/15" />
            <div className="absolute inset-14 rounded-full border border-dashed border-line-bright/50" />
            <RexCharacter
              pose="idle"
              expression="curious"
              className="relative h-[300px] w-auto animate-[drift_9s_ease-in-out_infinite] md:h-[390px]"
              glow
            />
            <div className="absolute bottom-2 left-0 border border-line/60 bg-abyss/70 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.14em] text-muted">
              REX / autonomous field unit
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-col gap-3 border-t border-line/60 pt-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-gold">
              01 / Five chapters
            </p>
            <h2 className="mt-2 text-3xl font-medium tracking-[-0.04em] text-white md:text-5xl">
              Follow the signal.
            </h2>
          </div>
          <p className="max-w-md text-xs leading-6 text-muted">
            The expedition moves from REX&apos;s first briefing to the lunar
            surface, Mars, the evidence audit, and a final message for future
            explorers.
          </p>
        </div>

        <div className="mt-6 grid gap-2">
          {chapters.map((chapter) => {
            const complete = progress.chapters.includes(chapter.slug);
            const isNext = nextChapter.slug === chapter.slug;
            return (
              <Link
                key={chapter.slug}
                href={`/rex/chapter/${chapter.slug}`}
                className={cn(
                  "group grid gap-4 border p-4 transition-colors md:grid-cols-[90px_1fr_180px] md:items-center md:p-5",
                  complete
                    ? "border-teal/30 bg-teal/[0.035]"
                    : isNext
                      ? "border-gold/40 bg-gold/[0.025]"
                      : "border-line/60 bg-panel/20 hover:border-line-bright",
                )}
              >
                <div className="flex items-center gap-3 md:flex-col md:items-start">
                  <span className="font-mono text-3xl text-gold/80">
                    {String(chapter.order).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[7px] uppercase tracking-[0.12em] text-muted">
                    {chapter.scenes} scenes
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-medium tracking-[-0.02em] text-white">
                      {chapter.title}
                    </h3>
                    {complete && (
                      <span className="inline-flex items-center gap-1 border border-teal/30 px-1.5 py-1 font-mono text-[7px] uppercase tracking-[0.1em] text-teal-bright">
                        <Check className="size-2.5" /> Complete
                      </span>
                    )}
                    {isNext && !complete && (
                      <span className="inline-flex items-center gap-1 border border-gold/30 px-1.5 py-1 font-mono text-[7px] uppercase tracking-[0.1em] text-gold">
                        <CircleDot className="size-2.5" /> Next
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
                    {chapter.subtitle}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    {chapter.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 md:justify-end">
                  <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-gold">
                    {complete ? "Replay" : "Enter"}
                  </span>
                  <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-12 border border-teal/25 bg-teal/[0.025] p-5 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <RexHead className="h-14 w-16 shrink-0" expression="content" />
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-teal-bright">
                REX field journal / {journal.length} entries
              </p>
              <h2 className="mt-2 text-xl font-medium tracking-[-0.03em] text-white md:text-2xl">
                Discoveries now leave a trace.
              </h2>
              <p className="mt-2 max-w-xl text-xs leading-5 text-muted">
                Completed interactions and expeditions are recorded locally with
                their source references, then linked back into the archive.
              </p>
            </div>
          </div>
          <Link
            href="/rex/journal"
            className="inline-flex shrink-0 items-center gap-2 border border-gold/50 bg-gold/[0.06] px-4 py-3 font-mono text-[8px] uppercase tracking-[0.12em] text-gold transition-colors hover:border-gold hover:bg-gold/10"
          >
            <NotebookPen className="size-3.5" />
            Open field journal
          </Link>
        </div>
        {journal.length > 0 && (
          <div className="mt-4 grid gap-1.5 border-t border-teal/20 pt-4 md:grid-cols-3">
            {journal.slice(0, 3).map((entry) => (
              <Link
                key={entry.id}
                href="/rex/journal"
                className="group border border-line/50 bg-void/20 p-3"
              >
                <p className="font-mono text-[6px] uppercase tracking-[0.12em] text-muted">
                  {entry.kind} /{" "}
                  {new Date(entry.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-silver/80 group-hover:text-white">
                  {entry.title}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14">
        <div className="flex flex-col gap-4 border-t border-line/60 pt-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-gold">
              02 / Field studies
            </p>
            <h2 className="mt-2 text-3xl font-medium tracking-[-0.04em] text-white md:text-5xl">
              Any relic. A closer look.
            </h2>
            <p className="mt-3 max-w-xl text-xs leading-6 text-muted">
              REX can visit every artifact in the archive. Each field study uses
              the same scene system, character, and evidence rules.
            </p>
          </div>
          <div className="flex gap-1">
            {(["all", "Moon", "Mars"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setWorld(item)}
                className={cn(
                  "border px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em]",
                  world === item
                    ? "border-teal bg-teal/10 text-teal-bright"
                    : "border-line text-muted hover:text-silver",
                )}
              >
                {item === "all" ? "Both worlds" : item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filteredStudies.map((study) => {
            const complete = progress.studies.includes(study.slug);
            return (
              <Link
                key={study.slug}
                href={`/rex/relic/${study.relicId}`}
                className="group border border-line/60 bg-panel/20 transition-colors hover:border-teal/50"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-void">
                  {study.image && (
                    <Image
                      src={study.image}
                      alt={study.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover opacity-65 grayscale-[18%] transition duration-700 group-hover:scale-[1.03] group-hover:opacity-85"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-transparent to-transparent" />
                  <span className="absolute left-2 top-2 border border-line/60 bg-abyss/80 px-1.5 py-1 font-mono text-[6px] uppercase tracking-[0.1em] text-gold">
                    {study.destination}
                  </span>
                  {complete && (
                    <span className="absolute right-2 top-2 flex items-center gap-1 border border-teal/40 bg-abyss/85 px-1.5 py-1 font-mono text-[6px] uppercase tracking-[0.1em] text-teal-bright">
                      <Check className="size-2.5" /> Logged
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-mono text-[7px] uppercase tracking-[0.12em] text-muted">
                    {study.subtitle}
                  </p>
                  <h3 className="mt-1 truncate text-sm font-medium text-white">
                    {study.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
                      {study.scenes} scenes
                    </span>
                    <ArrowUpRight className="size-3 text-muted group-hover:text-gold" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-14 border-t border-line/60 pt-6">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <RexHead className="h-14 w-16" expression="content" />
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-gold">
                  REX / character note
                </p>
                <p className="mt-1 text-sm text-silver">A fictional archive guide.</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-7">
            <p className="text-xs leading-6 text-muted">
              REX is an original AFTERLIGHT character and narrative device, not a
              NASA robot or mission record. Every factual scene statement cites
              the archive. Interaction puzzles are educational reconstructions,
              not recovered mission telemetry. Ambient sound and cues are
              synthesized in the browser; no external audio assets are used.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 font-mono text-[7px] uppercase tracking-[0.1em] text-muted/70">
              <span className="flex items-center gap-1.5">
                <LockKeyhole className="size-3" />
                Progress stored locally only
              </span>
              <span className="flex items-center gap-1.5">
                <Volume2 className="size-3" />
                Audio optional
              </span>
              <span className="flex items-center gap-1.5">
                <Map className="size-3" />
                Five chapters + {studies.length} field studies
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
