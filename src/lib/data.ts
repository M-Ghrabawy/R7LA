import { rawRelics } from "@/data/relics";
import { sourceMap, sources } from "@/data/sources";

export { sources };
import {
  artifactSchema,
  type Artifact,
  type Claim,
  type Destination,
  type ResolvedArtifact,
  type Source,
  type TimelineEvent,
} from "./schema";

function parseArtifacts(): Artifact[] {
  const parsed: Artifact[] = [];
  const ids = new Set<string>();

  for (const raw of rawRelics) {
    const result = artifactSchema.safeParse(raw);
    if (!result.success) {
      const details = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      throw new Error(`Invalid relic record "${raw.id}":\n${details}`);
    }
    if (ids.has(result.data.id)) {
      throw new Error(`Duplicate relic id: ${result.data.id}`);
    }
    ids.add(result.data.id);
    parsed.push(result.data);
  }

  return parsed;
}

function validateReferences(artifacts: Artifact[]) {
  for (const artifact of artifacts) {
    const references = new Set<string>([
      ...artifact.sourceIds,
      ...artifact.coordinates.sourceIds,
      ...artifact.claims.flatMap((claim) => claim.sourceIds),
      ...artifact.timeline.flatMap((event) => event.sourceIds),
      ...artifact.purpose.flatMap((statement) => statement.sourceIds),
      ...artifact.operationalHistory.flatMap(
        (statement) => statement.sourceIds,
      ),
      ...artifact.scientificLegacy.flatMap(
        (statement) => statement.sourceIds,
      ),
      ...artifact.images.map((image) => image.sourceId),
      ...artifact.models.flatMap((model) =>
        model.sourceId ? [model.sourceId] : [],
      ),
    ]);

    for (const sourceId of references) {
      if (!sourceMap.has(sourceId)) {
        throw new Error(
          `Relic "${artifact.id}" references unknown source "${sourceId}"`,
        );
      }
    }
  }
}

const parsedRelics = parseArtifacts();
validateReferences(parsedRelics);

export const relics: ResolvedArtifact[] = parsedRelics.map((artifact) => ({
  ...artifact,
  sources: artifact.sourceIds
    .map((id) => sourceMap.get(id))
    .filter((source): source is Source => Boolean(source)),
}));

export const relicsById = new Map(relics.map((relic) => [relic.id, relic]));

export function getRelic(id: string): ResolvedArtifact | undefined {
  return relicsById.get(id);
}

export function getSources(ids: string[]): Source[] {
  return ids
    .map((id) => sourceMap.get(id))
    .filter((source): source is Source => Boolean(source));
}

export function getSource(id: string): Source | undefined {
  return sourceMap.get(id);
}

export const destinationOrder: Destination[] = ["Moon", "Mars"];

export function relicsForDestination(destination: Destination) {
  return relics.filter((relic) => relic.destination === destination);
}

export const archiveStats = {
  relics: relics.length,
  worlds: new Set(relics.map((relic) => relic.destination)).size,
  missions: new Set(relics.map((relic) => relic.mission)).size,
  active: relics.filter(
    (relic) =>
      relic.operationalStatus === "active" ||
      relic.operationalStatus === "passive-operational",
  ).length,
  identifiedSources: sources.length,
  earliestLanding: relics
    .map((relic) => relic.landingDate)
    .sort((a, b) => a.localeCompare(b))[0],
  latestLanding: relics
    .map((relic) => relic.landingDate)
    .sort((a, b) => b.localeCompare(a))[0],
};

export type TimelineEntry = TimelineEvent & {
  relicId: string;
  relicName: string;
  mission: string;
  destination: Destination;
};

export const archiveTimeline: TimelineEntry[] = relics
  .flatMap((relic) =>
    relic.timeline.map((event) => ({
      ...event,
      relicId: relic.id,
      relicName: relic.shortName,
      mission: relic.mission,
      destination: relic.destination,
    })),
  )
  .sort((a, b) => a.date.localeCompare(b.date));

export type EvidenceEntry = Claim & {
  relicId: string;
  relicName: string;
  mission: string;
  destination: Destination;
  sources: Source[];
};

export const archiveEvidence: EvidenceEntry[] = relics.flatMap((relic) =>
  relic.claims.map((claim) => ({
    ...claim,
    relicId: relic.id,
    relicName: relic.shortName,
    mission: relic.mission,
    destination: relic.destination,
    sources: getSources(claim.sourceIds),
  })),
);

export {
  computeLegacyTotal,
  defaultLegacyWeights,
  legacyDimensionMeta,
  legacyDimensionKeys,
  sortRelicsByLegacy,
} from "./legacy";
export type { LegacyWeights } from "./legacy";

export function formatCoordinate(
  latitude: number,
  longitude: number,
): string {
  const lat = `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? "N" : "S"}`;
  const lon = `${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? "E" : "W"}`;
  return `${lat} · ${lon}`;
}

export function formatDate(date: string) {
  if (/^\d{4}$/.test(date)) return date;
  const parts = date.split("-").map(Number);
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  if (parts.length === 2) return `${months[parts[1] - 1]} ${parts[0]}`;
  return `${String(parts[2]).padStart(2, "0")} ${months[parts[1] - 1]} ${parts[0]}`;
}

export function destinationSlug(destination: Destination) {
  return destination.toLowerCase();
}
