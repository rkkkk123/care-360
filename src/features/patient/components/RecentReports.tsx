import * as React from "react";
import { HealthReport } from "@/types/models/report";
import { FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDisplayDate } from "@/lib/utils";

interface RecentReportsProps {
  reports: HealthReport[];
}

export function RecentReports({ reports }: RecentReportsProps) {
  if (reports.length === 0) {
    return (
      <div className="h-full bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
        <FileText className="w-8 h-8 text-muted-foreground/30 mb-4" />
        <p className="text-sm text-foreground mb-4">No health reports yet.</p>
        <Button variant="outline" size="sm" className="rounded-full">Upload a report</Button>
      </div>
    );
  }

  return (
    <div className="h-full bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Reports</span>
        <Link href="/patient/reports" className="text-xs font-medium text-primary hover:underline flex items-center">
          View all <ArrowRight className="w-3 h-3 ml-1" />
        </Link>
      </div>

      <div className="flex-1 space-y-4">
        {reports.slice(0, 3).map(report => (
          <Link
            key={report.id}
            href={`/patient/reports/${report.id}`}
            className="flex items-start gap-4 p-3 rounded-2xl hover:bg-secondary/50 transition-colors group cursor-pointer border border-transparent hover:border-border/50"
          >
            <div className="bg-background border border-border p-2 rounded-xl shrink-0 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
              <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{report.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                  {formatDisplayDate(report.date)}
                </span>
                <span className="w-1 h-1 bg-border rounded-full" />
                <span className="text-xs text-muted-foreground truncate">{report.providerName}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
