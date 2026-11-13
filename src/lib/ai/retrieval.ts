import { getRelic, relics } from "@/lib/data";
import type { ResolvedArtifact } from "@/lib/schema";

export function resolveRelic(
  relicId: string | null | undefined,
  message: string,
): ResolvedArtifact | null {
  if (relicId) return getRelic(relicId) ?? null;

  const normalized = message.toLowerCase();
  let best: { relic: ResolvedArtifact; score: number } | null = null;

  for (const relic of relics) {
    const terms = [
      relic.name,
      relic.shortName,
      relic.mission,
      relic.missionShort,
      relic.category,
      relic.destination,
    ];
    let score = 0;
    for (const term of terms) {
      const normalizedTerm = term.toLowerCase();
      if (normalizedTerm.length > 3 && normalized.includes(normalizedTerm)) {
        score += normalizedTerm.length;
      }
      for (const word of normalizedTerm.split(/[^a-z0-9]+/)) {
        if (word.length > 3 && normalized.includes(word)) score += 1;
      }
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { relic, score };
    }
  }

  return best?.relic ?? null;
}

export function groundingSources(relic: ResolvedArtifact) {
  return relic.sources.filter((source) => source.category !== "imagery");
}

export function buildGroundingContext(relic: ResolvedArtifact) {
  const sources = groundingSources(relic);
  const lines = [
    `OBJECT: ${relic.name}`,
    `MISSION: ${relic.mission}`,
    `DESTINATION: ${relic.destination}`,
    `CATEGORY: ${relic.category}`,
    `PHYSICAL STATUS: ${relic.physicalStatus}`,
    `OPERATIONAL STATUS: ${relic.operationalStatus}`,
    `LANDING: ${relic.landingDate}${relic.endDate ? `; END: ${relic.endDate}` : ""}`,
    `COORDINATES: ${relic.coordinates.latitude}, ${relic.coordinates.longitude} (${relic.coordinates.label}; ${relic.coordinates.precision})`,
    `LIFETIME BASIS: ${relic.lifetimeBasis}`,
    relic.plannedLifetime
      ? `PLANNED LIFETIME: ${relic.plannedLifetime.value} ${relic.plannedLifetime.unit} (${relic.plannedLifetime.label})`
      : "PLANNED LIFETIME: not established in the cited record",
    relic.actualLifetime
      ? `ACTUAL LIFETIME: ${relic.actualLifetime.value} ${relic.actualLifetime.unit} (${relic.actualLifetime.label}${relic.actualLifetime.ongoing ? "; ongoing" : ""})`
      : "ACTUAL LIFETIME: not established",
    `DESCRIPTION: ${relic.description}`,
    `ORIGINAL FUNCTION: ${relic.originalFunction}`,
    `CURRENT CONDITION: ${relic.currentCondition}`,
    "",
    "PURPOSE:",
    ...relic.purpose.map(
      (statement) =>
        `- ${statement.text} [${statement.sourceIds.join(", ")}]`,
    ),
    "",
    "OPERATIONAL HISTORY:",
    ...relic.operationalHistory.map(
      (statement) =>
        `- ${statement.text} [${statement.sourceIds.join(", ")}]`,
    ),
    "",
    "SCIENTIFIC LEGACY:",
    ...relic.scientificLegacy.map(
      (statement) =>
        `- ${statement.text} [${statement.sourceIds.join(", ")}]`,
    ),
    "",
    "TIMELINE:",
    ...relic.timeline.map(
      (event) =>
        `- ${event.dateLabel}: ${event.title}. ${event.summary} [${event.sourceIds.join(", ")}]`,
    ),
    "",
    "CLAIMS:",
    ...relic.claims.map(
      (claim) =>
        `- (${claim.status}) ${claim.assertion} [${claim.sourceIds.join(", ")}]`,
    ),
    "",
    "EDITORIAL LEGACY RATIONALES (not NASA ratings):",
    ...Object.entries(relic.legacy.rationales).map(
      ([key, value]) => `- ${key}: ${value}`,
    ),
    "",
    "SOURCE INDEX:",
    ...sources.map(
      (source) =>
        `- [${source.id}] ${source.title} | ${source.organization} | ${source.url}`,
    ),
  ];

  return { text: lines.join("\n"), sources };
}

export const defaultSuggestions = [
  "Why was this object left behind?",
  "What was its original purpose?",
  "What did it discover?",
  "Is it still scientifically useful?",
  "What would happen if humans returned to it?",
  "What did humanity learn from this mission?",
];
