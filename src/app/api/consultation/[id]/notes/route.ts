import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/consultation/auth-guard";
import { ConsultationStore } from "@/lib/consultation/consultation-store";
import { ParticipantRole } from "@/types/models/consultation";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { user, errorResponse } = await requireAuth(["patient", "doctor"]);
  if (!user || errorResponse) {
    return NextResponse.json({ error: errorResponse?.message }, { status: errorResponse?.status || 401 });
  }

  const role = user.role as ParticipantRole;
  const consultation = ConsultationStore.getConsultation(id, role);
  if (!consultation) {
    return NextResponse.json({ error: "Consultation not found." }, { status: 404 });
  }

  return NextResponse.json({
    notes: consultation.notes,
    isFinalized: consultation.isFinalized,
    patientVisibleSummary: consultation.patientVisibleSummary,
  });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  // STRICT: Doctor role only for writing notes
  const { user, errorResponse } = await requireAuth(["doctor"]);
  if (!user || errorResponse) {
    return NextResponse.json(
      { error: "Access denied. Only clinicians can author or update clinical notes." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const saveResult = ConsultationStore.saveNotes(id, user.id, body);

  if (saveResult.error) {
    return NextResponse.json({ error: saveResult.error }, { status: 400 });
  }

  return NextResponse.json({
    notes: saveResult.notes,
    savedAt: saveResult.notes?.lastSavedAt,
  });
}
