import type { Metadata } from "next";
import { EvidenceExplorer } from "@/components/evidence/evidence-explorer";
import { archiveEvidence } from "@/lib/data";

export const metadata: Metadata = {
  title: "Evidence Chain",
  description:
    "Inspect the sourced claims behind SPACE RELICS. Verified mission records are separated from scientific interpretations and hypothetical scenarios.",
};

export default function EvidencePage() {
  const evidence = archiveEvidence.map((claim) => ({
    ...claim,
    sources: claim.sources.map((source) => ({
      id: source.id,
      title: source.title,
      organization: source.organization,
      url: source.url,
      category: source.category,
    })),
  }));

  return <EvidenceExplorer evidence={evidence} />;
}
