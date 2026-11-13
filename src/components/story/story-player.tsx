"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Radio,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { sourceMap } from "@/data/sources";
import { useRexAudio } from "@/lib/story/use-rex-audio";
import { markComplete } from "@/lib/story/progress";
import type { StoryScene } from "@/lib/story/schema";
import { cn } from "@/lib/utils";
import { RexCharacter, RexHead } from "@/components/rex/rex-character";
import { RexStage } from "@/components/rex/rex-stage";
import { PuzzlePanel } from "./puzzles";

export function StoryPlayer({
  progressId,
  progressKind,
  title,
  subtitle,
  objective,
  scenes,
  backHref,
  backLabel,
  nextHref,
  nextLabel,
  relicId,
}: {
  progressId: string;
  progressKind: "chapter" | "study";
  title: string;
  subtitle: string;
  objective: string;
  scenes: StoryScene[];
  backHref: string;
  backLabel: string;
  nextHref?: string;
  nextLabel?: string;
  relicId?: string;
}) {
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [foundHotspots, setFoundHotspots] = useState<string[]>([]);
  const [hotspotDetail, setHotspotDetail] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [audioPromptDismissed, setAudioPromptDismissed] = useState(false);

  const scene = scenes[index];
  const audio = useRexAudio(scene.audioTheme);
  const isCompleted = completed.includes(scene.id);
  const sceneDone = !scene.puzzle || isCompleted || puzzleSolved;

  const sceneSources = useMemo(
    () =>
      [...new Set(scene.sourceIds)]
        .map((id) => sourceMap.get(id))
        .filter((source): source is NonNullable<typeof source> => Boolean(source)),
    [scene.sourceIds],
  );

  const puzzleHotspots =
    scene.puzzle?.type === "hotspot" ? scene.puzzle.hotspots : undefined;
  const visibleFound =
    isCompleted && puzzleHotspots
      ? puzzleHotspots.map((hotspot) => hotspot.id)
      : foundHotspots;

  const resetScene = useCallback(() => {
    setPuzzleSolved(false);
    setFoundHotspots([]);
    setHotspotDetail(null);
  }, []);

  const solve = useCallback(() => {
    setPuzzleSolved(true);
  }, []);

  const finish = useCallback(() => {
    markComplete(progressKind, progressId);
    setFinished(true);
    audio.play("complete");
  }, [audio, progressId, progressKind]);

  const next = useCallback(() => {
    if (!sceneDone) return;
    audio.play("advance");
    if (index >= scenes.length - 1) {
      finish();
      return;
    }
    setCompleted((current) => [...new Set([...current, scene.id])]);
    resetScene();
    setIndex((current) => current + 1);
  }, [audio, finish, index, resetScene, scene.id, sceneDone, scenes.length]);

  const previous = useCallback(() => {
    if (index === 0) return;
    audio.play("click");
    resetScene();
    setIndex((current) => current - 1);
  }, [audio, index, resetScene]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, previous]);

  const inspectHotspot = (id: string) => {
    if (!scene.puzzle || scene.puzzle.type !== "hotspot") return;
    const hotspot = scene.puzzle.hotspots.find((item) => item.id === id);
    if (!hotspot) return;
    audio.play("reveal");
    setHotspotDetail(id);
    const nextFound = [...new Set([...foundHotspots, id])];
    setFoundHotspots(nextFound);
    if (nextFound.length >= scene.puzzle.required) {
      setPuzzleSolved(true);
      audio.play("success");
    }
  };

  if (finished) {
    return (
      <CompletionScreen
        title={title}
        scenes={scenes.length}
        backHref={backHref}
        backLabel={backLabel}
        nextHref={nextHref ?? "/rex"}
        nextLabel={nextLabel ?? "Return to expedition hub"}
        relicId={relicId}
      />
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-6 md:px-8 md:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.13em] text-muted transition-colors hover:text-gold"
        >
          <ArrowLeft className="size-3.5" />
          {backLabel}
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              const enabled = await audio.toggle();
              if (enabled) setAudioPromptDismissed(true);
            }}
            className={cn(
              "flex items-center gap-1.5 border px-2.5 py-2 font-mono text-[8px] uppercase tracking-[0.1em] transition-colors",
              audio.enabled
                ? "border-teal/40 bg-teal/10 text-teal-bright"
                : "border-line text-muted hover:text-gold",
            )}
            aria-pressed={audio.enabled}
          >
            {audio.enabled ? (
              <Volume2 className="size-3" />
            ) : (
              <VolumeX className="size-3" />
            )}
            {audio.enabled ? "Audio on" : "Enable audio"}
          </button>
          <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
            Scene {String(index + 1).padStart(2, "0")} /{" "}
            {String(scenes.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-gold">
            {subtitle}
          </p>
          <h1 className="mt-1 text-3xl font-medium tracking-[-0.04em] text-white md:text-5xl">
            {title}
          </h1>
        </div>
        <p className="max-w-md font-mono text-[8px] uppercase leading-5 tracking-[0.1em] text-muted">
          Objective / {objective}
        </p>
      </div>

      <div className="mt-5 h-px bg-line/60">
        <div
          className="h-px bg-gold transition-[width] duration-500"
          style={{ width: `${((index + 1) / scenes.length) * 100}%` }}
        />
      </div>

      {!audio.enabled && !audioPromptDismissed && (
        <div className="mt-4 flex flex-col gap-3 border border-teal/30 bg-teal/[0.04] p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <RexHead className="h-9 w-11" expression="curious" />
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-teal-bright">
                REX audio channel offline
              </p>
              <p className="mt-1 text-[11px] leading-5 text-muted">
                Each scene has its own ambient field recording. Interaction cues
                play only after you enable sound.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={async () => {
                const enabled = await audio.enable();
                setAudioPromptDismissed(true);
                if (!enabled) setAudioPromptDismissed(true);
              }}
              className="flex items-center gap-1.5 border border-gold bg-gold px-3 py-2 font-mono text-[8px] uppercase tracking-[0.1em] text-abyss"
            >
              <Volume2 className="size-3" /> Enable audio
            </button>
            <button
              onClick={() => {
                audio.disable();
                setAudioPromptDismissed(true);
              }}
              className="border border-line px-3 py-2 font-mono text-[8px] uppercase tracking-[0.1em] text-muted hover:text-silver"
            >
              Stay muted
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(360px,.75fr)]">
        <div>
          <RexStage
            background={scene.background}
            props={scene.props}
            rexPose={scene.rexPose}
            rexExpression={scene.rexExpression}
            sceneKey={scene.id}
            hotspots={puzzleHotspots?.map((hotspot) => ({
              id: hotspot.id,
              label: hotspot.label,
              x: hotspot.x,
              y: hotspot.y,
            }))}
            foundHotspots={visibleFound}
            onHotspot={inspectHotspot}
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="font-mono text-[7px] uppercase tracking-[0.12em] text-muted/60">
              Interpretive AFTERLIGHT animation · REX is a fictional archive guide
            </p>
            <p className="hidden font-mono text-[7px] uppercase tracking-[0.12em] text-muted/60 sm:block">
              ← → scene navigation
            </p>
          </div>
        </div>

        <aside className="flex min-h-[420px] flex-col border border-line/70 bg-panel/25">
          <div className="flex items-start gap-3 border-b border-line/60 p-4">
            <RexHead className="h-10 w-12 shrink-0" expression={scene.rexExpression} />
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-gold">
                REX / {scene.eyebrow}
              </p>
              <h2 className="mt-1 text-lg font-medium leading-tight tracking-[-0.02em] text-white">
                {scene.title}
              </h2>
            </div>
          </div>

          <div
            key={scene.id}
            className="flex-1 space-y-3 animate-[fade-up_.35s_ease-out_both] overflow-y-auto p-4"
          >
            {scene.dialogue.map((line, lineIndex) => (
              <p
                key={lineIndex}
                className={cn(
                  "text-[12px] leading-6",
                  lineIndex === scene.dialogue.length - 1
                    ? "border-l border-gold/40 pl-3 text-silver"
                    : "text-silver/75",
                )}
              >
                {line}
              </p>
            ))}

            {hotspotDetail && puzzleHotspots && (
              <div className="border border-teal/30 bg-teal/[0.04] p-3">
                <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-teal-bright">
                  Object identified
                </p>
                {(() => {
                  const hotspot = puzzleHotspots.find(
                    (item) => item.id === hotspotDetail,
                  );
                  if (!hotspot) return null;
                  return (
                    <>
                      <p className="mt-1 text-xs font-medium text-white">
                        {hotspot.label}
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-muted">
                        {hotspot.detail}
                      </p>
                    </>
                  );
                })()}
              </div>
            )}

            {scene.sourceIds.length > 0 && (
              <div className="border-t border-line/50 pt-3">
                <p className="font-mono text-[7px] uppercase tracking-[0.13em] text-muted">
                  Scene record
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {sceneSources.map((source) => (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex max-w-full items-center gap-1 border border-line/60 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-teal/50 hover:text-silver"
                      title={`${source.title} — ${source.organization}`}
                    >
                      <span className="max-w-[180px] truncate">
                        {source.organization}
                      </span>
                      <ExternalLink className="size-2.5 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {scene.artifactIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 border-t border-line/50 pt-3">
                {scene.artifactIds.slice(0, 4).map((id) => (
                  <Link
                    key={id}
                    href={`/relics/${id}`}
                    className="inline-flex items-center gap-1 border border-gold/25 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.08em] text-gold/80 transition-colors hover:border-gold hover:text-gold"
                  >
                    Inspect artifact
                    <ArrowUpRight className="size-2.5" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-line/60 p-4">
            {scene.puzzle && scene.puzzle.type !== "hotspot" && !sceneDone && (
              <PuzzlePanel
                puzzle={scene.puzzle}
                solved={puzzleSolved}
                onSolved={solve}
                play={audio.play}
                compact
              />
            )}
            {scene.puzzle?.type === "hotspot" && !sceneDone && (
              <div className="border border-line/70 bg-panel/30 p-3">
                <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-gold">
                  Site scan / {foundHotspots.length} of {scene.puzzle.required}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-muted">
                  {scene.puzzle.prompt}
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer font-mono text-[7px] uppercase tracking-[0.1em] text-muted hover:text-gold">
                    Request hint
                  </summary>
                  <p className="mt-2 border-l border-gold/40 pl-2 text-[10px] leading-5 text-muted">
                    {scene.puzzle.hint}
                  </p>
                </details>
              </div>
            )}
            {sceneDone && scene.puzzle && (
              <div className="flex items-center gap-2 border border-teal/30 bg-teal/[0.04] p-3 font-mono text-[8px] uppercase leading-5 tracking-[0.08em] text-teal-bright">
                <Check className="size-3.5" />
                Interaction verified. Scene record unlocked.
              </div>
            )}
            {!scene.puzzle && (
              <div className="flex items-center gap-2 border border-line/50 p-3 font-mono text-[8px] uppercase tracking-[0.08em] text-muted">
                <Radio className="size-3.5 text-teal" />
                Archive scene ready
              </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                onClick={previous}
                disabled={index === 0}
                className="flex items-center gap-1.5 border border-line px-3 py-2 font-mono text-[8px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-silver disabled:opacity-30"
              >
                <ChevronLeft className="size-3" /> Back
              </button>
              <button
                onClick={next}
                disabled={!sceneDone}
                className="flex items-center gap-1.5 border border-gold bg-gold px-3 py-2 font-mono text-[8px] uppercase tracking-[0.1em] text-abyss transition-colors hover:bg-[#f2c76a] disabled:border-line disabled:bg-transparent disabled:text-muted"
              >
                {index === scenes.length - 1 ? "Complete" : "Continue"}
                <ChevronRight className="size-3" />
              </button>
            </div>
            {scene.puzzle && !sceneDone && (
              <button
                onClick={() => {
                  setPuzzleSolved(true);
                  audio.play("advance");
                }}
                className="mt-2 flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.1em] text-muted/60 hover:text-gold"
              >
                <RotateCcw className="size-2.5" /> Skip interaction
              </button>
            )}
          </div>
        </aside>
      </div>

      <div className="mt-3 flex gap-1">
        {scenes.map((item, sceneIndex) => (
          <div
            key={item.id}
            className={cn(
              "h-0.5 flex-1",
              sceneIndex <= index ? "bg-gold/60" : "bg-line/50",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function CompletionScreen({
  title,
  scenes,
  backHref,
  backLabel,
  nextHref,
  nextLabel,
  relicId,
}: {
  title: string;
  scenes: number;
  backHref: string;
  backLabel: string;
  nextHref: string;
  nextLabel: string;
  relicId?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-teal/20 blur-3xl" />
        <RexCharacter
          pose="celebrate"
          expression="excited"
          className="relative mx-auto h-64 w-auto"
        />
      </div>
      <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.2em] text-gold">
        Transmission complete / {scenes} scenes archived
      </p>
      <h1 className="mt-3 text-4xl font-medium tracking-[-0.045em] text-white md:text-6xl">
        {title}
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-7 text-muted">
        REX has recorded this expedition. The sources remain attached, and the
        archive is still open.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={nextHref}
          className="inline-flex items-center gap-2 border border-gold bg-gold px-5 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-abyss"
        >
          {nextLabel}
          <ArrowRight className="size-3.5" />
        </Link>
        {relicId && (
          <Link
            href={`/relics/${relicId}`}
            className="inline-flex items-center gap-2 border border-line-bright px-5 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-silver hover:border-teal"
          >
            Open relic record
            <ArrowUpRight className="size-3.5" />
          </Link>
        )}
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 border border-line px-5 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted hover:text-silver"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
