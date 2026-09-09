"use client";

import * as React from "react";
import Link from "next/link";
import {
  Stethoscope,
  ShieldCheck,
  Calendar,
  Clock,
  Video,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  AlertCircle,
  Activity,
  Pill,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/FadeIn";
import { formatDisplayDate } from "@/lib/utils";

export default function DoctorPortal() {
  return (
    <FadeIn>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-12">
        {/* Clinician Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Clinical Workspace
              </h1>
              <span className="text-xs font-semibold text-foreground bg-secondary px-3 py-1 rounded-full border border-border flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[1.5]" />
                Verified Fellow
              </span>
            </div>
            <p className="text-muted-foreground mt-2 text-sm font-medium">
              Welcome, Dr. Ananya Sharma, MD, FACP • License: CA-MED-491028
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
              <Link href="/doctor/patients">
                <Users className="w-3.5 h-3.5 mr-1.5 text-primary" />
                Patient Records
              </Link>
            </Button>

            <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
              <Link href="/doctor/prescriptions">
                <Pill className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Prescriptions
              </Link>
            </Button>

            <Button className="rounded-full shadow-sm text-xs gap-1.5" asChild>
              <Link href="/doctor/consultation/app_1">
                <Video className="w-3.5 h-3.5" />
                Open Live Telehealth Room
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Clinical Metrics Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-card border border-border shadow-apple-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wide">
              <span>Today&apos;s Sessions</span>
              <Calendar className="w-4 h-4 text-foreground stroke-[1.5]" />
            </div>
            <p className="text-3xl font-semibold text-foreground tracking-tight">3</p>
            <p className="text-xs text-foreground font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              1 patient ready in waiting suite
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-apple-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wide">
              <span>Active Patients</span>
              <Users className="w-4 h-4 text-foreground stroke-[1.5]" />
            </div>
            <p className="text-3xl font-semibold text-foreground tracking-tight">214</p>
            <p className="text-xs text-muted-foreground">Across Internal Medicine</p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-apple-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wide">
              <span>Trust Score</span>
              <Award className="w-4 h-4 text-foreground stroke-[1.5]" />
            </div>
            <p className="text-3xl font-semibold text-foreground tracking-tight">4.98</p>
            <p className="text-xs text-muted-foreground">From 214 verified reviews</p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-apple-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-medium uppercase tracking-wide">
              <span>AI Copilot</span>
              <Sparkles className="w-4 h-4 text-foreground stroke-[1.5]" />
            </div>
            <p className="text-3xl font-semibold text-foreground tracking-tight">Active</p>
            <p className="text-xs text-foreground font-medium">
              Zod Clinical Guardrails On
            </p>
          </div>
        </div>

        {/* PRIORITY CARD: Next Telehealth Consultation Ready */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-apple-md space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
                Patient Checked In • Ready to Consult
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-mono font-medium">
              Session: app_1 • HIPAA Protected
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-foreground font-serif font-semibold text-xl border border-border">
                  JD
                </div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">Jane Doe</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    38yo Female • Blood O+ • Allergies: Penicillin, Peanuts
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-5 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-foreground stroke-[1.5]" />
                  Today at 10:30 AM (PST)
                </span>
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-foreground stroke-[1.5]" />
                  Attached: Metabolic Panel (Vit D 24)
                </span>
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-foreground stroke-[1.5]" />
                  Vitals: BP 118/76 mmHg, HR 68
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button size="lg" className="rounded-full px-8 gap-2 active:scale-[0.98] transition-transform" asChild>
                <Link href="/doctor/consultation/app_1">
                  <Video className="w-4 h-4" />
                  Enter Clinical Workspace
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* AI Pre-Consultation Summary Brief */}
          <div className="p-5 rounded-2xl bg-secondary border border-border text-sm text-foreground flex items-start gap-4">
            <Sparkles className="w-5 h-5 text-foreground shrink-0 mt-0.5 stroke-[1.5]" />
            <div>
              <span className="font-semibold text-foreground uppercase tracking-wide block mb-1">
                AI Copilot Patient Overview
              </span>
              <p className="text-muted-foreground leading-relaxed">
                Patient booked regarding recent blood work. Kidney, liver, and fasting glucose (85 mg/dL) are optimal. Mild Vitamin D insufficiency (24 ng/mL). No active medication changes reported.
              </p>
            </div>
          </div>
        </div>

        {/* Today's Schedule List */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-foreground">Today&apos;s Appointments</h3>
              <p className="text-xs text-muted-foreground">Manage your scheduled telehealth consultations</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
              <Link href="/doctor/appointments">Full Schedule</Link>
            </Button>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 font-medium text-xs">
                  10:30
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">Jane Doe</h4>
                  <p className="text-xs text-muted-foreground">
                    Follow-up: Comprehensive Metabolic Panel • Telehealth
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Ready in Waiting Room
                </span>
                <Button size="sm" className="rounded-xl text-xs h-8" asChild>
                  <Link href="/doctor/consultation/app_1">Consult</Link>
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/20 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-75">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground font-medium text-xs">
                  02:00
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">Robert Vance</h4>
                  <p className="text-xs text-muted-foreground">
                    Preventive Cardiology Review • Telehealth
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">Scheduled</span>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/20 border border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-75">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground font-medium text-xs">
                  04:30
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">Michael Scott</h4>
                  <p className="text-xs text-muted-foreground">
                    Lipid Panel Analysis & Nutrition Plan • Telehealth
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">Scheduled</span>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
