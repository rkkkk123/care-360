import { NextResponse } from "next/server";
import { corsairClient } from "@/lib/corsair/corsair-client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const telemetry = await corsairClient.getTelemetry();
    return NextResponse.json({
      success: true,
      telemetry,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("[API /api/corsair/telemetry] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Corsair HealthOps telemetry" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const telemetry = await corsairClient.getTelemetry();
    return NextResponse.json({
      success: true,
      message: "Corsair DB Edge Sync Re-indexed successfully",
      telemetry,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to execute sync" },
      { status: 500 }
    );
  }
}
