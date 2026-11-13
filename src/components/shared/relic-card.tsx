import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ResolvedArtifact } from "@/lib/schema";
import { computeLegacyTotal } from "@/lib/data";
import { OperationalBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

export function RelicCard({
  relic,
  index,
  className,
}: {
  relic: ResolvedArtifact;
  index: string;
  className?: string;
}) {
  const image = relic.images[0];
  const score = computeLegacyTotal(relic.legacy);

  return (
    <Link
      href={`/relics/${relic.id}`}
      className={cn(
        "group flex flex-col border border-line/80 bg-panel/40 transition-colors duration-300 hover:border-teal/60",
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-void">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover opacity-85 grayscale-[18%] transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="border border-line/80 bg-abyss/80 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-gold">
            {index}
          </span>
          <span className="border border-line/80 bg-abyss/80 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-silver">
            {relic.destination}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-teal-bright">
            {relic.mission}
          </span>
          <span className="text-muted/40">/</span>
          <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
            {relic.category}
          </span>
        </div>
        <h3 className="text-xl font-medium leading-tight tracking-[-0.025em] text-white">
          {relic.shortName}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
          {relic.description}
        </p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <OperationalBadge status={relic.operationalStatus} />
          <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
            <span>Editorial {score}</span>
            <ArrowUpRight className="size-3 text-gold transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
