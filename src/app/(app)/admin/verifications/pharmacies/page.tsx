"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Store,
  RefreshCw,
  Search,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pharmacy } from "@/types/models/pharmacy";

export default function AdminPharmacyVerificationsPage() {
  const [pharmacies, setPharmacies] = React.useState<Pharmacy[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const loadPharmacies = async () => {
    try {
      const res = await fetch("/api/admin/verifications/pharmacies");
      if (res.ok) {
        const data = await res.json();
        setPharmacies(data.pharmacies || []);
      }
    } catch (err) {
      console.error("Failed to load pharmacies:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPharmacies();
  }, []);

  const handleUpdateStatus = async (pharmacyId: string, status: "verified" | "rejected" | "suspended") => {
    setUpdating(pharmacyId);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/verifications/pharmacies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pharmacyId, status }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`Pharmacy status updated to "${status}".`);
        setTimeout(() => setSuccessMsg(null), 3000);
        await loadPharmacies();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            CARE360 Platform Governance
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Pharmacy Network Verification
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review state regulatory board licenses, NABP credentials, and grant dispensing authorization.
          </p>
        </div>

        <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={loadPharmacies}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Refresh Registry
        </Button>
      </div>

      {successMsg && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Pharmacies Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading pharmacy verification records...</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-4 px-6">Pharmacy & Address</th>
                  <th className="py-4 px-4">State License</th>
                  <th className="py-4 px-4">NABP ID</th>
                  <th className="py-4 px-4">Services</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pharmacies.map((pharm) => (
                  <tr key={pharm.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-foreground text-sm">{pharm.name}</p>
                        <p className="text-muted-foreground text-[11px]">
                          {pharm.address.street}, {pharm.address.city}, {pharm.address.state} {pharm.address.zip}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-medium text-foreground">
                      {pharm.licenseNumber}
                    </td>

                    <td className="py-4 px-4 font-mono text-muted-foreground">
                      {pharm.nabpNumber}
                    </td>

                    <td className="py-4 px-4 text-[11px] text-muted-foreground">
                      {pharm.pickupAvailable && "Pickup"}
                      {pharm.pickupAvailable && pharm.deliveryAvailable && " • "}
                      {pharm.deliveryAvailable && "Courier"}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          pharm.verificationStatus === "verified"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : pharm.verificationStatus === "pending"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                        }`}
                      >
                        {pharm.verificationStatus === "verified" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        <span className="capitalize">{pharm.verificationStatus}</span>
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {pharm.verificationStatus !== "verified" ? (
                          <Button
                            size="sm"
                            disabled={updating === pharm.id}
                            onClick={() => handleUpdateStatus(pharm.id, "verified")}
                            className="rounded-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-3"
                          >
                            Approve
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updating === pharm.id}
                            onClick={() => handleUpdateStatus(pharm.id, "suspended")}
                            className="rounded-full text-xs text-destructive hover:bg-destructive/10 h-7 px-3"
                          >
                            Suspend
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
