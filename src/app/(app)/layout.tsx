import * as React from "react";
import { AppShell } from "@/components/shell/AppShell";
import { AppointmentsProvider } from "@/features/appointments/context/AppointmentsContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppointmentsProvider>
      <AppShell>
        {children}
      </AppShell>
    </AppointmentsProvider>
  );
}
