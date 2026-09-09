"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Pill,
  Store,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PharmacyOrder } from "@/types/models/order";

export default function PatientOrdersPage() {
  const [orders, setOrders] = React.useState<PharmacyOrder[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStatusBadge = (status: PharmacyOrder["status"]) => {
    switch (status) {
      case "pending":
      case "pharmacy_reviewing":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            Pharmacist Reviewing
          </span>
        );
      case "accepted":
      case "preparing":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Clock className="h-3 w-3 animate-spin" />
            Preparing Medication
          </span>
        );
      case "ready_for_pickup":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <MapPin className="h-3 w-3" />
            Ready for In-Store Pickup
          </span>
        );
      case "out_for_delivery":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Truck className="h-3 w-3 animate-bounce" />
            Out for Delivery
          </span>
        );
      case "delivered":
      case "picked_up":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            Order Completed
          </span>
        );
      case "cancelled":
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive border border-destructive/20">
            <AlertCircle className="h-3 w-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Medication Orders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track fulfillment, pharmacy preparation status, and courier dispatch in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
            <Link href="/patient/prescriptions">
              <Pill className="h-3.5 w-3.5 mr-1.5 text-primary" />
              My Prescriptions
            </Link>
          </Button>

          <Button size="sm" className="rounded-full text-xs" asChild>
            <Link href="/patient/pharmacies/compare">
              <Store className="h-3.5 w-3.5 mr-1.5" />
              Order New Refill
            </Link>
          </Button>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Retrieving medication orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-sm space-y-4">
          <div className="h-14 w-14 mx-auto rounded-3xl bg-secondary flex items-center justify-center text-muted-foreground">
            <Package className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-base font-medium text-foreground">No Active Orders</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              You haven't placed any medication orders yet. Select one of your active prescriptions to fulfill.
            </p>
          </div>
          <Button size="sm" className="rounded-full text-xs" asChild>
            <Link href="/patient/prescriptions">View Active Prescriptions</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            return (
              <div
                key={order.id}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:border-primary/30 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-secondary flex items-center justify-center text-foreground shrink-0 border border-border">
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
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Fulfilling at <strong className="text-foreground">{order.pharmacyName}</strong> • {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" className="rounded-full text-xs" asChild>
                      <Link href={`/patient/orders/${order.id}`}>
                        Track Order
                        <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Items Summary & Total */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Medications:</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {order.items.map((item, i) => (
                        <span key={i} className="rounded-lg bg-secondary/50 px-2.5 py-1 text-foreground font-medium">
                          {item.medicineName} ({item.dosage}) x{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right sm:text-right shrink-0">
                    <span className="text-muted-foreground text-[11px] block">Estimated Co-Pay</span>
                    <span className="font-mono font-bold text-foreground text-base">
                      ${order.pricing.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
