import { Prescription } from "@/types/models/prescription";
import { PharmacyComparisonMatch } from "@/types/models/pharmacy";
import { PharmacyStore } from "./pharmacy-store";

// Default Patient Coordinates: Palo Alto, CA
const DEFAULT_PATIENT_LAT = 37.4419;
const DEFAULT_PATIENT_LNG = -122.143;

function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export class PharmacyMatchingEngine {
  static comparePharmacies(
    prescription: Prescription,
    patientLat: number = DEFAULT_PATIENT_LAT,
    patientLng: number = DEFAULT_PATIENT_LNG,
    sortOption: "best_match" | "price" | "distance" | "fastest" = "best_match"
  ): PharmacyComparisonMatch[] {
    const pharmacies = PharmacyStore.getPharmacies().filter(
      (p) => p.verificationStatus === "verified" && p.isAcceptingNewOrders
    );

    const matches: PharmacyComparisonMatch[] = pharmacies.map((pharmacy) => {
      const inventory = PharmacyStore.getPharmacyInventory(pharmacy.id);

      const itemsCoverage: PharmacyComparisonMatch["itemsCoverage"] = [];
      let totalCost = 0;
      let allInStock = true;

      for (const rxItem of prescription.items) {
        const invItem = inventory.find((inv) => inv.medicineId === rxItem.medicineId);

        if (invItem && invItem.availableQuantity >= rxItem.quantity) {
          const cost = Number((invItem.unitPrice * rxItem.quantity).toFixed(2));
          totalCost += cost;
          itemsCoverage.push({
            medicineId: rxItem.medicineId,
            medicineName: rxItem.name,
            inStock: true,
            availableQuantity: invItem.availableQuantity,
            unitPrice: invItem.unitPrice,
          });
        } else {
          allInStock = false;
          itemsCoverage.push({
            medicineId: rxItem.medicineId,
            medicineName: rxItem.name,
            inStock: false,
            availableQuantity: invItem?.availableQuantity || 0,
            unitPrice: invItem?.unitPrice || 0,
          });
        }
      }

      const distance = calculateHaversineDistance(
        patientLat,
        patientLng,
        pharmacy.address.lat,
        pharmacy.address.lng
      );

      const totalPrescriptionCost = Number(totalCost.toFixed(2));
      const deliveryFee = pharmacy.fulfillmentModes.includes("delivery") ? pharmacy.deliveryFee : 0;
      const totalWithDelivery = Number((totalPrescriptionCost + deliveryFee).toFixed(2));

      // Deterministic Scoring & Reasoning
      let matchScore = 100;
      if (!allInStock) matchScore -= 50;
      matchScore -= Math.min(20, distance * 2);
      matchScore -= Math.min(15, totalPrescriptionCost * 0.5);

      let matchReason = "Complete prescription in stock";
      if (!allInStock) {
        matchReason = "Medication out of stock • Select another verified pharmacy";
      } else if (pharmacy.fulfillmentModes.includes("pickup") && distance <= 1.0) {
        matchReason = `Closest verified pickup location (${distance} mi) • Ready in 30 mins`;
      } else if (pharmacy.deliveryFee === 0 && pharmacy.fulfillmentModes.includes("delivery")) {
        matchReason = "Free direct courier doorstep delivery • Complete stock";
      } else {
        matchReason = `Available for pickup or delivery (${distance} mi)`;
      }

      return {
        pharmacy,
        distanceMiles: distance,
        allMedicinesInStock: allInStock,
        totalPrescriptionCost,
        deliveryFee,
        totalWithDelivery,
        pickupReadyMinutes: 30,
        deliveryEstimatedMinutes: pharmacy.fulfillmentModes.includes("delivery") ? 90 : undefined,
        itemsCoverage,
        matchScore: Math.max(10, Math.round(matchScore)),
        matchReason,
        stockStatus: allInStock ? "all_in_stock" : "partial_stock",
        estimatedReadyTime: pharmacy.fulfillmentModes.includes("pickup") ? "Ready in 30 mins" : "Courier in 2 hours",
        matchedCount: itemsCoverage.filter((i) => i.inStock).length,
        totalItemsCount: prescription.items.length,
        pricing: {
          itemsSubtotal: totalPrescriptionCost,
          deliveryFee,
          totalPrice: totalWithDelivery,
        },
        itemDetails: itemsCoverage.map((i) => ({
          medicineId: i.medicineId,
          medicineName: i.medicineName,
          quantity: prescription.items.find((x) => x.medicineId === i.medicineId)?.quantity || 1,
          stockStatus: i.inStock ? "in_stock" : "out_of_stock",
          unitPrice: i.unitPrice,
        })),
      };
    });

    // Sort according to criteria
    matches.sort((a, b) => {
      // Always prioritize pharmacies with all items in stock
      if (a.allMedicinesInStock && !b.allMedicinesInStock) return -1;
      if (!a.allMedicinesInStock && b.allMedicinesInStock) return 1;

      if (sortOption === "price") {
        return a.totalPrescriptionCost - b.totalPrescriptionCost;
      }
      if (sortOption === "distance") {
        return a.distanceMiles - b.distanceMiles;
      }
      if (sortOption === "fastest") {
        return a.pickupReadyMinutes - b.pickupReadyMinutes;
      }
      // default: best_match
      return b.matchScore - a.matchScore;
    });

    return matches;
  }
}
