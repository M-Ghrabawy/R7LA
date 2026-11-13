import type { LegacyAssessment, ResolvedArtifact } from "./schema";

export type LegacyWeights = {
  scientific: number;
  mission: number;
  historical: number;
  longevity: number;
  continued: number;
};

export const defaultLegacyWeights: LegacyWeights = {
  scientific: 30,
  mission: 20,
  historical: 20,
  longevity: 15,
  continued: 15,
};

export const legacyDimensionMeta: Record<
  keyof LegacyWeights,
  { label: string; short: string; description: string }
> = {
  scientific: {
    label: "Scientific contribution",
    short: "SCI",
    description:
      "Depth of new knowledge, measurements, samples, or discoveries produced by the object or its mission.",
  },
  mission: {
    label: "Mission significance",
    short: "MSN",
    description:
      "How central the object was to achieving its mission and advancing exploration capability.",
  },
  historical: {
    label: "Historical importance",
    short: "HST",
    description:
      "The object's place in the human story of space exploration and its value as material heritage.",
  },
  longevity: {
    label: "Longevity",
    short: "LNG",
    description:
      "How long the object operated compared with its planned life, or how long it has endured as a physical record.",
  },
  continued: {
    label: "Continued scientific value",
    short: "CNT",
    description:
      "Whether the object, its data, or its physical state remains useful to current or future science.",
  },
};

export const legacyDimensionKeys = Object.keys(
  legacyDimensionMeta,
) as Array<keyof LegacyWeights>;

export function computeLegacyTotal(
  assessment: Pick<LegacyAssessment, "dimensions">,
  weights: LegacyWeights = defaultLegacyWeights,
) {
  const totalWeight = Object.values(weights).reduce(
    (sum, value) => sum + value,
    0,
  );
  if (totalWeight <= 0) return 0;
  const weighted = legacyDimensionKeys.reduce(
    (sum, key) => sum + assessment.dimensions[key] * weights[key],
    0,
  );
  return Math.round(weighted / totalWeight);
}

export function sortRelicsByLegacy(
  artifacts: ResolvedArtifact[],
  weights: LegacyWeights = defaultLegacyWeights,
) {
  return [...artifacts].sort(
    (a, b) =>
      computeLegacyTotal(b.legacy, weights) -
      computeLegacyTotal(a.legacy, weights),
  );
}
