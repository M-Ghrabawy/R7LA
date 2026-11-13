import type { LegacyAssessment } from "@/lib/schema";
import {
  computeLegacyTotal,
  legacyDimensionMeta,
  type LegacyWeights,
} from "@/lib/data";
import { EditorialDisclosure } from "@/components/shared/disclosures";
import { cn } from "@/lib/utils";

export function LegacyScorePanel({
  assessment,
  weights,
  compact = false,
}: {
  assessment: LegacyAssessment;
  weights?: LegacyWeights;
  compact?: boolean;
}) {
  const score = computeLegacyTotal(assessment, weights);
  const dimensions = Object.keys(
    legacyDimensionMeta,
  ) as Array<keyof typeof legacyDimensionMeta>;

  return (
    <div
      className={cn(
        "border border-gold/25 bg-gold/[0.025]",
        compact ? "p-4" : "p-5 md:p-7",
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-gold">
            Legacy score / editorial
          </p>
          <p className="mt-2 max-w-md text-xs leading-5 text-muted">
            A transparent AFTERLIGHT assessment across five dimensions. This is
            not an official NASA rating.
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-4xl leading-none text-gold md:text-5xl">
            {String(score).padStart(2, "0")}
          </p>
          <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.15em] text-muted">
            / 100
          </p>
        </div>
      </div>

      <div className={cn("mt-6", compact ? "space-y-3" : "space-y-5")}>
        {dimensions.map((key) => {
          const meta = legacyDimensionMeta[key];
          return (
            <div key={key}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[7px] text-gold/70">
                    {meta.short}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-silver/85">
                    {meta.label}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-silver">
                  {assessment.dimensions[key]}
                </span>
              </div>
              <div className="mt-2 h-1 bg-line/60">
                <div
                  className="h-full bg-gold/80"
                  style={{ width: `${assessment.dimensions[key]}%` }}
                />
              </div>
              {!compact && (
                <p className="mt-2 max-w-xl text-[11px] leading-5 text-muted">
                  {assessment.rationales[key]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <EditorialDisclosure className="mt-6" />
    </div>
  );
}
