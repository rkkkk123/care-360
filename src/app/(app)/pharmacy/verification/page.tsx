"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Building,
  ArrowLeft,
  Calendar,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PharmacyVerificationPage() {
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
          Regulatory Credentials & Verification
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          State board licenses, DEA certificate status, and electronic e-prescribing validation.
        </p>
      </div>

      {/* Main Status */}
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.04] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-border">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">Fully Verified Network Dispenser</h3>
              <span className="rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-xs font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Approved by CARE360 Medical & Pharmacy Compliance Committee
            </p>
          </div>
        </div>

        {/* Credentials Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl bg-card p-4 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">California State Pharmacy Board</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-muted-foreground font-mono">License #: CA-PHY-99214</p>
            <p className="text-[11px] text-muted-foreground">Status: Active (Renewed through 2027)</p>
          </div>

          <div className="rounded-2xl bg-card p-4 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">NCPDP / NABP Electronic Routing</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-muted-foreground font-mono">NABP #: 0582910</p>
            <p className="text-[11px] text-muted-foreground">Status: Certified for SCRIPT Standard v2017071</p>
          </div>

          <div className="rounded-2xl bg-card p-4 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Pharmacist-in-Charge (PIC)</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-muted-foreground">Dr. David Chen, PharmD (RPh #54019)</p>
            <p className="text-[11px] text-muted-foreground">Board certified pharmacotherapist</p>
          </div>

          <div className="rounded-2xl bg-card p-4 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">DEA Registration (Controlled Subs)</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-muted-foreground font-mono">Schedule II-V Certified</p>
            <p className="text-[11px] text-muted-foreground">Electronic 2-factor signing enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
}
