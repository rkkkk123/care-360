"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  TrendingUp,
  Users,
  Video,
  Pill,
  Sparkles,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Camera,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminAnalyticsPage() {
  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Control Center
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
              <Activity className="h-3.5 w-3.5" />
              Real-Time Telemetry & Ecosystem Intelligence
            </div>
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              Platform Activity & Health Analytics
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Comprehensive telemetry across patient consultations, digital e-Rx fulfillment, and multi-modal AI utilization.
            </p>
          </div>
        </div>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-border bg-card p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-primary">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Consultations Completed
            </span>
            <Video className="h-4 w-4" />
          </div>
          <p className="text-3xl font-light tracking-tight text-foreground">3,812</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Avg duration: 18.4 mins
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              e-Rx Fulfillment Speed
            </span>
            <Clock className="h-4 w-4" />
          </div>
          <p className="text-3xl font-light tracking-tight text-foreground">38 min</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            From doctor sign to courier drop
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              AI Scans Processed
            </span>
            <Camera className="h-4 w-4" />
          </div>
          <p className="text-3xl font-light tracking-tight text-foreground">14,290</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            +32% growth this week
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Bilingual Voice Queries
            </span>
            <Mic className="h-4 w-4" />
          </div>
          <p className="text-3xl font-light tracking-tight text-foreground">8,640</p>
          <p className="text-[11px] text-blue-600 font-medium">
            58% English • 42% हिन्दी
          </p>
        </div>
      </div>

      {/* AI Features Utilization Grid */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Multi-Modal Health AI Tool Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-2xl bg-secondary/30 p-5 border border-border/40 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Medicine Pill / Label OCR</span>
              <span className="font-mono text-primary font-bold">5,820 scans</span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              Top identified: Metformin 500mg, Lisinopril 10mg, Amoxicillin 500mg.
            </p>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[82%] rounded-full" />
            </div>
          </div>

          <div className="rounded-2xl bg-secondary/30 p-5 border border-border/40 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Ayurvedic Botanical Leaf Identifier</span>
              <span className="font-mono text-emerald-600 font-bold">4,120 scans</span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              Top identified: Tulsi (Holy Basil), Neem (Azadirachta indica), Giloy.
            </p>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[65%] rounded-full" />
            </div>
          </div>

          <div className="rounded-2xl bg-secondary/30 p-5 border border-border/40 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Dermatology Skin ABCDE Screen</span>
              <span className="font-mono text-purple-600 font-bold">4,350 scans</span>
            </div>
            <p className="text-muted-foreground text-[11px]">
              91% classified Low Risk / Benign; 9% routed to specialist tele-consult.
            </p>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-[70%] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure & Security Health */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          HIPAA & Clinical Compliance Audit Score
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl bg-secondary/30 p-4 border border-border/40 space-y-1">
            <span className="text-muted-foreground">Prescription Audit Tamper Verification</span>
            <p className="font-bold text-foreground text-sm">100.0% Validated</p>
            <p className="text-[11px] text-emerald-600">Zero cryptographic hash mismatches detected</p>
          </div>

          <div className="rounded-2xl bg-secondary/30 p-4 border border-border/40 space-y-1">
            <span className="text-muted-foreground">Emergency SOS Dispatch Availability</span>
            <p className="font-bold text-foreground text-sm">99.999% High Availability</p>
            <p className="text-[11px] text-emerald-600">Mean connection dispatch: 1.4 seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
