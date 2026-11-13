import type * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border border-line px-2 py-1 font-mono text-[9px] uppercase leading-none tracking-[0.14em] text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
