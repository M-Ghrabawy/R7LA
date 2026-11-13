import type { TimelineEvent } from "@/lib/schema";
import { InlineSources } from "@/components/shared/source-list";
import { cn } from "@/lib/utils";

const eventLabel: Record<TimelineEvent["type"], string> = {
  launch: "Launch",
  arrival: "Arrival",
  landing: "Landing",
  deployment: "Deployment",
  discovery: "Discovery",
  record: "Record",
  loss: "Loss of contact",
  end: "End of mission",
  legacy: "Legacy",
};

export function TimelineList({
  events,
  compact = false,
}: {
  events: TimelineEvent[];
  compact?: boolean;
}) {
  return (
    <ol className="relative">
      <div className="absolute bottom-0 left-[7px] top-2 w-px bg-line/70" />
      {events.map((event, index) => (
        <li key={event.id} className="relative pb-7 pl-7 last:pb-0">
          <span
            className={cn(
              "absolute left-0 top-1 flex size-[15px] items-center justify-center rounded-full border bg-abyss",
              event.significance === "primary"
                ? "border-gold/80"
                : "border-line-bright",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                event.significance === "primary" ? "bg-gold" : "bg-muted",
              )}
            />
          </span>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-gold">
              {event.dateLabel}
            </span>
            <span className="font-mono text-[7px] uppercase tracking-[0.13em] text-muted">
              {eventLabel[event.type]}
            </span>
            <span className="font-mono text-[7px] text-muted/40">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3
            className={cn(
              "mt-1.5 font-medium tracking-[-0.015em] text-white",
              compact ? "text-sm" : "text-base",
            )}
          >
            {event.title}
          </h3>
          <p className="mt-1.5 max-w-2xl text-xs leading-6 text-muted">
            {event.summary}
          </p>
          <div className="mt-2">
            <InlineSources sourceIds={event.sourceIds} />
          </div>
        </li>
      ))}
    </ol>
  );
}
