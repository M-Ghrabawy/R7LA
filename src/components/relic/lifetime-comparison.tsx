import type { Lifetime } from "@/lib/schema";
import { cn } from "@/lib/utils";

const toDays = (lifetime: Lifetime) => {
  switch (lifetime.unit) {
    case "hours":
      return lifetime.value / 24;
    case "days":
      return lifetime.value;
    case "sols":
      return lifetime.value * 1.0275;
    case "months":
      return lifetime.value * 30.44;
    case "years":
      return lifetime.value * 365.25;
  }
};

function displayLifetime(lifetime: Lifetime | undefined) {
  if (!lifetime) {
    return {
      value: "Not established",
      detail: "No verified planned lifetime is stated in the cited record.",
    };
  }
  const unit =
    lifetime.unit === "sols"
      ? lifetime.value === 1
        ? "sol"
        : "sols"
      : lifetime.value === 1
        ? lifetime.unit.slice(0, -1)
        : lifetime.unit;
  return {
    value: `${lifetime.approximate ? "≈ " : ""}${lifetime.value.toLocaleString("en-US")} ${unit}`,
    detail: lifetime.ongoing
      ? `${lifetime.label} · ongoing`
      : lifetime.label,
  };
}

export function LifetimeComparison({
  planned,
  actual,
  basis,
}: {
  planned?: Lifetime;
  actual?: Lifetime;
  basis: string;
}) {
  const plannedDisplay = displayLifetime(planned);
  const actualDisplay = displayLifetime(actual);
  const maxDays = Math.max(
    actual ? toDays(actual) : 0,
    planned ? toDays(planned) : 0,
    1,
  );
  const plannedWidth = planned
    ? Math.max(2, Math.min(100, (toDays(planned) / maxDays) * 100))
    : 0;
  const actualWidth = actual
    ? Math.max(2, Math.min(100, (toDays(actual) / maxDays) * 100))
    : 0;

  return (
    <div className="border border-line/70 bg-panel/25 p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-gold">
          Planned / actual operational life
        </p>
        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
          Basis: {basis}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="border border-line/60 p-4">
          <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-muted">
            Planned
          </p>
          <p className="mt-3 font-mono text-xl text-silver">
            {plannedDisplay.value}
          </p>
          <p className="mt-1 text-[11px] leading-5 text-muted">
            {plannedDisplay.detail}
          </p>
          <div className="mt-4 h-1.5 bg-line/50">
            <div
              className="h-full bg-silver/45"
              style={{ width: `${plannedWidth}%` }}
            />
          </div>
        </div>
        <div className="border border-teal/30 bg-teal/[0.035] p-4">
          <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-teal-bright">
            Actual
          </p>
          <p className="mt-3 font-mono text-xl text-white">
            {actualDisplay.value}
          </p>
          <p className="mt-1 text-[11px] leading-5 text-silver/65">
            {actualDisplay.detail}
          </p>
          <div className="relative mt-4 h-1.5 bg-line/50">
            <div
              className={cn(
                "h-full",
                actual?.ongoing
                  ? "bg-[repeating-linear-gradient(90deg,#39b9c9_0,#39b9c9_5px,transparent_5px,transparent_9px)]"
                  : "bg-teal-bright",
              )}
              style={{ width: `${actualWidth}%` }}
            />
          </div>
        </div>
      </div>

      {planned && actual && !actual.ongoing && (
        <p className="mt-4 border-t border-line/50 pt-4 font-mono text-[8px] uppercase leading-5 tracking-[0.1em] text-muted">
          Actual duration{" "}
          <span className="text-gold">
            {toDays(actual) >= toDays(planned) ? "exceeded" : "fell short of"}{" "}
            the plan
          </span>{" "}
          by{" "}
          {Math.abs(
            Math.round(((toDays(actual) - toDays(planned)) / toDays(planned)) * 100),
          )}
          %. Values are normalized for comparison; sols and units remain as
          recorded.
        </p>
      )}
      {!planned && (
        <p className="mt-4 border-t border-line/50 pt-4 font-mono text-[8px] uppercase leading-5 tracking-[0.1em] text-muted">
          A planned lifetime is not displayed because no verified numeric figure
          is established in the cited source. No value has been inferred.
        </p>
      )}
    </div>
  );
}
