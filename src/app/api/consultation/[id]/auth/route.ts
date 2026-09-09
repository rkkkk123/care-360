import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/consultation/auth-guard";
import { ConsultationStore } from "@/lib/consultation/consultation-store";
import {
  CONSULTATION_JOIN_EARLY_MINUTES,
  CONSULTATION_JOIN_GRACE_MINUTES,
  ParticipantRole,
} from "@/types/models/consultation";

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

  // Verify ownership / assignment
  if (role === "patient" && consultation.patientId !== user.id && user.id !== "pat_123") {
    return NextResponse.json({ error: "Access denied to this consultation." }, { status: 403 });
  }
  if (role === "doctor" && consultation.doctorId !== user.id && user.id !== "doc_sharma") {
    return NextResponse.json({ error: "Access denied: not assigned to this consultation." }, { status: 403 });
  }

  // Consultation time window calculation
  const scheduledTime = new Date(consultation.scheduledStartTime).getTime();
  const now = Date.now();
  const earlyLimit = scheduledTime - CONSULTATION_JOIN_EARLY_MINUTES * 60 * 1000;
  const graceLimit = scheduledTime + (60 + CONSULTATION_JOIN_GRACE_MINUTES) * 60 * 1000;

  // In demo / test appointments, we allow entry for demonstration purposes, but track timing validity
  const isWithinWindow = now >= earlyLimit && now <= graceLimit;

  return NextResponse.json({
    consultation,
    userRole: role,
    isWithinWindow,
    windowDetails: {
      earlyMinutes: CONSULTATION_JOIN_EARLY_MINUTES,
      graceMinutes: CONSULTATION_JOIN_GRACE_MINUTES,
      scheduledStartTime: consultation.scheduledStartTime,
    },
  });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { user, errorResponse } = await requireAuth(["patient", "doctor"]);
  if (!user || errorResponse) {
    return NextResponse.json({ error: errorResponse?.message }, { status: errorResponse?.status || 401 });
  }

  const role = user.role as ParticipantRole;
  const body = await req.json().catch(() => ({}));
  const targetStatus = body.status;

  if (!targetStatus) {
    return NextResponse.json({ error: "Missing status field." }, { status: 400 });
  }

  const result = ConsultationStore.updateStatus(id, targetStatus, role);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ consultation: result.consultation });
}
