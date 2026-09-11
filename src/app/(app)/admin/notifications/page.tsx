"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  Server,
  Radio,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Filter,
  Search,
  Download,
  CheckCheck,
  Zap,
  RefreshCw,
  Eye,
  X,
  ExternalLink,
  Lock,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminIncident {
  id: string;
  category: "critical" | "security" | "clinical" | "infrastructure";
  severity: "critical" | "warning" | "info" | "success";
  title: string;
  summary: string;
  timestamp: string;
  unread: boolean;
  resolved: boolean;
  entityId: string;
  subsystem: string;
  node: string;
  actionUrl: string;
  actionLabel: string;
  payload: Record<string, any>;
}

const INITIAL_INCIDENTS: AdminIncident[] = [
  {
    id: "INC-9021",
    category: "critical",
    severity: "critical",
    title: "EMERGENCY SOS: Rapid Telemetry Dispatched",
    summary: "Patient Aarav Patel (MRN #C360-88412) triggered SOS in Palo Alto, CA (37.4419° N, 122.1430° W). Real-time SpO2: 89%, HR: 134 bpm. Santa Clara County EMS Unit #4 dispatched (ETA: 4m).",
    timestamp: "2 mins ago",
    unread: true,
    resolved: false,
    entityId: "SOS-PAT-88412",
    subsystem: "CAD E911 Dispatch Engine",
    node: "us-west-1a",
    actionUrl: "/patient/emergency",
    actionLabel: "Track Live SOS Telemetry",
    payload: {
      patient: "Aarav Patel",
      mrn: "C360-88412",
      gps: { lat: 37.4419, lng: -122.143 },
      vitals: { hr: 134, spo2: 89, bp: "154/98" },
      cad_unit: "SC-EMS-04",
      eta_minutes: 4,
      correlation_id: "cad_relay_9021a8fc"
    }
  },
  {
    id: "INC-4401",
    category: "security",
    severity: "critical",
    title: "Zero-Trust: Tor Exit Node Admin Login Blocked",
    summary: "Automated perimeter defense quarantined unauthorized brute-force attempt for account ops-root@care360.health from IP 185.220.101.4 (Known Tor exit node). Hardware FIDO2 challenge enforced.",
    timestamp: "9 mins ago",
    unread: true,
    resolved: false,
    entityId: "SEC-BLOCKED-4401",
    subsystem: "Cloudflare / Zero-Trust Perimeter",
    node: "edge-waf-us-east",
    actionUrl: "/admin/settings",
    actionLabel: "Audit Security Policy",
    payload: {
      target_account: "ops-root@care360.health",
      source_ip: "185.220.101.4",
      threat_level: "High - Known Tor Relay",
      quarantine_duration: "Permanent (CIDR)",
      mfa_method: "WebAuthn / FIDO2 YubiKey"
    }
  },
  {
    id: "INC-8920",
    category: "clinical",
    severity: "warning",
    title: "DEA Schedule II Dual-Attestation Required",
    summary: "Prescription e-Rx #RX-99420 (Oxycodone 10mg) issued by Dr. Marcus Vance, MD. Awaiting Chief Pharmacy Officer cryptographic co-signature at Walgreens #4190 before automated dispensing.",
    timestamp: "20 mins ago",
    unread: true,
    resolved: false,
    entityId: "RX-99420",
    subsystem: "NCPDP EPCS Gateway",
    node: "api-rx-prod-02",
    actionUrl: "/pharmacy",
    actionLabel: "Inspect Attestation Queue",
    payload: {
      drug: "Oxycodone HCl 10mg Tablet",
      prescriber: "Dr. Marcus Vance, MD (DEA: #BM8291042)",
      pharmacy: "Walgreens #4190, Palo Alto",
      dea_schedule: "Schedule II (C-II)",
      sha256_hash: "a4f91b702ec8c919d80c05f013d298711e5c"
    }
  },
  {
    id: "INC-3104",
    category: "clinical",
    severity: "info",
    title: "Physician Credentialing Review Submitted",
    summary: "Dr. Elena Rostova, MD (Cardiology & Electrophysiology) uploaded California State Medical Board License #C-59281 and federal DEA registration #BR902143 for network compliance onboarding.",
    timestamp: "38 mins ago",
    unread: true,
    resolved: false,
    entityId: "DOC-59281",
    subsystem: "CMS NPPES NPI Registry",
    node: "doc-verify-cluster",
    actionUrl: "/admin/verifications",
    actionLabel: "Verify Medical License",
    payload: {
      provider: "Dr. Elena Rostova, MD",
      npi: "1849201948",
      state_license: "CA-C-59281",
      specialty: "Cardiovascular Disease & Electrophysiology",
      primary_hospital: "Stanford Health Care"
    }
  },
  {
    id: "INC-1429",
    category: "infrastructure",
    severity: "success",
    title: "Corsair DB Multi-Region Ledger Sealed",
    summary: "Daily automated cryptographic audit validated 14,290 patient EHR records across US-East, Frankfurt, and Mumbai nodes. Zero SHA-256 hash discrepancies. P99 consensus latency: 38ms.",
    timestamp: "1 hour ago",
    unread: false,
    resolved: true,
    entityId: "CORSAIR-AUDIT-1429",
    subsystem: "Corsair Distributed Edge DB",
    node: "global-mesh-3-regions",
    actionUrl: "/admin/corsair",
    actionLabel: "Inspect Corsair DB Nodes",
    payload: {
      blocks_verified: 14290,
      hash_algorithm: "HMAC-SHA256",
      regions: ["us-east-1", "eu-central-1", "ap-south-1"],
      sync_latency_p99_ms: 38,
      tampering_detected: false
    }
  },
  {
    id: "INC-1042",
    category: "clinical",
    severity: "warning",
    title: "Pharmacy Supply Out-of-Stock Auto-Rerouted",
    summary: "CVS Health #1042 flagged 0 units remaining for Amoxicillin-Clavulanate 875mg. Corsair Smart Order Dispatch rerouted 3 pending patient prescriptions to nearby Walgreens #4190 (0.8 mi).",
    timestamp: "2 hours ago",
    unread: false,
    resolved: true,
    entityId: "PHARM-1042",
    subsystem: "Supply Chain Smart Router",
    node: "inventory-worker-01",
    actionUrl: "/pharmacy/inventory",
    actionLabel: "View Inventory Mesh",
    payload: {
      depleted_item: "Amoxicillin-Clavulanate 875mg",
      origin_pharmacy: "CVS Health #1042",
      destination_pharmacy: "Walgreens #4190",
      rerouted_count: 3,
      patient_impact_delay_minutes: 0
    }
  },
  {
    id: "INC-8841",
    category: "clinical",
    severity: "info",
    title: "Gemini 2.5 Flash Vision: Critical Lab Panel Flag",
    summary: "AI Vision Pipeline extracted 12-page Complete Blood Count & Comprehensive Metabolic Panel for Patient #P-8841. Flagged elevated ALT/AST (Liver Enzymes) for urgent doctor review.",
    timestamp: "3 hours ago",
    unread: false,
    resolved: false,
    entityId: "LAB-OCR-8841",
    subsystem: "Gemini 2.5 Flash Vision OCR",
    node: "ai-inference-gpu-cluster",
    actionUrl: "/doctor",
    actionLabel: "Open Physician Dashboard",
    payload: {
      patient_id: "P-8841",
      model: "google/gemini-2.5-flash-vision",
      confidence: "99.4%",
      abnormal_values: [
        { test: "ALT (SGPT)", result: "142 U/L", normal: "7-56 U/L", flag: "HIGH" },
        { test: "AST (SGOT)", result: "118 U/L", normal: "10-40 U/L", flag: "HIGH" }
      ]
    }
  },
  {
    id: "INC-5510",
    category: "infrastructure",
    severity: "info",
    title: "NCPDP SCRIPT Gateway Peak Velocity Handled",
    summary: "Outbound e-Prescription transaction velocity peaked at 420 req/sec across 50 national partner pharmacy chains. SCRIPT v2017071 gateway operating normally with 99.99% deliverability.",
    timestamp: "5 hours ago",
    unread: false,
    resolved: true,
    entityId: "NCPDP-PEAK-5510",
    subsystem: "SCRIPT v2017071 Gateway",
    node: "gateway-epcs-us-west",
    actionUrl: "/admin/analytics",
    actionLabel: "View Telemetry Graphs",
    payload: {
      peak_qps: 420,
      protocol: "NCPDP SCRIPT Standard v2017071",
      success_rate: "99.991%",
      active_pharmacies: 3492
    }
  }
];

export default function AdminNotificationsPage() {
  const [incidents, setIncidents] = React.useState<AdminIncident[]>(INITIAL_INCIDENTS);
  const [filterSeverity, setFilterSeverity] = React.useState<string>("all");
  const [filterSubsystem, setFilterSubsystem] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isLiveStreaming, setIsLiveStreaming] = React.useState<boolean>(true);
  const [inspectIncident, setInspectIncident] = React.useState<AdminIncident | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const unreadCount = incidents.filter((i) => i.unread).length;
  const criticalCount = incidents.filter((i) => i.severity === "critical" && !i.resolved).length;

  const filteredIncidents = incidents.filter((item) => {
    if (filterSeverity !== "all" && item.severity !== filterSeverity) return false;
    if (filterSubsystem !== "all" && item.subsystem !== filterSubsystem) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchEntity = item.entityId.toLowerCase().includes(q);
      const matchSubsystem = item.subsystem.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchEntity && !matchSubsystem) return false;
    }
    return true;
  });

  const markAllRead = () => {
    setIncidents((prev) => prev.map((i) => ({ ...i, unread: false })));
    showToast("All incidents marked as read.");
  };

  const toggleResolved = (id: string) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, resolved: !i.resolved, unread: false } : i))
    );
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidents, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `care360_incident_audit_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Exported complete audit log to JSON.");
  };

  const handleSimulateLiveAlert = () => {
    const newInc: AdminIncident = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      category: "critical",
      severity: "critical",
      title: "LIVE INCIDENT: Stanford Emergency Hub Connected",
      summary: "Paramedic Telemetry Uplink active for Unit #7. Vital indicators broadcasted to Stanford Medical ICU trauma team. Real-time audio-video active.",
      timestamp: "Just now",
      unread: true,
      resolved: false,
      entityId: "EMS-STANFORD-07",
      subsystem: "CAD E911 Dispatch Engine",
      node: "us-west-1b",
      actionUrl: "/patient/emergency",
      actionLabel: "Join Trauma Uplink",
      payload: {
        unit: "San Mateo Paramedic Unit 7",
        destination: "Stanford Hospital Trauma Center",
        severity_code: "Code 3 (Urgent)",
        gps: { lat: 37.432, lng: -122.175 }
      }
    };

    setIncidents((prev) => [newInc, ...prev]);
    showToast("Injected live incident telemetry event!");
  };

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-50 rounded-2xl bg-foreground text-background px-4 py-3 text-xs font-semibold shadow-apple-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Breadcrumb */}
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
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>National Health Mesh • Live Operations Feed</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Incident &amp; Notification Center
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              Real-time audit log of clinical alerts, DEA Schedule II compliance flags, Emergency SOS CAD relays, and Corsair DB node health.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateLiveAlert}
              className="rounded-full text-xs font-semibold gap-1.5 cursor-pointer bg-background"
            >
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Simulate Incident</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              className="rounded-full text-xs font-semibold gap-1.5 cursor-pointer bg-background"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Audit Log</span>
            </Button>

            {unreadCount > 0 && (
              <Button
                size="sm"
                onClick={markAllRead}
                className="rounded-full text-xs font-semibold gap-1.5 cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark All Read</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-apple-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wide">Critical Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-3xl font-semibold text-foreground tracking-tight">{criticalCount}</p>
          <p className="text-xs text-rose-600 font-medium">Immediate triage required</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-apple-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wide">Unread Incidents</span>
            <Bell className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-semibold text-foreground tracking-tight">{unreadCount}</p>
          <p className="text-xs text-muted-foreground font-medium">Across all subsystems</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-apple-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wide">Active Mesh Nodes</span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-semibold text-foreground tracking-tight">4 Nodes</p>
          <p className="text-xs text-emerald-600 font-medium">100% consensus health</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-apple-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wide">P99 Dispatch Latency</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-semibold text-foreground tracking-tight">38 ms</p>
          <p className="text-xs text-blue-600 font-medium">Zero dropped webhooks</p>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-apple-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, MRN, prescriber, entity ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-2xl bg-secondary/30 text-xs border-border/80"
            />
          </div>

          {/* Live stream badge toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-secondary/40 hover:bg-secondary cursor-pointer transition-colors"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveStreaming ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                }`}
              />
              <span>{isLiveStreaming ? "Live Feed: Active" : "Live Feed: Paused"}</span>
            </button>
          </div>
        </div>

        {/* Severity Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50 text-xs">
          <span className="text-muted-foreground font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>

          {[
            { id: "all", label: "All Incidents" },
            { id: "critical", label: "Critical" },
            { id: "warning", label: "Warnings" },
            { id: "info", label: "Informational" },
            { id: "success", label: "Success & Audit" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterSeverity(tab.id)}
              className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer ${
                filterSeverity === tab.id
                  ? "bg-foreground text-background shadow-xs"
                  : "bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List */}
      <div className="rounded-3xl border border-border bg-card shadow-apple-sm overflow-hidden divide-y divide-border/60">
        {filteredIncidents.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="font-semibold text-foreground text-sm">No incidents match your filter</p>
            <p className="text-xs">All monitored parameters are running within nominal bounds.</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            return (
              <div
                key={incident.id}
                className={`p-5 transition-colors hover:bg-secondary/20 flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  incident.unread ? "bg-primary/[0.02]" : ""
                } ${incident.resolved ? "opacity-75" : ""}`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="shrink-0 mt-0.5">
                    {incident.severity === "critical" && (
                      <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20">
                        <AlertTriangle className="w-5 h-5 animate-pulse" />
                      </div>
                    )}
                    {incident.severity === "warning" && (
                      <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                    )}
                    {incident.severity === "info" && (
                      <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 border border-blue-500/20">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                    )}
                    {incident.severity === "success" && (
                      <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-secondary border border-border text-foreground">
                        {incident.id}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {incident.subsystem}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground/70">
                        • {incident.timestamp}
                      </span>

                      {incident.resolved ? (
                        <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Resolved
                        </span>
                      ) : (
                        incident.unread && (
                          <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                            New
                          </span>
                        )
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-foreground tracking-tight">
                      {incident.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {incident.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[10px] font-mono bg-secondary/80 border border-border px-2 py-0.5 rounded text-foreground">
                        Entity: {incident.entityId}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        Node: {incident.node}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs font-semibold h-8 gap-1 cursor-pointer bg-background"
                    asChild
                  >
                    <Link href={incident.actionUrl}>
                      <span>{incident.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInspectIncident(incident)}
                      className="text-xs text-muted-foreground hover:text-foreground font-medium p-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer flex items-center gap-1"
                      title="Inspect event JSON payload"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Payload</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleResolved(incident.id)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                        incident.resolved
                          ? "bg-secondary border-border text-muted-foreground"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20 font-semibold"
                      }`}
                    >
                      {incident.resolved ? "Reopen" : "Resolve"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Payload Modal */}
      {inspectIncident && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-apple-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-mono bg-secondary px-2 py-0.5 rounded text-foreground font-bold">
                  {inspectIncident.id}
                </span>
                <h3 className="text-sm font-semibold text-foreground mt-1">
                  Incident Cryptographic Telemetry Payload
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectIncident(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-secondary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-secondary/50 p-4 border border-border/80 font-mono text-xs overflow-x-auto max-h-[300px]">
              <pre className="text-foreground leading-relaxed">
                {JSON.stringify(
                  {
                    incident_id: inspectIncident.id,
                    timestamp: inspectIncident.timestamp,
                    subsystem: inspectIncident.subsystem,
                    cluster_node: inspectIncident.node,
                    entity_reference: inspectIncident.entityId,
                    severity: inspectIncident.severity,
                    telemetry_payload: inspectIncident.payload
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectIncident(null)}
                className="rounded-full text-xs font-semibold cursor-pointer"
              >
                Close Inspector
              </Button>
              <Button
                size="sm"
                asChild
                className="rounded-full text-xs font-semibold cursor-pointer"
              >
                <Link href={inspectIncident.actionUrl}>
                  Launch Triage Action
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
