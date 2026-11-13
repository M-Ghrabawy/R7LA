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
  const isRetroreflector = relic.category
    .toLowerCase()
    .includes("retroreflector");

  if (relic.destination === "Moon") {
    const sceneLanguage = [
      "The regolith has preserved the site geometry. I am mapping the object against the mission record.",
      isRetroreflector
        ? "This instrument has no power source. I need to establish a return path with light."
        : "The surface is stable. The object is not. I am recording the difference.",
      "The archive must connect the object to the people, decisions, and science that produced it.",
    ];
    const scanScene: StoryScene = {
      id: `${relic.id}-scan`,
      kind: "puzzle",
      eyebrow: "Surface scan / artifact signature",
      title: "Resolve the physical signature.",
      dialogue: [
        log.opening,
        "The site is not a single point. I am separating the artifact shell from the surface noise.",
        ...sceneLanguage.slice(0, 2),
      ],
      rexPose: "inspect",
      rexExpression: "focused",
      background,
      props: diagnosticProps,
      artifactIds: [relic.id],
      sourceIds: observationSourceIds,
      audioTheme,
      puzzle: isRetroreflector
        ? {
            type: "signal",
            prompt: "Lock the laser return from the lunar array.",
            hint: "Sweep the optical axis toward 92° and keep pulse energy in the lower-middle range.",
            success:
              "Return signal locked. The passive array is still answering Earth.",
            azimuth: { target: 92, tolerance: 8 },
            gain: { target: 48, tolerance: 14 },
          }
        : {
            type: "scan",
            prompt: "Sweep the site spectrum and resolve the artifact echoes.",
            hint: "Two strong returns are inside the 25–70 Hz band. Sweep slowly and scan each peak.",
            success:
              "Artifact signature resolved. The surface record is now linked to the archive entry.",
            tolerance: 7,
            targets: [
              {
                id: `${relic.id}-shell`,
                label: "Hardware signature",
                frequency: 31,
                detail: log.observations[0]?.text ?? relic.description,
                sourceIds: log.observations[0]?.sourceIds ?? relic.sourceIds,
              },
              {
                id: `${relic.id}-trace`,
                label: "Surface trace",
                frequency: 64,
                detail:
                  log.observations[1]?.text ??
                  relic.currentCondition,
                sourceIds:
                  log.observations[1]?.sourceIds ?? relic.coordinates.sourceIds,
              },
            ],
          },
    };

    const scenes: StoryScene[] = [
      {
        id: `${relic.id}-arrive`,
        kind: "explore",
        eyebrow: `Field study / ${relic.missionShort}`,
        title: relic.coordinates.label,
        dialogue: [
          log.opening,
          relic.description,
          `The archive places this object at ${relic.coordinates.latitude.toFixed(4)}° latitude, ${relic.coordinates.longitude.toFixed(4)}° longitude. Position precision is marked ${relic.coordinates.precision.replaceAll("-", " ")}.`,
        ],
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
      scanScene,
      {
        id: `${relic.id}-reconstruct`,
        kind: "puzzle",
        eyebrow: "Timeline reconstruction",
        title: "Anchor the record in time.",
        dialogue: [
          `The archive contains ${relic.timeline.length} dated events for ${relic.shortName}.`,
          "Three events are enough to reconstruct the mission arc. Place them in order.",
          "A physical site can survive without a clock. The archive cannot.",
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
          hint: "Launch precedes landing; landing precedes the end of mission.",
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
  }

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
