"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Stethoscope,
  RefreshCw,
  Search,
  ExternalLink,
  Award,
  FileCheck,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DoctorVerificationItem {
  id: string;
  name: string;
  specialty: string;
  licenseNumber: string;
  stateBoard: string;
  npiNumber: string;
  education: string;
  hospitalAffiliation: string;
  submittedAt: string;
  status: "pending" | "verified" | "rejected";
}

const mockDoctors: DoctorVerificationItem[] = [
  {
    id: "doc-vance",
    name: "Dr. Marcus Vance, MD",
    specialty: "Neurology & Sleep Medicine",
    licenseNumber: "CA-MED-849120",
    stateBoard: "Medical Board of California",
    npiNumber: "1849204910",
    education: "Johns Hopkins School of Medicine",
    hospitalAffiliation: "UCSF Medical Center",
    submittedAt: "Today, 08:30 AM",
    status: "pending",
  },
  {
    id: "doc-clara",
    name: "Dr. Clara Alvarez, MD",
    specialty: "Pediatrics & Adolescent Care",
    licenseNumber: "CA-MED-771924",
    stateBoard: "Medical Board of California",
    npiNumber: "1928401923",
    education: "Stanford University School of Medicine",
    hospitalAffiliation: "Lucile Packard Children's Hospital",
    submittedAt: "Yesterday, 04:15 PM",
    status: "pending",
  },
  {
    id: "doc-sharma",
    name: "Dr. Priya Sharma, MD",
    specialty: "Cardiology & Internal Medicine",
    licenseNumber: "CA-MED-928410",
    stateBoard: "Medical Board of California",
    npiNumber: "1948201948",
    education: "Harvard Medical School",
    hospitalAffiliation: "Stanford Health Care",
    submittedAt: "Approved on May 12, 2026",
    status: "verified",
  },
];

export default function AdminDoctorVerificationsPage() {
  const [doctors, setDoctors] = React.useState<DoctorVerificationItem[]>(mockDoctors);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const handleUpdateStatus = (id: string, newStatus: "verified" | "rejected") => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status: newStatus } : doc))
    );
    setFeedback(`Doctor credential status set to "${newStatus}".`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredDoctors = doctors.filter((doc) => {
    return (
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            Physician Credentialing & Medical Board Verification
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Doctor Verification Queue
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Audit physician medical degrees, state licensing board status, NPI registry, and DEA prescribing schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
            <Link href="/admin">Control Center</Link>
          </Button>
          <Button size="sm" className="rounded-full text-xs" asChild>
            <Link href="/admin/verifications/pharmacies">Pharmacy Review Queue</Link>
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by physician name, specialty, or license number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
        />
      </div>

      {/* Verification Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{doc.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        doc.status === "verified"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : doc.status === "rejected"
                          ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {doc.specialty} • {doc.hospitalAffiliation}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="rounded-2xl bg-secondary/30 p-3 border border-border/40 space-y-1">
                  <span className="text-muted-foreground">State Board License</span>
                  <p className="font-semibold text-foreground">{doc.licenseNumber}</p>
                  <p className="text-[11px] text-muted-foreground">{doc.stateBoard}</p>
                </div>

                <div className="rounded-2xl bg-secondary/30 p-3 border border-border/40 space-y-1">
                  <span className="text-muted-foreground">National Provider ID (NPI)</span>
                  <p className="font-semibold text-foreground">{doc.npiNumber}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400">NPPES Registry Active</p>
                </div>

                <div className="rounded-2xl bg-secondary/30 p-3 border border-border/40 space-y-1">
                  <span className="text-muted-foreground">Education & Training</span>
                  <p className="font-semibold text-foreground">{doc.education}</p>
                  <p className="text-[11px] text-muted-foreground">MD Degree Verified</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex sm:flex-col items-center justify-end gap-2 border-t lg:border-t-0 pt-4 lg:pt-0">
              {doc.status === "pending" ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(doc.id, "verified")}
                    className="w-full rounded-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    Approve & Verify
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(doc.id, "rejected")}
                    className="w-full rounded-full text-xs text-rose-600 hover:text-rose-700 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                    Reject Application
                  </Button>
                </>
              ) : doc.status === "verified" ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(doc.id, "rejected")}
                  className="w-full rounded-full text-xs text-amber-600 border-amber-200 hover:bg-amber-50"
                >
                  Revoke Verification
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(doc.id, "verified")}
                  className="w-full rounded-full text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                >
                  Re-evaluate & Approve
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
