"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  Pill,
  Calendar,
  FileText,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Clock,
  Trash2,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Heart,
  ChevronRight,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientNotification {
  id: string;
  category: "prescription" | "appointment" | "report" | "emergency" | "wellness";
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  actionUrl: string;
  actionLabel: string;
  badge?: string;
}

const INITIAL_NOTIFICATIONS: PatientNotification[] = [
  {
    id: "notif-rx-101",
    category: "prescription",
    title: "Prescription Ready for Courier Dispatch or Pickup",
    message: "Walgreens Pharmacy #4190 (Palo Alto) has prepared your prescription for Metformin 500mg ER (60 Tablets). Courier delivery available in 45 mins or pickup until 9:00 PM.",
    timestamp: "12 mins ago",
    unread: true,
    actionUrl: "/patient/prescriptions",
    actionLabel: "Track Order & Delivery",
    badge: "Pharmacy Update"
  },
  {
    id: "notif-appt-204",
    category: "appointment",
    title: "Virtual Consultation in 2 Hours",
    message: "Your upcoming Telehealth appointment with Dr. Ananya Sharma, MD (Internal Medicine) is scheduled for today at 2:30 PM PST. Pre-consultation AI vitals summary is ready for doctor review.",
    timestamp: "1 hour ago",
    unread: true,
    actionUrl: "/patient/appointments",
    actionLabel: "Join Waiting Room",
    badge: "Upcoming Visit"
  },
  {
    id: "notif-rep-309",
    category: "report",
    title: "New Lab Results Processed by AI",
    message: "CityPath Diagnostics released your Comprehensive Metabolic Panel (CMP-14). Gemini 2.5 Flash Vision parsed 14 biomarkers. All electrolytes nominal; Fasting Glucose noted at 108 mg/dL.",
    timestamp: "3 hours ago",
    unread: true,
    actionUrl: "/patient/reports/rep_1",
    actionLabel: "View AI Analysis",
    badge: "Lab Report"
  },
  {
    id: "notif-med-412",
    category: "prescription",
    title: "Medication Adherence Check-in",
    message: "Time for your afternoon scheduled dose: Atorvastatin 20mg Tablet (Lipid Management). Tap to log adherence into your health timeline.",
    timestamp: "5 hours ago",
    unread: false,
    actionUrl: "/patient/health",
    actionLabel: "Log Dose Taken",
    badge: "Med Reminder"
  },
  {
    id: "notif-sos-501",
    category: "emergency",
    title: "Emergency Medical ID & Caregiver Linked",
    message: "Your designated emergency contact Elena Patel (+1 650-555-0192) confirmed SMS relay permissions. In the event of SOS, live GPS & blood type telemetry will be relayed.",
    timestamp: "Yesterday",
    unread: false,
    actionUrl: "/patient/emergency",
    actionLabel: "Review Emergency Card",
    badge: "Safety Beacon"
  },
  {
    id: "notif-scan-608",
    category: "wellness",
    title: "AI Botanical Scan Saved to Journal",
    message: "Your recent botanical leaf scan of Holy Basil (Ocimum tenuiflorum / Tulsi) was verified with 99.2% confidence. Anti-inflammatory and adaptogenic properties added to your wellness insights.",
    timestamp: "2 days ago",
    unread: false,
    actionUrl: "/patient/ai/scanner",
    actionLabel: "Open AI Scanner",
    badge: "Ayurveda Vision"
  }
];

export default function PatientNotificationsPage() {
  const [notifications, setNotifications] = React.useState<PatientNotification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = React.useState<string>("all");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filtered = notifications.filter((item) => {
    if (filter === "all") return true;
    return item.category === filter;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast("All notifications marked as read.");
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showToast("Notification removed.");
  };

  const simulateNewNotification = () => {
    const freshNotifs: PatientNotification[] = [
      {
        id: `notif-sim-${Date.now()}`,
        category: "prescription",
        title: "e-Prescription Dispatched to Walgreens",
        message: "Dr. Ananya Sharma renewed your e-Rx #RX-8941 for Lisinopril 10mg with 3 refills. Cryptographic SHA-256 seal verified.",
        timestamp: "Just now",
        unread: true,
        actionUrl: "/patient/prescriptions",
        actionLabel: "View Prescription",
        badge: "New e-Rx"
      },
      {
        id: `notif-sim-${Date.now()}`,
        category: "wellness",
        title: "Vitals Synchronized from HealthKit",
        message: "Resting Heart Rate (68 bpm) and Sleep (7.8 hrs) synced. Your weekly cardio recovery score improved by 8%.",
        timestamp: "Just now",
        unread: true,
        actionUrl: "/patient/health",
        actionLabel: "View Health Trends",
        badge: "Wearable Sync"
      }
    ];

    const pick = freshNotifs[Math.floor(Math.random() * freshNotifs.length)];
    setNotifications((prev) => [pick, ...prev]);
    showToast("Simulated a new incoming care notification!");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "prescription":
        return (
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
            <Pill className="w-5 h-5" />
          </div>
        );
      case "appointment":
        return (
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        );
      case "report":
        return (
          <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 border border-blue-500/20 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        );
      case "emergency":
        return (
          <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20 shrink-0">
            <AlertCircle className="w-5 h-5 animate-pulse" />
          </div>
        );
      default:
        return (
          <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 border border-purple-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-6 pb-24 px-4 sm:px-6">
      {/* Toast message */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-50 rounded-2xl bg-foreground text-background px-4 py-3 text-xs font-semibold shadow-apple-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-Time Patient Care Feed</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Care Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Prescription dispatches, upcoming consultations, lab results, and medication reminders.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={simulateNewNotification}
            className="rounded-full text-xs font-semibold gap-1.5 cursor-pointer bg-background"
          >
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>Simulate Alert</span>
          </Button>

          {unreadCount > 0 && (
            <Button
              size="sm"
              onClick={markAllAsRead}
              className="rounded-full text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Mark All Read</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-secondary/40 border border-border/80 overflow-x-auto text-xs">
        {[
          { id: "all", label: `All (${notifications.length})` },
          { id: "prescription", label: "Prescriptions" },
          { id: "appointment", label: "Appointments" },
          { id: "report", label: "Lab Reports" },
          { id: "wellness", label: "Wellness & AI" },
          { id: "emergency", label: "Emergency SOS" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap text-xs ${
              filter === tab.id
                ? "bg-background text-foreground shadow-xs border border-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="rounded-3xl border border-border bg-card shadow-apple-sm overflow-hidden divide-y divide-border/60">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground space-y-2">
            <Check className="w-10 h-10 text-emerald-500 mx-auto stroke-[1.5]" />
            <p className="font-semibold text-foreground text-sm">All caught up!</p>
            <p className="text-xs">No notifications in category &quot;{filter}&quot; at this time.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 transition-colors relative hover:bg-secondary/30 flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                item.unread ? "bg-primary/[0.02]" : ""
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {getCategoryIcon(item.category)}

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.badge && (
                      <span className="text-[10px] font-semibold bg-secondary border border-border/80 px-2 py-0.5 rounded-full text-foreground">
                        {item.badge}
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-muted-foreground/80 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.timestamp}</span>
                    </span>
                    {item.unread && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-foreground tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0">
                <Button
                  size="sm"
                  className="rounded-full text-xs h-8 px-4 font-semibold shrink-0 cursor-pointer gap-1"
                  asChild
                >
                  <Link
                    href={item.actionUrl}
                    onClick={() => markAsRead(item.id)}
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>

                <div className="flex items-center gap-2">
                  {item.unread && (
                    <button
                      type="button"
                      onClick={() => markAsRead(item.id)}
                      className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
                    >
                      Mark read
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteNotification(item.id)}
                    title="Dismiss notification"
                    className="text-muted-foreground hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-secondary cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
