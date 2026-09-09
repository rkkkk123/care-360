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
  ShieldCheck,
  FileText,
  User,
  Stethoscope,
  CheckSquare,
  Square,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PharmacyOrder, PharmacyOrderStatus } from "@/types/models/order";

export default function PharmacyFulfillmentWorkspace() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const [order, setOrder] = React.useState<PharmacyOrder | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);

  // Pharmacist item safety verification checklist state
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});

  const loadOrder = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error("Order not found or unauthorized");
      const data = await res.json();
      setOrder(data.order);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  React.useEffect(() => {
    if (orderId) loadOrder();
  }, [orderId, loadOrder]);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const advanceOrderStatus = async (nextStatus: PharmacyOrderStatus, note?: string) => {
    setUpdating(true);
    setActionSuccess(null);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          note: note || `Pharmacist advanced status to ${nextStatus.replace(/_/g, " ")}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update order status");
      }

      setOrder(data.order);
      setActionSuccess(`Order successfully advanced to ${nextStatus.replace(/_/g, " ")}`);
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3 max-w-4xl mx-auto">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Opening fulfillment workspace...</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="py-16 max-w-md mx-auto text-center space-y-4">
        <div className="h-14 w-14 mx-auto rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-medium text-foreground">Order Not Accessible</h2>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => router.push("/pharmacy/orders")}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Queue
        </Button>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/pharmacy/orders"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders Queue
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-light tracking-tight text-foreground font-mono">
              {order.orderNumber}
            </h1>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary capitalize border border-primary/20">
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Prescription #{order.prescriptionId} • Customer: <strong className="text-foreground">{order.patientName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
            <a href={`/api/prescriptions/${order.prescriptionId}/pdf`} target="_blank" rel="noopener noreferrer">
              <FileText className="h-3.5 w-3.5 mr-1.5 text-primary" />
              View Doctor e-Rx PDF
            </a>
          </Button>
        </div>
      </div>

      {/* Action Banners */}
      {actionSuccess && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-xs text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Pharmacist Action Center */}
      <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="space-y-1">
            <span className="text-xs uppercase font-semibold tracking-wider text-primary">
              Dispensing Action Center
            </span>
            <h3 className="text-lg font-semibold text-foreground">
              Current Step: {order.status.replace(/_/g, " ").toUpperCase()}
            </h3>
          </div>

          {/* Action Buttons depending on state */}
          <div className="flex items-center gap-2 flex-wrap">
            {(order.status === "pending" || order.status === "pharmacy_reviewing") && (
              <>
                <Button
                  size="sm"
                  disabled={updating}
                  onClick={() => advanceOrderStatus("accepted", "Pharmacist reviewed prescription and approved for dispensing")}
                  className="rounded-full text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  Accept Order & Reserve Stock
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={updating}
                  onClick={() => advanceOrderStatus("rejected", "Prescription rejected by pharmacist due to clinical contraindication")}
                  className="rounded-full text-xs text-destructive hover:bg-destructive/10"
                >
                  <XCircle className="h-3.5 w-3.5 mr-1.5" />
                  Reject Order
                </Button>
              </>
            )}

            {order.status === "accepted" && (
              <Button
                size="sm"
                disabled={updating}
                onClick={() => advanceOrderStatus("preparing", "Pharmacist started compounding, counting, and packaging medication")}
                className="rounded-full text-xs bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
              >
                <Pill className="h-3.5 w-3.5 mr-1.5" />
                Start Dispensing & Packaging
              </Button>
            )}

            {order.status === "preparing" && (
              <>
                {order.fulfillmentType === "pickup" ? (
                  <Button
                    size="sm"
                    disabled={updating}
                    onClick={() => advanceOrderStatus("ready_for_pickup", "Medication packaged and placed at pickup counter")}
                    className="rounded-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                  >
                    <MapPin className="h-3.5 w-3.5 mr-1.5" />
                    Mark Ready for In-Store Pickup
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={updating}
                    onClick={() => advanceOrderStatus("out_for_delivery", "Handed to courier with tracked temperature-controlled seal")}
                    className="rounded-full text-xs bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                  >
                    <Truck className="h-3.5 w-3.5 mr-1.5" />
                    Dispatch Courier (Out for Delivery)
                  </Button>
                )}
              </>
            )}

            {order.status === "ready_for_pickup" && (
              <Button
                size="sm"
                disabled={updating}
                onClick={() => advanceOrderStatus("picked_up", "Patient physically picked up and verified ID at counter")}
                className="rounded-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                Confirm Counter Handover (Complete)
              </Button>
            )}

            {order.status === "out_for_delivery" && (
              <Button
                size="sm"
                disabled={updating}
                onClick={() => advanceOrderStatus("delivered", "Courier confirmed safe delivery to patient address")}
                className="rounded-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                Confirm Courier Delivery (Complete)
              </Button>
            )}

            {(order.status === "picked_up" || order.status === "delivered") && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" />
                <span>Order Completed & Fully Dispensed</span>
              </div>
            )}
          </div>
        </div>

        {/* Clinical Safety & Dispensing Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Medication Dispensing Verification Checklist
            </h4>
            <span className="text-[11px] text-muted-foreground">
              Verify each line item before completing fulfillment
            </span>
          </div>

          <div className="space-y-3">
            {order.items.map((item, idx) => {
              const isChecked = checkedItems[item.medicineId] || order.status === "picked_up" || order.status === "delivered";
              return (
                <div
                  key={idx}
                  onClick={() => toggleCheck(item.medicineId)}
                  className={`rounded-2xl border p-4 cursor-pointer transition-all flex items-start justify-between gap-4 ${
                    isChecked
                      ? "border-emerald-500/40 bg-emerald-500/5 shadow-sm"
                      : "border-border bg-secondary/20 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-primary">
                      {isChecked ? (
                        <CheckSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Square className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{item.medicineName}</p>
                        <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {item.form} • {item.dosage}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Dispense Count: <strong className="text-foreground">{item.quantity} units</strong> • ${(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                      {item.instructions && (
                        <p className="text-[11px] text-muted-foreground bg-card/80 p-2 rounded-xl border border-border/50">
                          <span className="font-semibold text-foreground">Directions:</span> {item.instructions}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-[11px] font-semibold ${
                        isChecked ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                      }`}
                    >
                      {isChecked ? "Checked & Verified ✓" : "Click to Verify"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Patient & Delivery Info + Audit Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient & Prescription Context */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <User className="h-4 w-4 text-primary" />
            <span>Patient & Fulfillment Context</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="rounded-2xl bg-secondary/30 p-3.5 space-y-1 border border-border/40">
              <span className="text-muted-foreground text-[11px]">Patient Name</span>
              <p className="font-semibold text-foreground text-sm">{order.patientName}</p>
              <p className="text-muted-foreground">Patient Record ID: {order.patientId}</p>
            </div>

            <div className="rounded-2xl bg-secondary/30 p-3.5 space-y-1 border border-border/40">
              <span className="text-muted-foreground text-[11px]">Fulfillment Destination</span>
              <p className="font-semibold text-foreground capitalize">
                {order.fulfillmentType === "delivery" ? "Courier Doorstep Delivery" : "Customer Counter Pickup"}
              </p>
              {order.deliveryAddress && (
                <p className="text-muted-foreground">
                  Address: {typeof order.deliveryAddress === "object"
                    ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.zip}`
                    : order.deliveryAddress}
                </p>
              )}
              {order.deliveryNotes && (
                <p className="text-[11px] text-muted-foreground/90 italic">Note: &quot;{order.deliveryNotes}&quot;</p>
              )}
            </div>

            <div className="rounded-2xl bg-secondary/30 p-3.5 space-y-1 border border-border/40">
              <span className="text-muted-foreground text-[11px]">Authorized e-Prescription</span>
              <p className="font-mono text-primary font-semibold">{order.prescriptionId}</p>
              <p className="text-[11px] text-muted-foreground">Compliant with SCRIPT v2017071</p>
            </div>
          </div>
        </div>

        {/* Audit Trail Log */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>Audit & Fulfillment Event History</span>
          </div>

          <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {order.timeline.map((event, idx) => (
              <div key={idx} className="relative space-y-0.5">
                <div className="absolute -left-5 top-1 h-2.5 w-2.5 rounded-full border-2 border-primary bg-card" />
                <p className="text-xs font-semibold text-foreground">{event.note || event.status.replace(/_/g, " ")}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                  <span>•</span>
                  <span>{event.actor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
