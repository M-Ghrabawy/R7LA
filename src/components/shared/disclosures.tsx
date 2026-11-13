import { Sparkles, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function EditorialDisclosure({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 border border-gold/25 bg-gold/[0.035] p-3 font-mono text-[8px] uppercase leading-5 tracking-[0.12em] text-gold/80",
        className,
      )}
    >
      <TriangleAlert className="mt-0.5 size-3 shrink-0" />
      SPACE RELICS editorial assessment by AFTERLIGHT. This is not a NASA
      rating, official ranking, or agency conclusion.
    </p>
  );
}

export function AIArtworkDisclosure({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 border border-line/70 bg-void/30 p-3 font-mono text-[8px] uppercase leading-5 tracking-[0.12em] text-muted",
        className,
      )}
    >
      <Sparkles className="mt-0.5 size-3 shrink-0 text-teal" />
      Interactive schematic. Original AFTERLIGHT visualization, not flight
      hardware and not a NASA model.
    </p>
  );
}
