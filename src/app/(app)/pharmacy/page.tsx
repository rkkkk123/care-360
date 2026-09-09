"use client";

import * as React from "react";
import Link from "next/link";
import {
  Store,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Pill,
  ChevronRight,
  RefreshCw,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PharmacyOrder } from "@/types/models/order";

export default function PharmacyDashboardPage() {
  const [orders, setOrders] = React.useState<PharmacyOrder[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadData = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load pharmacy dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const pendingCount = orders.filter((o) => o.status === "pending" || o.status === "pharmacy_reviewing").length;
  const preparingCount = orders.filter((o) => o.status === "accepted" || o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready_for_pickup" || o.status === "out_for_delivery").length;
  const completedCount = orders.filter((o) => o.status === "picked_up" || o.status === "delivered").length;

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-foreground mb-3">
            <ShieldCheck className="h-3.5 w-3.5 stroke-[1.5]" />
            Verified Dispensing Pharmacy
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Walgreens Digital Care #4190
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-medium">
            License #CA-PHY-99214 • NABP: 0582910 • 859 El Camino Real, Palo Alto
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
            <Link href="/pharmacy/reviews">
              <Star className="h-3.5 w-3.5 mr-1.5 text-amber-500 fill-amber-500" />
              Reviews (4.9 ★)
            </Link>
          </Button>

          <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
            <Link href="/pharmacy/inventory">
              <Pill className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Manage Inventory
            </Link>
          </Button>

          <Button size="sm" className="rounded-full text-xs shadow-sm" asChild>
            <Link href="/pharmacy/orders">
              <Package className="h-3.5 w-3.5 mr-1.5" />
              View Orders Queue
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-border bg-card shadow-apple-sm p-6 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wide">Pending Review</span>
            <Clock className="h-4 w-4 stroke-[1.5]" />
          </div>
          <p className="text-3xl font-semibold text-foreground tracking-tight">{pendingCount}</p>
          <p className="text-xs text-muted-foreground">Awaiting pharmacist check</p>
        </div>

        <div className="rounded-3xl border border-border bg-card shadow-apple-sm p-6 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wide">In Dispensing</span>
            <Pill className="h-4 w-4 stroke-[1.5]" />
          </div>
          <p className="text-3xl font-semibold text-foreground tracking-tight">{preparingCount}</p>
          <p className="text-xs text-muted-foreground">Being prepared & packaged</p>
        </div>

        <div className="rounded-3xl border border-border bg-card shadow-apple-sm p-6 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wide">Ready / Dispatched</span>
            <Truck className="h-4 w-4 stroke-[1.5]" />
          </div>
          <p className="text-3xl font-semibold text-foreground tracking-tight">{readyCount}</p>
          <p className="text-xs text-muted-foreground">Pickup counter & courier</p>
        </div>

        <div className="rounded-3xl border border-border bg-card shadow-apple-sm p-6 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wide">Completed</span>
            <CheckCircle2 className="h-4 w-4 stroke-[1.5]" />
          </div>
          <p className="text-3xl font-semibold text-foreground tracking-tight">{completedCount}</p>
          <p className="text-xs text-muted-foreground">Fulfilled e-prescriptions</p>
        </div>
      </div>

      {/* Orders In Progress Queue */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="space-y-0.5">
            <h3 className="text-lg font-semibold text-foreground">Active Fulfillment Queue</h3>
            <p className="text-xs text-muted-foreground">
              Incoming patient prescription orders requiring action or dispensing.
            </p>
          </div>

          <Button variant="ghost" size="sm" className="rounded-full text-xs" onClick={loadData}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh Queue
          </Button>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-xs text-muted-foreground mt-2">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Package className="h-10 w-10 text-muted-foreground mx-auto" />
            <h4 className="text-sm font-medium text-foreground">No Active Orders in Queue</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              When patients select Walgreens Digital Care for their prescription fulfillment, orders will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-foreground shrink-0 border border-border">
                    {order.fulfillmentType === "delivery" ? (
                      <Truck className="h-5 w-5 text-primary" />
                    ) : (
                      <MapPin className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {order.orderNumber}
                      </span>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Patient: <strong className="text-foreground">{order.patientName}</strong> • {order.items.length} item(s) • ${order.pricing.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" className="rounded-full text-xs" asChild>
                    <Link href={`/pharmacy/orders/${order.id}`}>
                      Open Workspace
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {orders.length > 5 && (
          <div className="pt-2 text-center border-t border-border">
            <Button variant="ghost" size="sm" className="rounded-full text-xs" asChild>
              <Link href="/pharmacy/orders">
                View All {orders.length} Orders <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Connected Network Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-border bg-secondary/30 p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold tracking-tight">
            <ShieldCheck className="h-5 w-5 stroke-[1.5]" />
            <span className="text-sm">NCPDP e-Prescribing</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Directly connected to CARE360 doctors. All incoming prescriptions contain tamper-evident cryptographic SHA-256 seals.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-secondary/30 p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold tracking-tight">
            <Package className="h-5 w-5 stroke-[1.5]" />
            <span className="text-sm">Atomic Stock Reservation</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Inventory is reserved in real time upon patient checkout, preventing stockout collisions across care channels.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-secondary/30 p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold tracking-tight">
            <Truck className="h-5 w-5 stroke-[1.5]" />
            <span className="text-sm">Same-Day Fulfillment</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Supports both drive-thru/counter in-store pickup and integrated local courier dispatch.
          </p>
        </div>
      </div>
    </div>
  );
}
