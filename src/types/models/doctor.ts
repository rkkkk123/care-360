export type ConsultationMode = "video" | "in_person";

export interface TimeSlot {
  id: string;
  time: string; // e.g. "09:30 AM"
  period: "morning" | "afternoon" | "evening";
  available: boolean;
}

export interface DaySchedule {
  date: string; // ISO format "2026-03-10"
  displayDate: string; // "Wed, Mar 10"
  slots: TimeSlot[];
}

export interface DoctorReview {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
  consultationType: "video" | "in_person";
}

export interface DoctorProfile {
  id: string;
  name: string;
  title: string;
  specialization: string;
  subspecialties: string[];
  rating: number;
  reviewCount: number;
  experienceYears: number;
  verified: boolean;
  verificationBadge: string;
  licenseNumber: string;
  credentials: string[];
  hospitalAffiliations: string[];
  languages: string[];
  consultationFee: number;
  consultationTypes: ConsultationMode[];
  nextAvailableSlot: string;
  bio: string;
  clinicalFocus: string[];
  aiMatchScore?: number; // 0 - 100
  aiMatchReason?: string;
  avatar: string;
  clinicAddress?: {
    street: string;
    suite: string;
    city: string;
    state: string;
    zip: string;
  };
  reviews: DoctorReview[];
  weeklySchedule: DaySchedule[];
}
