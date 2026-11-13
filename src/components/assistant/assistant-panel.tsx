"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
  ExternalLink,
  GraduationCap,
  LoaderCircle,
  Radio,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RexHead } from "@/components/rex/rex-character";

type ArtifactOption = {
  id: string;
  shortName: string;
  missionShort: string;
  destination: string;
  category: string;
};

type Citation = {
  sourceId: string;
  title: string;
  organization: string;
  url: string;
  category: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  hypothetical?: boolean;
  mode?: "demo" | "live";
  provider?: string;
  model?: string | null;
  disclosure?: string;
};

type AssistantApiResponse = {
  answer: string;
  citations: Citation[];
  mode: "demo" | "live";
  provider: string;
  model: string | null;
  hypothetical: boolean;
  suggestedQuestions: string[];
  disclosure: string;
  error?: string;
};

const questions = [
  "Why was this object left behind?",
  "What was its original purpose?",
  "What did it discover?",
  "Is it still scientifically useful?",
  "What would happen if humans returned to it?",
];

function greetingFor(artifact: ArtifactOption | undefined) {
  if (!artifact) {
    return "I am REX, the SPACE RELICS archaeological explorer. Select an object and ask about its purpose, condition, science, or historical legacy.";
  }
  return `REX online. Archive context set to ${artifact.shortName} (${artifact.missionShort}, ${artifact.destination}). Ask about its purpose, operational history, scientific legacy, condition, or what a future visit might mean. I answer only from the cited record.`;
}

export function AssistantPanel({
  artifacts,
  fixedRelicId,
  liveConfigured,
  initialQuestion,
  initialRelicId,
  className,
  compact = false,
}: {
  artifacts: ArtifactOption[];
  fixedRelicId?: string;
  liveConfigured: boolean;
  initialQuestion?: string;
  initialRelicId?: string;
  className?: string;
  compact?: boolean;
}) {
  const initialId =
    fixedRelicId ??
    (initialRelicId && artifacts.some((item) => item.id === initialRelicId)
      ? initialRelicId
      : artifacts[0]?.id ?? "");
  const [selectedId, setSelectedId] = useState(initialId);
  const [level, setLevel] = useState<"cadet" | "archivist">("archivist");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "greeting",
      role: "assistant",
      content: greetingFor(artifacts.find((item) => item.id === initialId)),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(questions.slice(0, 4));
  const initialSent = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selected = useMemo(
    () => artifacts.find((item) => item.id === selectedId),
    [artifacts, selectedId],
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [loading, messages]);

  const runQuery = useCallback(
    async (question: string) => {
      if (!question.trim() || loading) return;
      setLoading(true);
      setInput("");

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: question.trim(),
      };
      setMessages((current) => [...current, userMessage]);

      const history = messages
        .filter((message) => message.id !== "greeting")
        .slice(-6)
        .map((message) => ({
          role: message.role,
          content: message.content,
        }));

      try {
        const response = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: question.trim(),
            relicId: selectedId || null,
            level,
            history,
          }),
        });
        const data = (await response.json()) as AssistantApiResponse;
        if (!response.ok) {
          throw new Error(data.error || "The archive assistant did not respond.");
        }
        setMessages((current) => [
          ...current,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.answer,
            citations: data.citations,
            hypothetical: data.hypothetical,
            mode: data.mode,
            provider: data.provider,
            model: data.model,
            disclosure: data.disclosure,
          },
        ]);
        if (data.suggestedQuestions?.length) {
          setSuggestions(data.suggestedQuestions.slice(0, 4));
        }
      } catch (error) {
        setMessages((current) => [
          ...current,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content:
              error instanceof Error
                ? `The archive assistant could not complete that request: ${error.message}`
                : "The archive assistant could not complete that request. No answer was generated.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [level, loading, messages, selectedId],
  );

  useEffect(() => {
    if (!initialQuestion || initialSent.current) return;
    initialSent.current = true;
    void runQuery(initialQuestion);
  }, [initialQuestion, runQuery]);

  const selectRelic = (id: string) => {
    setSelectedId(id);
    const artifact = artifacts.find((item) => item.id === id);
    setMessages([
      {
        id: "greeting",
        role: "assistant",
        content: greetingFor(artifact),
      },
    ]);
    setSuggestions(questions.slice(0, 4));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    void runQuery(input);
  };

  const mode = [...messages]
    .reverse()
    .find((message) => message.mode)?.mode;
  const effectiveMode = mode ?? (liveConfigured ? "live" : "demo");
  const lastDisclosure = [...messages]
    .reverse()
    .find((message) => message.disclosure)?.disclosure;

  return (
    <div
      className={cn(
        "flex min-h-[560px] flex-col overflow-hidden border border-line/80 bg-panel/30",
        className,
      )}
    >
      <div className="border-b border-line/70 bg-abyss/55 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center border border-teal/40 bg-teal/10">
              <RexHead className="h-8 w-9" expression="content" />
            </span>
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-gold">
                REX / space archaeologist
              </p>
              <p className="mt-0.5 text-xs text-silver">Grounded archive interface</p>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5 border px-2 py-1.5 font-mono text-[7px] uppercase tracking-[0.12em]",
              effectiveMode === "live"
                ? "border-teal/40 bg-teal/10 text-teal-bright"
                : "border-gold/40 bg-gold/[0.04] text-gold",
            )}
          >
            {effectiveMode === "live" ? (
              <Radio className="size-2.5" />
            ) : (
              <ShieldCheck className="size-2.5" />
            )}
            {effectiveMode === "live"
              ? "Live model mode"
              : "Demo · no LLM connected"}
          </div>
        </div>

        {!fixedRelicId && (
          <label className="mt-4 block">
            <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-muted">
              Current object context
            </span>
            <select
              value={selectedId}
              onChange={(event) => selectRelic(event.target.value)}
              className="mt-1.5 h-10 w-full border border-line bg-void/60 px-3 font-mono text-[9px] uppercase tracking-[0.1em] text-silver focus:border-teal focus:outline-none"
            >
              {artifacts.map((artifact) => (
                <option key={artifact.id} value={artifact.id}>
                  {artifact.shortName} / {artifact.missionShort} /{" "}
                  {artifact.destination}
                </option>
              ))}
            </select>
          </label>
        )}

        {fixedRelicId && selected && (
          <div className="mt-3 flex items-center gap-2 border border-line/50 bg-void/30 px-3 py-2">
            <span className="font-mono text-[7px] uppercase tracking-[0.13em] text-muted">
              Context locked
            </span>
            <span className="h-3 w-px bg-line" />
            <span className="text-xs text-silver">{selected.shortName}</span>
            <span className="ml-auto font-mono text-[7px] uppercase tracking-[0.12em] text-teal-bright">
              {selected.destination}
            </span>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className={cn(
          "flex-1 space-y-4 overflow-y-auto p-4 md:p-5",
          compact ? "max-h-[430px]" : "max-h-[520px]",
        )}
        aria-live="polite"
        aria-label="Assistant conversation"
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "flex gap-3",
              message.role === "user" && "flex-row-reverse",
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex size-6 shrink-0 items-center justify-center border",
                message.role === "assistant"
                  ? "border-teal/30 bg-teal/10 text-teal-bright"
                  : "border-line bg-void text-muted",
              )}
            >
              {message.role === "assistant" ? (
                <Sparkles className="size-3" />
              ) : (
                <UserRound className="size-3" />
              )}
            </span>
            <div
              className={cn(
                "max-w-[88%]",
                message.role === "user" && "text-right",
              )}
            >
              <div
                className={cn(
                  "border px-3.5 py-3 text-xs leading-6",
                  message.role === "assistant"
                    ? "border-line/60 bg-abyss/50 text-silver/85"
                    : "border-teal/30 bg-teal/[0.065] text-silver",
                )}
              >
                <p className="whitespace-pre-line">{message.content}</p>
                {message.hypothetical && (
                  <span className="mt-3 inline-flex border border-purple-300/30 bg-purple-300/5 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.12em] text-purple-200">
                    Hypothetical scenario
                  </span>
                )}
              </div>

              {message.citations && message.citations.length > 0 && (
                <div className="mt-2 space-y-1.5 text-left">
                  <p className="font-mono text-[7px] uppercase tracking-[0.13em] text-muted">
                    Cited records
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {message.citations.map((citation, index) => (
                      <a
                        key={citation.sourceId}
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex max-w-full items-center gap-1.5 border border-line/60 bg-void/30 px-2 py-1.5 text-left font-mono text-[7px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-teal/50 hover:text-silver"
                        title={`${citation.title} — ${citation.organization}`}
                      >
                        <span className="text-gold">[{index + 1}]</span>
                        <span className="max-w-[180px] truncate">
                          {citation.organization}
                        </span>
                        <ExternalLink className="size-2.5 shrink-0 opacity-50 group-hover:opacity-100" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {message.mode && (
                <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.1em] text-muted/60">
                  {message.mode === "demo"
                    ? "Demo archive response"
                    : `Live · ${message.provider}${message.model ? ` · ${message.model}` : ""}`}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <span className="flex size-6 items-center justify-center border border-teal/30 bg-teal/10 text-teal-bright">
              <LoaderCircle className="size-3 animate-spin" />
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted">
              Retrieving archive record…
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-line/70 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {suggestions.slice(0, compact ? 2 : 3).map((question) => (
              <button
                key={question}
                onClick={() => void runQuery(question)}
                disabled={loading}
                className="border border-line/60 px-2 py-1.5 text-left font-mono text-[7px] uppercase leading-4 tracking-[0.06em] text-muted transition-colors hover:border-gold/40 hover:text-gold disabled:opacity-40"
              >
                {question}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-0.5 border border-line/60 p-0.5">
            <button
              onClick={() => setLevel("cadet")}
              className={cn(
                "flex items-center gap-1 px-1.5 py-1 font-mono text-[7px] uppercase tracking-[0.08em]",
                level === "cadet"
                  ? "bg-gold/10 text-gold"
                  : "text-muted hover:text-silver",
              )}
              aria-pressed={level === "cadet"}
            >
              <GraduationCap className="size-2.5" />
              Cadet
            </button>
            <button
              onClick={() => setLevel("archivist")}
              className={cn(
                "px-1.5 py-1 font-mono text-[7px] uppercase tracking-[0.08em]",
                level === "archivist"
                  ? "bg-teal/10 text-teal-bright"
                  : "text-muted hover:text-silver",
              )}
              aria-pressed={level === "archivist"}
            >
              Archivist
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="flex items-end gap-2">
          <label className="relative block flex-1">
            <span className="sr-only">Ask the space archaeologist</span>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void runQuery(input);
                }
              }}
              rows={2}
              maxLength={600}
              placeholder="Ask about purpose, condition, science, or legacy…"
              className="min-h-11 w-full resize-none border border-line bg-void/60 px-3 py-3 font-sans text-xs leading-5 text-silver placeholder:text-muted/60 focus:border-teal focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex size-11 shrink-0 items-center justify-center border border-gold bg-gold text-abyss transition-colors hover:bg-[#f2c76a] disabled:border-line disabled:bg-line/40 disabled:text-muted"
            aria-label="Send question"
          >
            <ArrowUp className="size-4" />
          </button>
        </form>
        <p className="mt-2 font-mono text-[7px] uppercase leading-4 tracking-[0.1em] text-muted/65">
          {lastDisclosure ??
            (liveConfigured
              ? "Live provider is configured. Responses remain grounded in cited archive records."
              : "REX demo mode: no API key is configured. REX is answering from the structured archive, not a live LLM.")}
        </p>
      </div>
    </div>
  );
}
