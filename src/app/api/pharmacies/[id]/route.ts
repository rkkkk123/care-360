import { NextRequest, NextResponse } from "next/server";
import { PharmacyStore } from "@/lib/pharmacy/pharmacy-store";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const pharmacy = PharmacyStore.getPharmacy(id);
  if (!pharmacy) {
    return NextResponse.json({ error: "Pharmacy not found." }, { status: 404 });
  }

  const inventory = PharmacyStore.getPharmacyInventory(id);

  return NextResponse.json({ pharmacy, inventory });
}
