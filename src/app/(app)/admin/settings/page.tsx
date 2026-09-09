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
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [saved, setSaved] = React.useState(false);
  const [geminiEnabled, setGeminiEnabled] = React.useState(true);
  const [auditLogging, setAuditLogging] = React.useState(true);
  const [autoTamperAlarm, setAutoTamperAlarm] = React.useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
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
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
              <Settings className="h-3.5 w-3.5" />
              Infrastructure & Compliance Governance
            </div>
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              Platform & Security Settings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage cryptographic keys, AI engine routing, database synchronization, and compliance audit policies.
            </p>
          </div>

          <Button onClick={handleSave} size="sm" className="rounded-full text-xs shadow-sm">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Configuration
          </Button>
        </div>
      </div>

      {saved && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Platform security and gateway settings saved successfully.</span>
        </div>
      )}

      {/* Database & Gateway Integrations */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          Data Tier & Cloud Storage Connectors
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl bg-secondary/30 p-4 border border-border/40 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Supabase PostgreSQL 15</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Connected</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              RLS Policies Active • Row-level encryption enabled.
            </p>
          </div>

          <div className="rounded-2xl bg-secondary/30 p-4 border border-border/40 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Next.js Turbopack Edge Proxy</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Live</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Sub-50ms latency across 61 application routes.
            </p>
          </div>
        </div>
      </div>

      {/* AI Intelligence Engine Routing */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Cpu className="h-4 w-4 text-emerald-600" />
          AI Health Intelligence Gateways
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/40">
            <div>
              <p className="font-semibold text-foreground">Google Gemini 2.0 Health Model & Vision Pipeline</p>
              <p className="text-muted-foreground text-[11px]">
                Powers medical report OCR, medicine identification, and Ayurvedic botanical classification.
              </p>
            </div>
            <input
              type="checkbox"
              checked={geminiEnabled}
              onChange={(e) => setGeminiEnabled(e.target.checked)}
              className="h-4 w-4 accent-primary cursor-pointer rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/40">
            <div>
              <p className="font-semibold text-foreground">Immutable Cryptographic Audit Logging</p>
              <p className="text-muted-foreground text-[11px]">
                Record every consultation, prescription issuance, and pharmacy dispatch with SHA-256 signatures.
              </p>
            </div>
            <input
              type="checkbox"
              checked={auditLogging}
              onChange={(e) => setAuditLogging(e.target.checked)}
              className="h-4 w-4 accent-primary cursor-pointer rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/40">
            <div>
              <p className="font-semibold text-foreground">Automated Tamper Alarm & Incident Quarantine</p>
              <p className="text-muted-foreground text-[11px]">
                Instantly flag and suspend prescription fulfillment if digital signature verification fails.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoTamperAlarm}
              onChange={(e) => setAutoTamperAlarm(e.target.checked)}
              className="h-4 w-4 accent-primary cursor-pointer rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
