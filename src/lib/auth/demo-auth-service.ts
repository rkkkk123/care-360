import { AuthService, LoginCredentials, RegisterCredentials } from "./auth-types";
import { UserProfile, Role, OnboardingStatus, VerificationStatus } from "@/types/user";

// This is a demo implementation that uses a mock database (in-memory for the server process).
// In Edge/Serverless, memory doesn't persist, so we rely entirely on the cookie data for the session.

const DEMO_COOKIE_NAME = "care360_demo_session";

// We mock setting a cookie. In a real Next.js app, we'd use next/headers `cookies()` in server actions.
// To keep the auth service pure, we will just manage a mock DB and assume the middleware/action will handle the cookie.

export class DemoAuthService implements AuthService {
  private async getCookiesModule() {
    // Dynamically import next/headers so this file can be used in client/server 
    // Wait, next/headers only works on the server.
    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      return cookies();
    }
    return null;
  }

  async signIn(credentials: LoginCredentials) {
    const isDoctor = credentials.email.includes("doctor") || credentials.email.includes("sharma");
    const isPharmacy = credentials.email.includes("pharmacy");
    const isAdmin = credentials.email.includes("admin");

    const user: UserProfile = {
      id: isDoctor ? "doc_sharma" : isPharmacy ? "pharm_1" : isAdmin ? "admin_1" : "pat_123",
      authUserId: isDoctor ? "auth_doc_sharma" : isPharmacy ? "auth_pharm_1" : isAdmin ? "auth_admin_1" : "auth_pat_123",
      role: isDoctor ? "doctor" : isPharmacy ? "pharmacy" : isAdmin ? "admin" : "patient",
      email: credentials.email,
      firstName: isDoctor ? "Ananya" : isPharmacy ? "Walgreens" : isAdmin ? "System" : "Jane",
      lastName: isDoctor ? "Sharma" : isPharmacy ? "Palo Alto #4190" : isAdmin ? "Governance" : "Doe",
      onboardingStatus: "completed",
      verificationStatus: "verified",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const cookieStore = await this.getCookiesModule();
    if (cookieStore) {
      cookieStore.set(DEMO_COOKIE_NAME, JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    } else {
      // Client-side fallback if needed
      document.cookie = `${DEMO_COOKIE_NAME}=${JSON.stringify(user)}; path=/;`;
    }

    return { user, error: null };
  }

  async signUp(credentials: RegisterCredentials) {
    const user: UserProfile = {
      id: `demo-${Date.now()}`,
      authUserId: `auth-${Date.now()}`,
      role: credentials.role,
      email: credentials.email,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      onboardingStatus: "not_started",
      verificationStatus: credentials.role === "patient" ? "not_required" : "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const cookieStore = await this.getCookiesModule();
    if (cookieStore) {
      cookieStore.set(DEMO_COOKIE_NAME, JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    } else {
      document.cookie = `${DEMO_COOKIE_NAME}=${JSON.stringify(user)}; path=/;`;
    }

    return { user, error: null };
  }

  async signOut() {
    const cookieStore = await this.getCookiesModule();
    if (cookieStore) {
      cookieStore.delete(DEMO_COOKIE_NAME);
    } else {
      document.cookie = `${DEMO_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    return { error: null };
  }

  async getSession() {
    const cookieStore = await this.getCookiesModule();
    let sessionData = null;

    if (cookieStore) {
      sessionData = cookieStore.get(DEMO_COOKIE_NAME)?.value;
    } else {
      const match = document.cookie.match(new RegExp('(^| )' + DEMO_COOKIE_NAME + '=([^;]+)'));
      if (match) sessionData = match[2];
    }

    if (!sessionData) {
      return { user: null, error: null };
    }

    try {
      const user = JSON.parse(sessionData) as UserProfile;
      return { user, error: null };
    } catch (e) {
      return { user: null, error: new Error("Invalid session data") };
    }
  }

  async updateProfile(updates: Partial<UserProfile>) {
    const { user } = await this.getSession();
    if (!user) return { user: null, error: new Error("Not logged in") };
    
    const updatedUser = { ...user, ...updates };
    
    const cookieStore = await this.getCookiesModule();
    if (cookieStore) {
      cookieStore.set(DEMO_COOKIE_NAME, JSON.stringify(updatedUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    } else {
      document.cookie = `${DEMO_COOKIE_NAME}=${JSON.stringify(updatedUser)}; path=/;`;
    }
    
    return { user: updatedUser, error: null };
  }
}
