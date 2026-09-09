import { UserProfile, Role, OnboardingStatus, VerificationStatus } from "@/types/user";

export interface LoginCredentials {
  email: string;
  password?: string; // Optional for magic links, but required for standard auth
}

export interface RegisterCredentials {
  email: string;
  password?: string;
  role: Role;
  firstName?: string;
  lastName?: string;
}

export interface AuthService {
  signIn(credentials: LoginCredentials): Promise<{ user: UserProfile | null; error: Error | null }>;
  signUp(credentials: RegisterCredentials): Promise<{ user: UserProfile | null; error: Error | null }>;
  signOut(): Promise<{ error: Error | null }>;
  getSession(): Promise<{ user: UserProfile | null; error: Error | null }>;
  updateProfile(data: Partial<UserProfile>): Promise<{ error: Error | null }>;
  
  // Future methods for resetting password, etc.
}
