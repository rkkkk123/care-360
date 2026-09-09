import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/consultation/auth-guard";
import { PharmacyStore } from "@/lib/pharmacy/pharmacy-store";
import { CreateOrderInput } from "@/types/models/order";

export async function GET(req: NextRequest) {
  const { user, errorResponse } = await requireAuth(["patient", "pharmacy", "admin"]);
  if (!user || errorResponse) {
    return NextResponse.json({ error: errorResponse?.message }, { status: errorResponse?.status || 401 });
  }

  if (user.role === "pharmacy") {
    const orders = PharmacyStore.getOrdersForPharmacy(user.id);
    return NextResponse.json({ orders });
  }

  // Patient
  const orders = PharmacyStore.getOrdersForPatient(user.id);
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireAuth(["patient"]);
  if (!user || errorResponse) {
    return NextResponse.json(
      { error: "Access denied. Only patients can place medication fulfillment orders." },
      { status: 403 }
    );
  }

  const body: CreateOrderInput = await req.json().catch(() => null);
  if (!body?.prescriptionId || !body?.pharmacyId || !body?.fulfillmentType) {
    return NextResponse.json({ error: "Missing required order parameters." }, { status: 400 });
  }

  const patientName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Jane Doe";
  const result = PharmacyStore.createOrder(user.id, patientName, body);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    order: result.order,
  });
}
