import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Database, ScanSearch, ShieldCheck } from "lucide-react";
import { AssistantPanel } from "@/components/assistant/assistant-panel";
import { liveProviderConfigured } from "@/lib/ai";
import { getRelic, relics } from "@/lib/data";

export const metadata: Metadata = {
  title: "AI Space Archaeologist",
  description:
    "Ask grounded questions about human artifacts on the Moon and Mars. Every answer cites archive records; demo mode works without an API key.",
};

export default async function ArchaeologistPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; relic?: string }>;
}) {
  const params = await searchParams;
  const liveConfigured = liveProviderConfigured();
  const defaultRelic =
    (params.relic && getRelic(params.relic)?.id) || "apollo-11-lunar-module";
  const artifacts = relics.map((relic) => ({
    id: relic.id,
    shortName: relic.shortName,
    missionShort: relic.missionShort,
    destination: relic.destination,
    category: relic.category,
  }));

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-8 md:py-16">
      <div className="grid gap-8 border-b border-line/70 pb-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-[9px] text-gold">05</span>
            <span className="h-px w-8 bg-line-bright" />
            <span className="technical-label">
              AI space archaeologist / grounded interface
            </span>
          </div>
          <h1 className="text-balance text-4xl font-medium leading-[0.95] tracking-[-0.05em] text-white md:text-7xl">
            Ask the archive.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
            A conversational research assistant for the physical record of
            exploration. Select a relic and ask why it was left behind, what it
            discovered, or whether it still matters. Answers are limited to the
            cited archive record.
          </p>
        </div>
        <div className="lg:col-span-4">
          <div className="border border-line/70 bg-panel/25 p-4">
            <div className="flex items-center gap-2">
              <Database className="size-3.5 text-teal" />
              <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-silver">
                Retrieval scope
              </p>
            </div>
            <p className="mt-2 font-mono text-[8px] uppercase leading-5 tracking-[0.1em] text-muted">
              {relics.length} object records · cited mission, coordinate,
              historical, and imagery sources · no external browsing
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <AssistantPanel
          artifacts={artifacts}
          liveConfigured={liveConfigured}
          initialRelicId={defaultRelic}
          initialQuestion={params.q}
          className="min-h-[720px]"
        />

        <aside className="space-y-4">
          <div className="border border-line/70 bg-panel/20 p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-gold" />
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-gold">
                Grounding rules
              </p>
            </div>
            <ul className="mt-4 space-y-3 text-[11px] leading-5 text-muted">
              <li className="border-b border-line/40 pb-3">
                <span className="block font-mono text-[8px] uppercase tracking-[0.1em] text-silver">
                  No invented citations
                </span>
                Answers cite only records present in the archive. Citation
                links open the original source.
              </li>
              <li className="border-b border-line/40 pb-3">
                <span className="block font-mono text-[8px] uppercase tracking-[0.1em] text-silver">
                  Status-aware
                </span>
                Active, passive, inactive, and unverified objects are treated
                differently.
              </li>
              <li className="border-b border-line/40 pb-3">
                <span className="block font-mono text-[8px] uppercase tracking-[0.1em] text-silver">
                  Speculation is visible
                </span>
                Hypothetical scenarios carry a distinct label.
              </li>
              <li>
                <span className="block font-mono text-[8px] uppercase tracking-[0.1em] text-silver">
                  Demo mode is disclosed
                </span>
                Without an API key, no LLM runs. The interface says so.
              </li>
            </ul>
          </div>

          <div className="border border-line/70 bg-panel/20 p-5">
            <div className="flex items-center gap-2">
              <ScanSearch className="size-4 text-teal" />
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-teal-bright">
                Suggested investigations
              </p>
            </div>
            <div className="mt-4 space-y-2">
              {[
                "Why was this object left behind?",
                "What did it discover?",
                "Is it still scientifically useful?",
                "What would happen if humans returned?",
              ].map((question) => (
                <Link
                  key={question}
                  href={`/archaeologist?q=${encodeURIComponent(question)}&relic=${defaultRelic}`}
                  className="group flex items-start justify-between gap-3 border border-line/50 px-3 py-2.5 text-[11px] leading-5 text-silver/75 transition-colors hover:border-teal/40 hover:text-white"
                >
                  {question}
                  <ArrowUpRight className="mt-0.5 size-3 shrink-0 text-muted group-hover:text-gold" />
                </Link>
              ))}
            </div>
          </div>

          <div className="border border-gold/20 bg-gold/[0.025] p-5">
            <p className="font-mono text-[8px] uppercase leading-5 tracking-[0.12em] text-gold/80">
              AI disclosure
            </p>
            <p className="mt-3 text-[11px] leading-5 text-muted">
              The assistant is an independent AFTERLIGHT interface. It is not an
              official NASA system and does not represent agency conclusions.
              Curated demo answers are deterministic and generated from this
              archive. When a live provider is configured, its mode is labeled
              in the conversation.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
