import * as React from "react";

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-border/50 rounded-xl ${className}`} />;
}

export default function PatientDashboardLoading() {
  return (
    <div className="flex flex-col gap-8 pb-10 max-w-5xl mx-auto w-full">
      
      {/* 1. Greeting Skeleton */}
      <div className="mb-8 space-y-3">
        <Skeleton className="h-10 w-64 rounded-full" />
        <Skeleton className="h-5 w-80 rounded-full" />
      </div>

      {/* 2. Snapshot & Next Event */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[200px] w-full rounded-3xl" />
        <Skeleton className="h-[200px] w-full rounded-3xl" />
      </div>

      {/* 3. AI Insight */}
      <Skeleton className="h-[120px] w-full rounded-3xl" />

      {/* 4. Reports & Prescriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[280px] w-full rounded-3xl" />
        <Skeleton className="h-[280px] w-full rounded-3xl" />
      </div>

      {/* 5. Timeline & Care Network */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[320px] w-full rounded-3xl" />
        <Skeleton className="h-[320px] w-full rounded-3xl" />
      </div>
      
    </div>
  );
}
