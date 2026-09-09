export type PharmacyVerificationStatus =
  | "pending"
  | "under_review"
  | "verified"
  | "rejected"
  | "suspended";

export type FulfillmentMode = "pickup" | "delivery";

export interface PharmacyAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

export interface Pharmacy {
  id: string;
  name: string;
  legalBusinessName: string;
  ncpdpNumber: string;
  nabpNumber?: string;
  licenseNumber: string;
  address: PharmacyAddress;
  phone: string;
  email: string;
  hours: string;
  is24Hours?: boolean;
  verificationStatus: PharmacyVerificationStatus;
  fulfillmentModes: FulfillmentMode[];
  pickupAvailable?: boolean;
  deliveryAvailable?: boolean;
  deliveryRadiusMiles: number;
  deliveryFee: number;
  rating: number;
  reviewCount: number;
  isAcceptingNewOrders: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineCatalogItem {
  id: string;
  ndc: string; // National Drug Code
  name: string;
  genericName: string;
  strength: string;
  form: string;
  packageSize: number;
  standardUnitPrice: number;
  schedule: "OTC" | "Rx" | "Schedule II" | "Schedule III" | "Schedule IV";
  description: string;
  therapeuticClass: string;
}

export interface PharmacyInventoryItem {
  id: string;
  pharmacyId: string;
  medicineId: string;
  medicineName: string;
  ndc?: string;
  dosage?: string;
  form?: string;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number; // stockQuantity - reservedQuantity
  unitPrice: number;
  inStock: boolean;
  lastStockUpdate: string;
}

export interface PharmacyComparisonMatch {
  pharmacy: Pharmacy;
  distanceMiles: number;
  allMedicinesInStock: boolean;
  totalPrescriptionCost: number;
  deliveryFee: number;
  totalWithDelivery: number;
  pickupReadyMinutes: number;
  deliveryEstimatedMinutes?: number;
  itemsCoverage: Array<{
    medicineId: string;
    medicineName: string;
    inStock: boolean;
    availableQuantity: number;
    unitPrice: number;
  }>;
  matchScore: number;
  matchReason: string;

  // Presentation fields guaranteed by matching engine
  stockStatus: "all_in_stock" | "partial_stock" | "out_of_stock";
  estimatedReadyTime: string;
  matchedCount: number;
  totalItemsCount: number;
  pricing: {
    itemsSubtotal: number;
    deliveryFee: number;
    totalPrice: number;
  };
  itemDetails: Array<{
    medicineId: string;
    medicineName: string;
    quantity: number;
    stockStatus: "in_stock" | "low_stock" | "out_of_stock";
    unitPrice: number;
  }>;
}
