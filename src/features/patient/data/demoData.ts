import { PatientRecord } from "@/types/models/patient";
import { Appointment } from "@/types/models/appointment";
import { HealthReport } from "@/types/models/report";

const today = new Date();
const addDays = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const demoPatient: PatientRecord = {
  id: "pat_123",
  firstName: "Jane",
  lastName: "Doe",
  dateOfBirth: "1988-05-14",
  bloodType: "O+",
  allergies: ["Penicillin", "Peanuts"],
  metrics: {
    bloodPressure: "118/76",
    heartRate: 68,
    weight: 65,
    height: 168,
    lastUpdated: new Date().toISOString(),
  }
};

export const demoAppointments: Appointment[] = [
  {
    id: "app_1",
    patientId: "pat_123",
    doctorId: "doc_456",
    doctorName: "Dr. A. Sharma",
    specialization: "General Medicine",
    date: addDays(2),
    type: "video",
    status: "scheduled",
    notes: "Follow up on recent blood work."
  }
];

// Extracted metrics structure for reports
export interface Biomarker {
  name: string;
  value: number;
  unit: string;
  referenceRange: string;
  status: "normal" | "low" | "high";
}

export interface DetailedHealthReport extends HealthReport {
  extractedMetrics?: Biomarker[];
  aiAnalysis?: string;
  recommendations?: string[];
}

export const demoReports: DetailedHealthReport[] = [
  {
    id: "rep_1",
    patientId: "pat_123",
    title: "Comprehensive Metabolic Panel",
    type: "Blood Test",
    date: addDays(-2),
    status: "ready",
    providerName: "CityPath Labs",
    summary: "All metabolic levels are within the normal range. Vitamin D is slightly low.",
    aiAnalysis: "The metabolic panel indicates healthy kidney and liver function. Fasting glucose is excellent. However, 25-hydroxy vitamin D levels are at the lower end of the reference range, suggesting mild insufficiency. This is common during winter months.",
    recommendations: [
      "Discuss a Vitamin D3 supplement with your primary care physician.",
      "Maintain your current balanced diet and exercise routine.",
      "Ensure adequate hydration (2-3 liters of water daily)."
    ],
    extractedMetrics: [
      { name: "Glucose (Fasting)", value: 85, unit: "mg/dL", referenceRange: "70-99", status: "normal" },
      { name: "Vitamin D (25-OH)", value: 24, unit: "ng/mL", referenceRange: "30-100", status: "low" },
      { name: "Cholesterol (Total)", value: 175, unit: "mg/dL", referenceRange: "<200", status: "normal" },
      { name: "LDL Cholesterol", value: 95, unit: "mg/dL", referenceRange: "<100", status: "normal" },
      { name: "HDL Cholesterol", value: 65, unit: "mg/dL", referenceRange: ">50", status: "normal" }
    ]
  },
  {
    id: "rep_2",
    patientId: "pat_123",
    title: "Annual Physical Panel (2025)",
    type: "Blood Test",
    date: addDays(-365),
    status: "ready",
    providerName: "CityPath Labs",
    summary: "Standard annual panel. Cholesterol slightly elevated.",
    extractedMetrics: [
      { name: "Glucose (Fasting)", value: 88, unit: "mg/dL", referenceRange: "70-99", status: "normal" },
      { name: "Vitamin D (25-OH)", value: 35, unit: "ng/mL", referenceRange: "30-100", status: "normal" },
      { name: "Cholesterol (Total)", value: 210, unit: "mg/dL", referenceRange: "<200", status: "high" },
      { name: "LDL Cholesterol", value: 120, unit: "mg/dL", referenceRange: "<100", status: "high" },
      { name: "HDL Cholesterol", value: 60, unit: "mg/dL", referenceRange: ">50", status: "normal" }
    ]
  }
];

export const demoPrescriptions = [];

export const demoTimelineEvents = [
  {
    id: "tl_1",
    type: "report_ready",
    title: "New lab results available",
    description: "Comprehensive Metabolic Panel is ready to review.",
    date: addDays(-2)
  },
  {
    id: "tl_2",
    type: "report_ready",
    title: "Previous lab results",
    description: "Annual Physical Panel (2025) archived.",
    date: addDays(-365)
  }
];

// Mock Trend Data for Charts
export const demoTrendData = [
  { date: "Jan", systolic: 125, diastolic: 82, weight: 67, heartRate: 72 },
  { date: "Feb", systolic: 124, diastolic: 80, weight: 66.5, heartRate: 70 },
  { date: "Mar", systolic: 122, diastolic: 78, weight: 66, heartRate: 71 },
  { date: "Apr", systolic: 120, diastolic: 79, weight: 65.5, heartRate: 69 },
  { date: "May", systolic: 118, diastolic: 76, weight: 65, heartRate: 68 },
];
