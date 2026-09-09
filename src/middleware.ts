import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserProfile, Role } from "./types/user";

const PUBLIC_ROUTES = [
  "/",
  "/how-it-works",
  "/ai",
  "/doctors",
  "/pharmacies",
  "/trust",
  "/accessibility",
  "/login",
  "/register",
  "/role",
  "/verify",
  "/forgot-password",
  "/reset-password"
];

const ONBOARDING_ROUTES = [
  "/onboarding/patient",
  "/onboarding/doctor",
  "/onboarding/pharmacy"
];

// Helper to check if a route is strictly public (not requiring auth)
function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/assets") || pathname.match(/\.(.*)$/);
}

// Get the user's portal root path based on role
function getPortalPath(role: Role) {
  return `/${role}`;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (isPublicRoute(pathname)) {
    // If the user is authenticated and tries to visit auth pages, redirect to their portal
    if (["/login", "/register", "/role"].includes(pathname)) {
      const sessionCookie = request.cookies.get("care360_demo_session");
      if (sessionCookie) {
        try {
          const user = JSON.parse(sessionCookie.value) as UserProfile;
          if (user.role) {
            return NextResponse.redirect(new URL(getPortalPath(user.role), request.url));
          }
        } catch (e) {
          // Ignore invalid session, let them see public route
        }
      }
    }
    return NextResponse.next();
  }

  // Not a public route, requires authentication
  const sessionCookie = request.cookies.get("care360_demo_session");

  if (!sessionCookie) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  let user: UserProfile;
  try {
    user = JSON.parse(sessionCookie.value) as UserProfile;
  } catch (e) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // Onboarding Guard
  const needsOnboarding = user.onboardingStatus !== "completed";
  const isOnboardingRoute = ONBOARDING_ROUTES.includes(pathname);
  const correctOnboardingRoute = `/onboarding/${user.role}`;

  if (needsOnboarding) {
    if (!isOnboardingRoute || pathname !== correctOnboardingRoute) {
      return NextResponse.redirect(new URL(correctOnboardingRoute, request.url));
    }
    return NextResponse.next();
  }

  // If completed onboarding but trying to hit an onboarding route
  if (!needsOnboarding && isOnboardingRoute) {
    return NextResponse.redirect(new URL(getPortalPath(user.role), request.url));
  }

  // Role Access Guard
  const requestedPortalMatch = pathname.match(/^\/([a-z]+)(\/.*)?$/);
  
  if (requestedPortalMatch) {
    const requestedRole = requestedPortalMatch[1];
    
    // Check if the requested root path is one of our restricted portals
    if (["patient", "doctor", "pharmacy", "admin"].includes(requestedRole)) {
      if (requestedRole !== user.role) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
