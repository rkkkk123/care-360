import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/consultation/auth-guard";
import { PharmacyStore } from "@/lib/pharmacy/pharmacy-store";
import { PrescriptionPdfService } from "@/lib/pharmacy/pdf-service";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { user, errorResponse } = await requireAuth(["patient", "doctor", "pharmacy", "admin"]);
  if (!user || errorResponse) {
    return new NextResponse("Unauthorized access to medical prescription.", { status: 401 });
  }

  const prescription = PharmacyStore.getPrescription(id, user.role, user.id);
  if (!prescription) {
    return new NextResponse("Prescription not found or access denied.", { status: 404 });
  }

  const html = PrescriptionPdfService.generatePrescriptionHtml(prescription);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}
