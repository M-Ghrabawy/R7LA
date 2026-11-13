import { existsSync } from "node:fs";
import { join } from "node:path";
import { relics, sources, archiveEvidence, archiveTimeline } from "../src/lib/data";
import { rexChapters } from "../src/data/rex/chapters";
import { discoveryLogs } from "../src/data/rex/discovery-logs";
import { fieldStudies } from "../src/data/rex/field-studies";
import {
  chapterSchema,
  fieldStudySchema,
  rexLogSchema,
} from "../src/lib/story/schema";

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

const relicIds = new Set(relics.map((relic) => relic.id));
const storySlugs = new Set<string>();

for (const log of discoveryLogs) {
  const parsed = rexLogSchema.safeParse(log);
  if (!parsed.success) {
    errors.push(`Invalid REX log ${log.relicId}: ${parsed.error.issues[0]?.message}`);
  }
  if (!relicIds.has(log.relicId)) {
    errors.push(`REX log references unknown relic: ${log.relicId}`);
  }
  for (const observation of log.observations) {
    for (const sourceId of observation.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        errors.push(`REX log ${log.relicId} references unknown source ${sourceId}`);
      }
    }
  }
}

for (const chapter of rexChapters) {
  const parsed = chapterSchema.safeParse(chapter);
  if (!parsed.success) {
    errors.push(`Invalid chapter ${chapter.slug}: ${parsed.error.issues[0]?.message}`);
  }
  if (storySlugs.has(chapter.slug)) {
    errors.push(`Duplicate story slug: ${chapter.slug}`);
  }
  storySlugs.add(chapter.slug);
  const sceneIds = new Set<string>();
  for (const scene of chapter.scenes) {
    if (sceneIds.has(scene.id)) {
      errors.push(`Chapter ${chapter.slug} duplicate scene id ${scene.id}`);
    }
    sceneIds.add(scene.id);
    for (const sourceId of scene.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        errors.push(`Chapter ${chapter.slug} scene ${scene.id} unknown source ${sourceId}`);
      }
    }
    for (const artifactId of scene.artifactIds) {
      if (!relicIds.has(artifactId)) {
        errors.push(`Chapter ${chapter.slug} scene ${scene.id} unknown artifact ${artifactId}`);
      }
    }
    if (scene.puzzle) {
      if (scene.puzzle.type === "sequence") {
        const itemIds = new Set(scene.puzzle.items.map((item) => item.id));
        if (
          scene.puzzle.answer.length !== scene.puzzle.items.length ||
          new Set(scene.puzzle.answer).size !== scene.puzzle.answer.length ||
          scene.puzzle.answer.some((id) => !itemIds.has(id))
        ) {
          errors.push(`Chapter ${chapter.slug} scene ${scene.id} has invalid sequence puzzle`);
        }
      }
      if (scene.puzzle.type === "classify") {
        const bucketIds = new Set(scene.puzzle.buckets.map((bucket) => bucket.id));
        if (scene.puzzle.items.some((item) => !bucketIds.has(item.answer))) {
          errors.push(`Chapter ${chapter.slug} scene ${scene.id} has unknown classify bucket`);
        }
      }
      if (scene.puzzle.type === "choice") {
        const answer = scene.puzzle.answer;
        if (!scene.puzzle.options.some((option) => option.id === answer)) {
          errors.push(`Chapter ${chapter.slug} scene ${scene.id} has unknown choice answer`);
        }
      }
      if (scene.puzzle.type === "hotspot") {
        for (const hotspot of scene.puzzle.hotspots) {
          for (const sourceId of hotspot.sourceIds) {
            if (!sourceIds.has(sourceId)) {
              errors.push(`Chapter ${chapter.slug} scene ${scene.id} hotspot unknown source ${sourceId}`);
            }
          }
        }
        if (scene.puzzle.required > scene.puzzle.hotspots.length) {
          errors.push(`Chapter ${chapter.slug} scene ${scene.id} requires more hotspots than exist`);
        }
      }
    }
  }
}

for (const study of fieldStudies) {
  const parsed = fieldStudySchema.safeParse(study);
  if (!parsed.success) {
    errors.push(`Invalid field study ${study.slug}: ${parsed.error.issues[0]?.message}`);
  }
  if (storySlugs.has(`relic-${study.slug}`)) {
    errors.push(`Duplicate field study slug: ${study.slug}`);
  }
  storySlugs.add(`relic-${study.slug}`);
  if (!relicIds.has(study.relicId)) {
    errors.push(`Field study ${study.slug} unknown relic`);
  }
  for (const scene of study.scenes) {
    for (const sourceId of scene.sourceIds) {
      if (!sourceIds.has(sourceId)) {
        errors.push(`Field study ${study.slug} scene ${scene.id} unknown source ${sourceId}`);
      }
    }
  }
}

for (const relic of relics) {
  if (!discoveryLogs.some((log) => log.relicId === relic.id)) {
    errors.push(`Missing REX discovery log for ${relic.id}`);
  }
  if (!fieldStudies.some((study) => study.relicId === relic.id)) {
    errors.push(`Missing REX field study for ${relic.id}`);
  }
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
console.log(`  REX chapters: ${rexChapters.length}`);
console.log(`  REX scenes: ${rexChapters.reduce((sum, chapter) => sum + chapter.scenes.length, 0)}`);
console.log(`  REX field studies: ${fieldStudies.length}`);
console.log(`  REX discovery logs: ${discoveryLogs.length}`);
