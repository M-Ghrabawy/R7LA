import type { Metadata } from "next";
import { LegacyExplorer } from "@/components/legacy/legacy-explorer";
import { getSource, relics, sortRelicsByLegacy } from "@/lib/data";
import { computeLegacyTotal } from "@/lib/legacy";

export const metadata: Metadata = {
  title: "Legacy Score",
  description:
    "Explore the SPACE RELICS editorial Legacy Score: scientific contribution, mission significance, historical importance, longevity, and continued value. Not a NASA rating.",
};

export default function LegacyPage() {
  const sorted = sortRelicsByLegacy(relics);
  const items = sorted.map((relic) => ({
    id: relic.id,
    shortName: relic.shortName,
    mission: relic.missionShort,
    destination: relic.destination,
    category: relic.category,
    landingDate: relic.landingDate,
    operationalStatus: relic.operationalStatus,
    legacy: relic.legacy,
    score: computeLegacyTotal(relic.legacy),
    sources: relic.sourceIds
      .map((id) => getSource(id))
      .filter((source): source is NonNullable<typeof source> => Boolean(source))
      .slice(0, 3)
      .map((source) => ({
        id: source.id,
        title: source.title,
        organization: source.organization,
        url: source.url,
      })),
  }));

  return <LegacyExplorer items={items} />;
}
