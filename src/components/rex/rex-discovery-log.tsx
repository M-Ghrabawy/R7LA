import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { ResolvedArtifact } from "@/lib/schema";
import { discoveryLogsByRelic } from "@/data/rex/discovery-logs";
import { getSources } from "@/lib/data";
import { RexHead } from "./rex-character";

export function RexDiscoveryLog({ relic }: { relic: ResolvedArtifact }) {
  const log = discoveryLogsByRelic.get(relic.id);
  if (!log) return null;
  const sourceIds = [...new Set(log.observations.flatMap((item) => item.sourceIds))];
  const sources = getSources(sourceIds);

  return (
    <section
      aria-labelledby="rex-log-title"
      className="relative overflow-hidden border border-teal/25 bg-[linear-gradient(120deg,rgba(11,122,143,.07),rgba(7,19,31,.7))]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(43,82,98,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(43,82,98,.1)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
      <div className="relative grid gap-6 p-5 md:grid-cols-[120px_minmax(0,1fr)] md:p-7">
        <div className="flex items-start gap-3 md:flex-col">
          <RexHead className="h-16 w-20 shrink-0" expression={log.expression} />
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-gold">
              REX
            </p>
            <p className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
              Discovery log
            </p>
          </div>
        </div>

        <div>
          <h2
            id="rex-log-title"
            className="max-w-3xl text-xl font-medium leading-8 tracking-[-0.02em] text-white md:text-2xl"
          >
            “{log.opening}”
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {log.observations.map((observation) => (
              <div
                key={observation.text}
                className="border-l border-teal/40 pl-3"
              >
                <p className="text-xs leading-6 text-silver/75">
                  {observation.text}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {getSources(observation.sourceIds).map((source) => (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[7px] uppercase tracking-[0.08em] text-teal/75 hover:text-gold"
                      title={`${source.title} — ${source.organization}`}
                    >
                      {source.organization}
                      <ExternalLink className="size-2.5" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 border-t border-line/50 pt-4 text-sm italic leading-6 text-gold/80">
            {log.question}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {sources.slice(0, 3).map((source) => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-line/60 px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.08em] text-muted hover:text-silver"
                >
                  {source.organization}
                </a>
              ))}
            </div>
            <Link
              href={`/rex/relic/${relic.id}`}
              className="group inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.12em] text-gold transition-colors hover:text-white"
            >
              Play REX field study
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
