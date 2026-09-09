import * as React from "react";
import { demoReports } from "@/features/patient/data/demoData";
import { ArrowRight, ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn, formatDisplayDate } from "@/lib/utils";

export function ReportComparisonView() {
  const currentReport = demoReports[0]; // Comprehensive Metabolic Panel
  const pastReport = demoReports[1];    // Annual Physical Panel

  if (!currentReport.extractedMetrics || !pastReport.extractedMetrics) return null;

  // Create a matched array based on biomarker names
  const comparisonData = currentReport.extractedMetrics.map(currentMetric => {
    const pastMetric = pastReport.extractedMetrics?.find(m => m.name === currentMetric.name);
    
    // Calculate delta and trend
    let trend: "up" | "down" | "stable" | "none" = "none";
    let delta = 0;
    
    if (pastMetric) {
      delta = currentMetric.value - pastMetric.value;
      if (delta > 0) trend = "up";
      else if (delta < 0) trend = "down";
      else trend = "stable";
    }

    return {
      name: currentMetric.name,
      unit: currentMetric.unit,
      referenceRange: currentMetric.referenceRange,
      current: currentMetric.value,
      past: pastMetric ? pastMetric.value : null,
      trend,
      delta,
      currentStatus: currentMetric.status,
    };
  });

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 border-b border-border bg-secondary/30">
        <div className="col-span-4 p-4 sm:p-6 flex items-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Biomarker</span>
        </div>
        <div className="col-span-3 p-4 sm:p-6 text-center border-l border-border">
          <h4 className="text-sm font-medium text-foreground line-clamp-1">{pastReport.title}</h4>
          <p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>{formatDisplayDate(pastReport.date)}</p>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-muted-foreground/30" />
        </div>
        <div className="col-span-4 p-4 sm:p-6 text-center border-l border-border bg-primary/5">
          <h4 className="text-sm font-medium text-primary line-clamp-1">{currentReport.title}</h4>
          <p className="text-xs text-primary/70 mt-1" suppressHydrationWarning>{formatDisplayDate(currentReport.date)}</p>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {comparisonData.map((row, i) => (
          <div key={i} className="grid grid-cols-12 items-center hover:bg-secondary/10 transition-colors">
            <div className="col-span-4 p-4 sm:p-6">
              <p className="text-sm font-medium text-foreground">{row.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Ref: {row.referenceRange} {row.unit}</p>
            </div>
            
            <div className="col-span-3 p-4 sm:p-6 text-center border-l border-border">
              <span className="text-base text-muted-foreground">
                {row.past !== null ? row.past : "-"}
              </span>
            </div>
            
            <div className="col-span-1 flex items-center justify-center">
              {row.trend === "up" && <ArrowUp className={cn("w-4 h-4", row.currentStatus === "normal" ? "text-muted-foreground" : "text-orange-500")} />}
              {row.trend === "down" && <ArrowDown className={cn("w-4 h-4", row.currentStatus === "normal" ? "text-muted-foreground" : "text-blue-500")} />}
              {row.trend === "stable" && <Minus className="w-4 h-4 text-muted-foreground/50" />}
            </div>
            
            <div className="col-span-4 p-4 sm:p-6 text-center border-l border-border relative">
              {row.currentStatus !== "normal" && (
                <div className={cn(
                  "absolute inset-y-0 inset-x-0 opacity-10 pointer-events-none",
                  row.currentStatus === "high" ? "bg-orange-500" : "bg-blue-500"
                )} />
              )}
              <span className={cn(
                "text-base sm:text-lg font-medium",
                row.currentStatus === "normal" ? "text-foreground" : (row.currentStatus === "high" ? "text-orange-500" : "text-blue-500")
              )}>
                {row.current}
              </span>
              <span className="text-xs text-muted-foreground ml-1">{row.unit}</span>
              
              {row.delta !== 0 && (
                <div className="mt-1 text-[10px] text-muted-foreground">
                  {row.delta > 0 ? "+" : ""}{row.delta} from last
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
