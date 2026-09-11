"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Stethoscope,
  Store,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  Shield,
  AlertTriangle,
  Bell,
  Radio,
  Zap,
  Server,
  CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPortalPage() {
  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-foreground mb-3">
            <ShieldCheck className="h-3.5 w-3.5 stroke-[1.5]" />
            Network Operations Center
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Platform Administration
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-medium">
            System uptime: 99.99% • Data sync: Real-time • Active node: us-west-1
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
            <Link href="/admin/verifications/pharmacies">
              <Store className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Pharmacy Queue (1 Pending)
            </Link>
          </Button>

          <Button size="sm" className="rounded-full text-xs" asChild>
            <Link href="/admin/verifications">
              <Stethoscope className="h-3.5 w-3.5 mr-1.5" />
              Doctor Queue (2 Pending)
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-border bg-card shadow-apple-sm p-6 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wide">Total Patients</span>
            <Users className="h-4 w-4 stroke-[1.5]" />
          </div>
          <p className="text-3xl font-semibold text-foreground tracking-tight">1.2M+</p>
          <p className="text-xs text-emerald-600 font-medium">↑ 12% this month</p>
        </div>

        <div className="rounded-3xl border border-border bg-card shadow-apple-sm p-6 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wide">Active Doctors</span>
            <Stethoscope className="h-4 w-4 stroke-[1.5]" />
          </div>
          <p className="text-3xl font-semibold text-foreground tracking-tight">14,029</p>
          <p className="text-xs text-muted-foreground">12 pending verification</p>
        </div>

        <div className="rounded-3xl border border-border bg-card shadow-apple-sm p-6 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wide">Network Pharmacies</span>
            <Store className="h-4 w-4 stroke-[1.5]" />
          </div>
          <p className="text-3xl font-semibold text-foreground tracking-tight">3,492</p>
          <p className="text-xs text-muted-foreground">Across 50 states</p>
        </div>

        <div className="rounded-3xl border border-border bg-card shadow-apple-sm p-6 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wide">Support Tickets</span>
            <AlertTriangle className="h-4 w-4 stroke-[1.5]" />
          </div>
          <p className="text-3xl font-semibold text-foreground tracking-tight">24</p>
          <p className="text-xs text-amber-600 font-medium">Requiring attention</p>
        </div>
      </div>

      {/* Verification & Management Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pharmacy Governance */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-apple-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-foreground" />
                <h3 className="text-base font-semibold text-foreground">Pharmacy Network Governance</h3>
              </div>
              <span className="rounded-full bg-amber-500/10 text-amber-600 px-2.5 py-0.5 text-xs font-bold">
                Action Required
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Review California and nationwide state pharmacy board licenses, NCPDP identifiers, and courier dispatch radius.
            </p>
          </div>

          <div className="space-y-2 rounded-2xl bg-secondary/30 p-4 border border-border/50 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground">Community Care Wellness Pharmacy</span>
              <span className="text-amber-500 font-semibold">Under Review</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              License CA-RPH-649108 • 120 California Ave, Palo Alto
            </p>
          </div>

          <Button size="sm" className="rounded-full text-xs" asChild>
            <Link href="/admin/verifications/pharmacies">
              Open Pharmacy Review Queue
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Doctor Verification */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-foreground">Physician Credentialing</h3>
              </div>
              <span className="rounded-full bg-amber-500/10 text-amber-600 px-2.5 py-0.5 text-xs font-bold">
                Action Required
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Inspect medical degree transcripts, state medical board licenses, and DEA schedule registrations.
            </p>
          </div>

          <div className="space-y-2 rounded-2xl bg-secondary/30 p-4 border border-border/50 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground">Dr. Marcus Vance, MD</span>
              <span className="text-amber-500 font-semibold">Under Review</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Neurology & Sleep Medicine • Medical Board of California
            </p>
          </div>

          <Button size="sm" variant="outline" className="rounded-full text-xs" asChild>
            <Link href="/admin/verifications">
              Open Doctor Credentialing Queue
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Live System Alerts & Operations Incident Feed */}
      <AdminAlertsFeedSection />


      {/* Platform Administration Hub Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/users"
          className="rounded-3xl border border-border bg-card p-6 shadow-apple-sm hover:shadow-apple-md transition-shadow group block space-y-4"
        >
          <div className="flex items-center justify-between text-foreground">
            <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center">
              <Users className="h-5 w-5 stroke-[1.5]" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-base tracking-tight mb-1">User Directory</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Audit patients, licensed physicians, pharmacists, and staff role permissions.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/complaints"
          className="rounded-3xl border border-border bg-card p-6 shadow-apple-sm hover:shadow-apple-md transition-shadow group block space-y-4"
        >
          <div className="flex items-center justify-between text-foreground">
            <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center">
              <AlertCircle className="h-5 w-5 stroke-[1.5]" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-base tracking-tight mb-1">Support Complaints</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Track and resolve patient disputes, dispensing delays, and telehealth inquiries.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/analytics"
          className="rounded-3xl border border-border bg-card p-6 shadow-apple-sm hover:shadow-apple-md transition-shadow group block space-y-4"
        >
          <div className="flex items-center justify-between text-foreground">
            <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center">
              <Activity className="h-5 w-5 stroke-[1.5]" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-base tracking-tight mb-1">Telemetry Analytics</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Explore consultation volume, e-Rx turnaround times, and multi-modal AI scans.
            </p>
          </div>
        </Link>
      </div>

      {/* Platform Real-Time Systems Health & Compliance */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-apple-md space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              System Infrastructure & Compliance Health
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Continuous monitoring across CARE360 interconnected clinical services.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-foreground font-semibold">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>All Systems Nominal</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-secondary p-5 border border-border space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">NCPDP SCRIPT Gateway</span>
            <p className="font-semibold text-foreground text-lg tracking-tight">Active (v2017071)</p>
            <p className="text-xs text-muted-foreground font-medium">99.99% successful e-Rx transmission</p>
          </div>

          <div className="rounded-2xl bg-secondary p-5 border border-border space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">WebRTC Video Latency</span>
            <p className="font-semibold text-foreground text-lg tracking-tight">48 ms (P95)</p>
            <p className="text-xs text-muted-foreground font-medium">Zero dropped clinical sessions</p>
          </div>

          <div className="rounded-2xl bg-secondary p-5 border border-border space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cryptographic Audit Seal</span>
            <p className="font-semibold text-foreground text-lg tracking-tight">SHA-256 Validated</p>
            <p className="text-xs text-muted-foreground font-medium">Tamper detection enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminAlertsFeedSection() {
  const [activeFilter, setActiveFilter] = React.useState<"all" | "critical" | "clinical" | "infrastructure">("all");
  const [alerts, setAlerts] = React.useState([
    {
      id: "SOS-9021",
      category: "critical",
      severity: "critical",
      title: "EMERGENCY SOS: Rapid Telemetry Dispatched",
      desc: "Patient Aarav Patel (MRN #C360-88412) in Palo Alto, CA. SpO2: 89%, HR: 134 bpm. Santa Clara County EMS Unit #4 dispatched (ETA: 4m).",
      time: "2m ago",
      actionUrl: "/patient/emergency",
      actionLabel: "Track Live SOS",
      entity: "Patient #C360-88412",
      unread: true
    },
    {
      id: "SEC-4401",
      category: "critical",
      severity: "critical",
      title: "Zero-Trust: Tor Exit Node Admin Login Blocked",
      desc: "Perimeter defense quarantined unauthorized access attempt for ops-root@care360.health from IP 185.220.101.4. Hardware FIDO2 challenge enforced.",
      time: "9m ago",
      actionUrl: "/admin/settings",
      actionLabel: "Audit Security",
      entity: "IP 185.220.101.4",
      unread: true
    },
    {
      id: "RX-99420",
      category: "clinical",
      severity: "warning",
      title: "DEA Schedule II Dual-Attestation Required",
      desc: "Prescription e-Rx #RX-99420 (Oxycodone 10mg) by Dr. Marcus Vance. Awaiting Chief Pharmacist cryptographic co-signature at Walgreens #4190.",
      time: "20m ago",
      actionUrl: "/pharmacy",
      actionLabel: "Inspect Attestation",
      entity: "e-Rx #RX-99420",
      unread: true
    },
    {
      id: "DOC-59281",
      category: "clinical",
      severity: "info",
      title: "Physician Credentialing Review Submitted",
      desc: "Dr. Elena Rostova, MD (Cardiology) uploaded CA State Medical Board License #C-59281 & federal DEA certificate for compliance onboarding.",
      time: "38m ago",
      actionUrl: "/admin/verifications",
      actionLabel: "Verify MD License",
      entity: "Dr. Elena Rostova",
      unread: false
    },
    {
      id: "CORSAIR-1429",
      category: "infrastructure",
      severity: "success",
      title: "Corsair DB Multi-Region Ledger Sealed",
      desc: "Daily cryptographic audit validated 14,290 EHR blocks across US-East, Frankfurt, and Mumbai nodes. 0 hash discrepancies. P99 latency: 38ms.",
      time: "1h ago",
      actionUrl: "/admin/corsair",
      actionLabel: "Inspect Corsair DB",
      entity: "Cluster Mesh",
      unread: false
    }
  ]);

  const filtered = alerts.filter((a) => {
    if (activeFilter === "all") return true;
    return a.category === activeFilter;
  });

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })));
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-apple-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Live Operations &amp; Subsystem Incident Feed
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Automated event streaming across CAD emergency dispatch, DEA SCRIPT gateways, and Corsair cryptographic clusters.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs rounded-full h-8 gap-1 text-muted-foreground hover:text-foreground cursor-pointer">
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Acknowledge All</span>
          </Button>

          <Button size="sm" variant="outline" className="rounded-full text-xs h-8 gap-1.5 cursor-pointer bg-background" asChild>
            <Link href="/admin/notifications">
              <span>Full Incident Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
        {[
          { id: "all", label: "All Telemetry (5)" },
          { id: "critical", label: "Critical & SOS (2)" },
          { id: "clinical", label: "Clinical & e-Rx (2)" },
          { id: "infrastructure", label: "Corsair & Nodes (1)" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap text-xs ${
              activeFilter === tab.id
                ? "bg-foreground text-background shadow-xs"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border border-border/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.unread ? "bg-primary/[0.02] border-primary/20 shadow-xs" : "bg-secondary/20 hover:bg-secondary/40"
            }`}
          >
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <div className="shrink-0 mt-0.5">
                {item.severity === "critical" && (
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20">
                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                  </div>
                )}
                {item.severity === "warning" && (
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                )}
                {item.severity === "info" && (
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                )}
                {item.severity === "success" && (
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-secondary border border-border text-foreground">
                    {item.id}
                  </span>
                  <h4 className="text-xs font-semibold text-foreground tracking-tight truncate">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    • {item.time}
                  </span>
                  {item.unread && (
                    <span className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full border border-primary/20">
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="rounded-full text-xs h-8 px-4 font-semibold shrink-0 cursor-pointer bg-background hover:bg-secondary gap-1"
              asChild
            >
              <Link href={item.actionUrl}>
                <span>{item.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

