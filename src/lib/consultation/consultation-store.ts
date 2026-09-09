import {
  Consultation,
  ConsultationNotes,
  ConsultationStatus,
  ParticipantRole,
  PrescriptionReadyData,
} from "@/types/models/consultation";

// Global persistent cache across server requests in this Node process
declare global {
  // eslint-disable-next-line no-var
  var __care360_consultations: Map<string, Consultation> | undefined;
}

const consultations: Map<string, Consultation> =
  globalThis.__care360_consultations || new Map<string, Consultation>();

if (process.env.NODE_ENV !== "production") {
  globalThis.__care360_consultations = consultations;
}

// Initial Seed for Demo Appointment `app_1`
const defaultNotes: ConsultationNotes = {
  chiefConcern: "Follow up on recent metabolic blood panel and discussion on mild Vitamin D insufficiency.",
  historyOfPresentIllness: "Patient reports mild seasonal fatigue over the past 2 months. No chest pain, palpitations, shortness of breath, or GI symptoms. Appetite and sleep regular.",
  observations: "Alert and oriented x3. Appears healthy, well-nourished. Vital signs within target physiological ranges (BP 118/76 mmHg, HR 68 bpm).",
  assessment: "1. Mild 25-hydroxy Vitamin D insufficiency (24 ng/mL).\n2. Excellent glycemic control (Fasting Glucose 85 mg/dL).\n3. Normal hepatic and renal metabolic panel.",
  plan: "1. Initiate Vitamin D3 supplementation (2,000 IU daily with dietary fat).\n2. Continue standard aerobic and strength exercise.\n3. Repeat 25-OH Vitamin D and comprehensive metabolic panel in 90 days.",
  followUp: "Routine follow-up in 3 months with repeat blood draw.",
  doctorPrivateNotes: "Patient is highly adherent to lifestyle recommendations. Consider monitoring calcium if high-dose D3 is later required. Good candidate for connected care monitoring.",
  patientVisibleSummary: "Reviewed your Comprehensive Metabolic Panel. Your kidney, liver, and blood glucose markers are in optimal health. Your Vitamin D is slightly low at 24 ng/mL, which is very common during winter. We discussed beginning a daily Vitamin D3 supplement (2,000 IU) and repeating a check in 3 months.",
  lastSavedAt: new Date().toISOString(),
  isDraft: true,
};

const initialDemoConsultation: Consultation = {
  id: "app_1",
  appointmentId: "app_1",
  patientId: "pat_123",
  doctorId: "doc_sharma",
  doctorName: "Dr. Ananya Sharma",
  patientName: "Jane Doe",
  status: "confirmed",
  videoRoomUrl: "https://care360.daily.co/consultation-app-1",
  scheduledStartTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  authorizedReportIds: ["rep_1"],
  authorizedTimelineEventIds: ["tl_1"],
  notes: defaultNotes,
  patientVisibleSummary: defaultNotes.patientVisibleSummary,
  isFinalized: false,
};

if (!consultations.has("app_1")) {
  consultations.set("app_1", initialDemoConsultation);
}

export class ConsultationStore {
  static getConsultation(id: string, requesterRole: ParticipantRole): Consultation | null {
    let consultation = consultations.get(id);

    // If not found by consultationId, search by appointmentId
    if (!consultation) {
      for (const item of consultations.values()) {
        if (item.appointmentId === id) {
          consultation = item;
          break;
        }
      }
    }

    if (!consultation) {
      // Create dynamically if not seeded
      consultation = {
        id,
        appointmentId: id,
        patientId: "pat_123",
        doctorId: "doc_sharma",
        doctorName: "Dr. Ananya Sharma",
        patientName: "Jane Doe",
        status: "confirmed",
        videoRoomUrl: `https://care360.daily.co/consultation-${id}`,
        scheduledStartTime: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorizedReportIds: ["rep_1"],
        authorizedTimelineEventIds: ["tl_1"],
        notes: { ...defaultNotes },
        patientVisibleSummary: defaultNotes.patientVisibleSummary,
        isFinalized: false,
      };
      consultations.set(id, consultation);
    }

    // Clone to prevent direct mutation
    const copy: Consultation = JSON.parse(JSON.stringify(consultation));

    // PRIVACY ENFORCEMENT:
    // Patient role must NEVER see doctorPrivateNotes
    if (requesterRole === "patient") {
      copy.notes.doctorPrivateNotes = "";
      if (!copy.isFinalized) {
        // Patient cannot preview unfinalized patient notes
        copy.patientVisibleSummary = undefined;
      }
    }

    return copy;
  }

  static updateStatus(
    id: string,
    newStatus: ConsultationStatus,
    role: ParticipantRole
  ): { consultation: Consultation | null; error: string | null } {
    const consultation = consultations.get(id);
    if (!consultation) {
      return { consultation: null, error: "Consultation not found." };
    }

    if (consultation.isFinalized && newStatus !== "completed") {
      return { consultation, error: "Cannot modify status of a finalized consultation." };
    }

    // Role-specific transition rules
    if (role === "patient") {
      // Patient can indicate they are ready or leave, but CANNOT complete or cancel
      if (newStatus === "completed" || newStatus === "cancelled") {
        return { consultation, error: "Patients cannot finalize or cancel active consultations." };
      }
      if (consultation.status === "confirmed" && newStatus === "patient_ready") {
        consultation.status = "patient_ready";
      }
    } else if (role === "doctor") {
      if (consultation.status === "patient_ready" && newStatus === "in_progress") {
        consultation.status = "in_progress";
        consultation.startedAt = consultation.startedAt || new Date().toISOString();
      } else if (newStatus === "doctor_ready" || newStatus === "in_progress") {
        consultation.status = newStatus;
        if (newStatus === "in_progress" && !consultation.startedAt) {
          consultation.startedAt = new Date().toISOString();
        }
      }
    }

    consultation.updatedAt = new Date().toISOString();
    consultations.set(id, consultation);

    return { consultation: this.getConsultation(id, role), error: null };
  }

  static saveNotes(
    id: string,
    doctorId: string,
    updates: Partial<ConsultationNotes>
  ): { notes: ConsultationNotes | null; error: string | null } {
    const consultation = consultations.get(id);
    if (!consultation) {
      return { notes: null, error: "Consultation not found." };
    }

    if (consultation.isFinalized) {
      return { notes: consultation.notes, error: "Consultation is finalized and read-only." };
    }

    consultation.notes = {
      ...consultation.notes,
      ...updates,
      lastSavedAt: new Date().toISOString(),
      isDraft: true,
    };
    consultation.updatedAt = new Date().toISOString();
    consultations.set(id, consultation);

    return { notes: consultation.notes, error: null };
  }

  static finalizeConsultation(
    id: string,
    doctorId: string,
    data: {
      notes: ConsultationNotes;
      patientSummary: string;
      medicationRecommendations?: Array<{ name: string; intent: string; clinicianReviewRequired: true }>;
    }
  ): { consultation: Consultation | null; error: string | null } {
    const consultation = consultations.get(id);
    if (!consultation) {
      return { consultation: null, error: "Consultation not found." };
    }

    // Idempotent: If already finalized, return successfully without re-finalizing
    if (consultation.isFinalized) {
      return { consultation: this.getConsultation(id, "doctor"), error: null };
    }

    // Required fields verification
    if (!data.notes.assessment?.trim() || !data.notes.plan?.trim()) {
      return {
        consultation: null,
        error: "Both Assessment and Plan are clinically required to finalize a consultation.",
      };
    }

    const now = new Date().toISOString();

    const prescriptionReadyData: PrescriptionReadyData = {
      appointmentId: consultation.appointmentId,
      consultationId: consultation.id,
      doctorId,
      patientId: consultation.patientId,
      prescriptionId: null, // Ready for Phase 7
      medicationRecommendations: data.medicationRecommendations || [
        {
          name: "Vitamin D3 (Cholecalciferol)",
          dosageRecommendation: "2,000 IU Oral Daily",
          intent: "Correction of mild 25-OH Vitamin D insufficiency",
          clinicianReviewRequired: true,
        },
      ],
      preparedAt: now,
    };

    consultation.notes = {
      ...data.notes,
      patientVisibleSummary: data.patientSummary,
      isDraft: false,
      lastSavedAt: now,
    };
    consultation.patientVisibleSummary = data.patientSummary;
    consultation.prescriptionReadyData = prescriptionReadyData;
    consultation.isFinalized = true;
    consultation.status = "completed";
    consultation.finalizedBy = doctorId;
    consultation.finalizedAt = now;
    consultation.completedAt = now;
    consultation.updatedAt = now;

    consultations.set(id, consultation);

    return { consultation: this.getConsultation(id, "doctor"), error: null };
  }
}
