import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/consultation/auth-guard";
import { ConsultationStore } from "@/lib/consultation/consultation-store";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  // STRICT: Attending clinician only
  const { user, errorResponse } = await requireAuth(["doctor"]);
  if (!user || errorResponse) {
    return NextResponse.json(
      { error: "Access denied. Only attending clinicians can finalize clinical consultations." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { notes, patientSummary, medicationRecommendations } = body;

  if (!notes || !patientSummary) {
    return NextResponse.json(
      { error: "Consultation notes and patient-visible summary are required to finalize." },
      { status: 400 }
    );
  }

  const result = ConsultationStore.finalizeConsultation(id, user.id, {
    notes,
    patientSummary,
    medicationRecommendations,
  });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    consultation: result.consultation,
    finalizedAt: result.consultation?.finalizedAt,
  });
}
