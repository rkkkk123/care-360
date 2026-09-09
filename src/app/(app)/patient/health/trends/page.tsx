import * as React from "react";
import { HealthCharts } from "@/features/patient/components/HealthCharts";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TrendsPage() {
  return (
    <div className="py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/patient/health" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Health Overview
          </Link>
        </div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Health Trends</h1>
        <p className="mt-2 text-base text-muted-foreground">Track how your biomarkers are changing over time.</p>
      </div>

      <HealthCharts />
    </div>
  );
}
