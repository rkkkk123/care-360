import {
  demoPatient,
  demoReports,
  demoTimelineEvents,
} from "@/features/patient/data/demoData";
import { ConsultationStore } from "./consultation-store";
import { AuthorizedHealthContext } from "@/types/models/consultation";

export function buildConsultationContext(
  consultationId: string
): AuthorizedHealthContext | null {
  // Retrieve consultation under doctor role to get full metadata
  const consultation = ConsultationStore.getConsultation(consultationId, "doctor");
  if (!consultation) {
    return null;
  }

  // Filter ONLY explicitly authorized reports for this consultation
  const authorizedReports = demoReports.filter((rep) =>
    consultation.authorizedReportIds.includes(rep.id)
  );

  // Filter ONLY explicitly authorized timeline events for this consultation
  const authorizedTimelineEvents = demoTimelineEvents.filter((evt) =>
    consultation.authorizedTimelineEventIds.includes(evt.id)
  );

  const context: AuthorizedHealthContext = {
    patient: {
      id: demoPatient.id,
      firstName: demoPatient.firstName,
      lastName: demoPatient.lastName,
      dateOfBirth: demoPatient.dateOfBirth,
      bloodType: demoPatient.bloodType || "O+",
      allergies: demoPatient.allergies,
      metrics: {
        bloodPressure: demoPatient.metrics.bloodPressure,
        heartRate: demoPatient.metrics.heartRate,
        weight: demoPatient.metrics.weight,
        height: demoPatient.metrics.height,
        lastUpdated: demoPatient.metrics.lastUpdated,
      },
    },
    appointment: {
      id: consultation.appointmentId,
      date: consultation.scheduledStartTime,
      time: "10:30 AM",
      reason: consultation.notes.chiefConcern || "Follow up on recent blood work.",
      fee: 85,
      doctorName: consultation.doctorName,
      specialization: "Internal Medicine & Metabolic Health",
    },
    authorizedReports,
    authorizedTimelineEvents,
    patientStatedConcern:
      consultation.notes.chiefConcern || "Patient requested follow-up on recent metabolic blood panel.",
    previousConsultationSummary:
      "Patient previously consulted in 2025 regarding annual preventive physical examination with mild hyperlipidemia noted, since managed with diet.",
  };

  return context;
}
