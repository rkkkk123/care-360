import { NextResponse } from "next/server";
import { corsairClient } from "@/lib/corsair/corsair-client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { query = "" } = body;

    const { results, latencyMs, recordsScanned } = await corsairClient.searchKnowledgeBase(query);

    return NextResponse.json({
      success: true,
      query,
      resultsCount: results.length,
      latencyMs,
      recordsScanned,
      isSub50ms: latencyMs < 50,
      results,
    });
  } catch (error: any) {
    console.error("[API /api/corsair/search] Error:", error);
    return NextResponse.json(
      { error: "Knowledge base search failed" },
      { status: 500 }
    );
  }
}
