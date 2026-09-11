import { NextResponse } from "next/server";
import { Role, UserProfile } from "@/types/user";

export function createDemoUserProfile(role: Role): UserProfile {
  const isDoctor = role === "doctor";
  const isPharmacy = role === "pharmacy";
  const isAdmin = role === "admin";
  
  return {
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
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const roleParam = url.searchParams.get("role") as Role | null;
  const redirectParam = url.searchParams.get("redirect");
  
  const role = (roleParam && ["patient", "doctor", "pharmacy", "admin"].includes(roleParam))
    ? roleParam
    : "patient";

  const user = createDemoUserProfile(role);
  const targetDestination = redirectParam && redirectParam !== "/" ? redirectParam : `/${role}`;

  // Redirect to the portal dashboard
  const response = NextResponse.redirect(new URL(targetDestination, request.url));
  
  response.cookies.set("care360_demo_session", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role: explicitRole, redirect: redirectParam } = body;

    let role: Role = "patient";
    if (explicitRole && ["patient", "doctor", "pharmacy", "admin"].includes(explicitRole)) {
      role = explicitRole;
    } else if (email) {
      const emailLower = email.toLowerCase();
      if (emailLower.includes("doctor") || emailLower.includes("sharma")) {
        role = "doctor";
      } else if (emailLower.includes("pharmacy") || emailLower.includes("walgreens")) {
        role = "pharmacy";
      } else if (emailLower.includes("admin") || emailLower.includes("governance")) {
        role = "admin";
      } else {
        role = "patient";
      }
    }

    const user = createDemoUserProfile(role);
    const targetDestination = redirectParam && redirectParam !== "/" ? redirectParam : `/${role}`;

    const response = NextResponse.json({
      success: true,
      user,
      redirectUrl: targetDestination,
    });

    response.cookies.set("care360_demo_session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to authenticate session" }, { status: 500 });
  }
}

