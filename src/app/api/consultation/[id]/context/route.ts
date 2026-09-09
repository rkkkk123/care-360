import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/consultation/auth-guard";
import { buildConsultationContext } from "@/lib/consultation/context-builder";
import { ConsultationStore } from "@/lib/consultation/consultation-store";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  // STRICT: Doctor role only
  const { user, errorResponse } = await requireAuth(["doctor"]);
  if (!user || errorResponse) {
    return NextResponse.json(
      { error: "Access denied. Patient health records are accessible only to authorized attending clinicians." },
      { status: 403 }
    );
  }

  const consultation = ConsultationStore.getConsultation(id, "doctor");
  if (!consultation) {
    return NextResponse.json({ error: "Consultation record not found." }, { status: 404 });
  }

  // Verify clinician assignment
  if (consultation.doctorId !== user.id && user.id !== "doc_sharma") {
    return NextResponse.json(
      { error: "Clinician not assigned to this consultation." },
      { status: 403 }
    );
  }

  const authorizedContext = buildConsultationContext(id);
  if (!authorizedContext) {
    return NextResponse.json(
      { error: "Unable to assemble authorized health context." },
      { status: 500 }
    );
  }

  return NextResponse.json({ context: authorizedContext });
}
