import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/consultation/auth-guard";
import { buildConsultationContext } from "@/lib/consultation/context-builder";
import { CopilotService } from "@/lib/consultation/copilot-service";
import { AICopilotRequest } from "@/types/models/consultation";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  // STRICT: Clinician only
  const { user, errorResponse } = await requireAuth(["doctor"]);
  if (!user || errorResponse) {
    return NextResponse.json(
      { error: "Access denied. AI Copilot is reserved for attending clinicians." },
      { status: 403 }
    );
  }

  const authorizedContext = buildConsultationContext(id);
  if (!authorizedContext) {
    return NextResponse.json(
      { error: "Could not assemble authorized health context for this consultation." },
      { status: 404 }
    );
  }

  const body: AICopilotRequest = await req.json().catch(() => ({ queryType: "overview" }));

  try {
    const copilotResult = await CopilotService.queryCopilot(body, authorizedContext);
    return NextResponse.json({ result: copilotResult });
  } catch (err: any) {
    console.error("AI Copilot execution error:", err);
    return NextResponse.json(
      {
        error: "AI Copilot encountered a transient error. The consultation can continue normally without AI assistance.",
      },
      { status: 500 }
    );
  }
}
