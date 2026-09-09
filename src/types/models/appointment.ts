export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "patient_ready"
  | "doctor_ready"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type AppointmentType = "video" | "in_person" | "chat";

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string; // ISO string
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  consultationId?: string;
  isFinalized?: boolean;
  patientVisibleSummary?: string;
  finalizedAt?: string;
}
