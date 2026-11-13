import type { Metadata } from "next";
import { TimelineExperience } from "@/components/timeline/timeline-experience";
import { archiveTimeline, getSources } from "@/lib/data";

export const metadata: Metadata = {
  title: "Mission Timeline",
  description:
    "Navigate the chronology of human artifacts on the Moon and Mars, from Surveyor 3 to Perseverance, with sourced events.",
};

export default function TimelinePage() {
  const events = archiveTimeline.map((event) => ({
    ...event,
    sources: getSources(event.sourceIds).map((source) => ({
      id: source.id,
      title: source.title,
      organization: source.organization,
      url: source.url,
    })),
  }));

  const startYear = Number(events[0]?.date.slice(0, 4) ?? "1967");
  const endYear = 2026;

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-8 md:py-16">
      <div className="relative overflow-hidden border-b border-line/70 pb-8">
        <div className="pointer-events-none absolute -right-4 top-0 select-none font-mono text-[clamp(5rem,14vw,13rem)] leading-none tracking-[-0.08em] text-white/[0.025]">
          1967—2026
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal/40 to-transparent" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-[9px] text-gold">03</span>
              <span className="h-px w-8 bg-line-bright" />
              <span className="technical-label">
                Mission timeline / REX reconstruction
              </span>
            </div>
            <h1 className="text-balance text-4xl font-medium leading-[0.93] tracking-[-0.05em] text-white md:text-7xl">
              Every trace
              <br />
              <span className="text-muted">has a date.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
              Reconstruct five decades of exploration through launch, landing,
              discovery, silence, and legacy. Select any record to inspect the
              evidence behind it.
            </p>
          </div>
          <div className="grid grid-cols-3 border border-line/70 bg-abyss/45">
            <TimelineStat value={String(events.length)} label="Events" />
            <TimelineStat
              value={`${startYear}–${endYear}`}
              label="Time span"
              wide
            />
            <TimelineStat
              value={String(new Set(events.map((event) => event.relicId)).size)}
              label="Objects"
            />
          </div>
        </div>
      </div>

      <TimelineExperience
        events={events}
        startYear={startYear}
        endYear={endYear}
      />
    </div>
  );
}

function TimelineStat({
  value,
  label,
  wide = false,
}: {
  value: string;
  label: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`border-r border-line/60 px-4 py-3 last:border-r-0 ${wide ? "min-w-[110px]" : ""}`}
    >
      <p className="font-mono text-lg text-silver">{value}</p>
      <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
    </div>
  );
}
