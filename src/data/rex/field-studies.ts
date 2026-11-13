import { relics } from "@/lib/data";
import type { FieldStudy, StoryScene } from "@/lib/story/schema";
import { discoveryLogsByRelic } from "./discovery-logs";

function propsFor(category: string): StoryScene["props"] {
  const value = category.toLowerCase();
  if (value.includes("module")) return ["descent-stage", "tracks"];
  if (value.includes("roving") || value.includes("rover")) {
    return ["rover", "tracks"];
  }
  if (value.includes("lander")) return ["lander", "dish"];
  if (value.includes("retroreflector")) return ["retroreflector"];
  return ["lander", "archive-core"];
}

export const fieldStudies: FieldStudy[] = relics.map((relic) => {
  const log = discoveryLogsByRelic.get(relic.id);
  if (!log) {
    throw new Error(`Missing REX discovery log for ${relic.id}`);
  }

  const timeline = relic.timeline.slice(0, 3);
  const diagnosticProps = propsFor(relic.category);
  const background =
    relic.destination === "Moon"
      ? relic.id === "apollo-11-lunar-module"
        ? "moon"
        : "moon-crater"
      : "mars";
  const audioTheme = relic.destination === "Moon" ? "lunar" : "martian";
  const observationSourceIds = [
    ...new Set(log.observations.flatMap((item) => item.sourceIds)),
  ];
  const timelineSourceIds = [
    ...new Set(timeline.flatMap((event) => event.sourceIds)),
  ];

  const scenes: StoryScene[] = [
    {
      id: `${relic.id}-arrive`,
      kind: "explore",
      eyebrow: `Field study / ${relic.missionShort}`,
      title: relic.coordinates.label,
      dialogue: [log.opening, relic.description],
      rexPose: "walk",
      rexExpression: "curious",
      background,
      props: diagnosticProps,
      artifactIds: [relic.id],
      sourceIds: [
        ...new Set([
          ...observationSourceIds,
          ...relic.coordinates.sourceIds,
        ]),
      ],
      audioTheme,
    },
    {
      id: `${relic.id}-reconstruct`,
      kind: "puzzle",
      eyebrow: "Timeline reconstruction",
      title: "Rebuild the record.",
      dialogue: [
        `The archive contains ${relic.timeline.length} dated events for ${relic.shortName}.`,
        "Three of them are enough to anchor the mission sequence. Put them in order.",
      ],
      rexPose: "inspect",
      rexExpression: "focused",
      background: "archive",
      props: ["archive-core"],
      artifactIds: [relic.id],
      sourceIds: timelineSourceIds,
      audioTheme: "archive",
      puzzle: {
        type: "sequence",
        prompt: "Order the three mission events.",
        hint: "Use the dated archive record. Launch precedes landing; landing precedes the end of mission.",
        success: `Sequence verified. ${relic.shortName} is now anchored in the expedition archive.`,
        items: [...timeline]
          .reverse()
          .map((event) => ({ id: event.id, label: event.title })),
        answer: timeline.map((event) => event.id),
      },
    },
    {
      id: `${relic.id}-legacy`,
      kind: "archive",
      eyebrow: "Discovery log / legacy",
      title: "What should be remembered?",
      dialogue: [
        ...log.observations.map((item) => item.text),
        relic.currentCondition,
        log.question,
      ],
      rexPose:
        relic.operationalStatus === "active" ? "transmit" : "think",
      rexExpression: log.expression,
      background: "archive",
      props: ["archive-core"],
      artifactIds: [relic.id],
      sourceIds: observationSourceIds,
      audioTheme: "archive",
    },
  ];

  return {
    slug: relic.id,
    relicId: relic.id,
    title: relic.shortName,
    subtitle: `${relic.mission} / ${relic.destination}`,
    scenes,
  };
});

export const fieldStudiesBySlug = new Map(
  fieldStudies.map((study) => [study.slug, study]),
);

export const fieldStudiesByRelic = new Map(
  fieldStudies.map((study) => [study.relicId, study]),
);
