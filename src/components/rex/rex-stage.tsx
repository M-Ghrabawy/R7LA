"use client";

import { cn } from "@/lib/utils";
import type {
  RexExpression,
  RexPose,
  SceneBackground,
  SceneProp,
} from "@/lib/story/schema";
import { RexCharacter } from "./rex-character";

const stars = [
  [6, 12], [12, 28], [19, 8], [24, 36], [31, 16], [38, 7],
  [44, 27], [52, 12], [57, 34], [63, 18], [69, 6], [74, 31],
  [81, 13], [88, 24], [93, 7], [97, 36], [8, 48], [17, 55],
  [28, 47], [36, 62], [46, 52], [55, 60], [66, 49], [77, 58],
  [86, 46], [96, 55], [4, 70], [14, 76], [23, 68], [35, 79],
  [48, 70], [60, 78], [72, 69], [84, 77], [95, 68],
];

function Backdrop({ background }: { background: SceneBackground }) {
  const isMars = background === "mars" || background === "mars-dust";
  return (
    <svg
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sky-${background}`} x1="0" y1="0" x2="0" y2="1">
          {isMars ? (
            <>
              <stop offset="0" stopColor="#0d1117" />
              <stop offset=".5" stopColor="#2b1714" />
              <stop offset="1" stopColor="#6f3324" />
            </>
          ) : background === "observatory" || background === "archive" ? (
            <>
              <stop offset="0" stopColor="#031018" />
              <stop offset="1" stopColor="#071b27" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#02070b" />
              <stop offset="1" stopColor="#07131f" />
            </>
          )}
        </linearGradient>
        <linearGradient id={`ground-${background}`} x1="0" y1="0" x2="0" y2="1">
          {isMars ? (
            <>
              <stop offset="0" stopColor="#874934" />
              <stop offset="1" stopColor="#2b1714" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#56605f" />
              <stop offset="1" stopColor="#111b20" />
            </>
          )}
        </linearGradient>
        <radialGradient id={`glow-${background}`} cx=".7" cy=".35" r=".55">
          <stop offset="0" stopColor={isMars ? "#c16a45" : "#0b7a8f"} stopOpacity=".28" />
          <stop offset="1" stopColor="#07131f" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1000" height="600" fill={`url(#sky-${background})`} />
      <rect width="1000" height="600" fill={`url(#glow-${background})`} />

      {(background === "deep-space" ||
        background === "earth-orbit" ||
        background === "moon" ||
        background === "moon-crater") &&
        stars.map(([x, y], index) => (
          <circle
            key={index}
            cx={x * 10}
            cy={y * 6}
            r={index % 4 === 0 ? 1.6 : 0.9}
            fill={index % 7 === 0 ? "#e4b44c" : "#c9d3dd"}
            opacity={0.35 + (index % 5) * 0.1}
          />
        ))}

      {background === "earth-orbit" && (
        <>
          <circle cx="790" cy="560" r="280" fill="#0b3f55" opacity=".45" />
          <circle cx="790" cy="560" r="280" fill="none" stroke="#39b9c9" strokeWidth="1.5" opacity=".65" />
          <path d="M580 500 Q760 420 1000 470" fill="none" stroke="#9ce8ef" strokeWidth="1.5" opacity=".4" />
        </>
      )}

      {background === "deep-space" && (
        <>
          <circle cx="790" cy="230" r="95" fill="#16242d" />
          <circle cx="775" cy="218" r="82" fill="none" stroke="#2b5262" strokeWidth="1" opacity=".55" />
          <ellipse cx="790" cy="230" rx="156" ry="30" fill="none" stroke="#e4b44c" strokeWidth="1.5" opacity=".45" transform="rotate(-18 790 230)" />
        </>
      )}

      {(background === "observatory" || background === "archive") && (
        <>
          <circle cx="500" cy="310" r="250" fill="none" stroke="#1b3542" strokeWidth="1" />
          <circle cx="500" cy="310" r="180" fill="none" stroke="#1b3542" strokeWidth="1" strokeDasharray="3 8" />
          <circle cx="500" cy="310" r="320" fill="none" stroke="#0b7a8f" strokeWidth="1" opacity=".25" />
          <path d="M0 420 H1000" stroke="#1b3542" strokeWidth="1" />
          <path d="M0 460 H1000" stroke="#122835" strokeWidth="1" />
          {Array.from({ length: 12 }).map((_, index) => (
            <path key={index} d={`M${index * 90} 600 L${index * 90 + 180} 420`} stroke="#0b7a8f" strokeWidth=".7" opacity=".14" />
          ))}
          <rect x="82" y="340" width="5" height="160" fill="#0b7a8f" opacity=".45" />
          <rect x="913" y="380" width="5" height="130" fill="#e4b44c" opacity=".35" />
        </>
      )}

      {(background === "moon" || background === "moon-crater") && (
        <>
          <path d="M0 470 Q150 430 310 466 T690 452 T1000 478 V600 H0Z" fill={`url(#ground-${background})`} />
          <path d="M0 470 Q150 430 310 466 T690 452 T1000 478" fill="none" stroke="#c9d3dd" strokeWidth="1.5" opacity=".35" />
          <ellipse cx="760" cy="505" rx="110" ry="22" fill="#06121c" opacity=".55" />
          <ellipse cx="300" cy="530" rx="150" ry="26" fill="#06121c" opacity=".45" />
          {background === "moon-crater" && (
            <>
              <path d="M0 440 Q80 380 160 450 T320 430 T450 470 L450 600 H0Z" fill="#141d20" opacity=".8" />
              <path d="M650 470 Q760 410 900 455 T1000 430 V600 H650Z" fill="#10191d" opacity=".7" />
            </>
          )}
        </>
      )}

      {isMars && (
        <>
          <path d="M0 455 Q120 415 250 450 T520 442 T780 462 T1000 445 V600 H0Z" fill={`url(#ground-${background})`} />
          <path d="M0 455 Q120 415 250 450 T520 442 T780 462 T1000 445" fill="none" stroke="#e8a27d" strokeWidth="1.2" opacity=".35" />
          <path d="M90 500 Q220 450 330 490 T590 480 T860 505" fill="none" stroke="#d4845e" strokeWidth="1" opacity=".35" />
          <ellipse cx="610" cy="520" rx="130" ry="24" fill="#281514" opacity=".5" />
          <ellipse cx="880" cy="500" rx="70" ry="12" fill="#281514" opacity=".4" />
          {background === "mars-dust" && (
            <>
              <rect width="1000" height="600" fill="#6b3222" opacity=".25" />
              <path d="M0 330 Q280 290 520 340 T1000 320 V600 H0Z" fill="#8b4934" opacity=".18" />
              <path d="M0 380 Q240 340 470 390 T1000 370 V600 H0Z" fill="#a45b3f" opacity=".14" />
            </>
          )}
        </>
      )}
    </svg>
  );
}

function PropArt({ prop }: { prop: SceneProp }) {
  if (prop === "descent-stage") {
    return (
      <g transform="translate(210 360) scale(.8)">
        <path d="M-80 -20 L-62 48 H62 L80 -20Z" fill="#1b2c34" stroke="#8ca0a8" strokeWidth="2" />
        <path d="M-58 -20 L-44 -52 H44 L58 -20Z" fill="#d4d6cf" stroke="#89969a" />
        <path d="M-43 -52 L-24 -90 H24 L43 -52Z" fill="#bac0bf" stroke="#89969a" />
        <path d="M-52 46 L-92 120 M52 46 L92 120 M-29 46 L-44 126 M29 46 L44 126" stroke="#98a8ad" strokeWidth="5" />
        <ellipse cx="-95" cy="124" rx="15" ry="4" fill="#bdb29a" />
        <ellipse cx="95" cy="124" rx="15" ry="4" fill="#bdb29a" />
        <ellipse cx="-45" cy="130" rx="15" ry="4" fill="#bdb29a" />
        <ellipse cx="45" cy="130" rx="15" ry="4" fill="#bdb29a" />
        <path d="M-18 0 H18" stroke="#e4b44c" strokeWidth="2" opacity=".7" />
      </g>
    );
  }
  if (prop === "rover") {
    return (
      <g transform="translate(700 470) scale(.85)">
        <rect x="-80" y="-28" width="160" height="32" rx="8" fill="#c7ccca" stroke="#7c8d93" />
        <rect x="-44" y="-54" width="88" height="9" fill="#253b46" />
        <circle cx="-58" cy="12" r="24" fill="#1d2b32" stroke="#9aabb0" strokeWidth="4" />
        <circle cx="0" cy="12" r="24" fill="#1d2b32" stroke="#9aabb0" strokeWidth="4" />
        <circle cx="58" cy="12" r="24" fill="#1d2b32" stroke="#9aabb0" strokeWidth="4" />
        <path d="M22 -28 V-92" stroke="#b6c0c0" strokeWidth="5" />
        <circle cx="22" cy="-96" r="9" fill="#e4b44c" />
        <path d="M-50 12 H-82" stroke="#39b9c9" strokeWidth="3" />
      </g>
    );
  }
  if (prop === "lander") {
    return (
      <g transform="translate(790 440) scale(.75)">
        <path d="M-70 -30 L-54 30 H54 L70 -30Z" fill="#263b45" stroke="#8da0a7" strokeWidth="2" />
        <rect x="-48" y="-72" width="96" height="44" rx="7" fill="#c4cac9" stroke="#829298" />
        <path d="M-52 30 L-92 92 M52 30 L92 92 M0 30 V98" stroke="#98a8ad" strokeWidth="5" />
        <ellipse cx="-95" cy="95" rx="16" ry="4" fill="#bdb29a" />
        <ellipse cx="95" cy="95" rx="16" ry="4" fill="#bdb29a" />
        <ellipse cx="0" cy="100" rx="16" ry="4" fill="#bdb29a" />
        <path d="M26 -74 V-128" stroke="#b6c0c0" strokeWidth="3" />
        <ellipse cx="40" cy="-128" rx="20" ry="7" fill="#bdb29a" transform="rotate(-20 40 -128)" />
      </g>
    );
  }
  if (prop === "retroreflector") {
    return (
      <g transform="translate(460 482) scale(.65)">
        <rect x="-58" y="-38" width="116" height="74" rx="3" fill="#162a34" stroke="#8da0a7" />
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={-44 + col * 32}
              y={-25 + row * 21}
              width="22"
              height="15"
              fill="#e4b44c"
              opacity=".85"
            />
          )),
        )}
        <path d="M-38 36 L-52 78 M38 36 L52 78" stroke="#98a8ad" strokeWidth="4" />
      </g>
    );
  }
  if (prop === "dish") {
    return (
      <g transform="translate(150 430) scale(.6)">
        <path d="M0 70 V-20" stroke="#9eacb0" strokeWidth="5" />
        <ellipse cx="0" cy="-28" rx="56" ry="18" fill="#bcc6c5" stroke="#829298" transform="rotate(-18 0 -28)" />
        <path d="M-42 -15 Q0 -52 42 -15" fill="none" stroke="#e4b44c" strokeWidth="2" />
        <path d="M-50 72 H50" stroke="#829298" strokeWidth="4" />
      </g>
    );
  }
  if (prop === "sample-tube") {
    return (
      <g transform="translate(610 508)">
        <rect x="-7" y="-50" width="14" height="52" rx="5" fill="#d8d9d2" stroke="#e4b44c" />
        <circle cx="0" cy="-51" r="7" fill="#0b7a8f" opacity=".7" />
      </g>
    );
  }
  if (prop === "archive-core") {
    return (
      <g transform="translate(500 300)" opacity=".55">
        <circle r="120" fill="none" stroke="#0b7a8f" strokeWidth="1.2" />
        <circle r="86" fill="none" stroke="#2b5262" strokeDasharray="3 8" />
        <circle r="44" fill="none" stroke="#e4b44c" strokeWidth="1.2" />
        <circle r="8" fill="#39b9c9" />
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <circle
            key={angle}
            cx={Math.cos((angle * Math.PI) / 180) * 120}
            cy={Math.sin((angle * Math.PI) / 180) * 120}
            r="3"
            fill="#e4b44c"
          />
        ))}
      </g>
    );
  }
  return (
    <g transform="translate(250 520)" opacity=".5">
      <path d="M-150 0 Q0 -30 150 0" fill="none" stroke="#9ca8a8" strokeWidth="2" />
      <path d="M-90 6 Q0 -14 90 6" fill="none" stroke="#9ca8a8" strokeWidth="1" opacity=".5" />
    </g>
  );
}

export function RexStage({
  background,
  props,
  rexPose,
  rexExpression,
  sceneKey,
  hotspots,
  foundHotspots = [],
  onHotspot,
  compact = false,
}: {
  background: SceneBackground;
  props: SceneProp[];
  rexPose: RexPose;
  rexExpression: RexExpression;
  sceneKey: string;
  hotspots?: Array<{
    id: string;
    label: string;
    x: number;
    y: number;
  }>;
  foundHotspots?: string[];
  onHotspot?: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <div
      key={sceneKey}
      className={cn(
        "relative overflow-hidden border border-line/70 bg-void",
        compact ? "h-[300px] md:h-[360px]" : "h-[360px] md:h-[520px]",
      )}
    >
      <Backdrop background={background} />
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        {props.map((prop, index) => (
          <PropArt key={`${prop}-${index}`} prop={prop} />
        ))}
      </svg>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,16,.16),transparent_40%,rgba(3,10,16,.64))]" />
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 md:p-4">
        <div className="border border-line/60 bg-abyss/70 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.16em] text-teal-bright">
          REX visual feed / {background.replaceAll("-", " ")}
        </div>
        <div className="border border-line/60 bg-abyss/70 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.14em] text-muted">
          Live reconstruction
        </div>
      </div>

      {hotspots?.map((hotspot) => {
        const found = foundHotspots.includes(hotspot.id);
        return (
          <button
            key={hotspot.id}
            onClick={() => onHotspot?.(hotspot.id)}
            className="group absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            aria-label={`Inspect ${hotspot.label}`}
          >
            <span
              className={cn(
                "relative flex size-7 items-center justify-center rounded-full border transition-colors",
                found
                  ? "border-gold bg-gold/20 text-gold"
                  : "border-teal-bright/80 bg-abyss/40 text-teal-bright hover:border-gold hover:text-gold",
              )}
            >
              {!found && (
                <span className="absolute inset-0 animate-[pulse-ring_2.4s_ease-out_infinite] rounded-full border border-teal-bright/50" />
              )}
              <span className="size-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
            </span>
            <span
              className={cn(
                "whitespace-nowrap border px-1.5 py-1 font-mono text-[6px] uppercase tracking-[0.1em]",
                found
                  ? "border-gold/40 bg-abyss/90 text-gold"
                  : "border-line/60 bg-abyss/85 text-silver/80 opacity-0 transition-opacity group-hover:opacity-100",
              )}
            >
              {hotspot.label}
            </span>
          </button>
        );
      })}

      <div className="pointer-events-none absolute bottom-1 right-2 flex items-end gap-2 md:bottom-2 md:right-4">
        <RexCharacter
          pose={rexPose}
          expression={rexExpression}
          className={compact ? "h-[220px] w-auto md:h-[260px]" : "h-[260px] w-auto md:h-[390px]"}
        />
      </div>
      <div className="pointer-events-none absolute bottom-25 left-4 hidden md:block">
        <p className="font-mono text-[7px] uppercase tracking-[0.15em] text-muted/60">
          REX unit / archeological explorer
        </p>
      </div>
    </div>
  );
}
