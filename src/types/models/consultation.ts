import { DetailedHealthReport } from "@/features/patient/data/demoData";

export const CONSULTATION_JOIN_EARLY_MINUTES = 15;
export const CONSULTATION_JOIN_GRACE_MINUTES = 30;

export type ConsultationStatus =
  | "scheduled"
  | "confirmed"
  | "patient_ready"
  | "doctor_ready"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type ParticipantRole = "patient" | "doctor";

export type VideoConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "ended"
  | "failed";

export interface ConsultationNotes {
  chiefConcern: string;
  historyOfPresentIllness: string;
  observations: string;
  assessment: string;
  plan: string;
  followUp: string;
  doctorPrivateNotes: string; // STRICT: Clinician only, never returned to patient
  patientVisibleSummary: string; // Shared with patient upon finalization
  lastSavedAt?: string;
  isDraft: boolean;
}

export interface PrescriptionReadyMedication {
  name: string;
  dosageRecommendation?: string;
  instructions?: string;
  intent: string;
  clinicianReviewRequired: true;
}

export interface PrescriptionReadyData {
  appointmentId: string;
  consultationId: string;
  doctorId: string;
  patientId: string;
  prescriptionId: string | null; // Reserved for Phase 7 connected pharmacy marketplace
  medicationRecommendations: PrescriptionReadyMedication[];
  preparedAt: string;
}

export interface AuthorizedHealthContext {
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    bloodType?: string;
    allergies: string[];
    metrics: {
      bloodPressure: string;
      heartRate: number;
      weight: number;
      height: number;
      lastUpdated: string;
    };
  };
  appointment: {
    id: string;
    date: string;
    time: string;
    reason: string;
    fee: number;
    doctorName: string;
    specialization: string;
  };
  authorizedReports: DetailedHealthReport[];
  authorizedTimelineEvents: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    date: string;
  }>;
  patientStatedConcern: string;
  previousConsultationSummary?: string;
}

export interface Consultation {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  status: ConsultationStatus;
  videoRoomUrl: string;
  scheduledStartTime: string;
  startedAt?: string;
  endedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorizedReportIds: string[];
  authorizedTimelineEventIds: string[];
  notes: ConsultationNotes;
  patientVisibleSummary?: string;
  prescriptionReadyData?: PrescriptionReadyData;
  isFinalized: boolean;
  finalizedBy?: string;
  finalizedAt?: string;
}

export interface AICopilotRequest {
  consultationId: string;
  queryType: "overview" | "report_summary" | "report_diff" | "questions" | "draft_notes" | "custom";
  customPrompt?: string;
  currentDraftNotes?: Partial<ConsultationNotes>;
}

export interface AICopilotResponse {
  answer: string;
  suggestedQuestions?: string[];
  draftNote?: Partial<ConsultationNotes>;
  aiGeneratedAt: string;
  aiModel: string;
  aiContextVersion: string;
  disclaimer: "AI-generated assistance for clinician review.";
}
