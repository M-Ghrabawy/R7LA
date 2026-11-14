import { z } from "zod";

export const rexPoseSchema = z.enum([
  "idle",
  "walk",
  "point",
  "inspect",
  "think",
  "celebrate",
  "transmit",
  "low-power",
]);

export const rexExpressionSchema = z.enum([
  "curious",
  "content",
  "focused",
  "concerned",
  "excited",
]);

export const sceneBackgroundSchema = z.enum([
  "observatory",
  "archive",
  "earth-orbit",
  "deep-space",
  "moon",
  "moon-crater",
  "earthrise",
  "mars",
  "mars-dust",
  "mars-canyon",
  "data-lab",
  "transmission",
]);

export const audioThemeSchema = z.enum([
  "observatory",
  "lunar",
  "martian",
  "archive",
  "tension",
  "triumph",
]);

export const scenePropSchema = z.enum([
  "descent-stage",
  "rover",
  "lander",
  "retroreflector",
  "dish",
  "sample-tube",
  "archive-core",
  "tracks",
]);

export const hotspotPuzzleSchema = z.object({
  type: z.literal("hotspot"),
  prompt: z.string().min(1),
  hint: z.string().min(1),
  required: z.number().int().positive(),
  hotspots: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        detail: z.string().min(1),
        x: z.number().min(0).max(100),
        y: z.number().min(0).max(100),
        sourceIds: z.array(z.string()),
      }),
    )
    .min(2),
});

export const sequencePuzzleSchema = z.object({
  type: z.literal("sequence"),
  prompt: z.string().min(1),
  hint: z.string().min(1),
  success: z.string().min(1),
  items: z
    .array(z.object({ id: z.string(), label: z.string() }))
    .min(3),
  answer: z.array(z.string()).min(3),
});

export const classifyPuzzleSchema = z.object({
  type: z.literal("classify"),
  prompt: z.string().min(1),
  hint: z.string().min(1),
  success: z.string().min(1),
  buckets: z
    .array(z.object({ id: z.string(), label: z.string() }))
    .min(2),
  items: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        answer: z.string(),
      }),
    )
    .min(2),
});

export const choicePuzzleSchema = z.object({
  type: z.literal("choice"),
  prompt: z.string().min(1),
  hint: z.string().min(1),
  success: z.string().min(1),
  options: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        detail: z.string(),
      }),
    )
    .min(2),
  answer: z.string(),
});

export const scanPuzzleSchema = z.object({
  type: z.literal("scan"),
  prompt: z.string().min(1),
  hint: z.string().min(1),
  success: z.string().min(1),
  tolerance: z.number().positive().max(20),
  targets: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        frequency: z.number().min(0).max(100),
        detail: z.string().min(1),
        sourceIds: z.array(z.string()),
      }),
    )
    .min(2),
});

export const excavationPuzzleSchema = z.object({
  type: z.literal("excavation"),
  prompt: z.string().min(1),
  hint: z.string().min(1),
  success: z.string().min(1),
  zones: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        detail: z.string().min(1),
        x: z.number().min(5).max(95),
        y: z.number().min(5).max(95),
        radius: z.number().min(5).max(30),
        sourceIds: z.array(z.string()).min(1),
      }),
    )
    .min(2),
});

export const signalPuzzleSchema = z.object({
  type: z.literal("signal"),
  prompt: z.string().min(1),
  hint: z.string().min(1),
  success: z.string().min(1),
  azimuth: z.object({
    target: z.number().min(0).max(180),
    tolerance: z.number().positive().max(25),
  }),
  gain: z.object({
    target: z.number().min(0).max(100),
    tolerance: z.number().positive().max(30),
  }),
});

export const pathPuzzleSchema = z.object({
  type: z.literal("path"),
  prompt: z.string().min(1),
  hint: z.string().min(1),
  success: z.string().min(1),
  cols: z.number().int().min(3).max(6),
  rows: z.number().int().min(3).max(5),
  maxSteps: z.number().int().positive(),
  start: z.object({ x: z.number().int(), y: z.number().int() }),
  targets: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        x: z.number().int(),
        y: z.number().int(),
        detail: z.string().min(1),
        sourceIds: z.array(z.string()).min(1),
      }),
    )
    .min(2),
  obstacles: z
    .array(z.object({ x: z.number().int(), y: z.number().int() }))
    .default([]),
});

export const allocatePuzzleSchema = z.object({
  type: z.literal("allocate"),
  prompt: z.string().min(1),
  hint: z.string().min(1),
  success: z.string().min(1),
  budget: z.number().positive(),
  target: z.number().positive(),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        cost: z.number().positive(),
        value: z.number().positive(),
        detail: z.string().min(1),
        sourceIds: z.array(z.string()).min(1),
      }),
    )
    .min(3),
});

export const puzzleSchema = z.discriminatedUnion("type", [
  hotspotPuzzleSchema,
  sequencePuzzleSchema,
  classifyPuzzleSchema,
  choicePuzzleSchema,
  scanPuzzleSchema,
  signalPuzzleSchema,
  excavationPuzzleSchema,
  pathPuzzleSchema,
  allocatePuzzleSchema,
]);

export const storySceneSchema = z.object({
  id: z.string().min(1),
  kind: z.enum([
    "briefing",
    "explore",
    "inspect",
    "puzzle",
    "comparison",
    "archive",
    "transition",
  ]),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  dialogue: z.array(z.string()).min(1),
  rexPose: rexPoseSchema,
  rexExpression: rexExpressionSchema,
  background: sceneBackgroundSchema,
  props: z.array(scenePropSchema),
  artifactIds: z.array(z.string()),
  sourceIds: z.array(z.string()),
  audioTheme: audioThemeSchema,
  puzzle: puzzleSchema.optional(),
});

export const chapterSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int().positive(),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  summary: z.string().min(1),
  objective: z.string().min(1),
  scenes: z.array(storySceneSchema).min(3),
});

export const rexLogSchema = z.object({
  relicId: z.string().min(1),
  opening: z.string().min(1),
  observations: z
    .array(
      z.object({
        text: z.string().min(1),
        sourceIds: z.array(z.string()).min(1),
      }),
    )
    .min(2),
  question: z.string().min(1),
  expression: rexExpressionSchema,
});

export const fieldStudySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  relicId: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  scenes: z.array(storySceneSchema).min(3),
});

export type RexPose = z.infer<typeof rexPoseSchema>;
export type RexExpression = z.infer<typeof rexExpressionSchema>;
export type SceneBackground = z.infer<typeof sceneBackgroundSchema>;
export type AudioTheme = z.infer<typeof audioThemeSchema>;
export type SceneProp = z.infer<typeof scenePropSchema>;
export type Puzzle = z.infer<typeof puzzleSchema>;
export type StoryScene = z.infer<typeof storySceneSchema>;
export type Chapter = z.infer<typeof chapterSchema>;
export type RexLog = z.infer<typeof rexLogSchema>;
export type FieldStudy = z.infer<typeof fieldStudySchema>;
