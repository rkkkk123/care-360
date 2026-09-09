"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PharmacyOnboardingPage() {
  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      <div>
        <Link
          href="/pharmacy"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-light tracking-tight text-foreground">
          Pharmacy Partner Onboarding
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Onboarding checklist, practice management system (PMS) integration, and gateway configuration.
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <FileCheck className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-base font-semibold text-foreground">Onboarding Verification Complete</h3>
            <p className="text-xs text-muted-foreground">All onboarding milestones have been achieved for Walgreens Digital Care #4190.</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {[
            { title: "Organization Registration & Business Tax ID", done: true },
            { title: "State Pharmacy License Upload & Board Validation", done: true },
            { title: "DEA Controlled Substance Dispensing Clearance", done: true },
            { title: "CARE360 SCRIPT e-Prescribing API Gateway Pairing", done: true },
            { title: "Courier Dispatch & Local Pickup Calibration", done: true },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/50">
              <span className="font-medium text-foreground">{item.title}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                <CheckCircle2 className="h-4 w-4" /> Verified
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <Button size="sm" className="rounded-full text-xs" asChild>
            <Link href="/pharmacy">
              Proceed to Pharmacy Portal
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
