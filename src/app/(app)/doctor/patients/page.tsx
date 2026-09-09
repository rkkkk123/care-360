"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  FileText,
  Calendar,
  Pill,
  Video,
  Clock,
  ArrowRight,
  ShieldCheck,
  Activity,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  lastVisit: string;
  status: "Active" | "Stable" | "Follow-up Needed";
  recentRx: string;
  latestBiomarker: string;
  appointmentId: string;
}

const mockPatients: PatientRecord[] = [
  {
    id: "pat-1",
    name: "Jane Doe",
    age: 32,
    gender: "Female",
    condition: "Type 2 Diabetes Screening & Hypertension",
    lastVisit: "Today, 10:00 AM",
    status: "Active",
    recentRx: "Metformin 500mg (BID) • Lisinopril 10mg",
    latestBiomarker: "HbA1c: 6.8% (Borderline)",
    appointmentId: "apt-1",
  },
  {
    id: "pat-2",
    name: "Robert Chen",
    age: 45,
    gender: "Male",
    condition: "Hyperlipidemia & Cardiovascular Risk",
    lastVisit: "3 days ago",
    status: "Stable",
    recentRx: "Atorvastatin 20mg (QHS)",
    latestBiomarker: "Total Cholesterol: 215 mg/dL",
    appointmentId: "apt-2",
  },
  {
    id: "pat-3",
    name: "Maria Gonzalez",
    age: 28,
    gender: "Female",
    condition: "Asthma & Seasonal Bronchial Reactivity",
    lastVisit: "1 week ago",
    status: "Follow-up Needed",
    recentRx: "Albuterol HFA Inhaler (PRN)",
    latestBiomarker: "Spirometry FEV1: 84% predicted",
    appointmentId: "apt-3",
  },
  {
    id: "pat-4",
    name: "David Kim",
    age: 52,
    gender: "Male",
    condition: "Metabolic Syndrome Routine Care",
    lastVisit: "2 weeks ago",
    status: "Stable",
    recentRx: "Metformin 850mg (Daily)",
    latestBiomarker: "Fasting Glucose: 104 mg/dL",
    appointmentId: "apt-4",
  },
];

export default function DoctorPatientsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.recentRx.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || patient.status.toLowerCase().replace(/\s+/g, "-") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <Users className="h-3.5 w-3.5" />
            Clinical Patient Roster
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Patient Medical History & Longitudinal Records
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review authorized patient records, chronic care pathways, diagnostic summaries, and prescription history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="rounded-full text-xs" asChild>
            <Link href="/doctor/prescriptions/new">
              <Pill className="h-3.5 w-3.5 mr-1.5" />
              Write New Prescription
            </Link>
          </Button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patients by name, diagnosis, or medication..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "active", "stable", "follow-up-needed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-all ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground border border-border/50"
              }`}
            >
              {status.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base border border-primary/20">
                  {patient.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{patient.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        patient.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : patient.status === "Follow-up Needed"
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {patient.gender}, {patient.age} yrs • Last Consult: {patient.lastVisit}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="rounded-2xl bg-secondary/30 p-3 border border-border/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <Activity className="h-3.5 w-3.5 text-primary" />
                    <span>Primary Diagnosis & Vitals</span>
                  </div>
                  <p className="font-semibold text-foreground">{patient.condition}</p>
                  <p className="text-[11px] text-primary">{patient.latestBiomarker}</p>
                </div>

                <div className="rounded-2xl bg-secondary/30 p-3 border border-border/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                    <Pill className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Active Digital Prescriptions</span>
                  </div>
                  <p className="font-semibold text-foreground">{patient.recentRx}</p>
                  <p className="text-[11px] text-muted-foreground">Dispensed via Connected Pharmacy</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col items-center justify-end gap-2 border-t lg:border-t-0 pt-4 lg:pt-0">
              <Button size="sm" className="w-full rounded-full text-xs shadow-sm" asChild>
                <Link href={`/doctor/consultation/${patient.appointmentId}`}>
                  <Video className="h-3.5 w-3.5 mr-1.5" />
                  Telehealth Room
                </Link>
              </Button>

              <Button variant="outline" size="sm" className="w-full rounded-full text-xs" asChild>
                <Link href={`/doctor/prescriptions/new?patientId=${patient.id}&patientName=${encodeURIComponent(patient.name)}`}>
                  <Pill className="h-3.5 w-3.5 mr-1.5" />
                  Issue Rx
                </Link>
              </Button>

              <Button variant="ghost" size="sm" className="w-full rounded-full text-xs text-muted-foreground" asChild>
                <Link href="/doctor/appointments">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  View History
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
