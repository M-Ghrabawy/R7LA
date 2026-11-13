import {
  operationalStatusLabels,
  physicalStatusLabels,
  type OperationalStatus,
  type PhysicalStatus,
  type Verification,
  verificationLabels,
} from "@/lib/schema";
import { cn } from "@/lib/utils";

const operationalTone: Record<OperationalStatus, string> = {
  active: "border-teal-bright/40 bg-teal/10 text-teal-bright",
  "passive-operational": "border-gold/40 bg-gold/5 text-gold",
  inactive: "border-line-bright text-muted",
  decommissioned: "border-line-bright text-muted",
  unknown: "border-line text-muted",
};

const physicalTone: Record<PhysicalStatus, string> = {
  present: "border-teal/30 text-teal-bright",
  "present-unverified": "border-gold/30 text-gold/90",
  impacted: "border-line-bright text-muted",
  unknown: "border-line text-muted",
};

const verificationTone: Record<Verification, string> = {
  verified: "border-teal/40 bg-teal/10 text-teal-bright",
  interpretation: "border-gold/40 bg-gold/5 text-gold",
  hypothetical: "border-purple-300/30 bg-purple-300/5 text-purple-200",
};

const dotTone: Record<OperationalStatus, string> = {
  active: "bg-teal-bright shadow-[0_0_8px_rgba(57,185,201,.8)]",
  "passive-operational": "bg-gold shadow-[0_0_8px_rgba(228,180,76,.55)]",
  inactive: "bg-muted/60",
  decommissioned: "bg-muted/60",
  unknown: "bg-muted/30",
};

export function OperationalBadge({
  status,
  className,
}: {
  status: OperationalStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border px-2.5 py-1.5 font-mono text-[9px] uppercase leading-none tracking-[0.12em]",
        operationalTone[status],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotTone[status])} />
      {operationalStatusLabels[status]}
    </span>
  );
}

export function PhysicalBadge({
  status,
  className,
}: {
  status: PhysicalStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex border px-2.5 py-1.5 font-mono text-[9px] uppercase leading-none tracking-[0.12em]",
        physicalTone[status],
        className,
      )}
    >
      {physicalStatusLabels[status]}
    </span>
  );
}

export function VerificationBadge({
  status,
  className,
}: {
  status: Verification;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex border px-2 py-1 font-mono text-[8px] uppercase leading-none tracking-[0.13em]",
        verificationTone[status],
        className,
      )}
    >
      {verificationLabels[status]}
    </span>
  );
}
