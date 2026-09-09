"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, FileText, Download, Scale } from "lucide-react";
import { demoReports } from "@/features/patient/data/demoData";
import { Button } from "@/components/ui/button";
import { ReportSummary } from "@/features/patient/components/ReportSummary";
import { ExtractedMetrics } from "@/features/patient/components/ExtractedMetrics";
import { ContextualQA } from "@/features/patient/components/ContextualQA";
import { formatDisplayDate } from "@/lib/utils";

export default function ReportViewerPage() {
  const params = useParams();
  const reportId = params.id as string;
  
  const report = demoReports.find(r => r.id === reportId) || demoReports[0];

  return (
    <div className="py-8 max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/patient/reports" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Reports
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">{report.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {report.type}</span>
            <span className="w-1 h-1 bg-border rounded-full" />
            <span className="flex items-center gap-1" suppressHydrationWarning><Clock className="w-4 h-4" /> {formatDisplayDate(report.date)}</span>
            <span className="w-1 h-1 bg-border rounded-full" />
            <span>{report.providerName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-full" size="sm" asChild>
            <Link href="/patient/reports/compare">
              <Scale className="w-4 h-4 mr-2 text-primary" />
              Compare
            </Link>
          </Button>
          <Button variant="outline" className="rounded-full" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {report.summary && (
            <ReportSummary 
              summary={report.summary} 
              aiAnalysis={report.aiAnalysis} 
              recommendations={report.recommendations} 
            />
          )}
          
          {report.extractedMetrics && (
            <ExtractedMetrics metrics={report.extractedMetrics} />
          )}

          {/* Original Document Viewer Placeholder */}
          <div className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
            <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-foreground font-medium mb-2">Original Document Viewer</h3>
            <p className="text-sm text-muted-foreground">The PDF rendering engine is not active in this demo.</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ContextualQA />
          </div>
        </div>
      </div>
    </div>
  );
}
