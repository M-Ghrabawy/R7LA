import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden="true"
      className={cn("size-8", className)}
    >
      <circle cx="21" cy="21" r="18.5" stroke="currentColor" strokeOpacity=".38" />
      <ellipse
        cx="21"
        cy="21"
        rx="18.5"
        ry="7.5"
        stroke="currentColor"
        strokeOpacity=".55"
        transform="rotate(-28 21 21)"
      />
      <circle cx="21" cy="21" r="4.25" fill="currentColor" />
      <circle cx="21" cy="21" r="8.5" stroke="currentColor" strokeOpacity=".75" />
      <path d="M21 0v6M21 36v6M0 21h6M36 21h6" stroke="currentColor" strokeOpacity=".6" />
      <circle cx="34.5" cy="10.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <BrandMark className="size-7 text-gold" />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-[0.28em] text-white">
          R7LA
        </span>
        {!compact && (
          <span className="mt-1.5 font-mono text-[7px] uppercase tracking-[0.34em] text-muted">
            AFTERLIGHT / ARCHIVE 01
          </span>
        )}
      </span>
    </span>
  );
}
