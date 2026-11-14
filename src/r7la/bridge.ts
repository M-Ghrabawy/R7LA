/**
 * Bridge between the R7LA 3D observatory and the R7LA archive.
 * R7LA groups some artifacts (e.g. all Apollo Lunar Modules), so these
 * maps point at the best primary archive record for each 3D artifact.
 */

export const R7LA_TO_RELIC: Record<string, string> = {
  "apollo-lunar-modules": "apollo-11-lunar-module",
  "lunar-roving-vehicles": "apollo-15-lunar-roving-vehicle",
  "alsep-packages": "apollo-11-laser-ranging-retroreflector",
  "surveyor-landers": "surveyor-3",
  "lunokhod-1": "lunokhod-1",
  "sojourner-rover": "sojourner",
  "spirit-opportunity": "opportunity",
  "viking-1-2": "viking-1",
  curiosity: "curiosity",
  perseverance: "perseverance",
  "mars-pathfinder": "mars-pathfinder",
};

export const RELIC_TO_R7LA: Record<string, string> = {
  "apollo-11-lunar-module": "apollo-lunar-modules",
  "apollo-12-lunar-module": "apollo-lunar-modules",
  "apollo-17-lunar-module": "apollo-lunar-modules",
  "apollo-15-lunar-roving-vehicle": "lunar-roving-vehicles",
  "apollo-11-laser-ranging-retroreflector": "alsep-packages",
  "surveyor-3": "surveyor-landers",
  "lunokhod-1": "lunokhod-1",
  sojourner: "sojourner-rover",
  "mars-pathfinder": "mars-pathfinder",
  spirit: "spirit-opportunity",
  opportunity: "spirit-opportunity",
  curiosity: "curiosity",
  perseverance: "perseverance",
  "viking-1": "viking-1-2",
};

/** Reverse: 3D artifacts that map to an extended-catalogue record. */
export const R7LA_TO_EXTENDED: Record<string, string> = {
  "phoenix-insight": "phoenix",
  ingenuity: "ingenuity",
  dawn: "dawn",
  "near-shoemaker": "near-shoemaker",
  "pioneer-10-11": "pioneer-10",
  "kepler-telescope": "kepler",
  "alsep-packages": "apollo-12-alsep",
  "lunar-roving-vehicles": "apollo-17-lrv",
  "surveyor-landers": "surveyor-1",
  "viking-1-2": "viking-2-lander",
};

export function archiveHrefForMission(missionId: string): string {
  const relicId = R7LA_TO_RELIC[missionId];
  if (relicId) return `/relics/${relicId}`;
  const catalogueId = R7LA_TO_EXTENDED[missionId];
  return catalogueId ? `/catalog/${catalogueId}` : "/catalog";
}

export function observatoryHrefForRelic(relicId: string): string | null {
  const missionId = RELIC_TO_R7LA[relicId];
  return missionId ? `/observatory?artifact=${missionId}` : null;
}

/** Extended-catalogue records that also have a 3D artifact. */
export const EXTENDED_TO_R7LA: Record<string, string> = {
  "apollo-12-alsep": "alsep-packages",
  "apollo-17-lrv": "lunar-roving-vehicles",
  "surveyor-1": "surveyor-landers",
  "viking-2-lander": "viking-1-2",
  phoenix: "phoenix-insight",
  insight: "phoenix-insight",
  ingenuity: "ingenuity",
  dawn: "dawn",
  "near-shoemaker": "near-shoemaker",
  "pioneer-10": "pioneer-10-11",
  "pioneer-11": "pioneer-10-11",
  kepler: "kepler-telescope",
};

export function observatoryHrefForExtended(objectId: string): string | null {
  const missionId = EXTENDED_TO_R7LA[objectId];
  return missionId ? `/observatory?artifact=${missionId}` : null;
}
