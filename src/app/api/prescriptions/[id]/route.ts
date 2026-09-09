import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/consultation/auth-guard";
import { PharmacyStore } from "@/lib/pharmacy/pharmacy-store";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { user, errorResponse } = await requireAuth(["patient", "doctor", "pharmacy", "admin"]);
  if (!user || errorResponse) {
    return NextResponse.json({ error: errorResponse?.message }, { status: errorResponse?.status || 401 });
  }

  const prescription = PharmacyStore.getPrescription(id, user.role, user.id);
  if (!prescription) {
    return NextResponse.json({ error: "Prescription not found or access denied." }, { status: 404 });
  }

  return NextResponse.json({ prescription });
}
