import * as React from "react";
import { FileText, ArrowRight, Upload, Clock, Plus, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { demoReports } from "@/features/patient/data/demoData";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDisplayDate } from "@/lib/utils";

export default function ReportsPage() {
  if (demoReports.length === 0) {
    return (
      <div className="py-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight text-foreground">Health Reports</h1>
          <p className="mt-2 text-base text-muted-foreground">Your secure library of lab results and clinical notes.</p>
        </div>
        <EmptyState
          icon={FileText}
          title="No reports available"
          description="You haven't uploaded any health reports yet. Uploading a report allows the AI to provide insights."
          actionLabel="Upload Report"
          actionHref="/patient/reports/upload"
        />
      </div>
    );
  }

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">Health Reports</h1>
          <p className="mt-2 text-base text-muted-foreground">Your secure library of lab results and clinical notes.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full shrink-0 text-xs" asChild>
            <Link href="/patient/reports/compare">
              <Scale className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Compare Reports
            </Link>
          </Button>
          <Button className="rounded-full shrink-0 group text-xs" asChild>
            <Link href="/patient/reports/upload">
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Upload Report
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upload Card */}
        <Link href="/patient/reports/upload" className="bg-secondary/30 border border-border border-dashed rounded-3xl p-6 flex flex-col justify-center items-center text-center hover:bg-secondary/50 transition-colors group h-[220px]">
          <div className="bg-background border border-border p-3 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="font-medium text-foreground">Add new report</p>
          <p className="text-xs text-muted-foreground mt-1">PDF, JPG, or PNG</p>
        </Link>

        {/* Existing Reports */}
        {demoReports.map(report => (
          <Link 
            key={report.id} 
            href={`/patient/reports/${report.id}`}
            className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-border/80 transition-all flex flex-col h-[220px] group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary/5 border border-primary/20 p-2.5 rounded-xl">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 bg-secondary rounded-md text-muted-foreground">
                {report.status}
              </span>
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-foreground line-clamp-2">{report.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{report.type}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5" suppressHydrationWarning>
                <Clock className="w-3 h-3" />
                {formatDisplayDate(report.date)}
              </span>
              <span className="group-hover:text-primary transition-colors flex items-center">
                View <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
