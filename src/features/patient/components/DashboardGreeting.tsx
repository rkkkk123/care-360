import * as React from "react";
import { PatientRecord } from "@/types/models/patient";

interface DashboardGreetingProps {
  patient: PatientRecord;
}

export function DashboardGreeting({ patient }: DashboardGreetingProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-foreground">
        Good morning, {patient.firstName}.
      </h1>
      <p className="mt-2 text-base text-muted-foreground">
        Here's what's happening with your health today.
      </p>
    </div>
  );
}
