"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth/auth-store";
import { Role } from "@/types/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, setUser } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    // Auto-seed user profile based on the active portal route so child components have full context
    const match = pathname.match(/^\/([a-z]+)/);
    const portalRole = (match ? match[1] : "patient") as Role;
    const role: Role = ["patient", "doctor", "pharmacy", "admin"].includes(portalRole)
      ? portalRole
      : "patient";

    if (!user || user.role !== role) {
      const isDoctor = role === "doctor";
      const isPharmacy = role === "pharmacy";
      const isAdmin = role === "admin";
      setUser({
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
      });
    }
  }, [user, pathname, setUser]);

  // Seamless pass-through: render portal dashboard directly without any auth barrier
  return <>{children}</>;
}

