import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/consultation/auth-guard";
import { PharmacyStore } from "@/lib/pharmacy/pharmacy-store";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const inventory = PharmacyStore.getPharmacyInventory(id);
  return NextResponse.json({ inventory });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { user, errorResponse } = await requireAuth(["pharmacy", "admin"]);
  if (!user || errorResponse) {
    return NextResponse.json(
      { error: "Access denied. Only pharmacy personnel can update stock and pricing." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body?.medicineId || body.stockQuantity === undefined || body.unitPrice === undefined) {
    return NextResponse.json({ error: "Missing required fields (medicineId, stockQuantity, unitPrice)." }, { status: 400 });
  }

  const updatedItem = PharmacyStore.updateInventoryItem(
    id,
    body.medicineId,
    Number(body.stockQuantity),
    Number(body.unitPrice)
  );

  if (!updatedItem) {
    return NextResponse.json({ error: "Failed to update inventory item." }, { status: 400 });
  }

  return NextResponse.json({ success: true, item: updatedItem });
}
