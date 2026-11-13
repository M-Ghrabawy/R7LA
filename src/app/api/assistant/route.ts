import { NextResponse } from "next/server";
import { answerAssistant } from "@/lib/ai";
import { assistantRequestSchema } from "@/lib/ai/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function rateLimit(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (bucket.count >= 20) return false;
  bucket.count += 1;
  return true;
}

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "local";
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit reached. Try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = assistantRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request",
        details: parsed.error.issues.map((issue) => issue.message),
      },
      { status: 400 },
    );
  }

  try {
    const result = await answerAssistant(parsed.data);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "The archive assistant could not complete this request. No answer was generated.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "space-relics-assistant",
    configured: Boolean(process.env.AI_API_KEY),
    message:
      "POST a grounded question with { message, relicId?, level?, history? }.",
  });
}
