import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth-service";
import { Role } from "@/types/user";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const role = url.searchParams.get("role") as Role | null;
  
  if (!role || !["patient", "doctor", "pharmacy", "admin"].includes(role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Define emails mapped to roles based on demo accounts
  const emailMap: Record<Role, string> = {
    patient: "jane.doe@care360.health",
    doctor: "dr.sharma@care360.health",
    pharmacy: "pharmacy@care360.health",
    admin: "admin@care360.health"
  };

  // Ensure we sign out any existing session
  await auth.signOut();

  // Sign in as the requested demo user
  // demo-auth-service uses next/headers inside this call which works in Route Handlers
  await auth.signIn({
    email: emailMap[role],
    password: "Care360Secure!" // Demo password is not actually validated, but providing for completeness
  });

  // Redirect to the dashboard
  return NextResponse.redirect(new URL(`/${role}`, request.url));
}
