import type { Claim } from "@/lib/schema";
import { VerificationBadge } from "@/components/shared/status-badge";
import { SourceLinks } from "@/components/shared/source-list";
import { cn } from "@/lib/utils";

export function EvidencePanel({
  claims,
  className,
}: {
  claims: Claim[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {claims.map((claim, index) => (
        <article
          key={claim.id}
          className={cn(
            "border p-4 md:p-5",
            claim.status === "verified"
              ? "border-line/70 bg-panel/25"
              : claim.status === "interpretation"
                ? "border-gold/25 bg-gold/[0.025]"
                : "border-purple-300/20 bg-purple-300/[0.025]",
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[8px] text-muted">
                C-{String(index + 1).padStart(2, "0")}
              </span>
              <VerificationBadge status={claim.status} />
            </div>
            <span className="font-mono text-[7px] uppercase tracking-[0.12em] text-muted">
              {claim.category}
            </span>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-silver">
            {claim.assertion}
          </p>
          {claim.note && (
            <p className="mt-2 border-l border-gold/40 pl-3 text-[11px] leading-5 text-muted">
              {claim.note}
            </p>
          )}
          <div className="mt-4">
            <SourceLinks sourceIds={claim.sourceIds} compact />
          </div>
        </article>
      ))}
    </div>
  );
}
