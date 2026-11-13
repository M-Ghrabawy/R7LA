import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  index,
  label,
  title,
  description,
  action,
  className,
}: {
  index?: string;
  label: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 border-t border-line/70 pt-5 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-[9px] text-gold">{index ?? "01"}</span>
          <span className="h-px w-8 bg-line-bright" />
          <span className="technical-label">{label}</span>
        </div>
        <h2 className="max-w-3xl text-balance text-3xl font-medium leading-[1.05] tracking-[-0.035em] text-white md:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
