"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Store,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Pill,
  ArrowRight,
  AlertCircle,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pharmacy, PharmacyInventoryItem } from "@/types/models/pharmacy";

export default function PharmacyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pharmacyId = params?.id as string;

  const [pharmacy, setPharmacy] = React.useState<Pharmacy | null>(null);
  const [inventory, setInventory] = React.useState<PharmacyInventoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadPharmacyData() {
      try {
        const res = await fetch(`/api/pharmacies/${pharmacyId}`);
        if (!res.ok) throw new Error("Pharmacy not found");
        const data = await res.json();
        setPharmacy(data.pharmacy);
        setInventory(data.inventory || []);
      } catch (err: any) {
        setError(err.message || "Failed to load pharmacy details");
      } finally {
        setLoading(false);
      }
    }
    if (pharmacyId) {
      loadPharmacyData();
    }
  }, [pharmacyId]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3 max-w-4xl mx-auto">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading pharmacy network profile...</p>
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="py-16 max-w-md mx-auto text-center space-y-4">
        <div className="h-14 w-14 mx-auto rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-medium text-foreground">Pharmacy Not Found</h2>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => router.push("/patient/pharmacies")}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Back button */}
      <div>
        <Link
          href="/patient/pharmacies"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Connected Pharmacies
        </Link>
      </div>

      {/* Main Profile Header */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="flex items-start sm:items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
              <Store className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-semibold text-foreground">{pharmacy.name}</h1>
                {pharmacy.verificationStatus === "verified" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified License
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                State License: <span className="font-mono text-foreground">{pharmacy.licenseNumber}</span> • NABP / NCPDP: <span className="font-mono text-foreground">{pharmacy.nabpNumber}</span>
              </p>
            </div>
          </div>

          <Button size="sm" className="rounded-full text-xs shadow-md shadow-primary/20" asChild>
            <Link href={`/patient/pharmacies/compare`}>
              <PackageCheck className="h-3.5 w-3.5 mr-1.5" />
              Fulfill Prescription Here
            </Link>
          </Button>
        </div>

        {/* Contact & Hours Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="rounded-2xl bg-secondary/30 p-4 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-primary font-medium">
              <MapPin className="h-4 w-4" /> Location
            </div>
            <p className="text-foreground font-medium">{pharmacy.address.street}</p>
            <p className="text-muted-foreground">{pharmacy.address.city}, {pharmacy.address.state} {pharmacy.address.zip}</p>
          </div>

          <div className="rounded-2xl bg-secondary/30 p-4 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-primary font-medium">
              <Clock className="h-4 w-4" /> Operating Hours
            </div>
            <p className="text-foreground font-medium">{pharmacy.hours}</p>
            <p className="text-muted-foreground">{pharmacy.is24Hours ? "Open 24/7" : "Regular schedule"}</p>
          </div>

          <div className="rounded-2xl bg-secondary/30 p-4 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-primary font-medium">
              <Phone className="h-4 w-4" /> Direct Contact
            </div>
            <p className="text-foreground font-medium">{pharmacy.phone}</p>
            <p className="text-muted-foreground truncate">{pharmacy.email}</p>
          </div>
        </div>

        {/* Fulfillment Capabilities */}
        <div className="rounded-2xl bg-primary/[0.03] border border-primary/15 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-semibold text-foreground">Fulfillment Capabilities</span>
            <p className="text-muted-foreground">
              Supports real-time atomic inventory reservation and direct courier dispatch.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pharmacy.pickupAvailable && (
              <span className="rounded-full bg-card border border-border px-3 py-1 text-[11px] font-medium text-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" /> In-Store Pickup
              </span>
            )}
            {pharmacy.deliveryAvailable && (
              <span className="rounded-full bg-card border border-border px-3 py-1 text-[11px] font-medium text-foreground flex items-center gap-1">
                <Truck className="h-3 w-3 text-emerald-500" /> Courier Delivery (${pharmacy.deliveryFee.toFixed(2)})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Verified Medicine Catalog Sample */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-semibold text-foreground">Live Medication Inventory</h3>
            <p className="text-xs text-muted-foreground">
              National Drug Code (NDC) mapped inventory directly updated by pharmacy staff.
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {inventory.length} Verified Products
          </span>
        </div>

        <div className="divide-y divide-border/60">
          {inventory.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{item.medicineName}</p>
                  <span className="text-[10px] font-mono text-muted-foreground">NDC: {item.ndc}</span>
                </div>
                <p className="text-muted-foreground">
                  {item.dosage} • {item.form}
                </p>
              </div>

              <div className="text-right space-y-0.5">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    item.inStock && item.stockQuantity > 5
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : item.inStock && item.stockQuantity > 0
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {item.inStock && item.stockQuantity > 5
                    ? "In Stock"
                    : item.inStock && item.stockQuantity > 0
                    ? `Low Stock (${item.stockQuantity} left)`
                    : "Out of Stock"}
                </span>
                <p className="font-mono font-medium text-foreground">
                  ${item.unitPrice.toFixed(2)} <span className="text-muted-foreground text-[10px]">/ unit</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
