"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Calendar,
  Clock,
  FileText,
  Pill,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientConsultationSummaryProps {
  doctorName: string;
  specialization: string;
  completedAt?: string;
  summaryText: string;
  planText?: string;
  followUpText?: string;
  onReturnHome?: () => void;
}

export function PatientConsultationSummary({
  doctorName,
  specialization,
  completedAt,
  summaryText,
  planText,
  followUpText,
}: PatientConsultationSummaryProps) {
  return (
    <div className="max-w-3xl mx-auto bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Consultation Completed & Verified</span>
        </div>
        <h2 className="text-3xl font-light tracking-tight text-foreground">
          Consultation Summary
        </h2>
        <p className="text-xs text-muted-foreground">
          Conducted with {doctorName} • {specialization}
        </p>
      </div>

      {/* Clinician's Published Summary */}
      <div className="p-6 rounded-2xl bg-secondary/30 border border-border space-y-4">
        <div className="flex items-center gap-2 text-primary font-medium text-sm">
          <Stethoscope className="w-4 h-4" />
          <span>Doctor&apos;s Clinical Assessment & Guidance</span>
        </div>

        <div className="p-4 rounded-xl bg-background/80 border border-border/60 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
          {summaryText ||
            "Reviewed your lab results. All metabolic markers are optimal. Recommended daily Vitamin D3 supplementation (2,000 IU) and a 3-month routine re-check."}
        </div>
      </div>

      {/* Plan & Follow-up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {planText && (
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-2">
            <span className="font-semibold text-foreground block">Care Plan Instructions</span>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{planText}</p>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-2">
          <span className="font-semibold text-foreground block">Recommended Follow-up</span>
          <p className="text-muted-foreground leading-relaxed">
            {followUpText || "Follow up in 3 months for repeat metabolic panel."}
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-primary font-medium">
              <Calendar className="w-3.5 h-3.5" />
              Check-in scheduled for May 2026
            </span>
          </div>
        </div>
      </div>

      {/* Connected Care Links */}
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-medium text-foreground block">Added to your Health Timeline</span>
            <span className="text-muted-foreground text-[11px]">
              This consultation record and guidance are permanently stored in your medical history.
            </span>
          </div>
        </div>
        <Button size="sm" variant="outline" className="rounded-xl shrink-0" asChild>
          <Link href="/patient/timeline">
            View Timeline
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/60">
        <Button className="flex-1 rounded-full shadow-md" asChild>
          <Link href="/patient">Back to Home Portal</Link>
        </Button>
        <Button variant="outline" className="flex-1 rounded-full" asChild>
          <Link href="/patient/appointments">View All Appointments</Link>
        </Button>
      </div>
    </div>
  );
}
