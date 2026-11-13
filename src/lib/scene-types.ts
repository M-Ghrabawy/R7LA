import type { ResolvedArtifact } from "./schema";

export type SceneRelic = {
  id: string;
  name: string;
  shortName: string;
  missionShort: string;
  mission: string;
  category: string;
  destination: "Moon" | "Mars";
  latitude: number;
  longitude: number;
  coordinatesLabel: string;
  landingDate: string;
  summary: string;
  imageSrc: string;
  imageAlt: string;
  legacyScore: number;
  operationalStatus: ResolvedArtifact["operationalStatus"];
  physicalStatus: ResolvedArtifact["physicalStatus"];
};

export function toSceneRelic(
  relic: ResolvedArtifact,
  legacyScore: number,
): SceneRelic {
  return {
    id: relic.id,
    name: relic.name,
    shortName: relic.shortName,
    missionShort: relic.missionShort,
    mission: relic.mission,
    category: relic.category,
    destination: relic.destination,
    latitude: relic.coordinates.latitude,
    longitude: relic.coordinates.longitude,
    coordinatesLabel: relic.coordinates.label,
    landingDate: relic.landingDate,
    summary: relic.description,
    imageSrc: relic.images[0].src,
    imageAlt: relic.images[0].alt,
    legacyScore,
    operationalStatus: relic.operationalStatus,
    physicalStatus: relic.physicalStatus,
  };
}
