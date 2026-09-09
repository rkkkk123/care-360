export type PharmacyOrderStatus =
  | "pending"
  | "pharmacy_reviewing"
  | "accepted"
  | "preparing"
  | "ready_for_pickup"
  | "picked_up"
  | "out_for_delivery"
  | "delivered"
  | "rejected"
  | "cancelled"
  | "expired";

export type FulfillmentType = "pickup" | "delivery";

export interface OrderItemSnapshot {
  medicineId: string;
  medicineName: string;
  dosage?: string;
  strength?: string;
  form?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  instructions?: string;
}

export interface OrderEvent {
  id?: string;
  status: PharmacyOrderStatus;
  timestamp: string;
  note?: string;
  actor?: string;
  actorRole?: "patient" | "pharmacy" | "system" | "doctor";
}

export interface PharmacyOrderPricing {
  itemsSubtotal: number;
  deliveryFee: number;
  totalPrice: number;
}

export interface PharmacyOrder {
  id: string;
  orderNumber: string; // e.g. RX-ORD-2026-1049
  prescriptionId: string;
  prescriptionNumber?: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyAddress: string | {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  pharmacyPhone?: string;
  doctorId?: string;
  doctorName?: string;
  status: PharmacyOrderStatus;
  fulfillmentType: FulfillmentType;
  deliveryAddress?: string | {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  deliveryNotes?: string;
  pickupEstimatedMinutes?: number;
  deliveryEstimatedMinutes?: number;

  // Items
  items: OrderItemSnapshot[];
  itemsSnapshot: OrderItemSnapshot[];

  // Pricing
  pricing: PharmacyOrderPricing;
  subtotal?: number;
  deliveryFee?: number;
  total?: number;

  copayAmount?: number;
  patientNotes?: string;
  pharmacyRejectionReason?: string;

  // Timeline
  timeline: OrderEvent[];
  events: OrderEvent[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  prescriptionId: string;
  pharmacyId: string;
  fulfillmentType: FulfillmentType;
  items?: OrderItemSnapshot[];
  copayAmount?: number;
  deliveryAddress?: string | {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  deliveryNotes?: string;
  patientNotes?: string;
}
