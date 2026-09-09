import { NextRequest, NextResponse } from "next/server";
import { PharmacyStore } from "@/lib/pharmacy/pharmacy-store";
import { PharmacyMatchingEngine } from "@/lib/pharmacy/matching-engine";
import { PharmacySearchCopilot } from "@/lib/pharmacy/search-copilot";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.prescriptionId) {
    return NextResponse.json({ error: "Missing prescriptionId in request." }, { status: 400 });
  }

  const prescription = PharmacyStore.getPrescription(body.prescriptionId);
  if (!prescription) {
    return NextResponse.json({ error: "Prescription not found." }, { status: 404 });
  }

  let sortOption = body.sortOption || "best_match";
  let queryExplanation: string | undefined;

  // Optional Natural Language Search Interpretation
  if (body.naturalQuery?.trim()) {
    try {
      const preferences = await PharmacySearchCopilot.parseNaturalLanguageQuery(body.naturalQuery);
      sortOption = preferences.sort;
      queryExplanation = preferences.queryExplanation;
    } catch (e) {
      console.warn("Could not parse query, using defaults:", e);
    }
  }

  const matches = PharmacyMatchingEngine.comparePharmacies(
    prescription,
    body.patientLat,
    body.patientLng,
    sortOption
  );

  return NextResponse.json({
    prescription,
    matches,
    sortOption,
    queryExplanation,
  });
}
