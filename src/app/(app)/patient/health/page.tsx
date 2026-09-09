"use client";

import * as React from "react";
import Link from "next/link";
import { demoPatient } from "@/features/patient/data/demoData";
import { HealthCharts } from "@/features/patient/components/HealthCharts";
import {
  Activity,
  Heart,
  Scale,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HealthPage() {
  const { metrics } = demoPatient;

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Health Overview & Vitals
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Continuous biometrics, longitudinal trends, and clinical biomarker tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
            <Link href="/patient/reports/compare">
              <FileText className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Compare Reports
            </Link>
          </Button>

          <Button size="sm" className="rounded-full text-xs group" asChild>
            <Link href="/patient/doctors">
              <Stethoscope className="h-3.5 w-3.5 mr-1.5" />
              Consult Specialist
              <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Vitals Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Blood Pressure */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Blood Pressure
            </span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-light text-foreground">{metrics.bloodPressure}</span>
            <span className="text-xs text-muted-foreground uppercase">mmHg</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <ShieldCheck className="h-3 w-3" />
            <span>Optimal Range</span>
          </div>
        </div>

        {/* Resting Heart Rate */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Resting Heart Rate
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Heart className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-light text-foreground">{metrics.heartRate}</span>
            <span className="text-xs text-muted-foreground uppercase">BPM</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <ShieldCheck className="h-3 w-3" />
            <span>Athletic / Normal</span>
          </div>
        </div>

        {/* Body Weight */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Body Weight
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Scale className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-light text-foreground">{metrics.weight}</span>
            <span className="text-xs text-muted-foreground uppercase">kg</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span>-2.0 kg past 5 mos</span>
          </div>
        </div>

        {/* Calculated BMI */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Calculated BMI
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-light text-foreground">23.0</span>
            <span className="text-xs text-muted-foreground uppercase">kg/m²</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <ShieldCheck className="h-3 w-3" />
            <span>Normal Weight</span>
          </div>
        </div>

      </div>

      {/* AI Longitudinal Analysis Card */}
      <div className="rounded-3xl border border-primary/20 bg-primary/[0.04] p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-4 w-4" />
          <span>Longitudinal Intelligence Insight</span>
        </div>
        <h3 className="text-lg font-medium text-foreground">
          Blood pressure and glucose show sustained stability
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Over the past 5 months, systolic blood pressure improved from 125 to 118 mmHg, and resting heart rate dropped from 72 to 68 BPM. The main target for intervention is raising 25-OH Vitamin D from 24 ng/mL into the 40–60 ng/mL range.
        </p>
        <div className="pt-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
            <Link href="/patient/health/trends">
              View Detailed Trend Charts
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Trend Charts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-light tracking-tight text-foreground">
            5-Month Vital Sign Trends
          </h2>
          <Link href="/patient/health/trends" className="text-xs text-primary hover:underline font-medium">
            Expand full view →
          </Link>
        </div>

        <HealthCharts />
      </div>

    </div>
  );
}
