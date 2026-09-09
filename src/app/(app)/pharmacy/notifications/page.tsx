"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Package,
  Pill,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PharmacyNotif {
  id: string;
  type: "order" | "stock" | "compliance";
  title: string;
  description: string;
  time: string;
  read: boolean;
  linkHref?: string;
  actionText?: string;
}

const mockNotifs: PharmacyNotif[] = [
  {
    id: "notif-1",
    type: "order",
    title: "New e-Prescription Fulfillment Order",
    description: "Order #ORD-8921 received for Jane Doe (Metformin 500mg, Lisinopril 10mg) with Courier Delivery.",
    time: "5 mins ago",
    read: false,
    linkHref: "/pharmacy/orders",
    actionText: "View Order Queue",
  },
  {
    id: "notif-2",
    type: "stock",
    title: "Low Inventory Level Alert",
    description: "Amoxicillin 500mg Capsules has reached reorder threshold (12 units remaining).",
    time: "45 mins ago",
    read: false,
    linkHref: "/pharmacy/inventory",
    actionText: "Update Stock",
  },
  {
    id: "notif-3",
    type: "compliance",
    title: "Quarterly DEA Audit Log Synced",
    description: "Electronic Schedule II-V dispensing audit records successfully mirrored to California Board.",
    time: "Yesterday",
    read: true,
  },
];

export default function PharmacyNotificationsPage() {
  const [notifications, setNotifications] = React.useState(mockNotifs);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <Bell className="h-3.5 w-3.5" />
            Dispensing Alerts & e-Rx Queue Dispatch
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Pharmacy Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Prescription routing alerts, stock threshold warnings, and courier status events.
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
                  n.type === "stock"
                    ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                    : n.type === "compliance"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-primary/10 text-primary border border-primary/20"
                }`}
              >
                {n.type === "stock" ? (
                  <AlertCircle className="h-5 w-5" />
                ) : n.type === "compliance" ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Package className="h-5 w-5" />
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
