import { existsSync } from "node:fs";
import { join } from "node:path";
import { relics, sources, archiveEvidence, archiveTimeline } from "../src/lib/data";

const errors: string[] = [];
const publicDir = join(process.cwd(), "public");
const sourceIds = new Set<string>();

for (const source of sources) {
  if (sourceIds.has(source.id)) {
    errors.push(`Duplicate source id: ${source.id}`);
  }
  sourceIds.add(source.id);
  if (!source.url.startsWith("https://")) {
    errors.push(`Source is not HTTPS: ${source.id} (${source.url})`);
  }
}

for (const relic of relics) {
  if (!relic.sourceIds.length) {
    errors.push(`${relic.id}: no sources`);
  }
  if (relic.endDate && relic.endDate < relic.landingDate) {
    errors.push(
      `${relic.id}: endDate ${relic.endDate} precedes landingDate ${relic.landingDate}`,
    );
  }
  for (const image of relic.images) {
    const filePath = join(publicDir, image.src.replace(/^\//, ""));
    if (!existsSync(filePath)) {
      errors.push(`${relic.id}: missing image file ${image.src}`);
    }
  }
  const claimIds = new Set<string>();
  for (const claim of relic.claims) {
    if (claimIds.has(claim.id)) {
      errors.push(`${relic.id}: duplicate claim id ${claim.id}`);
    }
    claimIds.add(claim.id);
  }
  const eventIds = new Set<string>();
  for (const event of relic.timeline) {
    if (eventIds.has(event.id)) {
      errors.push(`${relic.id}: duplicate event id ${event.id}`);
    }
    eventIds.add(event.id);
    if (event.date < relic.landingDate && event.type === "discovery") {
      errors.push(
        `${relic.id}: discovery event ${event.id} predates landing (verify intentional)`,
      );
    }
  }
}

const ids = relics.map((relic) => relic.id);
if (new Set(ids).size !== ids.length) {
  errors.push("Relic ids are not unique");
}

const uncoveredClaims = archiveEvidence.filter(
  (claim) => claim.sources.length === 0,
);
if (uncoveredClaims.length) {
  errors.push(
    `Claims without resolved sources: ${uncoveredClaims.map((claim) => claim.id).join(", ")}`,
  );
}

const eventsWithoutSources = archiveTimeline.filter(
  (event) => event.sourceIds.length === 0,
);
if (eventsWithoutSources.length) {
  errors.push(
    `Timeline events without sources: ${eventsWithoutSources.map((event) => event.id).join(", ")}`,
  );
}

if (errors.length) {
  console.error("DATA VALIDATION FAILED");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("SPACE RELICS data validation passed");
console.log(`  relics: ${relics.length}`);
console.log(`  sources: ${sources.length}`);
console.log(`  claims: ${archiveEvidence.length}`);
console.log(`  timeline events: ${archiveTimeline.length}`);
console.log(`  images: ${relics.reduce((sum, relic) => sum + relic.images.length, 0)}`);
