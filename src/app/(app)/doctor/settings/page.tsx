"use client";

import * as React from "react";
import Link from "next/link";
import {
  Settings,
  ShieldCheck,
  Video,
  Bell,
  Pill,
  Save,
  CheckCircle2,
  Lock,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorSettingsPage() {
  const [saved, setSaved] = React.useState(false);
  const [autoAdmit, setAutoAdmit] = React.useState(true);
  const [smsAlerts, setSmsAlerts] = React.useState(true);
  const [copilotAssist, setCopilotAssist] = React.useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <Settings className="h-3.5 w-3.5" />
            Clinical Practice Configuration
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Doctor Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your virtual consultation room, AI copilot preferences, e-Prescription keys, and clinical notifications.
          </p>
        </div>

        <Button onClick={handleSave} size="sm" className="rounded-full text-xs shadow-sm">
          <Save className="h-3.5 w-3.5 mr-1.5" />
          Save Preferences
        </Button>
      </div>

      {saved && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Practice settings and clinical preferences updated successfully.</span>
        </div>
      )}

      {/* Provider Profile Summary */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Dr. Priya Sharma, MD</h3>
              <p className="text-xs text-muted-foreground">Cardiology & Internal Medicine • Stanford Health Care</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-3 py-1 text-xs font-semibold border border-emerald-500/20">
            NPI: 1948201948
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl bg-secondary/30 p-4 border border-border/40 space-y-1">
            <span className="text-muted-foreground">Medical Board License</span>
            <p className="font-semibold text-foreground">CA-MED-928410 (Active)</p>
          </div>
          <div className="rounded-2xl bg-secondary/30 p-4 border border-border/40 space-y-1">
            <span className="text-muted-foreground">DEA Registration Schedule</span>
            <p className="font-semibold text-foreground">Schedule II - V Authorized</p>
          </div>
        </div>
      </div>

      {/* Telehealth & AI Copilot Settings */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Video className="h-4 w-4 text-primary" />
          Virtual Consultation & Clinical AI Copilot
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/40">
            <div>
              <p className="font-semibold text-foreground">In-Consultation Gemini Clinical Copilot</p>
              <p className="text-muted-foreground text-[11px]">
                Suggest real-time differential diagnoses, ICD-10 codes, and drug-drug interactions during video calls.
              </p>
            </div>
            <input
              type="checkbox"
              checked={copilotAssist}
              onChange={(e) => setCopilotAssist(e.target.checked)}
              className="h-4 w-4 accent-primary cursor-pointer rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/40">
            <div>
              <p className="font-semibold text-foreground">Automatic Patient Waiting Room Admission</p>
              <p className="text-muted-foreground text-[11px]">
                Admit verified scheduled patients automatically when their appointment time starts.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoAdmit}
              onChange={(e) => setAutoAdmit(e.target.checked)}
              className="h-4 w-4 accent-primary cursor-pointer rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/40">
            <div>
              <p className="font-semibold text-foreground">Urgent SMS Alerts for Waiting Patients</p>
              <p className="text-muted-foreground text-[11px]">
                Receive SMS dispatch when a patient arrives in the waiting room more than 5 minutes early.
              </p>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="h-4 w-4 accent-primary cursor-pointer rounded"
            />
          </div>
        </div>
      </div>

      {/* e-Prescription & Security Settings */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Lock className="h-4 w-4 text-emerald-600" />
          Cryptographic Signature & SCRIPT e-Rx Protocol
        </h3>
        <p className="text-xs text-muted-foreground">
          All digital prescriptions issued through CARE360 are sealed with SHA-256 tamper-evident digital hashes and transmitted directly to NCPDP SCRIPT-compliant pharmacies.
        </p>

        <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 text-xs space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>Digital Certificate Valid & Active</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Certificate ID: cert_ca_99182_sharma • Expires Dec 2027
          </p>
        </div>
      </div>
    </div>
  );
}
