"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertCircle,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Search,
  Filter,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComplaintItem {
  id: string;
  ticketNumber: string;
  submitterName: string;
  submitterRole: "Patient" | "Doctor" | "Pharmacy";
  category: "Prescription Delivery" | "Telehealth Quality" | "Billing / Insurance" | "Home Visit";
  description: string;
  severity: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
}

const initialComplaints: ComplaintItem[] = [
  {
    id: "comp-1",
    ticketNumber: "TKT-2026-0418",
    submitterName: "Jane Doe",
    submitterRole: "Patient",
    category: "Prescription Delivery",
    description:
      "Courier delivery took 50 minutes instead of the estimated 30 minutes due to heavy rain in Palo Alto. Pharmacy verified seal was intact.",
    severity: "Low",
    status: "Resolved",
    createdAt: "Yesterday, 03:20 PM",
  },
  {
    id: "comp-2",
    ticketNumber: "TKT-2026-0422",
    submitterName: "Dr. Marcus Vance, MD",
    submitterRole: "Doctor",
    category: "Telehealth Quality",
    description:
      "Patient reported microphone distortion during the first 2 minutes of the WebRTC video session before reconnecting successfully.",
    severity: "Medium",
    status: "In Progress",
    createdAt: "Today, 11:15 AM",
  },
  {
    id: "comp-3",
    ticketNumber: "TKT-2026-0429",
    submitterName: "Robert Chen",
    submitterRole: "Patient",
    category: "Home Visit",
    description:
      "Request to reschedule Phlebotomist home visit from Wednesday 9:00 AM to Thursday 10:30 AM for routine fasting lipid panel.",
    severity: "Low",
    status: "Open",
    createdAt: "Today, 01:45 PM",
  },
];

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = React.useState<ComplaintItem[]>(initialComplaints);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const resolveTicket = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Resolved" } : c))
    );
    setFeedback("Ticket marked as Resolved and patient notified.");
    setTimeout(() => setFeedback(null), 3000);
  };

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.submitterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
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
              <ShieldAlert className="h-3.5 w-3.5" />
              Patient Advocacy & Dispute Resolution
            </div>
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              Support Complaints & Issue Tracking
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Audit reported clinical service incidents, pharmacy dispatch concerns, and telehealth quality inquiries.
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tickets by ID, submitter, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "open", "in progress", "resolved"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-all ${
                filterStatus === status
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground border border-border/50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((ticket) => (
          <div
            key={ticket.id}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">{ticket.ticketNumber}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    ticket.severity === "High"
                      ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                      : ticket.severity === "Medium"
                      ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                  }`}
                >
                  {ticket.severity} Priority
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    ticket.status === "Resolved"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : ticket.status === "In Progress"
                      ? "bg-blue-500/10 text-blue-600"
                      : "bg-amber-500/10 text-amber-600"
                  }`}
                >
                  {ticket.status}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">{ticket.createdAt}</span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  {ticket.category} • Submitted by {ticket.submitterName} ({ticket.submitterRole})
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {ticket.description}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center justify-end gap-2 border-t lg:border-t-0 pt-4 lg:pt-0">
              {ticket.status !== "Resolved" ? (
                <Button
                  size="sm"
                  onClick={() => resolveTicket(ticket.id)}
                  className="w-full rounded-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  Mark Resolved
                </Button>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Resolved & Archived
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
