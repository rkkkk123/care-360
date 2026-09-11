import { NextResponse } from "next/server";
import { corsairClient } from "@/lib/corsair/corsair-client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, payload = {} } = body;

    if (!type || (type !== "emergency_sos" && type !== "pharmacy_stockout")) {
      return NextResponse.json(
        { error: "Valid workflow type ('emergency_sos' | 'pharmacy_stockout') is required" },
        { status: 400 }
      );
    }

    const workflowResult = await corsairClient.triggerWorkflow(type, payload);

    return NextResponse.json({
      success: true,
      workflow: workflowResult,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("[API /api/corsair/workflows] Error:", error);
    return NextResponse.json(
      { error: "Workflow execution failed" },
      { status: 500 }
    );
  }
}
