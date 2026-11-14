"use client";

import { useMemo, useState } from "react";
import { Check, CircleHelp, RotateCcw, X } from "lucide-react";
import type { Puzzle } from "@/lib/story/schema";
import { ExcavationPuzzle } from "./excavation-puzzle";
import { cn } from "@/lib/utils";

type Sound = "click" | "success" | "error" | "reveal" | "brush";

function Hint({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-gold"
      >
        <CircleHelp className="size-3" />
        {open ? "Hide hint" : "Request hint"}
      </button>
      {open && (
        <p className="mt-2 border-l border-gold/40 pl-3 text-[11px] leading-5 text-muted">
          {text}
        </p>
      )}
    </div>
  );
}

export function PuzzlePanel({
  puzzle,
  solved,
  onSolved,
  play,
  compact = false,
}: {
  puzzle: Exclude<Puzzle, { type: "hotspot" }>;
  solved: boolean;
  onSolved: () => void;
  play: (sound: Sound) => void;
  compact?: boolean;
}) {
  if (puzzle.type === "sequence") {
    return (
      <SequencePuzzle
        puzzle={puzzle}
        solved={solved}
        onSolved={onSolved}
        play={play}
        compact={compact}
      />
    );
  }
  if (puzzle.type === "classify") {
    return (
      <ClassifyPuzzle
        puzzle={puzzle}
        solved={solved}
        onSolved={onSolved}
        play={play}
        compact={compact}
      />
    );
  }
  if (puzzle.type === "scan") {
    return (
      <ScanPuzzle
        puzzle={puzzle}
        solved={solved}
        onSolved={onSolved}
        play={play}
      />
    );
  }
  if (puzzle.type === "excavation") {
    return (
      <ExcavationPuzzle
        puzzle={puzzle}
        solved={solved}
        onSolved={onSolved}
        play={play}
      />
    );
  }
  if (puzzle.type === "path") {
    return (
      <PathPuzzle
        puzzle={puzzle}
        solved={solved}
        onSolved={onSolved}
        play={play}
      />
    );
  }
  if (puzzle.type === "allocate") {
    return (
      <AllocatePuzzle
        puzzle={puzzle}
        solved={solved}
        onSolved={onSolved}
        play={play}
      />
    );
  }
  if (puzzle.type === "signal") {
    return (
      <SignalPuzzle
        puzzle={puzzle}
        solved={solved}
        onSolved={onSolved}
        play={play}
      />
    );
  }
  return (
    <ChoicePuzzle
      puzzle={puzzle}
      solved={solved}
      onSolved={onSolved}
      play={play}
      compact={compact}
    />
  );
}

function Frame({
  prompt,
  children,
  feedback,
  solved,
  hint,
}: {
  prompt: string;
  children: React.ReactNode;
  feedback: string;
  solved: boolean;
  hint: string;
}) {
  return (
    <div className="border border-line/70 bg-panel/30 p-4">
      <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-gold">
        Interaction / {solved ? "verified" : "in progress"}
      </p>
      <p className="mt-2 text-sm leading-6 text-silver">{prompt}</p>
      <div className="mt-4">{children}</div>
      {feedback && (
        <p
          className={cn(
            "mt-3 border p-2.5 font-mono text-[8px] uppercase leading-5 tracking-[0.08em]",
            solved
              ? "border-teal/40 bg-teal/5 text-teal-bright"
              : "border-[#c9867c]/40 bg-[#c9867c]/5 text-[#dba197]",
          )}
        >
          {feedback}
        </p>
      )}
      {!solved && <Hint text={hint} />}
    </div>
  );
}

function SequencePuzzle({
  puzzle,
  solved,
  onSolved,
  play,
  compact,
}: {
  puzzle: Extract<Puzzle, { type: "sequence" }>;
  solved: boolean;
  onSolved: () => void;
  play: (sound: Sound) => void;
  compact: boolean;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");

  const check = (next: string[]) => {
    if (next.length !== puzzle.answer.length) return;
    if (next.every((id, index) => id === puzzle.answer[index])) {
      play("success");
      setFeedback(puzzle.success);
      onSolved();
    } else {
      play("error");
      setFeedback("Sequence mismatch. Use the dated archive record and try again.");
    }
  };

  return (
    <Frame
      prompt={puzzle.prompt}
      feedback={feedback}
      solved={solved}
      hint={puzzle.hint}
    >
      <ol className={cn("space-y-1.5", compact && "space-y-1")}>
        {puzzle.items.map((item) => {
          const position = selected.indexOf(item.id);
          return (
            <li key={item.id}>
              <button
                disabled={solved || position >= 0}
                onClick={() => {
                  play("click");
                  const next = [...selected, item.id];
                  setSelected(next);
                  setFeedback("");
                  check(next);
                }}
                className={cn(
                  "flex w-full items-center gap-3 border px-3 py-2 text-left text-xs transition-colors",
                  position >= 0
                    ? "border-gold/40 bg-gold/[0.04] text-gold"
                    : "border-line/60 text-silver/80 hover:border-teal/40 hover:text-white",
                )}
              >
                <span className="font-mono text-[8px] text-muted">
                  {position >= 0 ? String(position + 1).padStart(2, "0") : "··"}
                </span>
                {item.label}
                {position >= 0 && <Check className="ml-auto size-3" />}
              </button>
            </li>
          );
        })}
      </ol>
      {!solved && selected.length > 0 && (
        <button
          onClick={() => {
            play("click");
            setSelected([]);
            setFeedback("");
          }}
          className="mt-3 inline-flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.1em] text-muted hover:text-gold"
        >
          <RotateCcw className="size-3" /> Reset sequence
        </button>
      )}
    </Frame>
  );
}

function ClassifyPuzzle({
  puzzle,
  solved,
  onSolved,
  play,
  compact,
}: {
  puzzle: Extract<Puzzle, { type: "classify" }>;
  solved: boolean;
  onSolved: () => void;
  play: (sound: Sound) => void;
  compact: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const assigned = Object.keys(answers).length;

  const submit = () => {
    const correct = puzzle.items.every(
      (item) => answers[item.id] === item.answer,
    );
    if (correct) {
      play("success");
      setFeedback(puzzle.success);
      onSolved();
    } else {
      play("error");
      setFeedback("One or more classifications are incorrect. Review the record.");
    }
  };

  return (
    <Frame
      prompt={puzzle.prompt}
      feedback={feedback}
      solved={solved}
      hint={puzzle.hint}
    >
      <div className={cn("space-y-2", compact && "space-y-1.5")}>
        {puzzle.items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 border border-line/50 p-2.5 md:flex-row md:items-center"
          >
            <span className="flex-1 text-xs leading-5 text-silver/80">
              {item.label}
            </span>
            <div className="flex flex-wrap gap-1">
              {puzzle.buckets.map((bucket) => {
                const active = answers[item.id] === bucket.id;
                const correct =
                  solved && item.answer === bucket.id;
                return (
                  <button
                    key={bucket.id}
                    disabled={solved}
                    onClick={() => {
                      play("click");
                      setAnswers((current) => ({
                        ...current,
                        [item.id]: bucket.id,
                      }));
                      setFeedback("");
                    }}
                    className={cn(
                      "border px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.08em] transition-colors",
                      correct
                        ? "border-teal bg-teal/10 text-teal-bright"
                        : active
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-line/60 text-muted hover:border-line-bright hover:text-silver",
                    )}
                  >
                    {bucket.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {!solved && (
        <button
          onClick={submit}
          disabled={assigned !== puzzle.items.length}
          className="mt-3 inline-flex items-center gap-2 border border-gold/60 bg-gold/10 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-gold disabled:border-line disabled:bg-transparent disabled:text-muted"
        >
          <Check className="size-3" />
          Verify classification
        </button>
      )}
    </Frame>
  );
}

function ScanPuzzle({
  puzzle,
  solved,
  onSolved,
  play,
}: {
  puzzle: Extract<Puzzle, { type: "scan" }>;
  solved: boolean;
  onSolved: () => void;
  play: (sound: Sound) => void;
}) {
  const [frequency, setFrequency] = useState(12);
  const [found, setFound] = useState<string[]>([]);
  const [feedback, setFeedback] = useState(
    "Drag the receiver across the spectrum. Pause when the signal meter peaks.",
  );

  const nearest = puzzle.targets.reduce(
    (best, target) => {
      const distance = Math.abs(target.frequency - frequency);
      return distance < best.distance ? { target, distance } : best;
    },
    { target: puzzle.targets[0], distance: 100 },
  );
  const strength = Math.max(
    0,
    Math.round(100 - nearest.distance * (100 / Math.max(20, puzzle.tolerance * 4))),
  );
  const inTolerance = nearest.distance <= puzzle.tolerance;

  const revealTargets = (value: number, currentFound: string[]) => {
    const hits = puzzle.targets.filter(
      (target) =>
        Math.abs(target.frequency - value) <= puzzle.tolerance &&
        !currentFound.includes(target.id),
    );
    if (hits.length === 0) return currentFound;
    const next = [...currentFound, ...hits.map((hit) => hit.id)];
    setFound(next);
    setFeedback(
      `Return resolved: ${hits.map((hit) => hit.label).join(", ")}. ${
        next.length === puzzle.targets.length
          ? puzzle.success
          : "Keep sweeping."
      }`,
    );
    play( next.length === puzzle.targets.length ? "success" : "reveal");
    if (next.length === puzzle.targets.length) onSolved();
    return next;
  };

  const updateFrequency = (value: number) => {
    setFrequency(value);
    const next = revealTargets(value, found);
    if (next.length === found.length) {
      setFeedback(
        strength > 55
          ? "Signal rising. Hold near this band."
          : "Background noise. Continue sweeping the receiver.",
      );
    }
  };

  return (
    <Frame
      prompt={puzzle.prompt}
      feedback={feedback}
      solved={solved}
      hint={puzzle.hint}
    >
      <div className="relative overflow-hidden border border-line/60 bg-[#041018] p-3">
        <div className="absolute inset-x-0 top-0 h-px animate-[scan_3.4s_linear_infinite] bg-gradient-to-r from-transparent via-teal-bright to-transparent opacity-60" />
        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-px bg-gold/80 shadow-[0_0_12px_rgba(228,180,76,.65)] transition-[left] duration-150"
          style={{ left: `${frequency}%` }}
        />
        <div className="flex h-20 items-end gap-1">
          {Array.from({ length: 32 }).map((_, index) => {
            const level =
              10 +
              (Math.sin(index * 1.7 + frequency / 18) + 1) * 16 +
              (index % 5) * 2;
            const hit = puzzle.targets.some(
              (target) =>
                found.includes(target.id) &&
                Math.abs(target.frequency / 3.2 - index) < 2.5,
            );
            return (
              <div
                key={index}
                className={cn(
                  "flex-1 transition-colors",
                  hit ? "bg-gold" : "bg-teal/40",
                )}
                style={{ height: `${Math.min(74, level)}px` }}
              />
            );
          })}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[6px] uppercase tracking-[0.12em] text-muted">
          <span>low band</span>
          <span>spectrum sweep</span>
          <span>high band</span>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            value={frequency}
            disabled={solved}
            onChange={(event) => updateFrequency(Number(event.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none bg-line-bright accent-gold"
            aria-label="Scan frequency"
          />
          <span className="w-12 text-right font-mono text-[8px] text-teal-bright">
            {frequency} Hz
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-mono text-[6px] uppercase tracking-[0.1em] text-muted">
            Signal
          </span>
          <div className="h-1.5 flex-1 bg-line/60">
            <div
              className={cn(
                "h-full transition-all",
                inTolerance ? "bg-gold" : "bg-teal-bright/70",
              )}
              style={{ width: `${strength}%` }}
            />
          </div>
          <span
            className={cn(
              "w-14 text-right font-mono text-[7px]",
              inTolerance ? "text-gold" : "text-muted",
            )}
          >
            {inTolerance ? "contact" : `${strength}%`}
          </span>
          <span className="font-mono text-[7px] text-muted">
            {found.length}/{puzzle.targets.length}
          </span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {puzzle.targets.map((target) => (
          <div
            key={target.id}
            className={cn(
              "border px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.08em]",
              found.includes(target.id)
                ? "border-gold/40 bg-gold/5 text-gold"
                : "border-line/50 text-muted/60",
            )}
          >
            {found.includes(target.id) ? target.label : "unresolved return"}
          </div>
        ))}
      </div>
    </Frame>
  );
}

function SignalPuzzle({
  puzzle,
  solved,
  onSolved,
  play,
}: {
  puzzle: Extract<Puzzle, { type: "signal" }>;
  solved: boolean;
  onSolved: () => void;
  play: (sound: Sound) => void;
}) {
  const [azimuth, setAzimuth] = useState(18);
  const [gain, setGain] = useState(84);
  const [feedback, setFeedback] = useState("");

  const azimuthError = Math.abs(azimuth - puzzle.azimuth.target);
  const gainError = Math.abs(gain - puzzle.gain.target);
  const strength = Math.max(
    0,
    Math.round(
      100 -
        (azimuthError / 90) * 58 -
        (gainError / 100) * 42,
    ),
  );
  const aligned =
    azimuthError <= puzzle.azimuth.tolerance &&
    gainError <= puzzle.gain.tolerance;

  const lock = () => {
    if (aligned) {
      play("success");
      setFeedback(puzzle.success);
      onSolved();
    } else {
      play("error");
      setFeedback(
        "Return signal too weak. Adjust the optical axis and pulse energy.",
      );
    }
  };

  return (
    <Frame
      prompt={puzzle.prompt}
      feedback={feedback}
      solved={solved}
      hint={puzzle.hint}
    >
      <div className="relative overflow-hidden border border-line/60 bg-[#041018] p-3">
        <svg viewBox="0 0 300 100" className="w-full" aria-hidden="true">
          <circle cx="27" cy="50" r="20" fill="#123b47" stroke="#39b9c9" />
          <circle cx="270" cy="50" r="8" fill="#d5d8ce" stroke="#e4b44c" />
          <path
            d={`M47 50 L${47 + strength * 2.1} ${50 - Math.sin(((azimuth - 90) * Math.PI) / 180) * 34}`}
            stroke={aligned ? "#e4b44c" : "#39b9c9"}
            strokeWidth={aligned ? 2 : 1.2}
            strokeDasharray={aligned ? "0" : "4 5"}
            opacity={0.35 + strength / 150}
          />
          <text x="12" y="84" fill="#7e929f" fontSize="6" fontFamily="monospace">
            EARTH
          </text>
          <text x="248" y="84" fill="#7e929f" fontSize="6" fontFamily="monospace">
            LRRR
          </text>
        </svg>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
            return
          </span>
          <div className="h-1.5 flex-1 bg-line/60">
            <div
              className={cn(
                "h-full transition-all",
                aligned ? "bg-gold" : "bg-teal-bright",
              )}
              style={{ width: `${strength}%` }}
            />
          </div>
          <span className="w-8 text-right font-mono text-[8px] text-gold">
            {strength}%
          </span>
        </div>
      </div>
      <div className="mt-3 space-y-3">
        <label className="block">
          <span className="flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
            Optical azimuth <span className="text-teal-bright">{azimuth}°</span>
          </span>
          <input
            type="range"
            min={0}
            max={180}
            value={azimuth}
            disabled={solved}
            onChange={(event) => {
              setAzimuth(Number(event.target.value));
              setFeedback("");
            }}
            className="mt-2 h-1 w-full cursor-pointer appearance-none bg-line-bright accent-gold"
          />
        </label>
        <label className="block">
          <span className="flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
            Pulse energy <span className="text-teal-bright">{gain}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={gain}
            disabled={solved}
            onChange={(event) => {
              setGain(Number(event.target.value));
              setFeedback("");
            }}
            className="mt-2 h-1 w-full cursor-pointer appearance-none bg-line-bright accent-gold"
          />
        </label>
      </div>
      <button
        onClick={lock}
        disabled={solved}
        className="mt-3 inline-flex items-center gap-2 border border-gold/60 bg-gold/10 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-gold disabled:opacity-40"
      >
        <Check className="size-3" />
        Lock return signal
      </button>
    </Frame>
  );
}

function PathPuzzle({
  puzzle,
  solved,
  onSolved,
  play,
}: {
  puzzle: Extract<Puzzle, { type: "path" }>;
  solved: boolean;
  onSolved: () => void;
  play: (sound: Sound) => void;
}) {
  const [path, setPath] = useState<Array<{ x: number; y: number }>>([
    puzzle.start,
  ]);
  const [foundTargets, setFoundTargets] = useState<string[]>([]);
  const [feedback, setFeedback] = useState(
    "Select adjacent cells to plan a traverse. Collect every science target.",
  );
  const current = path[path.length - 1];

  const moveTo = (x: number, y: number) => {
    if (solved) return;
    const isAdjacent =
      Math.abs(current.x - x) + Math.abs(current.y - y) === 1;
    const blocked = puzzle.obstacles.some(
      (obstacle) => obstacle.x === x && obstacle.y === y,
    );
    const visited = path.some((cell) => cell.x === x && cell.y === y);
    if (!isAdjacent || blocked || visited) {
      play("error");
      setFeedback(
        blocked
          ? "Traverse blocked by hazardous terrain."
          : "Choose an adjacent, unvisited cell.",
      );
      return;
    }
    if (path.length - 1 >= puzzle.maxSteps) {
      play("error");
      setFeedback("Battery budget exhausted. Reset the route and try again.");
      return;
    }
    const nextPath = [...path, { x, y }];
    setPath(nextPath);
    play("click");
    const target = puzzle.targets.find(
      (item) => item.x === x && item.y === y && !foundTargets.includes(item.id),
    );
    const nextTargets = target
      ? [...foundTargets, target.id]
      : foundTargets;
    if (target) {
      setFoundTargets(nextTargets);
      setFeedback(`Science target reached: ${target.label}.`);
      play("reveal");
    }
    if (nextTargets.length === puzzle.targets.length) {
      play("success");
      setFeedback(puzzle.success);
      onSolved();
    }
  };

  return (
    <Frame
      prompt={puzzle.prompt}
      feedback={feedback}
      solved={solved}
      hint={puzzle.hint}
    >
      <div
        className="mx-auto grid max-w-[330px] gap-1"
        style={{ gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: puzzle.cols * puzzle.rows }).map((_, index) => {
          const x = index % puzzle.cols;
          const y = Math.floor(index / puzzle.cols);
          const isStart = puzzle.start.x === x && puzzle.start.y === y;
          const target = puzzle.targets.find(
            (item) => item.x === x && item.y === y,
          );
          const targetFound = target && foundTargets.includes(target.id);
          const obstacle = puzzle.obstacles.some(
            (item) => item.x === x && item.y === y,
          );
          const inPath = path.some((cell) => cell.x === x && cell.y === y);
          const isCurrent = current.x === x && current.y === y;
          return (
            <button
              key={index}
              onClick={() => moveTo(x, y)}
              disabled={solved}
              className={cn(
                "relative flex aspect-square items-center justify-center border font-mono text-[7px] transition-colors",
                obstacle
                  ? "border-[#c9867c]/25 bg-[#c9867c]/10 text-[#c9867c]"
                  : isCurrent
                    ? "border-gold bg-gold/15 text-gold"
                    : targetFound
                      ? "border-teal/50 bg-teal/10 text-teal-bright"
                      : target
                        ? "border-line bg-void/50 text-gold/70 hover:border-gold/50"
                        : inPath
                          ? "border-teal/30 bg-teal/[0.04] text-teal/60"
                          : "border-line/50 bg-void/30 text-muted/30 hover:border-line-bright",
              )}
              aria-label={`Traverse cell ${x + 1}, ${y + 1}${target ? `, target ${target.label}` : ""}`}
            >
              {obstacle
                ? "×"
                : isCurrent
                  ? "REX"
                  : targetFound
                    ? "✓"
                    : target
                      ? "◆"
                      : isStart
                        ? "S"
                        : "·"}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.08em] text-muted">
        <span>Steps {path.length - 1}/{puzzle.maxSteps}</span>
        <span>Targets {foundTargets.length}/{puzzle.targets.length}</span>
        <button
          onClick={() => {
            setPath([puzzle.start]);
            setFoundTargets([]);
            setFeedback("Route reset.");
            play("click");
          }}
          className="flex items-center gap-1 text-muted hover:text-gold"
        >
          <RotateCcw className="size-2.5" /> Reset route
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {puzzle.targets.map((target) => (
          <span
            key={target.id}
            className={cn(
              "border px-1.5 py-1 font-mono text-[6px] uppercase tracking-[0.08em]",
              foundTargets.includes(target.id)
                ? "border-teal/40 text-teal-bright"
                : "border-line/50 text-muted/60",
            )}
          >
            {target.label}
          </span>
        ))}
      </div>
    </Frame>
  );
}

function AllocatePuzzle({
  puzzle,
  solved,
  onSolved,
  play,
}: {
  puzzle: Extract<Puzzle, { type: "allocate" }>;
  solved: boolean;
  onSolved: () => void;
  play: (sound: Sound) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState(
    "Allocate the limited budget. You do not need every system.",
  );
  const cost = puzzle.items
    .filter((item) => selected.includes(item.id))
    .reduce((sum, item) => sum + item.cost, 0);
  const value = puzzle.items
    .filter((item) => selected.includes(item.id))
    .reduce((sum, item) => sum + item.value, 0);

  const toggle = (id: string, itemCost: number) => {
    if (solved) return;
    if (selected.includes(id)) {
      setSelected((current) => current.filter((item) => item !== id));
      play("click");
      return;
    }
    if (cost + itemCost > puzzle.budget) {
      play("error");
      setFeedback("Power budget exceeded. Turn off another system first.");
      return;
    }
    setSelected((current) => [...current, id]);
    play("click");
  };

  const commit = () => {
    if (value >= puzzle.target && cost <= puzzle.budget) {
      play("success");
      setFeedback(puzzle.success);
      onSolved();
    } else {
      play("error");
      setFeedback(
        `Allocation insufficient. Reach ${puzzle.target} science value within ${puzzle.budget} power units.`,
      );
    }
  };

  return (
    <Frame
      prompt={puzzle.prompt}
      feedback={feedback}
      solved={solved}
      hint={puzzle.hint}
    >
      <div className="grid gap-1.5 sm:grid-cols-2">
        {puzzle.items.map((item) => {
          const active = selected.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id, item.cost)}
              disabled={solved}
              className={cn(
                "border p-2.5 text-left transition-colors",
                active
                  ? "border-gold/50 bg-gold/[0.06]"
                  : "border-line/60 hover:border-teal/40",
              )}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="text-[11px] leading-4 text-silver">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center border",
                    active
                      ? "border-gold bg-gold/20 text-gold"
                      : "border-line",
                  )}
                >
                  {active && <Check className="size-2.5" />}
                </span>
              </span>
              <span className="mt-1 flex justify-between font-mono text-[6px] uppercase tracking-[0.08em] text-muted">
                <span>{item.cost} power</span>
                <span className="text-teal-bright">+{item.value} science</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <div className="flex justify-between font-mono text-[7px] uppercase tracking-[0.08em] text-muted">
            <span>Power</span>
            <span>{cost}/{puzzle.budget}</span>
          </div>
          <div className="mt-1 h-1.5 bg-line/60">
            <div
              className={cn(
                "h-full transition-all",
                cost > puzzle.budget * 0.85 ? "bg-[#c9867c]" : "bg-teal-bright",
              )}
              style={{ width: `${(cost / puzzle.budget) * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between font-mono text-[7px] uppercase tracking-[0.08em] text-muted">
            <span>Science</span>
            <span>{value}/{puzzle.target}</span>
          </div>
          <div className="mt-1 h-1.5 bg-line/60">
            <div
              className={cn(
                "h-full transition-all",
                value >= puzzle.target ? "bg-gold" : "bg-teal/50",
              )}
              style={{ width: `${Math.min(100, (value / puzzle.target) * 100)}%` }}
            />
          </div>
        </div>
      </div>
      <button
        onClick={commit}
        disabled={solved}
        className="mt-3 inline-flex items-center gap-2 border border-gold/60 bg-gold/10 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-gold disabled:opacity-40"
      >
        <Check className="size-3" />
        Commit allocation
      </button>
    </Frame>
  );
}

function ChoicePuzzle({
  puzzle,
  solved,
  onSolved,
  play,
  compact,
}: {
  puzzle: Extract<Puzzle, { type: "choice" }>;
  solved: boolean;
  onSolved: () => void;
  play: (sound: Sound) => void;
  compact: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const wrong = useMemo(
    () => selected !== null && selected !== puzzle.answer,
    [puzzle.answer, selected],
  );

  return (
    <Frame
      prompt={puzzle.prompt}
      feedback={feedback}
      solved={solved}
      hint={puzzle.hint}
    >
      <div className={cn("space-y-2", compact && "space-y-1.5")}>
        {puzzle.options.map((option) => {
          const active = selected === option.id;
          const correct = solved && option.id === puzzle.answer;
          return (
            <button
              key={option.id}
              disabled={solved}
              onClick={() => {
                play("click");
                setSelected(option.id);
                if (option.id === puzzle.answer) {
                  play("success");
                  setFeedback(puzzle.success);
                  onSolved();
                } else {
                  play("error");
                  setFeedback("That interpretation does not match the archive record.");
                }
              }}
              className={cn(
                "w-full border p-3 text-left transition-colors",
                correct
                  ? "border-teal bg-teal/10"
                  : active && wrong
                    ? "border-[#c9867c] bg-[#c9867c]/5"
                    : "border-line/60 hover:border-teal/40 hover:bg-teal/[0.03]",
              )}
            >
              <span className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center border",
                    correct
                      ? "border-teal text-teal-bright"
                      : active
                        ? "border-gold text-gold"
                        : "border-line text-transparent",
                  )}
                >
                  {correct ? <Check className="size-2.5" /> : active && wrong ? <X className="size-2.5" /> : null}
                </span>
                <span>
                  <span className="block text-xs leading-5 text-silver">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-[10px] leading-4 text-muted">
                    {option.detail}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </Frame>
  );
}
