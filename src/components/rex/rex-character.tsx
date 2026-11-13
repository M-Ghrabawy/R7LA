import { cn } from "@/lib/utils";
import type { RexExpression, RexPose } from "@/lib/story/schema";

const poseTransforms: Record<RexPose, string> = {
  idle: "",
  walk: "rotate(-3 130 330)",
  point: "rotate(-2 130 330)",
  inspect: "rotate(5 130 330)",
  think: "rotate(-5 130 330)",
  celebrate: "translate(0 -8)",
  transmit: "rotate(-2 130 330)",
  "low-power": "rotate(7 130 330) translate(0 8)",
};

function Eyes({ expression }: { expression: RexExpression }) {
  if (expression === "focused") {
    return (
      <g fill="none" stroke="#62ecff" strokeWidth="7" strokeLinecap="round">
        <path d="M93 113 L116 119" />
        <path d="M167 113 L144 119" />
      </g>
    );
  }
  if (expression === "concerned") {
    return (
      <g fill="none" stroke="#62ecff" strokeWidth="7" strokeLinecap="round">
        <path d="M91 117 Q104 106 118 116" />
        <path d="M142 116 Q156 106 169 117" />
      </g>
    );
  }
  if (expression === "curious") {
    return (
      <g fill="none" stroke="#62ecff" strokeLinecap="round">
        <path d="M91 119 Q105 104 119 119" strokeWidth="7" />
        <circle cx="155" cy="114" r="7" fill="#62ecff" stroke="none" />
      </g>
    );
  }
  if (expression === "excited") {
    return (
      <g fill="none" stroke="#62ecff" strokeWidth="7" strokeLinecap="round">
        <path d="M91 121 Q105 103 119 121" />
        <path d="M142 121 Q156 103 170 121" />
        <path d="M84 92 L88 83" strokeWidth="4" />
        <path d="M176 92 L172 83" strokeWidth="4" />
      </g>
    );
  }
  return (
    <g fill="none" stroke="#62ecff" strokeWidth="7" strokeLinecap="round">
      <path d="M91 120 Q105 107 119 120" />
      <path d="M142 120 Q156 107 170 120" />
    </g>
  );
}

export function RexHead({
  className,
  expression = "content",
}: {
  className?: string;
  expression?: RexExpression;
}) {
  return (
    <svg
      viewBox="0 0 260 210"
      className={cn("block", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rex-head-shell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffdf7" />
          <stop offset=".58" stopColor="#d9dde0" />
          <stop offset="1" stopColor="#9fa8ad" />
        </linearGradient>
        <radialGradient id="rex-visor-short" cx=".38" cy=".28" r=".8">
          <stop offset="0" stopColor="#1d3340" />
          <stop offset=".55" stopColor="#071017" />
          <stop offset="1" stopColor="#02070b" />
        </radialGradient>
      </defs>
      <path
        d="M71 22 Q130 3 189 22 Q221 35 220 82 Q218 136 176 165 Q130 184 84 165 Q42 136 40 82 Q39 35 71 22Z"
        fill="url(#rex-head-shell)"
        stroke="#77848b"
        strokeWidth="2"
      />
      <path
        d="M176 20 Q212 29 220 69 L211 63 Q202 36 174 27Z"
        fill="#e4b44c"
        opacity=".9"
      />
      <path
        d="M61 34 Q79 74 74 147"
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        opacity=".65"
      />
      <path
        d="M76 49 Q130 21 185 49 Q202 60 201 91 Q199 133 162 150 Q130 163 98 150 Q61 133 59 91 Q58 60 76 49Z"
        fill="url(#rex-visor-short)"
        stroke="#101e27"
        strokeWidth="3"
      />
      <path
        d="M79 63 Q102 42 139 47"
        fill="none"
        stroke="#7cf3ff"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity=".65"
      />
      <Eyes expression={expression} />
      {expression === "concerned" ? (
        <path d="M118 139 Q130 132 142 139" fill="none" stroke="#62ecff" strokeWidth="4" strokeLinecap="round" />
      ) : (
        <path d="M117 137 Q130 146 143 137" fill="none" stroke="#62ecff" strokeWidth="4" strokeLinecap="round" />
      )}
      <g>
        <ellipse cx="45" cy="99" rx="18" ry="28" fill="#e4b44c" />
        <ellipse cx="45" cy="99" rx="12" ry="20" fill="#0a1720" stroke="#58e8fa" strokeWidth="3" />
        <ellipse cx="215" cy="99" rx="18" ry="28" fill="#e4b44c" />
        <ellipse cx="215" cy="99" rx="12" ry="20" fill="#0a1720" stroke="#58e8fa" strokeWidth="3" />
      </g>
      <path d="M190 19 L199 -4" stroke="#9a7324" strokeWidth="5" strokeLinecap="round" />
      <path d="M199 -4 L212 2" stroke="#e4b44c" strokeWidth="5" strokeLinecap="round" />
      <circle cx="213" cy="2" r="4" fill="#62ecff" />
      <path
        d="M78 170 Q130 188 182 170 L174 189 Q130 199 86 189Z"
        fill="#10181d"
      />
    </svg>
  );
}

export function RexCharacter({
  pose = "idle",
  expression = "content",
  className,
  glow = true,
}: {
  pose?: RexPose;
  expression?: RexExpression;
  className?: string;
  glow?: boolean;
}) {
  const leftArm =
    pose === "celebrate"
      ? "rotate(138 80 178)"
      : pose === "point" || pose === "transmit"
        ? "rotate(-28 80 178)"
        : pose === "inspect"
          ? "rotate(38 80 178)"
          : pose === "think"
            ? "rotate(24 80 178)"
            : pose === "low-power"
              ? "rotate(8 80 178)"
              : "rotate(2 80 178)";
  const rightArm =
    pose === "celebrate"
      ? "rotate(-138 180 178)"
      : pose === "point"
        ? "rotate(28 180 178)"
        : pose === "transmit"
          ? "rotate(35 180 178)"
          : pose === "inspect"
            ? "rotate(-58 180 178)"
            : pose === "think"
              ? "rotate(-142 180 178)"
              : pose === "low-power"
                ? "rotate(-7 180 178)"
                : "rotate(-2 180 178)";
  const legLeft =
    pose === "walk" ? "rotate(-11 99 282)" : "rotate(0 99 282)";
  const legRight =
    pose === "walk" ? "rotate(12 161 282)" : "rotate(0 161 282)";
  const head =
    pose === "think"
      ? "rotate(-5 130 137)"
      : pose === "inspect"
        ? "rotate(4 130 137)"
        : pose === "low-power"
          ? "translate(0 6) rotate(7 130 137)"
          : "rotate(0 130 137)";

  return (
    <svg
      viewBox="0 0 260 360"
      className={cn("block overflow-visible", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rex-armor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffdf7" />
          <stop offset=".52" stopColor="#dce0e2" />
          <stop offset="1" stopColor="#929da2" />
        </linearGradient>
        <linearGradient id="rex-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3c46" />
          <stop offset="1" stopColor="#070e13" />
        </linearGradient>
        <linearGradient id="rex-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6dc8f" />
          <stop offset=".55" stopColor="#e4b44c" />
          <stop offset="1" stopColor="#986e20" />
        </linearGradient>
        <radialGradient id="rex-visor" cx=".38" cy=".28" r=".8">
          <stop offset="0" stopColor="#1e3846" />
          <stop offset=".55" stopColor="#071017" />
          <stop offset="1" stopColor="#02070b" />
        </radialGradient>
        <filter id="rex-cyan-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {glow && (
          <filter id="rex-body-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.04  0 0 0 0 0.55  0 0 0 0 0.68  0 0 0 .35 0"
            />
          </filter>
        )}
      </defs>

      <ellipse cx="130" cy="344" rx="72" ry="11" fill="#031018" opacity=".65" />
      {glow && (
        <ellipse
          cx="130"
          cy="194"
          rx="98"
          ry="154"
          fill="none"
          stroke="#0b7a8f"
          strokeWidth="2"
          opacity=".15"
          filter="url(#rex-body-glow)"
        />
      )}

      <g transform={poseTransforms[pose]}>
        <g transform={legLeft}>
          <rect x="87" y="250" width="24" height="32" rx="10" fill="#111b21" />
          <path d="M78 272 Q90 264 111 274 L111 317 Q96 326 77 319Z" fill="url(#rex-armor)" stroke="#77848b" strokeWidth="1.4" />
          <rect x="83" y="314" width="37" height="23" rx="9" fill="url(#rex-dark)" stroke="#4a5b63" />
          <path d="M85 329 H117" stroke="#62ecff" strokeWidth="3.5" filter="url(#rex-cyan-glow)" />
          <circle cx="99" cy="289" r="4" fill="#0b7a8f" />
        </g>
        <g transform={legRight}>
          <rect x="149" y="250" width="24" height="32" rx="10" fill="#111b21" />
          <path d="M149 274 Q170 264 182 272 L183 319 Q164 326 149 317Z" fill="url(#rex-armor)" stroke="#77848b" strokeWidth="1.4" />
          <rect x="140" y="314" width="37" height="23" rx="9" fill="url(#rex-dark)" stroke="#4a5b63" />
          <path d="M143 329 H175" stroke="#62ecff" strokeWidth="3.5" filter="url(#rex-cyan-glow)" />
          <circle cx="161" cy="289" r="4" fill="#0b7a8f" />
        </g>

        <path d="M105 226 Q130 216 155 226 L161 274 Q130 285 99 274Z" fill="url(#rex-dark)" stroke="#374a53" />
        <path d="M100 196 Q130 183 160 196 L158 244 Q130 255 102 244Z" fill="url(#rex-armor)" stroke="#77848b" strokeWidth="1.6" />
        <path d="M108 199 Q130 190 152 199 L151 236 Q130 244 109 236Z" fill="#c9d0d3" opacity=".55" />
        <path d="M130 205 L145 229 L115 229Z" fill="#0b7a8f" stroke="#39b9c9" strokeWidth="2" />
        <path d="M130 212 L136 224 L124 224Z" fill="#62ecff" opacity=".65" />
        <circle cx="106" cy="246" r="4" fill="#e4b44c" />
        <circle cx="154" cy="246" r="4" fill="#e4b44c" />

        <g transform={leftArm}>
          <circle cx="88" cy="185" r="19" fill="url(#rex-gold)" stroke="#8b6824" strokeWidth="1.2" />
          <rect x="66" y="198" width="29" height="53" rx="13" fill="url(#rex-armor)" stroke="#77848b" />
          <rect x="70" y="244" width="22" height="21" rx="8" fill="#111b21" />
          <path d="M71 263 Q81 254 91 263 L94 283 Q82 291 69 282Z" fill="url(#rex-armor)" stroke="#6f7b80" />
          <path d="M71 285 Q82 291 94 284 L94 297 Q80 304 68 296Z" fill="url(#rex-dark)" />
          <path d="M78 217 H84" stroke="#62ecff" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g transform={rightArm}>
          <circle cx="172" cy="185" r="19" fill="url(#rex-gold)" stroke="#8b6824" strokeWidth="1.2" />
          <rect x="165" y="198" width="29" height="53" rx="13" fill="url(#rex-armor)" stroke="#77848b" />
          <rect x="168" y="244" width="22" height="21" rx="8" fill="#111b21" />
          <path d="M169 263 Q179 254 189 263 L192 283 Q180 291 167 282Z" fill="url(#rex-armor)" stroke="#6f7b80" />
          <path d="M169 285 Q180 291 192 284 L192 297 Q178 304 166 296Z" fill="url(#rex-dark)" />
          <path d="M176 217 H182" stroke="#62ecff" strokeWidth="3" strokeLinecap="round" />
        </g>

        <g transform={head}>
          <path
            d="M69 58 Q130 31 191 58 Q223 73 221 123 Q219 176 177 201 Q130 220 83 201 Q41 176 39 123 Q37 73 69 58Z"
            fill="url(#rex-armor)"
            stroke="#77848b"
            strokeWidth="2"
          />
          <path
            d="M178 55 Q214 65 221 109 L212 102 Q202 74 174 64Z"
            fill="url(#rex-gold)"
            opacity=".92"
          />
          <path
            d="M60 76 Q78 122 74 188"
            fill="none"
            stroke="#fff"
            strokeWidth="6"
            strokeLinecap="round"
            opacity=".55"
          />
          <path
            d="M74 85 Q130 58 186 85 Q202 96 201 128 Q199 169 163 186 Q130 199 97 186 Q61 169 59 128 Q58 96 74 85Z"
            fill="url(#rex-visor)"
            stroke="#101e27"
            strokeWidth="3"
          />
          <path
            d="M78 96 Q103 76 139 80"
            fill="none"
            stroke="#8ff4ff"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity=".7"
          />
          <g transform="translate(0 -4)">
            <Eyes expression={expression} />
            {expression === "concerned" ? (
              <path d="M117 173 Q130 166 143 173" fill="none" stroke="#62ecff" strokeWidth="4" strokeLinecap="round" />
            ) : (
              <path d="M117 171 Q130 180 143 171" fill="none" stroke="#62ecff" strokeWidth="4" strokeLinecap="round" />
            )}
          </g>
          <g>
            <ellipse cx="43" cy="133" rx="18" ry="29" fill="url(#rex-gold)" />
            <ellipse cx="43" cy="133" rx="12" ry="21" fill="#07131c" stroke="#58e8fa" strokeWidth="3" />
            <ellipse cx="217" cy="133" rx="18" ry="29" fill="url(#rex-gold)" />
            <ellipse cx="217" cy="133" rx="12" ry="21" fill="#07131c" stroke="#58e8fa" strokeWidth="3" />
          </g>
          <path d="M190 55 L201 23" stroke="#9a7324" strokeWidth="5" strokeLinecap="round" />
          <path d="M201 23 L218 31" stroke="url(#rex-gold)" strokeWidth="5" strokeLinecap="round" />
          <circle cx="220" cy="31" r="4.5" fill="#62ecff" filter="url(#rex-cyan-glow)" />
          <path d="M79 204 Q130 222 181 204 L174 222 Q130 232 86 222Z" fill="#10181d" />
        </g>
      </g>

      {pose === "transmit" && (
        <g fill="none" stroke="#62ecff" strokeLinecap="round" filter="url(#rex-cyan-glow)">
          <path d="M198 176 Q217 153 218 126" strokeWidth="2" strokeDasharray="4 6" />
          <path d="M209 186 Q234 154 234 119" strokeWidth="1.5" strokeDasharray="3 7" opacity=".65" />
        </g>
      )}
      {pose === "low-power" && (
        <g opacity=".65">
          <circle cx="130" cy="182" r="3" fill="#e4b44c" />
          <text x="138" y="186" fill="#e4b44c" fontSize="9" fontFamily="monospace">LOW</text>
        </g>
      )}
    </svg>
  );
}
