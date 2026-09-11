"use client";

import * as React from "react";
import Link from "next/link";
import {
  Settings,
  User,
  Shield,
  Bell,
  Sparkles,
  Pill,
  Radio,
  Save,
  CheckCircle2,
  Lock,
  Download,
  Eye,
  Check,
  Smartphone,
  Mail,
  MapPin,
  Heart,
  FileText,
  Clock,
  RefreshCw,
  AlertCircle,
  Stethoscope,
  Store,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PatientSettingsTab =
  | "profile"
  | "privacy"
  | "ai"
  | "pharmacy"
  | "emergency"
  | "notifications";

export default function PatientSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<PatientSettingsTab>("profile");
  const [saved, setSaved] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Tab 1: Profile & Demographics
  const [fullName, setFullName] = React.useState("Jane Doe");
  const [email, setEmail] = React.useState("jane.doe@care360.health");
  const [phone, setPhone] = React.useState("+1 (650) 555-0192");
  const [dob, setDob] = React.useState("1992-06-15");
  const [gender, setGender] = React.useState("female");
  const [bloodType, setBloodType] = React.useState("O+");
  const [heightCm, setHeightCm] = React.useState("168");
  const [weightKg, setWeightKg] = React.useState("58");
  const [address, setAddress] = React.useState("450 Serra Mall, Stanford, CA 94305");

  // Tab 2: Privacy & HIPAA Consent
  const [ehrSharing, setEhrSharing] = React.useState(true);
  const [cryptographicSeal, setCryptographicSeal] = React.useState(true);
  const [biometricLock, setBiometricLock] = React.useState(true);
  const [phiMasking, setPhiMasking] = React.useState(true);

  // Tab 3: AI Care Preferences
  const [proactiveInsights, setProactiveInsights] = React.useState(true);
  const [voiceDialect, setVoiceDialect] = React.useState("bilingual");
  const [smartReminders, setSmartReminders] = React.useState(true);
  const [botanicalAutoSave, setBotanicalAutoSave] = React.useState(true);

  // Tab 4: Pharmacy & Prescriptions
  const [preferredPharmacy, setPreferredPharmacy] = React.useState("walgreens_4190");
  const [autoRefill, setAutoRefill] = React.useState(true);
  const [genericSubstitution, setGenericSubstitution] = React.useState(true);
  const [deliveryAddress, setDeliveryAddress] = React.useState("450 Serra Mall, Stanford, CA (Gate Code: #4910)");

  // Tab 5: Emergency SOS
  const [emergencyContactName, setEmergencyContactName] = React.useState("Elena Patel (Sister)");
  const [emergencyContactPhone, setEmergencyContactPhone] = React.useState("+1 (650) 555-0192");
  const [autoCadRelay, setAutoCadRelay] = React.useState(true);
  const [lockscreenMedicalId, setLockscreenMedicalId] = React.useState(true);
  const [allergies, setAllergies] = React.useState("Penicillin, Latex");
  const [chronicConditions, setChronicConditions] = React.useState("Type 2 Diabetes (Managed), Mild Hypertension");

  // Tab 6: Notifications & Channels
  const [notifPrescriptionPush, setNotifPrescriptionPush] = React.useState(true);
  const [notifAppointmentSms, setNotifAppointmentSms] = React.useState(true);
  const [notifWeeklyDigestEmail, setNotifWeeklyDigestEmail] = React.useState(true);
  const [notifChimes, setNotifChimes] = React.useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      showToast("Health preferences and profile saved successfully.");
      setTimeout(() => setSaved(false), 4000);
    }, 600);
  };

  const handleExportData = () => {
    const exportData = {
      patientProfile: { fullName, email, phone, dob, gender, bloodType, heightCm, weightKg, address },
      privacy: { ehrSharing, cryptographicSeal, biometricLock },
      aiCare: { proactiveInsights, voiceDialect, smartReminders },
      pharmacy: { preferredPharmacy, autoRefill, genericSubstitution, deliveryAddress },
      emergency: { emergencyContactName, emergencyContactPhone, allergies, chronicConditions, autoCadRelay },
      exportedAt: new Date().toISOString(),
      format: "HL7-FHIR-R4-Patient-Summary"
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `care360_health_profile_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Downloaded complete patient health record (JSON).");
  };

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8 pb-28 px-4 sm:px-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-50 rounded-2xl bg-foreground text-background px-4 py-3 text-xs font-semibold shadow-apple-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <Link
          href="/patient"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patient Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>MRN #C360-88412 • Primary MD: Dr. Ananya Sharma</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Account &amp; Health Settings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              Manage personal demographics, HIPAA data consent, AI copilot diagnostics, pharmacy refill rules, and SOS safety beacon.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="rounded-full text-xs font-semibold px-4 h-10 gap-1.5 cursor-pointer bg-background"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Record</span>
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-full text-xs font-semibold px-5 h-10 shadow-md gap-2 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Preferences</span>
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
              Your patient health profile &amp; security preferences have been updated.
            </span>
          </div>
          <span className="text-[10px] font-mono opacity-80">Saved at {new Date().toLocaleTimeString()}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-secondary/50 border border-border/80 overflow-x-auto text-xs">
        {[
          { id: "profile", label: "Profile & Vitals", icon: User },
          { id: "privacy", label: "Privacy & HIPAA", icon: Shield },
          { id: "ai", label: "AI Care & Voice", icon: Sparkles },
          { id: "pharmacy", label: "Pharmacy & Refills", icon: Pill },
          { id: "emergency", label: "SOS & Medical ID", icon: Radio },
          { id: "notifications", label: "Notification Channels", icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as PatientSettingsTab)}
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

      {/* TAB 1: Profile & Vitals */}
      {activeTab === "profile" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Personal Information &amp; Clinical Baseline
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Demographic and physiological parameters used for consultation matching and dosage calculations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Full Legal Name</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 text-xs rounded-xl bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Date of Birth</label>
                <Input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="h-11 text-xs rounded-xl bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Contact Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 text-xs rounded-xl bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Phone Number</label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 font-mono text-xs rounded-xl bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Blood Type</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-foreground font-medium text-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Height &amp; Weight</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      className="h-11 text-xs pr-10 rounded-xl bg-background"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">cm</span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      className="h-11 text-xs pr-10 rounded-xl bg-background"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px]">kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs pt-2 border-t border-border/60">
              <label className="font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Primary Residential Address (for Courier &amp; Home Visit Dispatch)</span>
              </label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-11 text-xs rounded-xl bg-background"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Privacy & HIPAA */}
      {activeTab === "privacy" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Medical Data Privacy &amp; HIPAA Consent
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Control who accesses your medical records, test results, and consultation history.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Connected Care EHR Interoperability</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Allow board-certified physicians and clinical specialists within the CARE360 network to review your past lab panels and visit summaries during consultations.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={ehrSharing}
                    onChange={(e) => setEhrSharing(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Cryptographic SHA-256 Health Seal</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Generate an immutable, tamper-evident cryptographic hash for all medical reports and prescriptions issued to your record.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={cryptographicSeal}
                    onChange={(e) => setCryptographicSeal(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Biometric Authentication Lock</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Require Touch ID, Face ID, or PIN re-authentication before displaying sensitive lab reports or downloading medical PDFs.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={biometricLock}
                    onChange={(e) => setBiometricLock(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI Care & Voice */}
      {activeTab === "ai" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                AI Health Copilot &amp; Speech Preferences
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customize how Gemini 2.5 Flash Vision and ElevenLabs voice models interact with your health journey.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Proactive AI Lab Biomarker Insights</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Allow the AI copilot to highlight trends between historical blood tests, vitals, and lifestyle metrics for your doctor.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={proactiveInsights}
                    onChange={(e) => setProactiveInsights(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50 space-y-2">
                <label className="font-semibold text-foreground text-sm">AI Voice Assistant Language &amp; Dialect</label>
                <select
                  value={voiceDialect}
                  onChange={(e) => setVoiceDialect(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-foreground font-medium text-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="bilingual">Bilingual Code-Switching (English + हिन्दी Hindi)</option>
                  <option value="english_us">English (US Medical Standard)</option>
                  <option value="english_uk">English (UK Clinical Standard)</option>
                  <option value="hindi_pure">हिन्दी (Hindi Native Medical Vocab)</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  The voice assistant will smoothly respond in your preferred language during symptom checks.
                </p>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Automatic Herbal &amp; Botanical Journaling</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Automatically index botanical leaf scans (e.g., Tulsi, Neem, Ashwagandha) into your herbal wellness history.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={botanicalAutoSave}
                    onChange={(e) => setBotanicalAutoSave(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Pharmacy & Prescriptions */}
      {activeTab === "pharmacy" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Pill className="h-4 w-4 text-amber-600" />
                Pharmacy Network &amp; Refill Preferences
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Set default dispensing pharmacy, automatic refill requests, and courier delivery preferences.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Default Network Pharmacy</label>
                <select
                  value={preferredPharmacy}
                  onChange={(e) => setPreferredPharmacy(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-foreground font-medium text-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="walgreens_4190">Walgreens Pharmacy #4190 (Palo Alto) • 0.8 mi • In-Network</option>
                  <option value="cvs_102">CVS Health #102 (Mountain View) • 2.1 mi • In-Network</option>
                  <option value="stanford_pharmacy">Stanford Hospital Outpatient Pharmacy • 1.4 mi</option>
                  <option value="kaiser_perm">Kaiser Permanente Pharmacy (Redwood City) • 4.5 mi</option>
                </select>
                <p className="text-[11px] text-muted-foreground">
                  New e-Prescriptions written by your doctor are routed directly to this pharmacy for verification.
                </p>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Automatic Refill Renewal Requests</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Automatically submit a refill renewal request to Dr. Sharma when your recurring chronic medication supply drops below 5 days.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={autoRefill}
                    onChange={(e) => setAutoRefill(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Prefer FDA Generic Equivalents</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Always dispense FDA-approved AB-rated generic bioequivalents to minimize co-pay costs.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={genericSubstitution}
                    onChange={(e) => setGenericSubstitution(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="font-semibold text-foreground">Courier Delivery Address &amp; Gate Code</label>
                <Input
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="h-11 text-xs rounded-xl bg-background"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Emergency SOS & Medical ID */}
      {activeTab === "emergency" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2 text-rose-600">
                <Radio className="h-4 w-4" />
                Rapid Emergency SOS &amp; Medical ID Beacon
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage emergency contacts, critical allergy disclosures, and paramedic telemetry broadcasting.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Primary Emergency Contact</label>
                <Input
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  className="h-11 text-xs rounded-xl bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Emergency Contact Phone</label>
                <Input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  className="h-11 font-mono text-xs rounded-xl bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Known Drug Allergies</label>
                <Input
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="h-11 text-xs rounded-xl bg-background"
                />
                <p className="text-[11px] text-muted-foreground">
                  Flagged during e-Prescription checks and transmitted to EMS paramedics.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Chronic Conditions</label>
                <Input
                  value={chronicConditions}
                  onChange={(e) => setChronicConditions(e.target.value)}
                  className="h-11 text-xs rounded-xl bg-background"
                />
              </div>
            </div>

            <div className="space-y-4 text-xs pt-2 border-t border-border/60">
              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Automated CAD E911 Live Telemetry Relay</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Upon triggering the red SOS button, broadcast live GPS coordinates, vitals snapshot, and blood type to local municipal emergency services.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={autoCadRelay}
                    onChange={(e) => setAutoCadRelay(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Lockscreen Emergency Medical ID Badge</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Display blood type, critical allergies, and emergency contact phone on your mobile device lock screen for first responder access.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={lockscreenMedicalId}
                    onChange={(e) => setLockscreenMedicalId(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Notification Channels */}
      {activeTab === "notifications" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Care Alert Channels &amp; Delivery Methods
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose how and when you receive prescription updates, appointment reminders, and lab alerts.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Pharmacy Dispense &amp; Courier Push Notifications</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Receive instant push alerts when your prescription is approved, packed, and out for courier delivery.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={notifPrescriptionPush}
                    onChange={(e) => setNotifPrescriptionPush(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Telehealth Consultation SMS Alerts</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Receive SMS reminder with encrypted WebRTC video link 1 hour and 15 minutes prior to scheduled visits.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={notifAppointmentSms}
                    onChange={(e) => setNotifAppointmentSms(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Weekly Health &amp; Lab Summary Email</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Receive a consolidated Monday morning email summary of vitals, adherence score, and pending lab reviews.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={notifWeeklyDigestEmail}
                    onChange={(e) => setNotifWeeklyDigestEmail(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-start justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">Subtle Audio Chimes on In-App Alerts</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Play a gentle chime when new prescriptions or chat messages arrive while using CARE360.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={notifChimes}
                    onChange={(e) => setNotifChimes(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
