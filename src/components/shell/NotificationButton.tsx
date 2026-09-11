"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Stethoscope,
  Pill,
  Sparkles,
  ArrowRight,
  X,
  ExternalLink,
  Clock,
  Radio,
  Server,
  Zap,
  Trash2,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NotificationItem {
  id: string;
  category: "clinical" | "critical" | "security" | "infrastructure";
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  actionUrl?: string;
  actionLabel?: string;
  severity: "critical" | "warning" | "info" | "success";
  metadata?: {
    entityId?: string;
    node?: string;
    subsystem?: string;
  };
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-sos-9021",
    category: "critical",
    title: "EMERGENCY SOS: Rapid Telemetry Dispatched",
    message: "Patient Aarav Patel (MRN #C360-88412) triggered SOS in Palo Alto, CA (37.4419° N, 122.1430° W). Real-time SpO2: 89%, HR: 134 bpm. Santa Clara County EMS Unit #4 dispatched (ETA: 4m).",
    timestamp: "1 min ago",
    unread: true,
    actionUrl: "/patient/emergency",
    actionLabel: "Track Live SOS Telemetry",
    severity: "critical",
    metadata: { entityId: "SOS-9021", node: "us-west-1", subsystem: "CAD E911 Dispatch" },
  },
  {
    id: "notif-sec-4401",
    category: "security",
    title: "Zero-Trust: Tor Exit Node Admin Login Blocked",
    message: "Automated perimeter defense quarantined unauthorized brute-force attempt for account ops-root@care360.health from IP 185.220.101.4 (Known Tor exit node). Hardware FIDO2 challenge enforced.",
    timestamp: "8 mins ago",
    unread: true,
    actionUrl: "/admin/settings",
    actionLabel: "Audit Security Policy",
    severity: "critical",
    metadata: { entityId: "SEC-LOG-4401", node: "edge-waf-01", subsystem: "Zero-Trust Perimeter" },
  },
  {
    id: "notif-dea-8920",
    category: "clinical",
    title: "DEA Schedule II Dual-Attestation Required",
    message: "Prescription e-Rx #RX-99420 (Oxycodone 10mg) issued by Dr. Marcus Vance, MD. Awaiting Chief Pharmacy Officer cryptographic co-signature at Walgreens #4190 before automated dispensing.",
    timestamp: "18 mins ago",
    unread: true,
    actionUrl: "/pharmacy",
    actionLabel: "Inspect Attestation Queue",
    severity: "warning",
    metadata: { entityId: "RX-99420", subsystem: "NCPDP EPCS Gateway" },
  },
  {
    id: "notif-cred-3104",
    category: "clinical",
    title: "Physician Credentialing Review Submitted",
    message: "Dr. Elena Rostova, MD (Cardiology & Electrophysiology) uploaded California State Medical Board License #C-59281 and federal DEA registration #BR902143 for network compliance onboarding.",
    timestamp: "34 mins ago",
    unread: true,
    actionUrl: "/admin/verifications",
    actionLabel: "Verify Medical License",
    severity: "info",
    metadata: { entityId: "DOC-59281", subsystem: "CMS NPPES NPI Registry" },
  },
  {
    id: "notif-sync-1429",
    category: "infrastructure",
    title: "Corsair DB Multi-Region Ledger Sealed",
    message: "Daily automated cryptographic audit validated 14,290 patient EHR records across US-East, Frankfurt, and Mumbai nodes. Zero SHA-256 hash discrepancies. P99 consensus latency: 38ms.",
    timestamp: "1 hour ago",
    unread: true,
    actionUrl: "/admin/corsair",
    actionLabel: "Inspect Corsair DB Nodes",
    severity: "success",
    metadata: { node: "multi-region-mesh", subsystem: "Corsair Edge Persistence" },
  },
  {
    id: "notif-stock-1042",
    category: "clinical",
    title: "Pharmacy Supply Out-of-Stock Auto-Rerouted",
    message: "CVS Health #1042 flagged 0 units remaining for Amoxicillin-Clavulanate 875mg. Corsair Smart Order Dispatch rerouted 3 pending patient prescriptions to nearby Walgreens #4190 (0.8 mi).",
    timestamp: "2 hours ago",
    unread: false,
    actionUrl: "/pharmacy/inventory",
    actionLabel: "View Inventory Mesh",
    severity: "warning",
    metadata: { entityId: "PHARM-1042", subsystem: "Supply Chain Router" },
  },
  {
    id: "notif-ocr-8841",
    category: "clinical",
    title: "Gemini 2.5 Flash Vision: Critical Lab Panel Flag",
    message: "AI Vision Pipeline extracted 12-page Complete Blood Count & Comprehensive Metabolic Panel for Patient #P-8841. Flagged elevated ALT/AST (Liver Enzymes) for urgent doctor review.",
    timestamp: "3 hours ago",
    unread: false,
    actionUrl: "/doctor",
    actionLabel: "Open Physician Dashboard",
    severity: "info",
    metadata: { entityId: "LAB-8841", subsystem: "Gemini Multi-Modal OCR" },
  },
  {
    id: "notif-gate-5510",
    category: "infrastructure",
    title: "NCPDP SCRIPT Gateway Peak Velocity Handled",
    message: "Outbound e-Prescription transaction velocity peaked at 420 req/sec across 50 national partner pharmacy chains. SCRIPT v2017071 gateway operating normally with 99.99% deliverability.",
    timestamp: "5 hours ago",
    unread: false,
    actionUrl: "/admin/analytics",
    actionLabel: "View Telemetry Graphs",
    severity: "info",
    metadata: { subsystem: "SCRIPT v2017071 Gateway" },
  },
  {
    id: "notif-fhir-1840",
    category: "infrastructure",
    title: "HL7 FHIR R4 Integration Pipeline Synced",
    message: "Bi-directional FHIR R4 pipeline synced 1,840 patient observation records with Stanford Health Care Epic EHR system with zero schema violations.",
    timestamp: "7 hours ago",
    unread: false,
    actionUrl: "/admin/analytics",
    actionLabel: "Audit FHIR R4 Logs",
    severity: "success",
    metadata: { subsystem: "HL7 FHIR R4 Connector" },
  }
];

export function NotificationButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = React.useState<"all" | "critical" | "security" | "clinical" | "infrastructure">("all");
  const [justSimulated, setJustSimulated] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.category === filter;
  });

  // Handle click outside to close
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Simulate an incoming live alert for high realism
  const handleSimulateAlert = () => {
    const randomIncidents: NotificationItem[] = [
      {
        id: `notif-sim-${Date.now()}`,
        category: "critical",
        title: "CRITICAL: Paramedic Telemetry Uplink Established",
        message: "San Mateo EMS Unit #12 established WebRTC encrypted video uplink for Patient Liam Vance. Vitals streaming to on-call ER trauma doctor.",
        timestamp: "Just now",
        unread: true,
        actionUrl: "/patient/emergency",
        actionLabel: "Connect to Live Uplink",
        severity: "critical",
        metadata: { entityId: "EMS-911", node: "us-west-1", subsystem: "WebRTC Trauma Hub" },
      },
      {
        id: `notif-sim-${Date.now()}`,
        category: "security",
        title: "Cryptographic Attestation Hash Verified",
        message: "Kaiser Permanente Central Pharmacy verified SHA-256 seal for prescription e-Rx #RX-8819. Block #892,109 added to Corsair immutable ledger.",
        timestamp: "Just now",
        unread: true,
        actionUrl: "/admin/corsair",
        actionLabel: "Inspect Block",
        severity: "success",
        metadata: { entityId: "BLK-892109", subsystem: "Corsair WORM Ledger" },
      },
      {
        id: `notif-sim-${Date.now()}`,
        category: "clinical",
        title: "Urgent Drug-Drug Interaction Intercepted",
        message: "CDS Hook flagged major interaction: Clopidogrel + Omeprazole. Prescribing physician Dr. Sarah Lin notified to adjust gastroprotective agent.",
        timestamp: "Just now",
        unread: true,
        actionUrl: "/doctor",
        actionLabel: "Open Clinical Alert",
        severity: "warning",
        metadata: { entityId: "CDS-INTERACTION", subsystem: "Clinical Decision Support" },
      }
    ];

    const pick = randomIncidents[Math.floor(Math.random() * randomIncidents.length)];
    setNotifications((prev) => [pick, ...prev]);
    setJustSimulated(true);
    setTimeout(() => setJustSimulated(false), 2000);
  };

  const getSeverityIcon = (category: string, severity: string) => {
    if (severity === "critical") {
      return (
        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 shrink-0">
          <AlertTriangle className="w-4 h-4 animate-pulse" />
        </div>
      );
    }
    if (category === "security") {
      return (
        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20 shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
      );
    }
    if (category === "infrastructure") {
      return (
        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 shrink-0">
          <Server className="w-4 h-4" />
        </div>
      );
    }
    if (severity === "warning") {
      return (
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
      );
    }
    if (severity === "success") {
      return (
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
          <Check className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20 shrink-0">
        <Stethoscope className="w-4 h-4" />
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button Trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative text-muted-foreground hover:text-foreground rounded-full transition-all cursor-pointer ${
          isOpen ? "bg-secondary text-foreground ring-2 ring-primary/20" : ""
        }`}
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-background animate-in zoom-in-50">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Popover Dropdown Card */}
      {isOpen && (
        <div className="absolute right-[-2.5rem] sm:right-0 mt-3 w-[calc(100vw-2rem)] max-w-[420px] sm:w-[460px] rounded-3xl border border-border bg-card/95 backdrop-blur-2xl shadow-apple-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-border/80 bg-secondary/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-semibold text-foreground text-sm tracking-tight">
                  CARE360 Incident &amp; Operations Center
                </h3>
              </div>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono bg-rose-500/10 text-rose-600 border border-rose-500/20 px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSimulateAlert}
                title="Simulate an incoming real-time alert"
                className={`text-[11px] font-medium px-2 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                  justSimulated
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-semibold"
                    : "bg-background/80 border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Zap className="w-3 h-3 text-amber-500" />
                <span>{justSimulated ? "Alert Injected!" : "+ Live Ping"}</span>
              </button>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-3.5 py-2 border-b border-border/60 bg-background/60 flex items-center gap-1.5 overflow-x-auto text-xs">
            {(
              [
                { id: "all", label: "All Feed" },
                { id: "critical", label: "Critical SOS" },
                { id: "security", label: "Security / Zero-Trust" },
                { id: "clinical", label: "Clinical & e-Rx" },
                { id: "infrastructure", label: "Corsair & Nodes" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap text-[11px] ${
                  filter === tab.id
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification List Body */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-border/50">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
                <Check className="w-8 h-8 text-emerald-500 mx-auto stroke-[1.5]" />
                <p className="font-semibold text-foreground">No active incidents</p>
                <p>All subsystems in category &quot;{filter}&quot; are running nominal.</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 transition-colors relative hover:bg-secondary/40 flex items-start gap-3 group ${
                    notif.unread ? "bg-primary/[0.03]" : ""
                  }`}
                >
                  {getSeverityIcon(notif.category, notif.severity)}

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {notif.unread && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0 animate-pulse" />
                        )}
                        <h4 className="text-xs font-semibold text-foreground tracking-tight truncate">
                          {notif.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground/80 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{notif.timestamp}</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>

                    {/* Metadata tags */}
                    {notif.metadata && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {notif.metadata.entityId && (
                          <span className="text-[9px] font-mono font-bold bg-secondary border border-border/80 px-1.5 py-0.5 rounded text-foreground">
                            {notif.metadata.entityId}
                          </span>
                        )}
                        {notif.metadata.subsystem && (
                          <span className="text-[9px] font-medium bg-primary/5 text-primary border border-primary/10 px-1.5 py-0.5 rounded">
                            {notif.metadata.subsystem}
                          </span>
                        )}
                        {notif.metadata.node && (
                          <span className="text-[9px] font-mono text-muted-foreground">
                            Node: {notif.metadata.node}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action links */}
                    <div className="pt-1 flex items-center justify-between">
                      {notif.actionUrl ? (
                        <Link
                          href={notif.actionUrl}
                          onClick={() => {
                            markAsRead(notif.id);
                            setIsOpen(false);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                        >
                          <span>{notif.actionLabel || "Inspect Incident"}</span>
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      ) : <span />}

                      <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        {notif.unread && (
                          <button
                            type="button"
                            onClick={() => markAsRead(notif.id)}
                            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => dismissNotification(notif.id)}
                          title="Dismiss notification"
                          className="text-muted-foreground hover:text-rose-600 transition-colors p-1 rounded hover:bg-secondary cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-secondary/40 border-t border-border/80 flex items-center justify-between text-xs">
            <Link
              href="/admin/notifications"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-semibold text-primary hover:underline transition-colors flex items-center gap-1"
            >
              <span>View Full Incident Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/settings"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <span>Alert Routing Settings</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}


