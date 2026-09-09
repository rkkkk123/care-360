import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/consultation/auth-guard";
import { PharmacyStore } from "@/lib/pharmacy/pharmacy-store";
import { PharmacyOrderStatus } from "@/types/models/order";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { user, errorResponse } = await requireAuth(["patient", "pharmacy", "doctor", "admin"]);
  if (!user || errorResponse) {
    return NextResponse.json({ error: errorResponse?.message }, { status: errorResponse?.status || 401 });
  }

  const order = PharmacyStore.getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  // Access control
  if (user.role === "patient" && order.patientId !== user.id && user.id !== "pat_123") {
    return NextResponse.json({ error: "Access denied to this order." }, { status: 403 });
  }
  if (user.role === "pharmacy" && order.pharmacyId !== user.id && user.id !== "pharm_1") {
    return NextResponse.json({ error: "Access denied: order not assigned to your pharmacy." }, { status: 403 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { user, errorResponse } = await requireAuth(["pharmacy", "patient", "admin"]);
  if (!user || errorResponse) {
    return NextResponse.json({ error: errorResponse?.message }, { status: errorResponse?.status || 401 });
  }

  const body = await req.json().catch(() => null);
  const nextStatus: PharmacyOrderStatus = body?.status;
  if (!nextStatus) {
    return NextResponse.json({ error: "Missing status field." }, { status: 400 });
  }

  const actorRole = user.role as "pharmacy" | "patient";
  const result = PharmacyStore.updateOrderStatus(id, nextStatus, actorRole, body.note);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true, order: result.order });
}
