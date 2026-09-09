import { NextResponse } from "next/server";
import { Role, UserProfile } from "@/types/user";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const role = url.searchParams.get("role") as Role | null;
  
  if (!role || !["patient", "doctor", "pharmacy", "admin"].includes(role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Create demo user profile
  const isDoctor = role === "doctor";
  const isPharmacy = role === "pharmacy";
  const isAdmin = role === "admin";
  
  const user: UserProfile = {
    id: isDoctor ? "doc_sharma" : isPharmacy ? "pharm_1" : isAdmin ? "admin_1" : "pat_123",
    authUserId: isDoctor ? "auth_doc_sharma" : isPharmacy ? "auth_pharm_1" : isAdmin ? "auth_admin_1" : "auth_pat_123",
    role: role,
    email: isDoctor ? "dr.sharma@care360.health" : isPharmacy ? "pharmacy@care360.health" : isAdmin ? "admin@care360.health" : "jane.doe@care360.health",
    firstName: isDoctor ? "Ananya" : isPharmacy ? "Walgreens" : isAdmin ? "System" : "Jane",
    lastName: isDoctor ? "Sharma" : isPharmacy ? "Palo Alto #4190" : isAdmin ? "Governance" : "Doe",
    onboardingStatus: "completed",
    verificationStatus: "verified",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Redirect to the dashboard
  const response = NextResponse.redirect(new URL(`/${role}`, request.url));
  
  // In a GET Route Handler, we must set cookies on the NextResponse object directly.
  // cookies().set() from next/headers fails in GET routes in newer Next.js versions.
  response.cookies.set("care360_demo_session", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}
