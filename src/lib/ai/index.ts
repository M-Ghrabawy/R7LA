import { demoProvider } from "./demo-provider";
import { liveProvider, liveProviderConfigured } from "./openai-provider";
import type { AssistantInput, AssistantResult } from "./types";

export async function answerAssistant(
  input: AssistantInput,
): Promise<AssistantResult> {
  if (!liveProviderConfigured()) {
    return demoProvider.answer(input);
  }

  try {
    return await liveProvider.answer(input);
  } catch (error) {
    const fallback = await demoProvider.answer(input);
    return {
      ...fallback,
      disclosure:
        "LIVE PROVIDER UNAVAILABLE — a demo answer from the structured archive is shown instead. No live model answered this request. " +
        (error instanceof Error ? error.message.slice(0, 140) : ""),
    };
  }
}

export { liveProviderConfigured };
