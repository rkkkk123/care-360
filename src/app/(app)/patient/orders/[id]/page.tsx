"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pill,
  Store,
  Phone,
  ShieldCheck,
  RefreshCw,
  FileText,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PharmacyOrder, PharmacyOrderStatus } from "@/types/models/order";

export default function PatientOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = React.useState<PharmacyOrder | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchOrder = React.useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error("Order not found or access denied");
      const data = await res.json();
      setOrder(data.order);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderId]);

  React.useEffect(() => {
    if (orderId) {
      fetchOrder();
      // Auto-refresh every 6 seconds to show real-time fulfillment changes
      const interval = setInterval(() => {
        fetchOrder(true);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [orderId, fetchOrder]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3 max-w-4xl mx-auto">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Connecting to live pharmacy dispatch network...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-16 max-w-md mx-auto text-center space-y-4">
        <div className="h-14 w-14 mx-auto rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-medium text-foreground">Order Not Found</h2>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => router.push("/patient/orders")}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Orders
        </Button>
      </div>
    );
  }

  // Stepper calculations
  const steps: { key: PharmacyOrderStatus[]; label: string; description: string }[] = [
    {
      key: ["pending", "pharmacy_reviewing"],
      label: "Order Placed",
      description: "Prescription routed & pharmacist reviewing",
    },
    {
      key: ["accepted"],
      label: "Verified & Accepted",
      description: "Pharmacist approved inventory & dosage",
    },
    {
      key: ["preparing"],
      label: "Preparing Medication",
      description: "Dispensing, labeling, and quality verification",
    },
    {
      key: ["ready_for_pickup", "out_for_delivery"],
      label: order.fulfillmentType === "delivery" ? "Out for Delivery" : "Ready for Pickup",
      description: order.fulfillmentType === "delivery" ? "Courier dispatched to your address" : "Available at pharmacy counter",
    },
    {
      key: ["picked_up", "delivered"],
      label: "Completed",
      description: "Handed over safely to patient",
    },
  ];

  const getStepStatus = (stepIndex: number) => {
    const statusOrder: PharmacyOrderStatus[] = [
      "pending",
      "pharmacy_reviewing",
      "accepted",
      "preparing",
      order.fulfillmentType === "delivery" ? "out_for_delivery" : "ready_for_pickup",
      order.fulfillmentType === "delivery" ? "delivered" : "picked_up",
    ];

    const currentIdx = statusOrder.indexOf(order.status);

    if (order.status === "cancelled" || order.status === "rejected") {
      return "cancelled";
    }

    // Map step indices to statusOrder indices
    // step 0: pending / pharmacy_reviewing (indices 0, 1)
    // step 1: accepted (index 2)
    // step 2: preparing (index 3)
    // step 3: ready / out (index 4)
    // step 4: completed (index 5)
    const stepTargetIndices = [1, 2, 3, 4, 5];
    const targetIdx = stepTargetIndices[stepIndex];

    if (currentIdx > targetIdx) return "completed";
    if (currentIdx === targetIdx || (stepIndex === 0 && currentIdx <= 1)) return "current";
    return "upcoming";
  };

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/patient/orders"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-light tracking-tight text-foreground">
              Live Order Fulfillment
            </h1>
            <button
              onClick={() => fetchOrder()}
              disabled={refreshing}
              className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition"
              title="Refresh status"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-primary" : ""}`} />
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Order #{order.orderNumber} • Prescribed via CARE360 e-Prescription
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
            <Link href={`/patient/prescriptions/${order.prescriptionId}`}>
              <FileText className="h-3.5 w-3.5 mr-1.5 text-primary" />
              View Prescription
            </Link>
          </Button>
        </div>
      </div>

      {/* Visual Live Tracker Progress Stepper */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="space-y-0.5">
            <span className="text-xs uppercase font-semibold tracking-wider text-muted-foreground">
              Current Status
            </span>
            <h3 className="text-lg font-semibold text-foreground capitalize">
              {order.status.replace(/_/g, " ")}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono text-muted-foreground">
              Live Updates Active
            </span>
          </div>
        </div>

        {/* Stepper Bar */}
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {steps.map((step, idx) => {
              const state = getStepStatus(idx);
              const isCompleted = state === "completed";
              const isCurrent = state === "current";

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-4 transition-all space-y-2 ${
                    isCurrent
                      ? "border-primary bg-primary/5 shadow-sm"
                      : isCompleted
                      ? "border-emerald-500/30 bg-emerald-500/[0.03]"
                      : "border-border/60 bg-secondary/20 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-primary text-primary-foreground animate-pulse"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? "✓" : idx + 1}
                    </span>
                    {isCurrent && (
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary uppercase">
                        Active
                      </span>
                    )}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${isCurrent ? "text-primary" : "text-foreground"}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fulfillment Specific Banner */}
        <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-primary shrink-0">
              {order.fulfillmentType === "delivery" ? (
                <Truck className="h-5 w-5" />
              ) : (
                <MapPin className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {order.fulfillmentType === "delivery"
                  ? "Direct Courier Delivery"
                  : "In-Store Pharmacy Pickup"}
              </p>
              <p className="text-muted-foreground text-[11px]">
                {order.fulfillmentType === "delivery"
                  ? `Address: ${typeof order.deliveryAddress === "object" ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}` : order.deliveryAddress || "Patient primary address"}`
                  : `Location: ${order.pharmacyName}`}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] text-muted-foreground">Pharmacy Contact:</span>
            <p className="font-medium text-foreground">{order.pharmacyPhone || "(650) 326-3876"}</p>
          </div>
        </div>
      </div>

      {/* Order Details & Receipt Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prescription Medications Ordered */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Pill className="h-4 w-4 text-primary" />
            <span>Medications Dispensed ({order.items.length})</span>
          </div>

          <div className="space-y-3">
            {order.items.map((it, idx) => (
              <div key={idx} className="rounded-2xl bg-secondary/30 p-3.5 border border-border/50 text-xs space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold text-foreground">{it.medicineName}</h5>
                    <p className="text-muted-foreground text-[11px]">{it.dosage} • {it.form}</p>
                  </div>
                  <span className="font-mono font-medium text-foreground">
                    ${(it.unitPrice * it.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1 border-t border-border/30">
                  <span>Quantity: {it.quantity} units</span>
                  <span>Unit: ${it.unitPrice.toFixed(2)}</span>
                </div>
                {it.instructions && (
                  <p className="text-[10px] text-muted-foreground/90 italic">
                    "{it.instructions}"
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-1.5 pt-3 border-t border-border text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Items Subtotal:</span>
              <span className="font-mono text-foreground">${order.pricing.itemsSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Fulfillment & Delivery Fee:</span>
              <span className="font-mono text-foreground">
                {order.pricing.deliveryFee > 0 ? `$${order.pricing.deliveryFee.toFixed(2)}` : "Free"}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-foreground pt-1.5 border-t border-border/60">
              <span>Total Patient Co-Pay:</span>
              <span className="font-mono text-primary">${order.pricing.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Real-Time Audit Log / Fulfillment Timeline */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>Fulfillment Event Log</span>
          </div>

          <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {order.timeline.map((event, idx) => (
              <div key={idx} className="relative space-y-0.5">
                <div className="absolute -left-5 top-1 h-2.5 w-2.5 rounded-full border-2 border-primary bg-card" />
                <p className="text-xs font-semibold text-foreground">{event.note || event.status.replace(/_/g, " ")}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                  <span>•</span>
                  <span>Actor: {event.actor}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Connected Health Ecosystem Note */}
          <div className="rounded-2xl bg-primary/[0.04] p-3.5 border border-primary/15 text-xs text-muted-foreground space-y-1 mt-4">
            <div className="flex items-center gap-1.5 font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Connected Health Ecosystem</span>
            </div>
            <p className="text-[11px]">
              This medication fulfillment is automatically synchronized with your Doctor's Clinical Chart and Health Timeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
