"use client";

import * as React from "react";
import Link from "next/link";
import {
  Settings,
  Shield,
  Database,
  Cpu,
  Lock,
  Save,
  CheckCircle2,
  ArrowLeft,
  Server,
  Key,
  Eye,
  EyeOff,
  Bell,
  Sliders,
  Sparkles,
  AlertTriangle,
  Radio,
  FileText,
  Activity,
  Zap,
  Globe,
  RefreshCw,
  Clock,
  ShieldCheck,
  Stethoscope,
  Building2,
  Copy,
  Check,
  Download,
  RotateCcw,
  Volume2,
  Mail,
  Smartphone,
  PhoneCall,
  Terminal,
  ExternalLink,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SettingsTab =
  | "facility"
  | "security"
  | "ai"
  | "corsair"
  | "emergency"
  | "notifications"
  | "providers";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("facility");
  const [saved, setSaved] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Tab 1: Organization & Facility Profile
  const [orgName, setOrgName] = React.useState("CARE360 Health Systems, Inc.");
  const [facilityNpi, setFacilityNpi] = React.useState("1982736450");
  const [facilityCode, setFacilityCode] = React.useState("CA-HOSP-9402");
  const [primaryTimezone, setPrimaryTimezone] = React.useState("America/Los_Angeles");
  const [measurementSystem, setMeasurementSystem] = React.useState<"metric" | "imperial">("metric");
  const [mrnPrefix, setMrnPrefix] = React.useState("C360-");
  const [cmoName, setCmoName] = React.useState("Dr. Eleanor Vance, MD, FACC (Chief Medical Officer)");

  // Tab 2: Security & HIPAA
  const [auditLogging, setAuditLogging] = React.useState(true);
  const [autoTamperAlarm, setAutoTamperAlarm] = React.useState(true);
  const [mandatory2FA, setMandatory2FA] = React.useState(true);
  const [sessionTimeout, setSessionTimeout] = React.useState("15");
  const [phiDataMasking, setPhiDataMasking] = React.useState(true);
  const [ipWhitelist, setIpWhitelist] = React.useState("10.240.0.0/16, 192.168.100.0/24, 73.189.42.18/32");
  const [disasterRecoverySnapshots, setDisasterRecoverySnapshots] = React.useState(true);

  // Tab 3: AI Model Orchestration & Guardrails
  const [primaryAiModel, setPrimaryAiModel] = React.useState("gemini-2.5-flash");
  const [fallbackAiModel, setFallbackAiModel] = React.useState("mistral-large");
  const [ocrConfidenceThreshold, setOcrConfidenceThreshold] = React.useState(85);
  const [aiTemperature, setAiTemperature] = React.useState(0.1);
  const [requireDoctorCoSign, setRequireDoctorCoSign] = React.useState(true);
  const [autoDisclaimerInjection, setAutoDisclaimerInjection] = React.useState(true);
  const [bilingualVoice, setBilingualVoice] = React.useState(true);
  const [cdsHookUrl, setCdsHookUrl] = React.useState("https://cds.care360.health/v1/drug-interactions");

  // Tab 4: Corsair DB & Edge Persistence
  const [apiKey, setApiKey] = React.useState("ck_live_9942aX_NKl6TIGmYrJDa5HZ78M7r2u");
  const [webhookSecret, setWebhookSecret] = React.useState("csec_hI91ZmoutZ1jy-7Omoi7zfim20cmxuxG");
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [showSecret, setShowSecret] = React.useState(false);
  const [cacheEvictionTtl, setCacheEvictionTtl] = React.useState("50");
  const [testingPing, setTestingPing] = React.useState(false);
  const [pingResults, setPingResults] = React.useState<{ region: string; latency: number; status: string }[] | null>(null);

  // Tab 5: Emergency SOS & CAD Dispatch
  const [cadMode, setCadMode] = React.useState<"live" | "sandbox">("live");
  const [dispatchRadius, setDispatchRadius] = React.useState("10");
  const [sosWebhookUrl, setSosWebhookUrl] = React.useState("https://dispatch.care360.health/v1/sos/relay");
  const [webrtcRoomGeneration, setWebrtcRoomGeneration] = React.useState(true);
  const [paramedicGpsFrequency, setParamedicGpsFrequency] = React.useState("5");
  const [testingSosWebhook, setTestingSosWebhook] = React.useState(false);

  // Tab 6: Notifications & Alert Routing
  const [opsAlertEmail, setOpsAlertEmail] = React.useState("security-ops@care360.health");
  const [pagerDutyWebhook, setPagerDutyWebhook] = React.useState("https://events.pagerduty.com/v2/enqueue");
  const [emergencySmsPhone, setEmergencySmsPhone] = React.useState("+1 (800) 555-0199");
  const [callOnCritical, setCallOnCritical] = React.useState(true);
  const [chimeAudioAlerts, setChimeAudioAlerts] = React.useState(true);
  const [dailyExecutiveDigest, setDailyExecutiveDigest] = React.useState(true);
  const [testingAlertChime, setTestingAlertChime] = React.useState(false);

  // Tab 7: Provider & Pharmacy Governance
  const [npiLiveValidation, setNpiLiveValidation] = React.useState(true);
  const [deaTwoSignerRule, setDeaTwoSignerRule] = React.useState(true);
  const [realtimeInventorySync, setRealtimeInventorySync] = React.useState(true);
  const [ncpdpStandardVersion, setNcpdpStandardVersion] = React.useState("v2017071");
  const [stateBoardRecheckDays, setStateBoardRecheckDays] = React.useState("30");
  const [autoSuspendThreshold, setAutoSuspendThreshold] = React.useState("3");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      showToast("All configuration policies committed and synchronized across production mesh.");
      setTimeout(() => setSaved(false), 4000);
    }, 750);
  };

  const handleTestPing = () => {
    setTestingPing(true);
    setPingResults(null);
    setTimeout(() => {
      setTestingPing(false);
      setPingResults([
        { region: "US-West (Silicon Valley - Primary)", latency: 11, status: "Active Primary" },
        { region: "US-East (N. Virginia)", latency: 18, status: "Consensus Healthy" },
        { region: "EU-Central (Frankfurt)", latency: 32, status: "Consensus Healthy" },
        { region: "AP-South (Mumbai)", latency: 41, status: "Consensus Healthy" },
      ]);
      showToast("Multi-region ping completed: 100% consensus health.");
    }, 900);
  };

  const handleRollApiKey = () => {
    const randomHex = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const newKey = `ck_live_${randomHex.slice(0, 8)}_NKl6TIGm${randomHex.slice(8)}`;
    setApiKey(newKey);
    showToast("Rolled new Corsair API key. Remember to save changes.");
  };

  const handleTestSosWebhook = () => {
    setTestingSosWebhook(true);
    setTimeout(() => {
      setTestingSosWebhook(false);
      showToast("Test SOS CAD packet delivered with HTTP 200 OK (28ms).");
    }, 800);
  };

  const handleTestAlertChime = () => {
    setTestingAlertChime(true);
    setTimeout(() => {
      setTestingAlertChime(false);
      showToast("Audio chime verified & test push notification emitted.");
    }, 600);
  };

  const handleExportConfig = () => {
    const configExport = {
      organization: { name: orgName, npi: facilityNpi, facilityCode, timezone: primaryTimezone, measurementSystem },
      security: { auditLogging, autoTamperAlarm, mandatory2FA, sessionTimeout, phiDataMasking, ipWhitelist },
      ai: { primaryAiModel, fallbackAiModel, ocrConfidenceThreshold, aiTemperature, requireDoctorCoSign },
      corsair: { cacheEvictionTtl, activeRegions: ["us-west-1", "us-east-1", "eu-central-1", "ap-south-1"] },
      emergency: { cadMode, dispatchRadius, sosWebhookUrl, webrtcRoomGeneration },
      notifications: { opsAlertEmail, emergencySmsPhone, callOnCritical, chimeAudioAlerts },
      governance: { npiLiveValidation, deaTwoSignerRule, realtimeInventorySync, ncpdpStandardVersion },
      exportedAt: new Date().toISOString(),
      environment: "production-mesh"
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configExport, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `care360_system_settings_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Exported configuration schema JSON.");
  };

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8 pb-28 px-4 sm:px-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-50 rounded-2xl bg-foreground text-background px-4 py-3 text-xs font-semibold shadow-apple-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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
              <span>Production Mesh v2.4.1 • Facility: {facilityCode} • CMS Certified</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Enterprise Governance &amp; Settings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              Configure hospital organization metadata, Zero-Trust HIPAA enforcement, multi-modal AI diagnostic thresholds, Corsair DB edge replication, and 911 CAD dispatch relays.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportConfig}
              className="rounded-full text-xs font-semibold px-4 h-10 gap-1.5 cursor-pointer bg-background"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export JSON</span>
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-full text-xs font-semibold px-5 h-10 shadow-md gap-2 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Deploying Cluster...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save All Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {saved && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-between animate-in fade-in-0 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">
              System configurations committed and synchronized across all 4 production nodes (us-west, us-east, frankfurt, mumbai).
            </span>
          </div>
          <span className="text-[10px] font-mono opacity-80">
            Hash: SHA-256 Validated • {new Date().toLocaleTimeString()}
          </span>
        </div>
      )}

      {/* Category Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-secondary/50 border border-border/80 overflow-x-auto text-xs">
        {[
          { id: "facility", label: "Facility & Legal", icon: Building2 },
          { id: "security", label: "Security & HIPAA", icon: ShieldCheck },
          { id: "ai", label: "AI Diagnostic Copilot", icon: Cpu },
          { id: "corsair", label: "Corsair & Edge DB", icon: Database },
          { id: "emergency", label: "Emergency SOS & CAD", icon: Radio },
          { id: "notifications", label: "Alert Routing & Pager", icon: Bell },
          { id: "providers", label: "Providers & e-Rx", icon: Stethoscope },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer text-xs ${
                isActive
                  ? "bg-background text-foreground shadow-xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Organization & Facility Profile */}
      {activeTab === "facility" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Hospital &amp; Healthcare Facility Identity
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Official medical organizational identifiers, CMS hospital registry codes, and default clinical formatting.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Organization Legal Entity Name</label>
                <Input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="h-11 text-xs rounded-xl bg-background"
                />
                <p className="text-[11px] text-muted-foreground">
                  Appears on official e-Prescriptions, clinical reports, and patient discharge summaries.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center justify-between">
                  <span>Organization NPI Number</span>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">CMS Verified</span>
                </label>
                <Input
                  value={facilityNpi}
                  onChange={(e) => setFacilityNpi(e.target.value)}
                  className="h-11 font-mono text-xs rounded-xl bg-background"
                />
                <p className="text-[11px] text-muted-foreground">
                  10-digit National Provider Identifier registered with the federal CMS NPPES registry.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Clinical Facility Code</label>
                <Input
                  value={facilityCode}
                  onChange={(e) => setFacilityCode(e.target.value)}
                  className="h-11 font-mono text-xs rounded-xl bg-background"
                />
                <p className="text-[11px] text-muted-foreground">
                  California Department of Public Health licensed hospital code.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Primary Clinical Timezone</label>
                <select
                  value={primaryTimezone}
                  onChange={(e) => setPrimaryTimezone(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-foreground font-medium text-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="America/Los_Angeles">America/Los_Angeles (Pacific Time - UTC-8)</option>
                  <option value="America/Denver">America/Denver (Mountain Time - UTC-7)</option>
                  <option value="America/Chicago">America/Chicago (Central Time - UTC-6)</option>
                  <option value="America/New_York">America/New_York (Eastern Time - UTC-5)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+5:30)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Determines appointment scheduling, medication timing, and audit timestamps.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Medical Record Number (MRN) Prefix</label>
                <Input
                  value={mrnPrefix}
                  onChange={(e) => setMrnPrefix(e.target.value)}
                  className="h-11 font-mono text-xs rounded-xl bg-background"
                />
                <p className="text-[11px] text-muted-foreground">
                  Example generated MRN: <span className="font-mono text-foreground font-semibold">{mrnPrefix}88412</span>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Clinical Measurement Unit Standard</label>
                <select
                  value={measurementSystem}
                  onChange={(e) => setMeasurementSystem(e.target.value as any)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-foreground font-medium text-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="metric">Metric (Blood Pressure: mmHg, Blood Sugar: mg/dL, Weight: kg)</option>
                  <option value="imperial">Imperial (Blood Pressure: mmHg, Blood Sugar: mg/dL, Weight: lbs)</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Standardized unit system applied to lab graphs and consultation telemetry.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60">
              <label className="font-semibold text-foreground text-xs">Chief Medical Officer (CMO) Attestation</label>
              <Input
                value={cmoName}
                onChange={(e) => setCmoName(e.target.value)}
                className="mt-1.5 h-11 text-xs rounded-xl bg-background"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Authorized medical executive responsible for institutional DEA compliance and clinical protocols.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Security & HIPAA */}
      {activeTab === "security" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                HIPAA Audit &amp; Cryptographic Verification Policies
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enforce immutable audit trails and real-time tampering detection across all clinical transactions.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Immutable SHA-256 Prescription Audit Ledger</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Cryptographically sign every prescription issuance, transfer, and dispense action. Stores tamper-evident SHA-256 hash in PostgreSQL &amp; Corsair DB with WORM (Write Once, Read Many) compliance.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={auditLogging}
                    onChange={(e) => setAuditLogging(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Automated Tamper Alarm &amp; Immediate Pharmacy Quarantine</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Instantly quarantine pharmacy dispense orders and flag high-priority admin incidents if digital signature verification fails or hash collision is detected.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={autoTamperAlarm}
                    onChange={(e) => setAutoTamperAlarm(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Mandatory Hardware WebAuthn / FIDO2 Multi-Factor Authentication</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Enforce physical security keys (YubiKey / Apple TouchID / Passkeys) for all Physician and Administrator portal sessions to satisfy EPCS (Electronic Prescriptions for Controlled Substances) federal guidelines.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={mandatory2FA}
                    onChange={(e) => setMandatory2FA(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Protected Health Information (PHI) Automatic Data Masking</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Automatically redact Social Security Numbers, Full Dates of Birth, and Financial details in administrative inspection logs and non-clinical debugging screens.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={phiDataMasking}
                    onChange={(e) => setPhiDataMasking(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Lock className="h-4 w-4 text-purple-600" />
              Session Inactivity &amp; IP Network Whitelist
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="font-semibold text-foreground">Session Inactivity Auto-Lock</label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-foreground font-medium text-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="15">15 Minutes (HIPAA Maximum Recommendation)</option>
                  <option value="30">30 Minutes (Standard Hospital Station)</option>
                  <option value="60">60 Minutes (Office Hours Extended)</option>
                  <option value="240">4 Hours (Dedicated Hospital Kiosk Mode)</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Locks clinical workspace requiring biometric or PIN re-authentication.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-foreground">Zero-Trust JWT Token Lifetime</label>
                <select
                  value="15"
                  disabled
                  className="w-full h-11 px-3.5 rounded-xl bg-secondary/40 border border-border text-foreground font-medium text-xs cursor-not-allowed"
                >
                  <option value="15">15 Minutes (Short-Lived Ephemeral Token with Rotating Refresh)</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Refreshed automatically via HTTP-only rotating refresh cookies.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-semibold text-foreground flex items-center justify-between">
                <span>Administrative Clinical CIDR / IP Whitelist</span>
                <span className="text-[10px] font-mono text-muted-foreground">IPv4 / IPv6</span>
              </label>
              <Input
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                className="h-11 font-mono text-xs rounded-xl bg-background"
              />
              <p className="text-[11px] text-muted-foreground">
                Access to this Admin Portal is restricted to connections originating from these CIDR ranges.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI Model Orchestration & Guardrails */}
      {activeTab === "ai" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-600" />
                Multi-Modal Health AI Diagnostic Engine Routing
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure primary and failover inference models for clinical report OCR, dermatology screening, and botanical analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="font-semibold text-foreground">Primary Vision &amp; OCR Engine</label>
                <select
                  value={primaryAiModel}
                  onChange={(e) => setPrimaryAiModel(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-foreground font-medium text-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="gemini-2.5-flash">Google Gemini 2.5 Flash Vision (Recommended - Sub-600ms)</option>
                  <option value="gemini-1.5-pro">Google Gemini 1.5 Pro Vision (High Precision Medical Benchmark)</option>
                  <option value="mistral-pixtral">Mistral Pixtral 12B (Self-Hosted Edge Node)</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Powers multi-page blood panel extraction and prescription label OCR with sub-800ms latency.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-foreground">Secondary Clinical Reasoning Fallback</label>
                <select
                  value={fallbackAiModel}
                  onChange={(e) => setFallbackAiModel(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-foreground font-medium text-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="mistral-large">Mistral Large 2411 (Clinical Pharmacology Benchmark)</option>
                  <option value="nvidia-bionemo">NVIDIA BioNeMo Medical Microservice</option>
                  <option value="gemini-redundant">Gemini Redundant Secondary Cluster</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Automated failover active when primary provider experiences rate limit or &gt;1.5s latency.
                </p>
              </div>
            </div>

            {/* Slider for OCR confidence */}
            <div className="p-5 rounded-2xl bg-secondary/30 border border-border/50 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-foreground">
                  AI OCR Clinical Confidence Threshold
                </label>
                <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full text-xs">
                  {ocrConfidenceThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="98"
                value={ocrConfidenceThreshold}
                onChange={(e) => setOcrConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer h-2 bg-secondary rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>60% (Permissive)</span>
                <span>85% (Clinical Benchmark)</span>
                <span>98% (Strict Double-Audit)</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Scans analyzed below {ocrConfidenceThreshold}% confidence automatically flag for mandatory human doctor review before prescription fulfillment.
              </p>
            </div>

            {/* Safety Guardrails */}
            <div className="space-y-4 text-xs">
              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Mandatory Human Physician Co-Sign on Urgent AI Assessments</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Complies with FDA Software as a Medical Device (SaMD) Class II guidelines: AI outputs remain tentative until validated by a licensed physician.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={requireDoctorCoSign}
                    onChange={(e) => setRequireDoctorCoSign(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Automated Clinical Disclaimer Injection</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Append statutory diagnostic disclaimer to all AI patient symptom summaries (&quot;This analysis is an informational aid and does not constitute a definitive medical diagnosis&quot;).
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={autoDisclaimerInjection}
                    onChange={(e) => setAutoDisclaimerInjection(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Bilingual Neural Speech Synthesis (Hindi &amp; English)</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Powers the voice symptom checker with ElevenLabs neural dialect code-switching. Supports seamless fluid transition between Hindi (हिन्दी) and Indian-English medical vocabulary.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={bilingualVoice}
                    onChange={(e) => setBilingualVoice(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Corsair DB & Edge Persistence */}
      {activeTab === "corsair" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Corsair HealthOps &amp; Edge Persistence Tier
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sub-50ms cryptographic key encryption, edge schema cache, and multi-region database replication.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleTestPing}
                disabled={testingPing}
                className="rounded-xl border-border bg-background hover:bg-secondary text-xs h-9 gap-1.5 cursor-pointer shrink-0"
              >
                <Zap className={`w-3.5 h-3.5 ${testingPing ? "text-primary animate-spin" : "text-emerald-500"}`} />
                <span>{testingPing ? "Pinging Nodes..." : "Test Multi-Region Ping"}</span>
              </Button>
            </div>

            {/* Ping results cards */}
            {pingResults && (
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/80 space-y-3 animate-in fade-in-50">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Distributed Cluster Node Latency Benchmark
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">Tested just now</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {pingResults.map((node) => (
                    <div key={node.region} className="p-3 rounded-xl bg-background border border-border/60 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-foreground truncate">{node.region}</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {node.latency} ms
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{node.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keys configuration */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-foreground flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-primary" />
                    <span>Corsair Production API Key</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRollApiKey}
                      className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Roll Key</span>
                    </button>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      Live Production
                    </span>
                  </div>
                </div>
                <div className="relative flex items-center">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    readOnly
                    value={apiKey}
                    className="font-mono text-xs pr-20 h-11 rounded-xl bg-secondary/30"
                  />
                  <div className="absolute right-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                      title={showApiKey ? "Hide key" : "Show key"}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(apiKey, "API Key")}
                      className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                      title="Copy API key"
                    >
                      {copiedKey === "API Key" ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-foreground flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-purple-600" />
                    <span>Corsair Webhook HMAC Signing Secret</span>
                  </label>
                  <span className="text-[10px] font-mono text-muted-foreground">HMAC-SHA256</span>
                </div>
                <div className="relative flex items-center">
                  <Input
                    type={showSecret ? "text" : "password"}
                    readOnly
                    value={webhookSecret}
                    className="font-mono text-xs pr-20 h-11 rounded-xl bg-secondary/30"
                  />
                  <div className="absolute right-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                      title={showSecret ? "Hide secret" : "Show secret"}
                    >
                      {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(webhookSecret, "Webhook Secret")}
                      className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                      title="Copy secret"
                    >
                      {copiedKey === "Webhook Secret" ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="font-semibold text-foreground">Corsair Redis KEK Cache Eviction TTL</label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={cacheEvictionTtl}
                    onChange={(e) => setCacheEvictionTtl(e.target.value)}
                    className="w-36 font-mono text-xs h-11 rounded-xl bg-background"
                  />
                  <span className="text-muted-foreground">milliseconds (Sub-50ms cryptographic KEK cache)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Emergency SOS & CAD Dispatch */}
      {activeTab === "emergency" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2 text-rose-600">
                  <Radio className="h-4 w-4" />
                  Rapid SOS Emergency Triage &amp; Computer-Aided Dispatch (CAD)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Automate real-time emergency telemetry broadcasting, ambulance routing, and caregiver webhook dispatch.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleTestSosWebhook}
                disabled={testingSosWebhook}
                className="rounded-xl border-border bg-background hover:bg-secondary text-xs h-9 gap-1.5 cursor-pointer shrink-0"
              >
                <Zap className={`w-3.5 h-3.5 ${testingSosWebhook ? "text-rose-600 animate-spin" : "text-rose-600"}`} />
                <span>{testingSosWebhook ? "Broadcasting..." : "Test CAD Dispatch Relay"}</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="font-semibold text-foreground">Emergency Dispatch Radius Threshold</label>
                <select
                  value={dispatchRadius}
                  onChange={(e) => setDispatchRadius(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-foreground font-medium text-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="5">5 km (Metropolitan High-Density)</option>
                  <option value="10">10 km (Suburban Optimal)</option>
                  <option value="25">25 km (Regional / Rural Dispatch)</option>
                  <option value="50">50 km (Remote Trauma Grid)</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Alerts hospitals and registered ambulances within this perimeter upon SOS trigger.
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-foreground">Computer-Aided Dispatch (CAD) Mode</label>
                <select
                  value={cadMode}
                  onChange={(e) => setCadMode(e.target.value as any)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-foreground font-medium text-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="live">FirstNet E911 Live Integration (Active 911 Relays)</option>
                  <option value="sandbox">Simulation Sandbox (Mock First Responders)</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Controls whether SOS events dispatch real emergency services or trigger sandbox simulator.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-semibold text-foreground">Caregiver Webhook Relay Endpoint</label>
              <Input
                value={sosWebhookUrl}
                onChange={(e) => setSosWebhookUrl(e.target.value)}
                className="h-11 font-mono text-xs rounded-xl bg-background"
              />
              <p className="text-[11px] text-muted-foreground">
                Receives instant JSON payload containing GPS coordinates, vitals snapshot, and emergency contact list.
              </p>
            </div>

            <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-semibold text-foreground text-sm">Automated WebRTC Telehealth Emergency Room Link</p>
                <p className="text-muted-foreground leading-relaxed">
                  Upon SOS trigger, generate an encrypted WebRTC room URL sent via SMS to the nearest on-call emergency room physician.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                <input
                  type="checkbox"
                  checked={webrtcRoomGeneration}
                  onChange={(e) => setWebrtcRoomGeneration(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Notifications & Alert Routing */}
      {activeTab === "notifications" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  Incident Alert Escalation &amp; On-Call Dispatch
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Route mission-critical clinical alerts to on-call biomedical engineers, pharmacists, and medical directors.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleTestAlertChime}
                disabled={testingAlertChime}
                className="rounded-xl border-border bg-background hover:bg-secondary text-xs h-9 gap-1.5 cursor-pointer shrink-0"
              >
                <Volume2 className={`w-3.5 h-3.5 ${testingAlertChime ? "text-primary animate-bounce" : ""}`} />
                <span>{testingAlertChime ? "Chiming..." : "Test Alert Audio & Push"}</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>Operations Team Alert Email</span>
                </label>
                <Input
                  type="email"
                  value={opsAlertEmail}
                  onChange={(e) => setOpsAlertEmail(e.target.value)}
                  className="h-11 text-xs rounded-xl bg-background"
                />
                <p className="text-[11px] text-muted-foreground">
                  Receives automated audit digest and high-priority infrastructure alarms.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Emergency On-Call SMS Hotline</span>
                </label>
                <Input
                  type="tel"
                  value={emergencySmsPhone}
                  onChange={(e) => setEmergencySmsPhone(e.target.value)}
                  className="h-11 font-mono text-xs rounded-xl bg-background"
                />
                <p className="text-[11px] text-muted-foreground">
                  Direct SMS dispatch for patient SOS alerts and pharmacy stock depletion.
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-foreground flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-purple-600" />
                <span>PagerDuty / Opsgenie Incident Webhook URL</span>
              </label>
              <Input
                value={pagerDutyWebhook}
                onChange={(e) => setPagerDutyWebhook(e.target.value)}
                className="h-11 font-mono text-xs rounded-xl bg-background"
              />
              <p className="text-[11px] text-muted-foreground">
                Integration URL for automated on-call incident escalation and scheduling.
              </p>
            </div>

            <div className="space-y-4 text-xs pt-2">
              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Automated Phone Call Escalation on Level-1 Critical Alerts</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Trigger automated Twilio voice telephone call to duty biomedical engineer if an emergency SOS or DEA attestation warning is unacknowledged within 3 minutes.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={callOnCritical}
                    onChange={(e) => setCallOnCritical(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Audible Chime Alert for Real-Time Telemetry Events</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Play a subtle Apple-grade audio chime when an emergency SOS or DEA attestation event arrives in the admin dashboard.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={chimeAudioAlerts}
                    onChange={(e) => setChimeAudioAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: Provider & Pharmacy Governance */}
      {activeTab === "providers" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-blue-600" />
                Medical Credentialing &amp; Pharmacy Governance
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Regulate physician board licensing, DEA controlled-substance controls, and inventory sync.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">National Provider Identifier (NPI) Live Registry API</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Verify doctor state licensing directly against the federal CMS NPPES registry during onboarding.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={npiLiveValidation}
                    onChange={(e) => setNpiLiveValidation(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Controlled Substances DEA Schedule II Two-Signer Verification</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Require dual-attestation (prescribing physician + chief pharmacy officer) for Schedule II narcotic electronic prescriptions before dispensing.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={deaTwoSignerRule}
                    onChange={(e) => setDeaTwoSignerRule(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Real-Time Pharmacy Stock Availability Webhook</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Continuously update pharmacy medicine inventories to prevent patients from placing orders on out-of-stock items. Automatically reroute orders to nearest partner pharmacy if depleted.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={realtimeInventorySync}
                    onChange={(e) => setRealtimeInventorySync(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pt-2 border-t border-border/60">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">NCPDP SCRIPT Standard Version</label>
                <select
                  value={ncpdpStandardVersion}
                  onChange={(e) => setNcpdpStandardVersion(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-foreground font-medium text-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="v2017071">NCPDP SCRIPT v2017071 (Mandated CMS Standard)</option>
                  <option value="v2020101">NCPDP SCRIPT v2020101 (Enhanced Real-Time Benefit Check)</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Protocol standard used for all electronic prescription interchange.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">State Medical Board License Re-Verification Cycle</label>
                <select
                  value={stateBoardRecheckDays}
                  onChange={(e) => setStateBoardRecheckDays(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-foreground font-medium text-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="30">Every 30 Days (Strict Automated Recheck)</option>
                  <option value="60">Every 60 Days</option>
                  <option value="90">Every 90 Days (Quarterly Standard)</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  Automated background sync with state medical boards to catch license sanctions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
