import { NextRequest, NextResponse } from "next/server";
import { PharmacyStore } from "@/lib/pharmacy/pharmacy-store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode");
  const query = searchParams.get("query")?.toLowerCase();

  let pharmacies = PharmacyStore.getPharmacies();

  // Public/patient directory shows verified pharmacies by default unless admin query
  const includeUnverified = searchParams.get("includeUnverified") === "true";
  if (!includeUnverified) {
    pharmacies = pharmacies.filter((p) => p.verificationStatus === "verified");
  }

  if (mode && (mode === "pickup" || mode === "delivery")) {
    pharmacies = pharmacies.filter((p) => p.fulfillmentModes.includes(mode));
  }

  if (query) {
    pharmacies = pharmacies.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.address.city.toLowerCase().includes(query) ||
        p.address.street.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({ pharmacies });
}
