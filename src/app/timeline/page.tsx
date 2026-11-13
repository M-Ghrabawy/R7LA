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
      <div className="flex flex-col gap-6 border-b border-line/70 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-[9px] text-gold">03</span>
            <span className="h-px w-8 bg-line-bright" />
            <span className="technical-label">Mission timeline / REX reconstruction</span>
          </div>
          <h1 className="text-balance text-4xl font-medium leading-none tracking-[-0.045em] text-white md:text-7xl">
            Five decades
            <br />
            <span className="text-muted">of leaving things behind.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
            Move through time across lunar and Martian missions. Launch,
            landing, discovery, loss of contact, and legacy — each event tied to
            its source.
          </p>
        </div>
        <div className="grid grid-cols-3 border border-line/70">
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
