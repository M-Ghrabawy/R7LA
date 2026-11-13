"use client";

import { useEffect, useRef, useState } from "react";
import { Brush, RotateCcw, Sparkles } from "lucide-react";
import type { Puzzle } from "@/lib/story/schema";
import { cn } from "@/lib/utils";

type ExcavationPuzzleData = Extract<Puzzle, { type: "excavation" }>;

function drawDust(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const { width, height } = canvas;
  context.globalCompositeOperation = "source-over";
  context.clearRect(0, 0, width, height);
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#8d8f88");
  gradient.addColorStop(0.5, "#a6a69c");
  gradient.addColorStop(1, "#747873");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  let seed = 42;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  for (let index = 0; index < 2600; index += 1) {
    const x = random() * width;
    const y = random() * height;
    const size = random() * 2.4 + 0.4;
    context.fillStyle = `rgba(${52 + random() * 50}, ${54 + random() * 48}, ${50 + random() * 42}, ${0.12 + random() * 0.2})`;
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
    context.fill();
  }
  for (let index = 0; index < 20; index += 1) {
    const x = random() * width;
    const y = random() * height;
    const radius = random() * 10 + 2;
    context.fillStyle = "rgba(45, 48, 46, .18)";
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "rgba(230, 230, 216, .2)";
    context.lineWidth = 1;
    context.stroke();
  }
  context.globalCompositeOperation = "destination-out";
}

function ArtifactPlan({
  zones,
  found,
}: {
  zones: ExcavationPuzzleData["zones"];
  found: string[];
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 size-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dig-soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d443f" />
          <stop offset="1" stopColor="#111b1d" />
        </linearGradient>
        <radialGradient id="dig-light" cx=".5" cy=".45" r=".6">
          <stop offset="0" stopColor="#9fb8b1" stopOpacity=".18" />
          <stop offset="1" stopColor="#07131f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#dig-soil)" />
      <path d="M0 66 Q15 62 27 66 T54 64 T78 68 T100 65 V100 H0Z" fill="#172322" />
      <path d="M0 55 Q24 48 50 53 T100 50" fill="none" stroke="#7b8f86" strokeWidth=".4" opacity=".5" />
      <path d="M8 74 Q17 69 26 73" fill="none" stroke="#b6b2a0" strokeWidth=".35" opacity=".5" />
      <g fill="none" stroke="#b0b0a2" strokeOpacity=".55" strokeWidth=".35">
        <path d="M27 65 L36 47 L44 47 L53 65" />
        <path d="M33 54 L47 54" />
        <path d="M40 47 L40 36" />
        <path d="M30 67 L24 82 M51 67 L57 82" />
        <path d="M56 70 h9 v6 h-9z" />
        <circle cx="70" cy="74" r="2.2" />
        <path d="M66 75 h-7" />
      </g>
      <g fill="#d1c487" opacity=".8">
        <rect x="58" y="69" width="3" height="2" />
        <rect x="62" y="70" width="2" height="1.5" />
      </g>
      <g fill="none" stroke="#1a2425" strokeWidth="1.2" opacity=".4">
        <ellipse cx="16" cy="80" rx="2" ry="4" transform="rotate(-20 16 80)" />
        <ellipse cx="21" cy="84" rx="2" ry="4" transform="rotate(15 21 84)" />
        <ellipse cx="25" cy="79" rx="2" ry="4" transform="rotate(-15 25 79)" />
      </g>
      <rect width="100" height="100" fill="url(#dig-light)" />
      {zones.map((zone) =>
        found.includes(zone.id) ? (
          <g key={zone.id}>
            <circle
              cx={zone.x}
              cy={zone.y}
              r={zone.radius}
              fill="none"
              stroke="#e4b44c"
              strokeWidth=".6"
              strokeDasharray="2 2"
            />
            <circle cx={zone.x} cy={zone.y} r=".9" fill="#e4b44c" />
            <text
              x={zone.x + 2.5}
              y={zone.y - 2}
              fill="#e4b44c"
              fontSize="2.4"
              fontFamily="monospace"
            >
              {zone.label.toUpperCase()}
            </text>
          </g>
        ) : null,
      )}
    </svg>
  );
}

export function ExcavationPuzzle({
  puzzle,
  solved,
  onSolved,
  play,
}: {
  puzzle: ExcavationPuzzleData;
  solved: boolean;
  onSolved: () => void;
  play: (sound: "click" | "success" | "error" | "reveal" | "brush") => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countsRef = useRef<Record<string, number>>({});
  const completedRef = useRef(false);
  const lastBrushSound = useRef(0);
  const [found, setFound] = useState<string[]>([]);
  const [zoneProgress, setZoneProgress] = useState<Record<string, number>>({});
  const [hintOpen, setHintOpen] = useState(false);
  const [feedback, setFeedback] = useState(
    "Drag across the regolith to clear it. Work slowly around the artifact.",
  );
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * 1.5);
    canvas.height = Math.round(rect.height * 1.5);
    drawDust(canvas);
  }, [epoch]);

  const discover = (zoneId: string) => {
    const zone = puzzle.zones.find((item) => item.id === zoneId);
    if (!zone || found.includes(zoneId)) return;
    const next = [...found, zoneId];
    setFound(next);
    setFeedback(`${zone.label} exposed. ${zone.detail}`);
    play("reveal");
    if (next.length >= puzzle.zones.length && !completedRef.current) {
      completedRef.current = true;
      play("success");
      setFeedback(puzzle.success);
      onSolved();
    }
  };

  const brushAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || solved) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(
      (x / rect.width) * canvas.width,
      (y / rect.height) * canvas.height,
      canvas.width * 0.032,
      0,
      Math.PI * 2,
    );
    context.fill();
    context.globalCompositeOperation = "source-over";

    const now = performance.now();
    if (now - lastBrushSound.current > 130) {
      lastBrushSound.current = now;
      play("brush");
    }

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    for (const zone of puzzle.zones) {
      if (found.includes(zone.id)) continue;
      const distance = Math.hypot(percentX - zone.x, percentY - zone.y);
      if (distance <= zone.radius) {
        const counts = countsRef.current;
        counts[zone.id] = (counts[zone.id] ?? 0) + 1;
        const percent = Math.min(
          100,
          Math.round((counts[zone.id] / 22) * 100),
        );
        setZoneProgress((current) => ({
          ...current,
          [zone.id]: percent,
        }));
        if (counts[zone.id] >= 22) discover(zone.id);
      }
    }
  };

  const reset = () => {
    countsRef.current = {};
    completedRef.current = false;
    setFound([]);
    setZoneProgress({});
    setFeedback(
      "Drag across the regolith to clear it. Work slowly around the artifact.",
    );
    setEpoch((current) => current + 1);
    play("click");
  };

  return (
    <div className="border border-line/70 bg-panel/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Brush className="size-3.5 text-gold" />
          <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-gold">
            Dust table / excavation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
            {found.length}/{puzzle.zones.length} exposed
          </span>
          <button
            onClick={reset}
            className="flex items-center gap-1 border border-line px-2 py-1.5 font-mono text-[6px] uppercase tracking-[0.08em] text-muted hover:text-gold"
          >
            <RotateCcw className="size-2.5" /> Reset
          </button>
        </div>
      </div>

      <div className="relative mt-3 h-[260px] overflow-hidden border border-line/70 bg-[#10191a] md:h-[310px]">
        <ArtifactPlan zones={puzzle.zones} found={found} />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full cursor-crosshair touch-none"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            brushAt(event.clientX, event.clientY);
          }}
          onPointerMove={(event) => {
            if (event.buttons === 1 || event.pointerType === "touch") {
              brushAt(event.clientX, event.clientY);
            }
          }}
          aria-label="Lunar dust excavation canvas"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-2.5">
          <span className="border border-line/60 bg-abyss/75 px-2 py-1 font-mono text-[6px] uppercase tracking-[0.1em] text-silver/75">
            Brush / low pressure
          </span>
          <span className="flex items-center gap-1 border border-line/60 bg-abyss/75 px-2 py-1 font-mono text-[6px] uppercase tracking-[0.1em] text-teal-bright">
            <Sparkles className="size-2.5" />
            {puzzle.prompt}
          </span>
        </div>
        {solved && (
          <div className="absolute inset-0 flex items-center justify-center bg-abyss/25">
            <span className="border border-gold/60 bg-abyss/90 px-4 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-gold">
              Site record complete
            </span>
          </div>
        )}
      </div>

      <p className="mt-3 min-h-10 border-l border-teal/40 pl-2 text-[11px] leading-5 text-silver/75">
        {feedback}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {puzzle.zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => {
              if (found.includes(zone.id)) return;
              countsRef.current[zone.id] =
                (countsRef.current[zone.id] ?? 0) + 6;
              const percent = Math.min(
                100,
                Math.round((countsRef.current[zone.id] / 22) * 100),
              );
              setZoneProgress((current) => ({
                ...current,
                [zone.id]: percent,
              }));
              if (countsRef.current[zone.id] >= 22) discover(zone.id);
            }}
            className={cn(
              "border px-2 py-1.5 text-left font-mono text-[6px] uppercase tracking-[0.08em]",
              found.includes(zone.id)
                ? "border-gold/40 bg-gold/5 text-gold"
                : "border-line/50 text-muted/60 hover:border-teal/40 hover:text-silver",
            )}
          >
            {found.includes(zone.id)
              ? zone.label
              : `Guided brush ${zoneProgress[zone.id] ?? 0}%`}
          </button>
        ))}
      </div>
      <button
        onClick={() => setHintOpen((open) => !open)}
        className="mt-2 font-mono text-[7px] uppercase tracking-[0.1em] text-muted hover:text-gold"
      >
        {hintOpen ? "Hide hint" : "Request hint"}
      </button>
      {hintOpen && (
        <p className="mt-1 border-l border-gold/40 pl-2 text-[10px] leading-5 text-muted">
          {puzzle.hint}
        </p>
      )}
    </div>
  );
}
