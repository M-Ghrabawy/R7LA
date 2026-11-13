import { z } from "zod";

export const assistantRequestSchema = z.object({
  message: z.string().trim().min(1).max(600),
  relicId: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional()
    .nullable(),
  level: z.enum(["cadet", "archivist"]).default("archivist"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      }),
    )
    .max(8)
    .default([]),
});

export type AssistantRequest = z.infer<typeof assistantRequestSchema>;

export const assistantCitationSchema = z.object({
  sourceId: z.string(),
  title: z.string(),
  organization: z.string(),
  url: z.string().url(),
  category: z.string(),
});

export const assistantResultSchema = z.object({
  answer: z.string().min(1),
  citations: z.array(assistantCitationSchema).max(6),
  mode: z.enum(["demo", "live"]),
  provider: z.string(),
  model: z.string().nullable(),
  hypothetical: z.boolean(),
  suggestedQuestions: z.array(z.string()).max(5),
  disclosure: z.string(),
});

export type AssistantCitation = z.infer<typeof assistantCitationSchema>;
export type AssistantResult = z.infer<typeof assistantResultSchema>;

export type AssistantInput = AssistantRequest & {
  resolvedRelicId?: string | null;
};
