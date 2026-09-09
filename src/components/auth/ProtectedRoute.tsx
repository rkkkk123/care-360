"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth/auth-store";
import { Role } from "@/types/user";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // Redirect to login, but remember where we tried to go
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Role check
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace("/unauthorized");
      return;
    }

    // Onboarding check: Force onboarding if not completed
    if (user.onboardingStatus === "not_started" && !pathname.includes("/onboarding")) {
      router.replace(`/onboarding/${user.role}`);
      return;
    }

  }, [user, isLoading, router, pathname, allowedRoles]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FAFAFC]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Prevent flash of unauthorized content while router redirects
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  if (user.onboardingStatus === "not_started" && !pathname.includes("/onboarding")) {
    return null;
  }

  return <>{children}</>;
}
