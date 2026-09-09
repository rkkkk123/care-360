import { cookies } from "next/headers";
import { UserProfile, Role } from "@/types/user";

const DEMO_COOKIE_NAME = "care360_demo_session";

export interface AuthenticatedSession {
  user: UserProfile;
}

export async function getAuthenticatedUser(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(DEMO_COOKIE_NAME)?.value;
    if (!sessionCookie) {
      return null;
    }
    const user = JSON.parse(sessionCookie) as UserProfile;
    return user;
  } catch (err) {
    return null;
  }
}

export async function requireAuth(allowedRoles?: Role[]): Promise<{
  user: UserProfile | null;
  errorResponse?: { status: number; message: string };
}> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return {
      user: null,
      errorResponse: { status: 401, message: "Authentication required." },
    };
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      user: null,
      errorResponse: { status: 403, message: "Forbidden: insufficient permissions." },
    };
  }

  return { user };
}
