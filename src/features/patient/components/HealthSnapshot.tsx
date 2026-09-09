import * as React from "react";
import { PatientMetrics } from "@/types/models/patient";
import { Activity, Heart, Scale } from "lucide-react";

interface HealthSnapshotProps {
  metrics: PatientMetrics;
}

export function HealthSnapshot({ metrics }: HealthSnapshotProps) {
  return (
    <div className="h-full bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Latest Vitals</span>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-xs">Blood Pressure</span>
          </div>
          <div className="text-2xl font-light text-foreground">{metrics.bloodPressure}</div>
          <div className="text-[10px] text-muted-foreground uppercase">mmHg</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Heart className="w-4 h-4" />
            <span className="text-xs">Heart Rate</span>
          </div>
          <div className="text-2xl font-light text-foreground">{metrics.heartRate}</div>
          <div className="text-[10px] text-muted-foreground uppercase">BPM</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Scale className="w-3 h-3" />
          <span>{metrics.weight} kg</span>
        </div>
        <span>Updated 2 days ago</span>
      </div>
    </div>
  );
}
