import { Role } from "./roles";
export type { Role };

export type OnboardingStatus = "not_started" | "in_progress" | "completed";

export type VerificationStatus = 
  | "not_required"
  | "pending"
  | "under_review"
  | "verified"
  | "rejected"
  | "needs_more_information"
  | "suspended";

export interface UserProfile {
  id: string;
  authUserId: string;
  role: Role;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  onboardingStatus: OnboardingStatus;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
}
