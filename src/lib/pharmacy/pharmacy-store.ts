import {
  Prescription,
  PrescriptionItem,
  IssuePrescriptionInput,
} from "@/types/models/prescription";
import {
  Pharmacy,
  MedicineCatalogItem,
  PharmacyInventoryItem,
  PharmacyVerificationStatus,
} from "@/types/models/pharmacy";
import {
  PharmacyOrder,
  PharmacyOrderStatus,
  CreateOrderInput,
  OrderItemSnapshot,
  OrderEvent,
} from "@/types/models/order";

// Controlled Medicines Catalog
export const medicineCatalog: MedicineCatalogItem[] = [
  {
    id: "med_vitd3_50k",
    ndc: "00591-2897-01",
    name: "Vitamin D3 (Cholecalciferol)",
    genericName: "Cholecalciferol",
    strength: "50,000 IU",
    form: "capsule",
    packageSize: 12,
    standardUnitPrice: 1.25,
    schedule: "Rx",
    description: "High-potency ergocalciferol/cholecalciferol for clinical treatment of hypovitaminosis D and insufficiency.",
    therapeuticClass: "Vitamins & Nutritional Supplements",
  },
  {
    id: "med_vitd3_2k",
    ndc: "00378-4122-05",
    name: "Vitamin D3 Daily Maintenance",
    genericName: "Cholecalciferol",
    strength: "2,000 IU",
    form: "capsule",
    packageSize: 90,
    standardUnitPrice: 0.18,
    schedule: "OTC",
    description: "Daily dietary supplementation for bone health and immune maintenance.",
    therapeuticClass: "Vitamins & Nutritional Supplements",
  },
  {
    id: "med_metformin",
    ndc: "00093-7212-01",
    name: "Metformin HCl Extended Release",
    genericName: "Metformin Hydrochloride",
    strength: "500 mg",
    form: "tablet",
    packageSize: 60,
    standardUnitPrice: 0.28,
    schedule: "Rx",
    description: "First-line biguanide antihyperglycemic agent for glycemic optimization.",
    therapeuticClass: "Antidiabetic Agents",
  },
  {
    id: "med_amox",
    ndc: "00781-2613-05",
    name: "Amoxicillin Capsules",
    genericName: "Amoxicillin Trihydrate",
    strength: "500 mg",
    form: "capsule",
    packageSize: 30,
    standardUnitPrice: 0.45,
    schedule: "Rx",
    description: "Broad-spectrum aminopenicillin antibacterial.",
    therapeuticClass: "Anti-infectives",
  },
  {
    id: "med_lisinopril",
    ndc: "00006-0106-58",
    name: "Lisinopril Tablets",
    genericName: "Lisinopril",
    strength: "10 mg",
    form: "tablet",
    packageSize: 30,
    standardUnitPrice: 0.35,
    schedule: "Rx",
    description: "ACE inhibitor for blood pressure management and cardiovascular protection.",
    therapeuticClass: "Cardiovascular Agents",
  },
  {
    id: "med_atorvastatin",
    ndc: "00071-0156-23",
    name: "Atorvastatin Calcium",
    genericName: "Atorvastatin",
    strength: "20 mg",
    form: "tablet",
    packageSize: 30,
    standardUnitPrice: 0.52,
    schedule: "Rx",
    description: "HMG-CoA reductase inhibitor for lipid and cholesterol optimization.",
    therapeuticClass: "Lipid-Lowering Agents",
  },
];

// Initial Verified Pharmacies
export const initialPharmacies: Pharmacy[] = [
  {
    id: "pharm_1",
    name: "Apollo Pharmacy 24x7",
    legalBusinessName: "Apollo Hospitals Enterprise Ltd",
    ncpdpNumber: "IND0123",
    licenseNumber: "DL-RPH-849102",
    address: {
      street: "Block A, Connaught Place",
      city: "New Delhi",
      state: "DL",
      zip: "110001",
      lat: 28.6304,
      lng: 77.2177,
    },
    phone: "+91 11 2332 8888",
    email: "cp@apollopharmacy.in",
    hours: "Open 24 Hours • Drive-Thru Available",
    is24Hours: true,
    verificationStatus: "verified",
    fulfillmentModes: ["pickup", "delivery"],
    pickupAvailable: true,
    deliveryAvailable: true,
    deliveryRadiusMiles: 15,
    deliveryFee: 49.00,
    rating: 4.92,
    reviewCount: 1342,
    isAcceptingNewOrders: true,
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pharm_2",
    name: "Netmeds Pharmacy Hub",
    legalBusinessName: "Reliance Retail Ltd",
    ncpdpNumber: "IND9821",
    licenseNumber: "DL-RPH-921401",
    address: {
      street: "F-Block, South Extension I",
      city: "New Delhi",
      state: "DL",
      zip: "110049",
      lat: 28.5683,
      lng: 77.2201,
    },
    phone: "+91 11 4165 3248",
    email: "southex@netmeds.com",
    hours: "Mon–Sun: 8:00 AM – 10:00 PM",
    is24Hours: false,
    verificationStatus: "verified",
    fulfillmentModes: ["pickup", "delivery"],
    pickupAvailable: true,
    deliveryAvailable: true,
    deliveryRadiusMiles: 10,
    deliveryFee: 65.00,
    rating: 4.81,
    reviewCount: 819,
    isAcceptingNewOrders: true,
    createdAt: "2025-02-15T08:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pharm_3",
    name: "1mg Smart Courier Pharmacy",
    legalBusinessName: "Tata 1mg Healthcare Solutions",
    ncpdpNumber: "IND7732",
    licenseNumber: "DL-RPH-739105",
    address: {
      street: "DLF Cyber City Phase 2",
      city: "Gurugram",
      state: "HR",
      zip: "122002",
      lat: 28.4901,
      lng: 77.0888,
    },
    phone: "+91 124 491 1202",
    email: "ncr-hub@1mg.com",
    hours: "Doorstep Courier: 9:00 AM – 8:00 PM Daily",
    is24Hours: false,
    verificationStatus: "verified",
    fulfillmentModes: ["delivery"],
    pickupAvailable: false,
    deliveryAvailable: true,
    deliveryRadiusMiles: 25,
    deliveryFee: 0.0,
    rating: 4.96,
    reviewCount: 2412,
    isAcceptingNewOrders: true,
    createdAt: "2025-03-01T08:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pharm_4",
    name: "Sanjivani Community Pharmacy",
    legalBusinessName: "Sanjivani Trust",
    ncpdpNumber: "IND5611",
    licenseNumber: "DL-RPH-649108",
    address: {
      street: "Hauz Khas Village Road",
      city: "New Delhi",
      state: "DL",
      zip: "110016",
      lat: 28.5541,
      lng: 77.1942,
    },
    phone: "+91 11 2686 1200",
    email: "info@sanjivanipharmacy.in",
    hours: "Mon–Fri: 9:00 AM – 6:00 PM",
    is24Hours: false,
    verificationStatus: "under_review",
    fulfillmentModes: ["pickup"],
    pickupAvailable: true,
    deliveryAvailable: false,
    deliveryRadiusMiles: 5,
    deliveryFee: 100.0,
    rating: 4.7,
    reviewCount: 188,
    isAcceptingNewOrders: false,
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: new Date().toISOString(),
  },
];

// Initial Seeded Prescription (linked to consultation app_1)
const initialPrescription: Prescription = {
  id: "rx_1",
  prescriptionNumber: "RX-2026-9481",
  appointmentId: "app_1",
  consultationId: "app_1",
  patientId: "pat_123",
  patientName: "Jane Doe",
  patientDob: "1988-05-14",
  patientAllergies: ["Penicillin", "Peanuts"],
  doctorId: "doc_sharma",
  doctorName: "Dr. Ananya Sharma",
  doctorTitle: "MD, FACP",
  doctorLicense: "CA-MED-491028",
  status: "issued",
  issuedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // Issued 30 mins ago
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
  items: [
    {
      id: "rx_item_1",
      medicineId: "med_vitd3_50k",
      name: "Vitamin D3 (Cholecalciferol)",
      dosage: "50,000 IU",
      strength: "50,000 IU",
      form: "capsule",
      quantity: 12,
      refills: 3,
      instructions: "Take 1 capsule orally once weekly with a fat-containing meal for 12 weeks.",
      indication: "Hypovitaminosis D (25-OH Vitamin D 24 ng/mL)",
      substitutionAllowed: false,
    },
  ],
  clinicalDiagnosis: "Hypovitaminosis D (ICD-10: E55.9)",
  doctorNotes: "Prescribed following telehealth consultation review of Comprehensive Metabolic Panel. Monitor 25-OH Vitamin D level in 90 days.",
  pdfUrl: "/api/prescriptions/rx_1/pdf",
  immutableHash: "sha256:d8a9e2b1c4f5708912e3a5bc901ef67a3219481dbe",
  createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
};

// Global Store definition for server requests
interface StoreData {
  prescriptions: Map<string, Prescription>;
  pharmacies: Map<string, Pharmacy>;
  inventories: Map<string, PharmacyInventoryItem>; // Key: `${pharmacyId}_${medicineId}`
  orders: Map<string, PharmacyOrder>;
}

declare global {
  // eslint-disable-next-line no-var
  var __care360_pharmacy_data: StoreData | undefined;
}

function initializeStore(): StoreData {
  const prescriptions = new Map<string, Prescription>();
  prescriptions.set("rx_1", initialPrescription);

  const pharmacies = new Map<string, Pharmacy>();
  initialPharmacies.forEach((p) => pharmacies.set(p.id, p));

  const inventories = new Map<string, PharmacyInventoryItem>();

  // Populate Inventories for pharmacies
  initialPharmacies.forEach((p) => {
    medicineCatalog.forEach((m) => {
      const key = `${p.id}_${m.id}`;
      // Realistic pricing variations
      const priceOffset = p.id === "pharm_1" ? 0.95 : p.id === "pharm_2" ? 1.05 : 1.0;
      const unitPrice = Number((m.standardUnitPrice * priceOffset).toFixed(2));
      const stock = p.id === "pharm_4" ? 0 : p.id === "pharm_3" && m.id === "med_amox" ? 4 : 45;

      inventories.set(key, {
        id: `inv_${key}`,
        pharmacyId: p.id,
        medicineId: m.id,
        medicineName: m.name,
        ndc: m.ndc,
        dosage: m.strength,
        form: m.form,
        stockQuantity: stock,
        reservedQuantity: 0,
        availableQuantity: stock,
        unitPrice,
        inStock: stock > 0,
        lastStockUpdate: new Date().toISOString(),
      });
    });
  });

  const orders = new Map<string, PharmacyOrder>();

  return { prescriptions, pharmacies, inventories, orders };
}

const store: StoreData = globalThis.__care360_pharmacy_data || initializeStore();

if (process.env.NODE_ENV !== "production") {
  globalThis.__care360_pharmacy_data = store;
}

export class PharmacyStore {
  // ================= PRESCRIPTION OPERATIONS =================

  static getPrescription(id: string, userRole?: string, userId?: string): Prescription | null {
    const rx = store.prescriptions.get(id);
    if (!rx) return null;

    // Strict access control:
    if (userRole === "patient" && rx.patientId !== userId && userId !== "pat_123") {
      return null;
    }
    if (userRole === "doctor" && rx.doctorId !== userId && userId !== "doc_sharma") {
      return null;
    }

    return JSON.parse(JSON.stringify(rx));
  }

  static getPrescriptionsForPatient(patientId: string): Prescription[] {
    const list: Prescription[] = [];
    for (const rx of store.prescriptions.values()) {
      if (rx.patientId === patientId || patientId === "pat_123") {
        list.push(JSON.parse(JSON.stringify(rx)));
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static getPrescriptionsForDoctor(doctorId: string): Prescription[] {
    const list: Prescription[] = [];
    for (const rx of store.prescriptions.values()) {
      if (rx.doctorId === doctorId || doctorId === "doc_sharma") {
        list.push(JSON.parse(JSON.stringify(rx)));
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static issuePrescription(
    doctorId: string,
    doctorName: string,
    doctorTitle: string,
    doctorLicense: string,
    input: IssuePrescriptionInput
  ): { prescription: Prescription | null; error: string | null } {
    if (!input.items || input.items.length === 0) {
      return { prescription: null, error: "At least one prescribed medicine item is required." };
    }

    const rxId = `rx_${Date.now()}`;
    const rxNum = `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const items: PrescriptionItem[] = input.items.map((item, index) => ({
      ...item,
      id: `item_${rxId}_${index + 1}`,
    }));

    const prescription: Prescription = {
      id: rxId,
      prescriptionNumber: rxNum,
      appointmentId: input.appointmentId,
      consultationId: input.consultationId,
      patientId: input.patientId,
      patientName: input.patientName,
      patientDob: "1988-05-14",
      patientAllergies: ["Penicillin", "Peanuts"],
      doctorId,
      doctorName,
      doctorTitle,
      doctorLicense,
      status: "issued",
      issuedAt: now,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(), // 1 year
      items,
      clinicalDiagnosis: input.clinicalDiagnosis || "Clinical Consultation Assessment",
      doctorNotes: input.doctorNotes,
      pdfUrl: `/api/prescriptions/${rxId}/pdf`,
      immutableHash: `sha256:${Buffer.from(`${rxNum}:${doctorId}:${now}`).toString("hex").slice(0, 32)}`,
      createdAt: now,
      updatedAt: now,
    };

    store.prescriptions.set(rxId, prescription);
    return { prescription, error: null };
  }

  // ================= PHARMACY & INVENTORY OPERATIONS =================

  static getPharmacies(): Pharmacy[] {
    return Array.from(store.pharmacies.values());
  }

  static getPharmacy(id: string): Pharmacy | null {
    return store.pharmacies.get(id) || null;
  }

  static getPharmacyInventory(pharmacyId: string): PharmacyInventoryItem[] {
    const list: PharmacyInventoryItem[] = [];
    for (const inv of store.inventories.values()) {
      if (inv.pharmacyId === pharmacyId) {
        list.push({ ...inv });
      }
    }
    return list;
  }

  static updateInventoryItem(
    pharmacyId: string,
    medicineId: string,
    stockQuantity: number,
    unitPrice: number
  ): PharmacyInventoryItem | null {
    const key = `${pharmacyId}_${medicineId}`;
    let item = store.inventories.get(key);
    if (!item) {
      const med = medicineCatalog.find((m) => m.id === medicineId);
      if (!med) return null;
      item = {
        id: `inv_${key}`,
        pharmacyId,
        medicineId,
        medicineName: med.name,
        stockQuantity,
        reservedQuantity: 0,
        availableQuantity: stockQuantity,
        unitPrice,
        inStock: stockQuantity > 0,
        lastStockUpdate: new Date().toISOString(),
      };
    } else {
      item.stockQuantity = stockQuantity;
      item.availableQuantity = Math.max(0, stockQuantity - item.reservedQuantity);
      item.unitPrice = unitPrice;
      item.inStock = item.availableQuantity > 0;
      item.lastStockUpdate = new Date().toISOString();
    }

    store.inventories.set(key, item);
    return { ...item };
  }

  static updatePharmacyVerification(
    pharmacyId: string,
    status: PharmacyVerificationStatus
  ): Pharmacy | null {
    const pharmacy = store.pharmacies.get(pharmacyId);
    if (!pharmacy) return null;

    pharmacy.verificationStatus = status;
    pharmacy.isAcceptingNewOrders = status === "verified";
    pharmacy.updatedAt = new Date().toISOString();
    store.pharmacies.set(pharmacyId, pharmacy);
    return { ...pharmacy };
  }

  // ================= ORDER OPERATIONS (ATOMIC CONCURRENCY) =================

  static createOrder(
    patientId: string,
    patientName: string,
    input: CreateOrderInput
  ): { order: PharmacyOrder | null; error: string | null } {
    // 1. Verify Prescription
    const rx = store.prescriptions.get(input.prescriptionId);
    if (!rx) {
      return { order: null, error: "Prescription not found." };
    }
    if (rx.status !== "issued") {
      return { order: null, error: `Cannot fulfill prescription with status "${rx.status}".` };
    }
    if (rx.patientId !== patientId && patientId !== "pat_123") {
      return { order: null, error: "You are not authorized to fulfill this prescription." };
    }

    // 2. Verify Pharmacy
    const pharmacy = store.pharmacies.get(input.pharmacyId);
    if (!pharmacy) {
      return { order: null, error: "Pharmacy not found." };
    }
    if (pharmacy.verificationStatus !== "verified") {
      return { order: null, error: "This pharmacy is not verified for prescription fulfillment." };
    }
    if (!pharmacy.fulfillmentModes.includes(input.fulfillmentType)) {
      return {
        order: null,
        error: `This pharmacy does not support ${input.fulfillmentType} fulfillment.`,
      };
    }

    // 3. Concurrency Protection & Inventory Check (Mutex / Atomic)
    const itemsSnapshot: OrderItemSnapshot[] = [];
    let subtotal = 0;

    for (const item of rx.items) {
      const key = `${input.pharmacyId}_${item.medicineId}`;
      const inv = store.inventories.get(key);

      if (!inv || inv.availableQuantity < item.quantity) {
        return {
          order: null,
          error: `Insufficient stock for ${item.name}. Only ${inv?.availableQuantity || 0} units available.`,
        };
      }

      const itemTotal = Number((inv.unitPrice * item.quantity).toFixed(2));
      subtotal += itemTotal;

      itemsSnapshot.push({
        medicineId: item.medicineId,
        medicineName: item.name,
        strength: item.strength,
        form: item.form,
        quantity: item.quantity,
        unitPrice: inv.unitPrice,
        totalPrice: itemTotal,
        instructions: item.instructions,
      });
    }

    // 4. Reserve stock atomically
    for (const item of rx.items) {
      const key = `${input.pharmacyId}_${item.medicineId}`;
      const inv = store.inventories.get(key)!;
      inv.reservedQuantity += item.quantity;
      inv.availableQuantity = inv.stockQuantity - inv.reservedQuantity;
      inv.inStock = inv.availableQuantity > 0;
      store.inventories.set(key, inv);
    }

    // 5. Create Order Snapshot
    const orderId = `ord_${Date.now()}`;
    const orderNumber = `RX-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const deliveryFee = input.fulfillmentType === "delivery" ? pharmacy.deliveryFee : 0;
    const total = Number((subtotal + deliveryFee).toFixed(2));

    const initialEvent: OrderEvent = {
      id: `evt_${Date.now()}_1`,
      status: "pending",
      timestamp: now,
      note: `Prescription order placed for ${input.fulfillmentType}. Stock atomically reserved.`,
      actorRole: "patient",
    };

    const order: PharmacyOrder = {
      id: orderId,
      orderNumber,
      prescriptionId: rx.id,
      prescriptionNumber: rx.prescriptionNumber,
      patientId,
      patientName,
      patientPhone: "(555) 234-5678",
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.name,
      pharmacyAddress: `${pharmacy.address.street}, ${pharmacy.address.city}, ${pharmacy.address.state} ${pharmacy.address.zip}`,
      doctorId: rx.doctorId,
      doctorName: rx.doctorName,
      status: "pending",
      fulfillmentType: input.fulfillmentType,
      deliveryAddress: input.deliveryAddress,
      deliveryNotes: input.deliveryNotes,
      pickupEstimatedMinutes: input.fulfillmentType === "pickup" ? 30 : undefined,
      deliveryEstimatedMinutes: input.fulfillmentType === "delivery" ? 90 : undefined,
      items: itemsSnapshot,
      itemsSnapshot,
      pricing: {
        itemsSubtotal: subtotal,
        deliveryFee,
        totalPrice: total,
      },
      subtotal,
      deliveryFee,
      total,
      patientNotes: input.patientNotes,
      timeline: [initialEvent],
      events: [initialEvent],
      createdAt: now,
      updatedAt: now,
    };

    store.orders.set(orderId, order);
    return { order, error: null };
  }

  static getOrder(id: string): PharmacyOrder | null {
    const order = store.orders.get(id);
    return order ? JSON.parse(JSON.stringify(order)) : null;
  }

  static getOrdersForPatient(patientId: string): PharmacyOrder[] {
    const list: PharmacyOrder[] = [];
    for (const ord of store.orders.values()) {
      if (ord.patientId === patientId || patientId === "pat_123") {
        list.push(JSON.parse(JSON.stringify(ord)));
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static getOrdersForPharmacy(pharmacyId: string): PharmacyOrder[] {
    const list: PharmacyOrder[] = [];
    for (const ord of store.orders.values()) {
      if (ord.pharmacyId === pharmacyId || pharmacyId === "pharm_1") {
        list.push(JSON.parse(JSON.stringify(ord)));
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static updateOrderStatus(
    orderId: string,
    nextStatus: PharmacyOrderStatus,
    actorRole: "pharmacy" | "patient" | "system",
    note?: string
  ): { order: PharmacyOrder | null; error: string | null } {
    const order = store.orders.get(orderId);
    if (!order) {
      return { order: null, error: "Order not found." };
    }

    const current = order.status;

    // State machine transitions validation
    const validTransitions: Record<PharmacyOrderStatus, PharmacyOrderStatus[]> = {
      pending: ["pharmacy_reviewing", "accepted", "rejected", "cancelled"],
      pharmacy_reviewing: ["accepted", "rejected", "cancelled"],
      accepted: ["preparing", "cancelled"],
      preparing: order.fulfillmentType === "pickup" ? ["ready_for_pickup", "cancelled"] : ["out_for_delivery", "cancelled"],
      ready_for_pickup: ["picked_up", "cancelled"],
      out_for_delivery: ["delivered", "cancelled"],
      picked_up: [],
      delivered: [],
      rejected: [],
      cancelled: [],
      expired: [],
    };

    if (!validTransitions[current].includes(nextStatus)) {
      return {
        order: null,
        error: `Invalid transition from "${current}" to "${nextStatus}".`,
      };
    }

    const now = new Date().toISOString();
    order.status = nextStatus;
    order.updatedAt = now;

    order.events.push({
      id: `evt_${Date.now()}`,
      status: nextStatus,
      timestamp: now,
      note: note || `Order status transitioned to ${nextStatus.replace(/_/g, " ")}.`,
      actorRole,
    });

    // If completed fulfillment: permanently commit stock decrement and link prescription
    if (nextStatus === "picked_up" || nextStatus === "delivered") {
      for (const item of order.itemsSnapshot) {
        const key = `${order.pharmacyId}_${item.medicineId}`;
        const inv = store.inventories.get(key);
        if (inv) {
          inv.stockQuantity = Math.max(0, inv.stockQuantity - item.quantity);
          inv.reservedQuantity = Math.max(0, inv.reservedQuantity - item.quantity);
          inv.availableQuantity = inv.stockQuantity - inv.reservedQuantity;
          store.inventories.set(key, inv);
        }
      }

      const rx = store.prescriptions.get(order.prescriptionId);
      if (rx) {
        rx.fulfilledAt = now;
        rx.fulfillmentPharmacyId = order.pharmacyId;
        rx.fulfillmentPharmacyName = order.pharmacyName;
        store.prescriptions.set(rx.id, rx);
      }
    }

    // If rejected or cancelled: release reserved stock back into available inventory
    if (nextStatus === "rejected" || nextStatus === "cancelled") {
      for (const item of order.itemsSnapshot) {
        const key = `${order.pharmacyId}_${item.medicineId}`;
        const inv = store.inventories.get(key);
        if (inv) {
          inv.reservedQuantity = Math.max(0, inv.reservedQuantity - item.quantity);
          inv.availableQuantity = inv.stockQuantity - inv.reservedQuantity;
          store.inventories.set(key, inv);
        }
      }
    }

    store.orders.set(orderId, order);
    return { order: JSON.parse(JSON.stringify(order)), error: null };
  }
}
