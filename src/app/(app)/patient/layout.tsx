import * as React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["patient", "admin"]}>
      {children}
    </ProtectedRoute>
  );
}
