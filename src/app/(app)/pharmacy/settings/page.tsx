"use client";

import * as React from "react";
import Link from "next/link";
import {
  Settings,
  Store,
  Truck,
  Printer,
  Bell,
  Save,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PharmacySettingsPage() {
  const [saved, setSaved] = React.useState(false);
  const [autoAcceptRefills, setAutoAcceptRefills] = React.useState(true);
  const [courierDispatch, setCourierDispatch] = React.useState(true);
  const [smsReadyAlerts, setSmsReadyAlerts] = React.useState(true);
  const [dispatchRadius, setDispatchRadius] = React.useState("10");

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
            Pharmacy Systems & Fulfillment Parameters
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Pharmacy Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure dispensing label printers, delivery radius, automated verification, and operating limits.
          </p>
        </div>

        <Button onClick={handleSave} size="sm" className="rounded-full text-xs shadow-sm">
          <Save className="h-3.5 w-3.5 mr-1.5" />
          Save Configuration
        </Button>
      </div>

      {saved && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Pharmacy operating parameters updated successfully.</span>
        </div>
      )}

      {/* Courier & Delivery Settings */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary" />
          Local Delivery & Courier Dispatch Hub
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/40">
            <div>
              <p className="font-semibold text-foreground">Enable Same-Day On-Demand Courier</p>
              <p className="text-muted-foreground text-[11px]">
                Accept instant courier pickup and delivery within your active geo-fence radius.
              </p>
            </div>
            <input
              type="checkbox"
              checked={courierDispatch}
              onChange={(e) => setCourierDispatch(e.target.checked)}
              className="h-4 w-4 accent-primary cursor-pointer rounded"
            />
          </div>

          <div className="p-3 rounded-2xl bg-secondary/30 border border-border/40 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">Active Dispatch Radius</span>
              <span className="font-mono font-bold text-primary">{dispatchRadius} Miles</span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={dispatchRadius}
              onChange={(e) => setDispatchRadius(e.target.value)}
              className="w-full accent-primary cursor-pointer"
            />
            <p className="text-[11px] text-muted-foreground">
              Covers Palo Alto, Menlo Park, Mountain View, and Stanford campus communities.
            </p>
          </div>
        </div>
      </div>

      {/* Dispensing Automation & Workflow */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Store className="h-4 w-4 text-emerald-600" />
          Automated Dispensing & Verification Rules
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/40">
            <div>
              <p className="font-semibold text-foreground">Auto-Accept Pre-Verified In-Stock e-Rx</p>
              <p className="text-muted-foreground text-[11px]">
                Instantly move electronic prescriptions with 100% catalog stock match into the dispensing queue.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoAcceptRefills}
              onChange={(e) => setAutoAcceptRefills(e.target.checked)}
              className="h-4 w-4 accent-primary cursor-pointer rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border/40">
            <div>
              <p className="font-semibold text-foreground">Automatic SMS Alert to Patient When Ready</p>
              <p className="text-muted-foreground text-[11px]">
                Notify patients with a pickup code the second the pharmacist tags the package as &ldquo;Ready for Pickup&rdquo;.
              </p>
            </div>
            <input
              type="checkbox"
              checked={smsReadyAlerts}
              onChange={(e) => setSmsReadyAlerts(e.target.checked)}
              className="h-4 w-4 accent-primary cursor-pointer rounded"
            />
          </div>
        </div>
      </div>

      {/* Hardware & Printer Integration */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Printer className="h-4 w-4 text-blue-600" />
          Hardware & Prescription Label Thermal Printers
        </h3>

        <div className="rounded-2xl bg-secondary/30 p-4 border border-border/40 text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground">Primary Vial Label Printer:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">Zebra ZD410 (Online)</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Automatically prints FDA-compliant auxiliary cautionary labels and bilingual dosage instructions.
          </p>
        </div>
      </div>
    </div>
  );
}
