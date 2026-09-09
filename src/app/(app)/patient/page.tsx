"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Camera,
  Mic,
  Stethoscope,
  Store,
  Home,
  AlertCircle,
  ArrowRight,
  Pill,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { DashboardGreeting } from "@/features/patient/components/DashboardGreeting";
import { HealthSnapshot } from "@/features/patient/components/HealthSnapshot";
import { UpcomingAppointment } from "@/features/patient/components/UpcomingAppointment";
import { AIInsightCard } from "@/features/patient/components/AIInsightCard";
import { RecentReports } from "@/features/patient/components/RecentReports";
import { RecentPrescriptions } from "@/features/patient/components/RecentPrescriptions";
import { TimelinePreview } from "@/features/patient/components/TimelinePreview";
import { ConnectedCareVisualization } from "@/features/patient/components/ConnectedCareVisualization";
import { useAppointments } from "@/features/appointments/context/AppointmentsContext";
import { 
  demoPatient, 
  demoReports, 
  demoPrescriptions,
  demoTimelineEvents
} from "@/features/patient/data/demoData";

export default function PatientDashboard() {
  const { appointments } = useAppointments();
  const nextAppointment = appointments.find(a => a.status === "scheduled");

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-5xl mx-auto">
      
      {/* 1. Greeting / Context */}
      <DashboardGreeting patient={demoPatient} />

      {/* 2. Ecosystem Quick Care Launchpad (All Tools at a Glance) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Connected Healthcare Services & AI Suite
            </h3>
          </div>
          <span className="text-[11px] text-primary font-medium">6 Services Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* AI Vision Scanner */}
          <Link
            href="/patient/ai/scanner"
            className="rounded-3xl border border-blue-200/60 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/20 p-5 shadow-apple-sm hover:shadow-apple-md transition-shadow flex flex-col justify-between group space-y-4 hover:bg-blue-50 dark:hover:bg-blue-900/40"
          >
            <div className="h-10 w-10 rounded-2xl bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Camera className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-blue-950 dark:text-blue-100">AI Scanners</p>
              <p className="text-[11px] text-blue-700/70 dark:text-blue-300/70 mt-0.5">Pills • Leaves • Skin</p>
            </div>
          </Link>

          {/* Voice Assistant */}
          <Link
            href="/patient/ai"
            className="rounded-3xl border border-purple-200/60 bg-purple-50/50 dark:border-purple-900/50 dark:bg-purple-950/20 p-5 shadow-apple-sm hover:shadow-apple-md transition-shadow flex flex-col justify-between group space-y-4 hover:bg-purple-50 dark:hover:bg-purple-900/40"
          >
            <div className="h-10 w-10 rounded-2xl bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <Mic className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-purple-950 dark:text-purple-100">Voice Assistant</p>
              <p className="text-[11px] text-purple-700/70 dark:text-purple-300/70 mt-0.5">English & हिन्दी</p>
            </div>
          </Link>

          {/* Doctors */}
          <Link
            href="/patient/doctors"
            className="rounded-3xl border border-emerald-200/60 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20 p-5 shadow-apple-sm hover:shadow-apple-md transition-shadow flex flex-col justify-between group space-y-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
          >
            <div className="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <Stethoscope className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-emerald-950 dark:text-emerald-100">Find Doctors</p>
              <p className="text-[11px] text-emerald-700/70 dark:text-emerald-300/70 mt-0.5">98% AI Match</p>
            </div>
          </Link>

          {/* Pharmacy */}
          <Link
            href="/patient/pharmacies/compare"
            className="rounded-3xl border border-amber-200/60 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20 p-5 shadow-apple-sm hover:shadow-apple-md transition-shadow flex flex-col justify-between group space-y-4 hover:bg-amber-50 dark:hover:bg-amber-900/40"
          >
            <div className="h-10 w-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <Store className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-amber-950 dark:text-amber-100">Pharmacy Stock</p>
              <p className="text-[11px] text-amber-700/70 dark:text-amber-300/70 mt-0.5">Compare & Deliver</p>
            </div>
          </Link>

          {/* Home Visit */}
          <Link
            href="/patient/home-visit"
            className="rounded-3xl border border-sky-200/60 bg-sky-50/50 dark:border-sky-900/50 dark:bg-sky-950/20 p-5 shadow-apple-sm hover:shadow-apple-md transition-shadow flex flex-col justify-between group space-y-4 hover:bg-sky-50 dark:hover:bg-sky-900/40"
          >
            <div className="h-10 w-10 rounded-2xl bg-sky-100 dark:bg-sky-900/60 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
              <Home className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-sky-950 dark:text-sky-100">Home Visits</p>
              <p className="text-[11px] text-sky-700/70 dark:text-sky-300/70 mt-0.5">Doctor/Nurse Call</p>
            </div>
          </Link>

          {/* Rapid SOS */}
          <Link
            href="/patient/emergency"
            className="rounded-3xl border border-red-200/60 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20 p-5 shadow-apple-sm hover:shadow-apple-md transition-shadow flex flex-col justify-between group space-y-4 hover:bg-red-50 dark:hover:bg-red-900/40"
          >
            <div className="h-10 w-10 rounded-2xl bg-red-100 dark:bg-red-900/60 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-105 transition-transform">
              <AlertCircle className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-red-950 dark:text-red-100">SOS Emergency</p>
              <p className="text-[11px] text-red-700/70 dark:text-red-300/70 mt-0.5">1-Tap Medical ID</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 3. Priority Level 0: Snapshot & Next Event */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthSnapshot metrics={demoPatient.metrics} />
        <UpcomingAppointment appointment={nextAppointment} />
      </div>

      {/* 4. AI Insight */}
      <AIInsightCard 
        title="New lab results are available."
        description="Your Comprehensive Metabolic Panel from CityPath Labs is ready to review. CARE360 AI has generated a preliminary summary."
        actionText="Review Summary"
        actionHref="/patient/reports/rep_1"
      />

      {/* 5. Priority Level 1: Reports & Prescriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentReports reports={demoReports} />
        <RecentPrescriptions prescriptions={demoPrescriptions} />
      </div>

      {/* 6. Priority Level 2: Timeline & Care Network */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TimelinePreview events={demoTimelineEvents} />
        <div className="flex flex-col gap-6">
          <ConnectedCareVisualization />
          {/* Quick actions for Network */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex-1 flex flex-col justify-center items-center text-center">
            <h3 className="text-sm font-medium text-foreground mb-1">Need care?</h3>
            <p className="text-xs text-muted-foreground mb-4">Find top-rated providers and pharmacies in your network.</p>
            <div className="flex gap-2 w-full">
               <Link href="/patient/doctors" className="flex-1 bg-secondary/50 hover:bg-secondary text-xs py-2 rounded-xl border border-border transition-colors text-foreground font-medium text-center">Find a Doctor</Link>
               <Link href="/patient/pharmacies" className="flex-1 bg-secondary/50 hover:bg-secondary text-xs py-2 rounded-xl border border-border transition-colors text-foreground font-medium text-center">Find Pharmacy</Link>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
