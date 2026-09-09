import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/consultation/auth-guard";
import { ConsultationStore } from "@/lib/consultation/consultation-store";
import { VideoService } from "@/lib/consultation/video-service";
import { ParticipantRole } from "@/types/models/consultation";

export async function POST(
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

  const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || (role === "doctor" ? "Dr. Sharma" : "Jane Doe");
  const videoCredentials = await VideoService.getVideoToken(id, user.id, role, userName);

  return NextResponse.json({
    video: videoCredentials,
    participant: {
      id: user.id,
      name: userName,
      role,
    },
  });
}
