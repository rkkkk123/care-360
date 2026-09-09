import * as React from "react";
import { FullTimeline } from "@/features/patient/components/FullTimeline";

export default function TimelinePage() {
  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-tight text-foreground">Health Timeline</h1>
        <p className="mt-2 text-base text-muted-foreground">Your complete medical history in one connected view.</p>
      </div>
      
      <FullTimeline />
    </div>
  );
}
