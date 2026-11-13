import { z } from "zod";
import {
  buildGroundingContext,
  defaultSuggestions,
  resolveRelic,
} from "./retrieval";
import type { AssistantProvider } from "./demo-provider";
import type { AssistantInput, AssistantResult } from "./types";

const livePayloadSchema = z.object({
  answer: z.string().min(1),
  sourceIds: z.array(z.string()).max(6),
  hypothetical: z.boolean(),
});

export function liveProviderConfigured() {
  return (
    Boolean(process.env.AI_API_KEY) &&
    process.env.AI_PROVIDER?.toLowerCase() !== "demo"
  );
}

function providerLabel() {
  return process.env.AI_PROVIDER?.toLowerCase() === "openai-compatible"
    ? "openai-compatible"
    : "openai-compatible";
}

export const liveProvider: AssistantProvider = {
  id: "live-grounded",
  async answer(input: AssistantInput): Promise<AssistantResult> {
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      throw new Error("AI_API_KEY is not configured");
    }

    const relic = resolveRelic(input.relicId, input.message);
    if (!relic) {
      throw new Error("A selected relic is required for a live grounded answer");
    }

    const baseUrl = (
      process.env.AI_BASE_URL ?? "https://api.openai.com/v1"
    ).replace(/\/+$/, "");
    const model = process.env.AI_MODEL ?? "gpt-4.1-mini";
    const context = buildGroundingContext(relic);
    const levelInstruction =
      input.level === "cadet"
        ? "Write for a curious 12-year-old. Short sentences. Explain technical terms."
        : "Write for an informed museum visitor. Precise, compact, and technical where necessary.";

    const system = [
      "You are the SPACE RELICS AI Space Archaeologist, an independent editorial archive assistant.",
      "Answer ONLY from the supplied archive context. Never invent facts, sources, dates, coordinates, or statuses.",
      "Use the source IDs supplied in the context. Never cite anything outside that list.",
      "Clearly mark any speculative or hypothetical statement as hypothetical.",
      "Do not describe the SPACE RELICS editorial Legacy Score as a NASA rating.",
      "Never claim to be NASA. Never imply NASA endorsement.",
      levelInstruction,
      'Return strict JSON: {"answer": string, "sourceIds": string[], "hypothetical": boolean}.',
      "The answer must be plain text, at most 170 words, and must mention when information is not established.",
    ].join(" ");

    const history = input.history.slice(-6).map((entry) => ({
      role: entry.role,
      content: entry.content,
    }));

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.15,
        max_tokens: 700,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          ...history,
          {
            role: "user",
            content: `ARCHIVE CONTEXT:\n${context.text}\n\nQUESTION:\n${input.message}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(
        `Live provider returned ${response.status}: ${detail.slice(0, 200)}`,
      );
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("Live provider returned an empty response");

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(content);
    } catch {
      throw new Error("Live provider returned invalid JSON");
    }

    const payload = livePayloadSchema.parse(parsedJson);
    const allowed = new Map(
      context.sources.map((source) => [source.id, source]),
    );
    const requested = payload.sourceIds
      .map((id) => allowed.get(id))
      .filter((source): source is NonNullable<typeof source> => Boolean(source));

    const citations = (requested.length ? requested : context.sources.slice(0, 3))
      .slice(0, 4)
      .map((source) => ({
        sourceId: source.id,
        title: source.title,
        organization: source.organization,
        url: source.url,
        category: source.category,
      }));

    return {
      answer: payload.answer,
      citations,
      mode: "live",
      provider: providerLabel(),
      model,
      hypothetical: payload.hypothetical,
      suggestedQuestions: defaultSuggestions.slice(0, 4),
      disclosure:
        "LIVE MODEL MODE — grounded with retrieved archive records. Responses can vary; verify every cited source.",
    };
  },
};
