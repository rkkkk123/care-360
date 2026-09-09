"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Shield,
  Stethoscope,
  Store,
  User,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "pharmacy" | "admin";
  joinedDate: string;
  status: "active" | "pending" | "suspended";
  lastActive: string;
}

const initialUsers: UserRecord[] = [
  {
    id: "usr-1",
    name: "Jane Doe",
    email: "patient@care360.health",
    role: "patient",
    joinedDate: "Feb 10, 2026",
    status: "active",
    lastActive: "10 mins ago",
  },
  {
    id: "usr-2",
    name: "Dr. Priya Sharma, MD",
    email: "doctor@care360.health",
    role: "doctor",
    joinedDate: "Jan 15, 2026",
    status: "active",
    lastActive: "1 hour ago",
  },
  {
    id: "usr-3",
    name: "Central Pharmacy (Walgreens #4190)",
    email: "pharmacy@care360.health",
    role: "pharmacy",
    joinedDate: "Jan 22, 2026",
    status: "active",
    lastActive: "25 mins ago",
  },
  {
    id: "usr-4",
    name: "Roshan (Platform Admin)",
    email: "admin@care360.health",
    role: "admin",
    joinedDate: "Jan 01, 2026",
    status: "active",
    lastActive: "Just now",
  },
  {
    id: "usr-5",
    name: "Dr. Marcus Vance, MD",
    email: "marcus.vance@stanfordhealth.org",
    role: "doctor",
    joinedDate: "Yesterday",
    status: "pending",
    lastActive: "2 hours ago",
  },
  {
    id: "usr-6",
    name: "Community Care Wellness Pharmacy",
    email: "dispensing@communitycare.org",
    role: "pharmacy",
    joinedDate: "3 days ago",
    status: "pending",
    lastActive: "5 hours ago",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<UserRecord[]>(initialUsers);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "active" ? "suspended" : "active";
          setFeedback(`User ${u.name} status updated to ${nextStatus}.`);
          setTimeout(() => setFeedback(null), 3000);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
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
              <Users className="h-3.5 w-3.5" />
              Ecosystem Identity & Access Directory
            </div>
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              Platform User Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Govern multi-role accounts across Patients, Licensed Physicians, Dispensing Pharmacies, and System Administrators.
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

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users by name, email, or identifier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "patient", "doctor", "pharmacy", "admin"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-all ${
                roleFilter === role
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground border border-border/50"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-secondary/30 text-muted-foreground uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4 sm:px-6">User / Account</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Last Activity</th>
                <th className="p-4 text-right sm:pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{u.name}</p>
                        <p className="text-[11px] text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                        u.role === "admin"
                          ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                          : u.role === "doctor"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : u.role === "pharmacy"
                          ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                          : "bg-primary/10 text-primary border border-primary/20"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        u.status === "active"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : u.status === "pending"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-rose-500/10 text-rose-600"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="p-4 text-muted-foreground">{u.joinedDate}</td>
                  <td className="p-4 text-muted-foreground">{u.lastActive}</td>

                  <td className="p-4 text-right sm:pr-6">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStatus(u.id)}
                      className={`rounded-full text-[11px] h-7 px-3 ${
                        u.status === "active"
                          ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                          : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                      }`}
                    >
                      {u.status === "active" ? "Suspend" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
