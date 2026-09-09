import * as React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["doctor", "admin"]}>
      {children}
    </ProtectedRoute>
  );
}
