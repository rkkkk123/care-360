"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  User,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/motion/FadeIn";
import { formatDisplayDate } from "@/lib/utils";

interface DoctorAppointmentItem {
  id: string;
  patientName: string;
  patientAge: number;
  patientAllergies: string[];
  date: string;
  time: string;
  chiefConcern: string;
  reportAttached: string;
  status: "ready" | "scheduled" | "completed";
  patientVisibleSummary?: string;
}

const initialDoctorSchedule: DoctorAppointmentItem[] = [
  {
    id: "app_1",
    patientName: "Jane Doe",
    patientAge: 38,
    patientAllergies: ["Penicillin", "Peanuts"],
    date: new Date().toISOString(),
    time: "10:30 AM",
    chiefConcern: "Follow up on recent Comprehensive Metabolic Panel & Vitamin D3 supplementation",
    reportAttached: "Comprehensive Metabolic Panel (CityPath Labs)",
    status: "ready",
  },
  {
    id: "app_2",
    patientName: "Robert Vance",
    patientAge: 52,
    patientAllergies: ["Aspirin"],
    date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    time: "02:00 PM",
    chiefConcern: "Preventive Cardiology Review and blood pressure monitoring review",
    reportAttached: "Lipid Profile & hs-CRP Panel",
    status: "scheduled",
  },
  {
    id: "app_3",
    patientName: "Michael Scott",
    patientAge: 46,
    patientAllergies: ["None"],
    date: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    time: "04:30 PM",
    chiefConcern: "Annual Metabolic Assessment & nutrition optimization",
    reportAttached: "Comprehensive Metabolic Panel (2025)",
    status: "scheduled",
  },
];

export default function DoctorAppointmentsPage() {
  const [schedule, setSchedule] = React.useState<DoctorAppointmentItem[]>(initialDoctorSchedule);
  const [activeTab, setActiveTab] = React.useState<"all" | "today" | "completed">("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filtered = schedule.filter((item) => {
    if (activeTab === "completed" && item.status !== "completed") return false;
    if (activeTab === "today" && item.status === "completed") return false;
    if (searchQuery.trim()) {
      return (
        item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.chiefConcern.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <FadeIn>
      <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-16">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              Consultations Schedule
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage patient telehealth rooms, authorized records, and clinical documentation.
            </p>
          </div>

          <Button className="rounded-full shadow-sm text-xs gap-1.5" asChild>
            <Link href="/doctor/consultation/app_1">
              <Video className="w-3.5 h-3.5" />
              Launch Active Telehealth Suite
            </Link>
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              All Consultations ({schedule.length})
            </button>
            <button
              onClick={() => setActiveTab("today")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "today"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Today&apos;s Sessions
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "completed"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Completed
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search patients or reasons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-9 h-9 rounded-xl bg-background"
            />
          </div>
        </div>

        {/* Consultations List */}
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-card border rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:border-border/80 ${
                item.status === "ready" ? "border-primary/40 bg-primary/[0.02]" : "border-border"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center font-serif text-lg font-medium text-primary shrink-0">
                  {item.patientName.split(" ").map((n) => n[0]).join("")}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-medium text-foreground">{item.patientName}</h3>
                    <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {item.patientAge}yo
                    </span>
                    {item.status === "ready" ? (
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Patient Ready
                      </span>
                    ) : item.status === "completed" ? (
                      <span className="text-[10px] uppercase font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                        Finalized
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                        Confirmed
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-foreground font-medium">{item.chiefConcern}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {item.time} ({formatDisplayDate(item.date)})
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      {item.reportAttached}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  className={`rounded-full text-xs shadow-md gap-1.5 ${
                    item.status === "ready"
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                  }`}
                  asChild
                >
                  <Link href={`/doctor/consultation/${item.id}`}>
                    <Video className="w-3.5 h-3.5" />
                    {item.status === "completed" ? "Review Documentation" : "Enter Clinical Workspace"}
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-xs">
              No consultations match your current filter.
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
