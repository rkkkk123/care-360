import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/consultation/auth-guard";
import { PharmacyStore } from "@/lib/pharmacy/pharmacy-store";
import { IssuePrescriptionInput } from "@/types/models/prescription";

export async function GET(req: NextRequest) {
  const { user, errorResponse } = await requireAuth(["patient", "doctor", "admin"]);
  if (!user || errorResponse) {
    return NextResponse.json({ error: errorResponse?.message }, { status: errorResponse?.status || 401 });
  }

  if (user.role === "doctor") {
    const prescriptions = PharmacyStore.getPrescriptionsForDoctor(user.id);
    return NextResponse.json({ prescriptions });
  }

  // Patient or Admin
  const prescriptions = PharmacyStore.getPrescriptionsForPatient(user.id);
  return NextResponse.json({ prescriptions });
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAuth(["doctor"]);
  if (!user || errorResponse) {
    return NextResponse.json(
      { error: "Access denied. Only authorized physicians can issue prescriptions." },
      { status: 403 }
    );
  }

  const body: IssuePrescriptionInput = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const doctorName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Dr. Ananya Sharma";
  const result = PharmacyStore.issuePrescription(
    user.id,
    doctorName,
    "MD, FACP",
    "CA-MED-491028",
    body
  );

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    prescription: result.prescription,
  });
}
