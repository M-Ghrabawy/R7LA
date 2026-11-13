import { NextResponse } from "next/server";
import { relics } from "@/lib/data";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ok",
    archive: "space-relics",
    relics: relics.length,
    assistant:
      process.env.AI_API_KEY && process.env.AI_PROVIDER !== "demo"
        ? "live-configured"
        : "demo",
  });
}
