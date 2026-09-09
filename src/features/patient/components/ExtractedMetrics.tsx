import * as React from "react";
import { Biomarker } from "@/features/patient/data/demoData";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExtractedMetricsProps {
  metrics: Biomarker[];
}

export function ExtractedMetrics({ metrics }: ExtractedMetricsProps) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Extracted Biomarkers</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((metric, idx) => {
          const isNormal = metric.status === "normal";
          
          return (
            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">{metric.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Ref: {metric.referenceRange} {metric.unit}</p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1">
                  <span className={cn(
                    "text-xl font-medium",
                    isNormal ? "text-foreground" : (metric.status === "high" ? "text-orange-500" : "text-blue-500")
                  )}>
                    {metric.value}
                  </span>
                  <span className="text-xs text-muted-foreground">{metric.unit}</span>
                </div>
                {!isNormal && (
                  <span className={cn(
                    "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm mt-1 inline-block",
                    metric.status === "high" ? "bg-orange-500/10 text-orange-600" : "bg-blue-500/10 text-blue-600"
                  )}>
                    {metric.status}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
