import { ArrowUpRight, FileText } from "lucide-react";
import { getSources } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SourceLinks({
  sourceIds,
  className,
  compact = false,
}: {
  sourceIds: string[];
  className?: string;
  compact?: boolean;
}) {
  const unique = [...new Set(sourceIds)];
  const sources = getSources(unique);

  return (
    <div className={cn("space-y-2", className)}>
      {sources.map((source) => (
        <a
          key={source.id}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group flex items-start gap-3 border border-line/50 bg-void/20 p-3 transition-colors hover:border-teal/60 hover:bg-teal/5",
            compact && "items-center p-2",
          )}
        >
          <FileText className="mt-0.5 size-3.5 shrink-0 text-teal" />
          <span className="min-w-0 flex-1">
            <span className="block text-xs leading-5 text-silver group-hover:text-white">
              {source.title}
            </span>
            {!compact && (
              <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
                {source.organization} · {source.category}
              </span>
            )}
          </span>
          <ArrowUpRight className="size-3 shrink-0 text-muted transition-colors group-hover:text-gold" />
        </a>
      ))}
    </div>
  );
}

export function InlineSources({ sourceIds }: { sourceIds: string[] }) {
  const sources = getSources([...new Set(sourceIds)]);
  return (
    <span className="inline-flex flex-wrap gap-x-2 gap-y-1">
      {sources.map((source, index) => (
        <a
          key={source.id}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[8px] uppercase tracking-[0.1em] text-teal/80 underline decoration-teal/30 underline-offset-2 hover:text-gold"
          title={`${source.title} — ${source.organization}`}
        >
          [{index + 1}]
        </a>
      ))}
    </span>
  );
}
