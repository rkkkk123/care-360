"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  Pill,
  Video,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationItem {
  id: string;
  type: "consultation" | "prescription" | "urgent";
  title: string;
  description: string;
  time: string;
  read: boolean;
  linkHref?: string;
  actionText?: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "consultation",
    title: "Upcoming Video Telehealth Session",
    description: "Jane Doe has joined the waiting room for her 10:00 AM Metabolic Follow-up.",
    time: "10 mins ago",
    read: false,
    linkHref: "/doctor/consultation/apt-1",
    actionText: "Enter Room",
  },
  {
    id: "notif-2",
    type: "prescription",
    title: "Prescription Dispense Confirmed",
    description: "Walgreens Palo Alto successfully dispensed Metformin 500mg (Rx #RX-2026-9041).",
    time: "1 hour ago",
    read: false,
    linkHref: "/doctor/prescriptions/rx-1",
    actionText: "View e-Rx",
  },
  {
    id: "notif-3",
    type: "urgent",
    title: "Critical Lab Biomarker Flag",
    description: "Robert Chen uploaded a comprehensive metabolic panel with elevated AST/ALT.",
    time: "3 hours ago",
    read: true,
    linkHref: "/doctor/patients",
    actionText: "Review Patient",
  },
  {
    id: "notif-4",
    type: "consultation",
    title: "New Appointment Booked",
    description: "Maria Gonzalez scheduled a Follow-up Consultation for tomorrow at 2:30 PM.",
    time: "Yesterday",
    read: true,
    linkHref: "/doctor/appointments",
    actionText: "View Schedule",
  },
];

export default function DoctorNotificationsPage() {
  const [notifications, setNotifications] = React.useState(mockNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <Bell className="h-3.5 w-3.5" />
            Clinical Alerts & Telehealth Dispatch
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Doctor Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time consultation triggers, pharmacy fulfillment updates, and patient alert signals.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={markAllRead} className="rounded-full text-xs">
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-3xl border p-5 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              !n.read
                ? "bg-card border-primary/30 ring-1 ring-primary/10"
                : "bg-card/60 border-border opacity-85"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  n.type === "urgent"
                    ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                    : n.type === "prescription"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-primary/10 text-primary border border-primary/20"
                }`}
              >
                {n.type === "urgent" ? (
                  <AlertCircle className="h-5 w-5" />
                ) : n.type === "prescription" ? (
                  <Pill className="h-5 w-5" />
                ) : (
                  <Video className="h-5 w-5" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-foreground">{n.title}</h4>
                  {!n.read && (
                    <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{n.description}</p>
                <p className="text-[10px] text-muted-foreground/70">{n.time}</p>
              </div>
            </div>

            {n.linkHref && (
              <Button size="sm" variant="outline" className="rounded-full text-xs shrink-0 self-end sm:self-center" asChild>
                <Link href={n.linkHref}>
                  {n.actionText}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
