import { archiveStats, getSource } from "@/lib/data";
import type { Source } from "@/lib/schema";
import type {
  AssistantCitation,
  AssistantInput,
  AssistantResult,
} from "./types";
import {
  defaultSuggestions,
  groundingSources,
  resolveRelic,
} from "./retrieval";

export type AssistantProvider = {
  id: string;
  answer(input: AssistantInput): Promise<AssistantResult>;
};

type Intent =
  | "return"
  | "lifetime"
  | "location"
  | "purpose"
  | "discovery"
  | "useful"
  | "left"
  | "status"
  | "overview";

function detectIntent(message: string): Intent {
  const text = message.toLowerCase();
  if (
    /(return|recover|retrieve|visit|salvage|future mission|what if)/.test(text)
  ) {
    return "return";
  }
  if (/(how long|last|lifetime|operate|years|sols|days)/.test(text)) {
    return "lifetime";
  }
  if (/(where|location|coordinates|site|latitude|longitude)/.test(text)) {
    return "location";
  }
  if (/(left behind|abandon|why.*left|stranded)/.test(text)) {
    return "left";
  }
  if (/(why|purpose|function|used for|designed)/.test(text)) {
    return "purpose";
  }
  if (/(discover|find|learn|science|scientific|result)/.test(text)) {
    return "discovery";
  }
  if (/(still|useful|active|working|operational|detectable)/.test(text)) {
    return "useful";
  }
  if (/(status|condition|intact|present)/.test(text)) {
    return "status";
  }
  return "overview";
}

function toCitations(sources: Source[]): AssistantCitation[] {
  return sources.map((source) => ({
    sourceId: source.id,
    title: source.title,
    organization: source.organization,
    url: source.url,
    category: source.category,
  }));
}

function chooseSources(
  sourceIds: string[],
  fallback: Source[],
): AssistantCitation[] {
  const selected: Source[] = [];
  for (const id of sourceIds) {
    const source = getSource(id);
    if (
      source &&
      source.category !== "imagery" &&
      !selected.some((item) => item.id === source.id)
    ) {
      selected.push(source);
    }
  }
  for (const source of fallback) {
    if (selected.length >= 3) break;
    if (!selected.some((item) => item.id === source.id)) {
      selected.push(source);
    }
  }
  return toCitations(selected.slice(0, 3));
}

function citationSuffix(citations: AssistantCitation[]) {
  if (citations.length === 0) return "";
  return ` Sources: ${citations.map((_, index) => `[${index + 1}]`).join(" ")}`;
}

function plainPrefix(level: AssistantInput["level"]) {
  return level === "cadet" ? "Short version. " : "";
}

const intentSuggestions: Record<Intent, string[]> = {
  return: [
    "What condition is it in today?",
    "What did humanity learn from this mission?",
    "Is it still scientifically useful?",
  ],
  lifetime: [
    "Why did it last longer than planned?",
    "What ended its mission?",
    "Where is it now?",
  ],
  location: [
    "What is the site like?",
    "How precise are the coordinates?",
    "Is it visible from orbit?",
  ],
  purpose: [
    "What did it discover?",
    "Why was it left behind?",
    "Is it still scientifically useful?",
  ],
  discovery: [
    "What did humanity learn from it?",
    "How did it change later missions?",
    "Is the data still used?",
  ],
  useful: [
    "Is it still operational?",
    "What would a future visit find?",
    "What did it discover?",
  ],
  left: [
    "What condition is it in today?",
    "Was it designed to stay behind?",
    "What did humanity learn from it?",
  ],
  status: [
    "What happened at the end of the mission?",
    "Where is it located?",
    "Is it still operational?",
  ],
  overview: [
    "Why was this object left behind?",
    "What did it discover?",
    "Is it still scientifically useful?",
    "What would happen if humans returned?",
  ],
};

export const demoProvider: AssistantProvider = {
  id: "demo-archive",
  async answer(input) {
    const relic = resolveRelic(input.relicId, input.message);
    const intent = detectIntent(input.message);

    if (!relic) {
      return {
        answer:
          `The archive currently indexes ${archiveStats.relics} human-made objects across the Moon and Mars. ` +
          `Select an object to ask about its purpose, history, condition, or scientific legacy. ` +
          `I can answer from the structured record and will attach the cited source links.`,
        citations: [],
        mode: "demo",
        provider: "demo-archive",
        model: null,
        hypothetical: false,
        suggestedQuestions: defaultSuggestions.slice(0, 4),
        disclosure:
          "DEMO KNOWLEDGE MODE — no LLM is connected. This response is generated directly from the structured archive.",
      };
    }

    const fallback = groundingSources(relic);
    let sourceIds: string[] = relic.sourceIds;
    let hypothetical = false;
    let text = "";
    const prefix = plainPrefix(input.level);

    switch (intent) {
      case "return": {
        hypothetical = true;
        sourceIds = [
          ...relic.coordinates.sourceIds,
          ...relic.claims.flatMap((claim) => claim.sourceIds),
        ];
        text =
          `${prefix}No approved recovery mission for ${relic.shortName} is recorded in this archive. ` +
          `Today the record lists its physical state as “${relic.physicalStatus.replaceAll("-", " ")}” and its operational state as “${relic.operationalStatus.replaceAll("-", " ")}”. ` +
          `${relic.currentCondition} ` +
          `A future crewed visit would be a new mission with its own engineering, heritage-protection, and planetary-protection requirements. ` +
          `Any claim about what could be recovered, reused, or displayed on Earth is a hypothetical scenario, not an observed capability.`;
        break;
      }
      case "lifetime": {
        sourceIds = [
          ...relic.claims.flatMap((claim) => claim.sourceIds),
          ...relic.sourceIds,
        ];
        const planned = relic.plannedLifetime
          ? `${relic.plannedLifetime.value.toLocaleString("en-US")} ${relic.plannedLifetime.unit} planned`
          : "no verified planned numeric lifetime is established in the cited record";
        const actual = relic.actualLifetime
          ? `${relic.actualLifetime.value.toLocaleString("en-US")} ${relic.actualLifetime.unit} recorded (${relic.actualLifetime.label}${relic.actualLifetime.ongoing ? ", ongoing" : ""})`
          : "no verified actual lifetime is established";
        text =
          `${prefix}${relic.shortName}: ${planned}; ${actual}. ` +
          `The comparison uses “${relic.lifetimeBasis.toLowerCase()}” as its basis. ` +
          `The archive does not convert or infer missing values.`;
        break;
      }
      case "location": {
        sourceIds = relic.coordinates.sourceIds;
        text =
          `${prefix}${relic.shortName} is recorded at ${relic.coordinates.label}, ` +
          `latitude ${relic.coordinates.latitude}°, longitude ${relic.coordinates.longitude}°. ` +
          `Coordinate precision is marked “${relic.coordinates.precision.replaceAll("-", " ")}”. ` +
          `The archive does not upgrade an approximate or landing-ellipse position into an exact point.`;
        break;
      }
      case "purpose": {
        sourceIds = relic.purpose.flatMap((statement) => statement.sourceIds);
        text =
          `${prefix}${relic.description} ` +
          `Its original function was: ${relic.originalFunction} ` +
          relic.purpose.map((statement) => statement.text).join(" ");
        break;
      }
      case "discovery": {
        sourceIds = relic.scientificLegacy.flatMap(
          (statement) => statement.sourceIds,
        );
        text =
          `${prefix}The archive records these scientific outcomes for ${relic.shortName}: ` +
          relic.scientificLegacy
            .map((statement) => statement.text)
            .join(" ") +
          ` Scientific interpretations are labeled separately from verified mission records.`;
        break;
      }
      case "useful": {
        sourceIds = relic.sourceIds;
        const state =
          relic.operationalStatus === "active"
            ? "It is operationally active."
            : relic.operationalStatus === "passive-operational"
              ? "It is passive but still detectable."
              : relic.operationalStatus === "inactive"
                ? "It is no longer active."
                : "It is decommissioned.";
        text =
          `${prefix}${state} ${relic.currentCondition} ` +
          `${relic.legacy.rationales.continued} ` +
          `This is an editorial assessment of continued value, not an official agency rating.`;
        break;
      }
      case "left": {
        sourceIds = [
          ...relic.purpose.flatMap((statement) => statement.sourceIds),
          ...relic.operationalHistory.flatMap(
            (statement) => statement.sourceIds,
          ),
        ];
        const category =
          relic.operationalStatus === "active"
            ? "This object was not left behind; it remains operational."
            : relic.operationalStatus === "passive-operational"
              ? "This object was designed to remain behind as a passive instrument."
              : "This object was left in place when its mission ended; that does not mean it was abandoned without purpose.";
        text =
          `${prefix}${category} ${relic.operationalHistory
            .map((statement) => statement.text)
            .join(" ")} ` +
          `The archive separately tracks whether the object is physically present, operationally active, inactive, or decommissioned.`;
        break;
      }
      case "status": {
        sourceIds = relic.sourceIds;
        text =
          `${prefix}${relic.shortName}: physical status “${relic.physicalStatus.replaceAll("-", " ")}”; operational status “${relic.operationalStatus.replaceAll("-", " ")}”. ` +
          `${relic.currentCondition}`;
        break;
      }
      default: {
        sourceIds = relic.sourceIds;
        text =
          `${prefix}${relic.shortName} is a ${relic.category.toLowerCase()} from ${relic.mission}, located on ${relic.destination}. ` +
          `${relic.description} ` +
          `The archive currently records it as ${relic.operationalStatus.replaceAll("-", " ")}.`;
      }
    }

    const citations = chooseSources(sourceIds, fallback);
    const answer = `${text.trim()}${citationSuffix(citations)}`;
    const suggestions = intentSuggestions[intent].filter(
      (suggestion) => suggestion !== input.message,
    );

    return {
      answer,
      citations,
      mode: "demo",
      provider: "demo-archive",
      model: null,
      hypothetical,
      suggestedQuestions: suggestions.slice(0, 4),
      disclosure:
        "DEMO KNOWLEDGE MODE — no LLM is connected. This response is generated directly from the structured archive.",
    };
  },
};
