import { z } from "zod";

export const destinationSchema = z.enum(["Moon", "Mars"]);
export const physicalStatusSchema = z.enum([
  "present",
  "present-unverified",
  "impacted",
  "unknown",
]);
export const operationalStatusSchema = z.enum([
  "active",
  "passive-operational",
  "inactive",
  "decommissioned",
  "unknown",
]);
export const verificationSchema = z.enum([
  "verified",
  "interpretation",
  "hypothetical",
]);

export const sourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  organization: z.string().min(1),
  url: z.string().url(),
  category: z.enum([
    "mission",
    "technical",
    "imagery",
    "coordinate",
    "historical",
    "dataset",
  ]),
  accessed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().optional(),
});

export type Source = z.infer<typeof sourceSchema>;

export const imageAssetSchema = z.object({
  id: z.string().min(1),
  kind: z.literal("image"),
  title: z.string().min(1),
  src: z.string().startsWith("/"),
  alt: z.string().min(1),
  credit: z.string().min(1),
  nasaId: z.string().min(1),
  sourceId: z.string().min(1),
  license: z.literal("public-domain"),
  generated: z.literal(false),
});

export const modelAssetSchema = z.object({
  id: z.string().min(1),
  kind: z.literal("model"),
  title: z.string().min(1),
  src: z.string().startsWith("/").optional(),
  sourceId: z.string().optional(),
  credit: z.string().min(1),
  format: z.enum(["glb", "schematic"]),
  generated: z.boolean(),
});

export const sourcedStatementSchema = z.object({
  text: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
  status: verificationSchema.default("verified"),
});

export const claimSchema = z.object({
  id: z.string().min(1),
  assertion: z.string().min(1),
  status: verificationSchema,
  category: z.enum([
    "mission-record",
    "scientific",
    "historical",
    "engineering",
    "imagery",
  ]),
  sourceIds: z.array(z.string()).min(1),
  note: z.string().optional(),
});

export const timelineEventSchema = z.object({
  id: z.string().min(1),
  date: z.string().regex(/^\d{4}(-\d{2})?(-\d{2})?$/),
  dateLabel: z.string().min(1),
  type: z.enum([
    "launch",
    "arrival",
    "landing",
    "deployment",
    "discovery",
    "record",
    "loss",
    "end",
    "legacy",
  ]),
  title: z.string().min(1),
  summary: z.string().min(1),
  sourceIds: z.array(z.string()).min(1),
  significance: z.enum(["primary", "secondary"]).default("secondary"),
});

export const lifetimeSchema = z.object({
  value: z.number().positive(),
  unit: z.enum(["hours", "days", "sols", "months", "years"]),
  label: z.string().min(1),
  approximate: z.boolean().default(false),
  ongoing: z.boolean().default(false),
});

export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  label: z.string().min(1),
  precision: z.enum(["exact", "approximate", "landing-ellipse"]),
  sourceIds: z.array(z.string()).min(1),
});

export const legacySchema = z.object({
  dimensions: z.object({
    scientific: z.number().min(0).max(100),
    mission: z.number().min(0).max(100),
    historical: z.number().min(0).max(100),
    longevity: z.number().min(0).max(100),
    continued: z.number().min(0).max(100),
  }),
  rationales: z.object({
    scientific: z.string().min(1),
    mission: z.string().min(1),
    historical: z.string().min(1),
    longevity: z.string().min(1),
    continued: z.string().min(1),
  }),
});

export const artifactSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  shortName: z.string().min(1),
  mission: z.string().min(1),
  missionShort: z.string().min(1),
  destination: destinationSchema,
  category: z.string().min(1),
  physicalStatus: physicalStatusSchema,
  operationalStatus: operationalStatusSchema,
  landingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  coordinates: coordinatesSchema,
  plannedLifetime: lifetimeSchema.optional(),
  actualLifetime: lifetimeSchema.optional(),
  lifetimeBasis: z.string().min(1),
  description: z.string().min(1),
  purpose: z.array(sourcedStatementSchema).min(1),
  operationalHistory: z.array(sourcedStatementSchema).min(1),
  scientificLegacy: z.array(sourcedStatementSchema).min(1),
  originalFunction: z.string().min(1),
  currentCondition: z.string().min(1),
  images: z.array(imageAssetSchema).min(1),
  models: z.array(modelAssetSchema),
  timeline: z.array(timelineEventSchema).min(3),
  claims: z.array(claimSchema).min(2),
  sourceIds: z.array(z.string()).min(2),
  legacy: legacySchema,
  featured: z.boolean().default(false),
});

export type Destination = z.infer<typeof destinationSchema>;
export type PhysicalStatus = z.infer<typeof physicalStatusSchema>;
export type OperationalStatus = z.infer<typeof operationalStatusSchema>;
export type Verification = z.infer<typeof verificationSchema>;
export type ImageAsset = z.infer<typeof imageAssetSchema>;
export type ModelAsset = z.infer<typeof modelAssetSchema>;
export type SourcedStatement = z.infer<typeof sourcedStatementSchema>;
export type Claim = z.infer<typeof claimSchema>;
export type TimelineEvent = z.infer<typeof timelineEventSchema>;
export type Lifetime = z.infer<typeof lifetimeSchema>;
export type LegacyAssessment = z.infer<typeof legacySchema>;
export type Artifact = z.infer<typeof artifactSchema>;
export type ArtifactInput = z.input<typeof artifactSchema>;
export type ResolvedArtifact = Artifact & { sources: Source[] };

export const physicalStatusLabels: Record<PhysicalStatus, string> = {
  present: "Present",
  "present-unverified": "Present · not directly imaged",
  impacted: "Impacted",
  unknown: "Unknown",
};

export const operationalStatusLabels: Record<OperationalStatus, string> = {
  active: "Operationally active",
  "passive-operational": "Passive · still detectable",
  inactive: "Inactive",
  decommissioned: "Decommissioned",
  unknown: "Unknown",
};

export const verificationLabels: Record<Verification, string> = {
  verified: "Verified record",
  interpretation: "Scientific interpretation",
  hypothetical: "Hypothetical scenario",
};
