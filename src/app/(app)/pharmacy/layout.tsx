import * as React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function PharmacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["pharmacy", "admin"]}>
      {children}
    </ProtectedRoute>
  );
}
