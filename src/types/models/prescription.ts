export type PrescriptionStatus = "draft" | "issued" | "filled" | "cancelled" | "expired";

export type MedicationForm =
  | "capsule"
  | "tablet"
  | "liquid"
  | "injection"
  | "topical"
  | "inhaler";

export interface PrescriptionItem {
  id: string;
  medicineId: string;
  name: string;
  medicineName?: string; // Optional convenience alias
  genericName?: string;
  dosage: string;
  strength?: string;
  form: MedicationForm | string;
  quantity: number;
  refills?: number;
  route?: string;
  frequency?: string;
  duration?: string;
  instructions: string;
  indication?: string;
  substitutionAllowed?: boolean;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string; // e.g. RX-2026-9481
  appointmentId?: string;
  consultationId?: string;
  patientId: string;
  patientName: string;
  patientDob?: string;
  patientAllergies: string[];
  doctorId: string;
  doctorName: string;
  doctorTitle?: string;
  doctorLicense: string;
  doctorNpi?: string;
  status: PrescriptionStatus;
  issuedAt: string;
  expiresAt?: string;
  validUntil?: string;
  items: PrescriptionItem[];
  clinicalDiagnosis?: string;
  diagnosis?: string;
  doctorNotes?: string;
  notes?: string;
  refillsAllowed?: number;
  refillsRemaining?: number;
  pdfUrl: string;
  immutableHash: string;
  fulfilledAt?: string;
  fulfillmentPharmacyId?: string;
  fulfillmentPharmacyName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IssuePrescriptionInput {
  appointmentId?: string;
  consultationId?: string;
  patientId: string;
  patientName: string;
  clinicalDiagnosis?: string;
  diagnosis?: string;
  doctorNotes?: string;
  items: Omit<PrescriptionItem, "id">[];
}
