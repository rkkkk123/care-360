export type ReportStatus = "processing" | "ready" | "needs_review";

export interface HealthReport {
  id: string;
  patientId: string;
  title: string;
  type: string;
  date: string; // ISO string
  status: ReportStatus;
  summary?: string; // AI generated summary
  pdfUrl?: string;
  providerName?: string;
}
