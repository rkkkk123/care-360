import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/consultation/auth-guard";
import { PharmacyStore } from "@/lib/pharmacy/pharmacy-store";
import { PharmacyVerificationStatus } from "@/types/models/pharmacy";

export async function GET() {
  const { user, errorResponse } = await requireAuth(["admin", "pharmacy"]);
  if (!user || errorResponse) {
    return NextResponse.json({ error: errorResponse?.message }, { status: errorResponse?.status || 401 });
  }

  const pharmacies = PharmacyStore.getPharmacies();
  return NextResponse.json({ pharmacies });
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAuth(["admin"]);
  if (!user || errorResponse) {
    return NextResponse.json(
      { error: "Access denied. Only system administrators can approve pharmacy verifications." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body?.pharmacyId || !body?.status) {
    return NextResponse.json({ error: "Missing pharmacyId or status." }, { status: 400 });
  }

  const status: PharmacyVerificationStatus = body.status;
  const updatedPharmacy = PharmacyStore.updatePharmacyVerification(body.pharmacyId, status);

  if (!updatedPharmacy) {
    return NextResponse.json({ error: "Pharmacy not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, pharmacy: updatedPharmacy });
}
