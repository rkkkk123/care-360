"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  DollarSign,
  Calendar,
  CheckCircle2,
  Save,
  ArrowLeft,
  Video,
  Building,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorAvailabilityPage() {
  const [saved, setSaved] = React.useState(false);
  const [videoFee, setVideoFee] = React.useState("75");
  const [inPersonFee, setInPersonFee] = React.useState("120");

  const [schedule, setSchedule] = React.useState([
    { day: "Monday", enabled: true, start: "09:00", end: "17:00", slotsCount: 8 },
    { day: "Tuesday", enabled: true, start: "09:00", end: "17:00", slotsCount: 8 },
    { day: "Wednesday", enabled: true, start: "09:00", end: "17:00", slotsCount: 8 },
    { day: "Thursday", enabled: true, start: "09:00", end: "17:00", slotsCount: 8 },
    { day: "Friday", enabled: true, start: "09:00", end: "15:00", slotsCount: 6 },
    { day: "Saturday", enabled: false, start: "10:00", end: "14:00", slotsCount: 0 },
    { day: "Sunday", enabled: false, start: "10:00", end: "14:00", slotsCount: 0 },
  ]);

  const toggleDay = (idx: number) => {
    setSchedule((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, enabled: !item.enabled } : item))
    );
  };

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div>
        <Link
          href="/doctor"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-light tracking-tight text-foreground">
          Availability & Consultation Fees
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure clinical telehealth slots, in-person practice hours, and service charges.
        </p>
      </div>

      {saved && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Availability schedule and clinical fees updated across CARE360 discovery.</span>
        </div>
      )}

      {/* Consultation Pricing Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-base font-semibold text-foreground">Consultation Fee Schedule</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl bg-secondary/30 p-5 border border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <Video className="h-4 w-4 text-primary" />
                Telehealth Video Consultation
              </span>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                Default
              </span>
            </div>
            <p className="text-muted-foreground">30-minute encrypted WebRTC video session with AI Copilot notes.</p>
            <div className="relative w-36">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">$</span>
              <input
                type="number"
                value={videoFee}
                onChange={(e) => setVideoFee(e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-border bg-card font-mono font-bold text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-secondary/30 p-5 border border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <Building className="h-4 w-4 text-emerald-500" />
                In-Clinic Physical Visit
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                Clinic
              </span>
            </div>
            <p className="text-muted-foreground">Comprehensive in-person physical assessment and lab review.</p>
            <div className="relative w-36">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">$</span>
              <input
                type="number"
                value={inPersonFee}
                onChange={(e) => setInPersonFee(e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-border bg-card font-mono font-bold text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Matrix */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-base font-semibold text-foreground">Weekly Practice Hours</h3>
            <p className="text-xs text-muted-foreground">Patients can only book active and open appointment slots.</p>
          </div>
          <span className="text-xs font-mono text-muted-foreground">Pacific Time (PT)</span>
        </div>

        <div className="divide-y divide-border/60 text-xs">
          {schedule.map((item, idx) => (
            <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-36">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => toggleDay(idx)}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <span className={`font-medium ${item.enabled ? "text-foreground" : "text-muted-foreground line-through"}`}>
                  {item.day}
                </span>
              </div>

              {item.enabled ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    defaultValue={item.start}
                    className="rounded-xl border border-border bg-card px-2.5 py-1.5 text-foreground font-mono"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="time"
                    defaultValue={item.end}
                    className="rounded-xl border border-border bg-card px-2.5 py-1.5 text-foreground font-mono"
                  />
                  <span className="text-[11px] text-muted-foreground pl-2">
                    ({item.slotsCount} slots available)
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground text-xs italic">Unavailable for booking</span>
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <Button
            size="sm"
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 3000);
            }}
            className="rounded-full text-xs bg-primary shadow-md shadow-primary/20"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Schedule & Fees
          </Button>
        </div>
      </div>
    </div>
  );
}
