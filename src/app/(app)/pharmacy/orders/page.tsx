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
  Search,
  ChevronRight,
  Filter,
  RefreshCw,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PharmacyOrder, PharmacyOrderStatus } from "@/types/models/order";

export default function PharmacyOrdersQueuePage() {
  const [orders, setOrders] = React.useState<PharmacyOrder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [fulfillmentFilter, setFulfillmentFilter] = React.useState<string>("all");

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load pharmacy orders:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(q) ||
      order.patientName.toLowerCase().includes(q) ||
      order.prescriptionId.toLowerCase().includes(q) ||
      order.items.some((i) => i.medicineName.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (fulfillmentFilter !== "all" && order.fulfillmentType !== fulfillmentFilter) {
      return false;
    }

    if (statusFilter === "pending") {
      return order.status === "pending" || order.status === "pharmacy_reviewing";
    } else if (statusFilter === "preparing") {
      return order.status === "accepted" || order.status === "preparing";
    } else if (statusFilter === "ready") {
      return order.status === "ready_for_pickup" || order.status === "out_for_delivery";
    } else if (statusFilter === "completed") {
      return order.status === "picked_up" || order.status === "delivered";
    }

    return true;
  });

  const getStatusBadge = (status: PharmacyOrderStatus) => {
    switch (status) {
      case "pending":
      case "pharmacy_reviewing":
        return (
          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Pending Review
          </span>
        );
      case "accepted":
        return (
          <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Accepted
          </span>
        );
      case "preparing":
        return (
          <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Dispensing
          </span>
        );
      case "ready_for_pickup":
        return (
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Ready at Counter
          </span>
        );
      case "out_for_delivery":
        return (
          <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Out with Courier
          </span>
        );
      case "delivered":
      case "picked_up":
        return (
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Fulfilled
          </span>
        );
      case "cancelled":
      case "rejected":
        return (
          <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive border border-destructive/20">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Fulfillment Orders Queue
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Authoritative dispensing management for Walgreens Digital Care #4190.
          </p>
        </div>

        <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={loadOrders}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Refresh List
        </Button>
      </div>

      {/* Search & Tab Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order #, patient name, Rx ID, or medicine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-border bg-card shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={fulfillmentFilter}
              onChange={(e) => setFulfillmentFilter(e.target.value)}
              className="rounded-2xl border border-border bg-card px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-auto"
            >
              <option value="all">All Modes (Pickup & Delivery)</option>
              <option value="pickup">In-Store Pickup Only</option>
              <option value="delivery">Courier Delivery Only</option>
            </select>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none pt-1">
          {(
            [
              { id: "all", label: "All Orders", count: orders.length },
              {
                id: "pending",
                label: "Pending Review",
                count: orders.filter((o) => o.status === "pending" || o.status === "pharmacy_reviewing").length,
              },
              {
                id: "preparing",
                label: "In Dispensing",
                count: orders.filter((o) => o.status === "accepted" || o.status === "preparing").length,
              },
              {
                id: "ready",
                label: "Ready / Dispatched",
                count: orders.filter((o) => o.status === "ready_for_pickup" || o.status === "out_for_delivery").length,
              },
              {
                id: "completed",
                label: "Completed",
                count: orders.filter((o) => o.status === "picked_up" || o.status === "delivered").length,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs transition flex items-center gap-1.5 whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  statusFilter === tab.id
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table / Cards */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-sm space-y-3">
          <Package className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-medium text-foreground">No matching orders</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No fulfillment orders matched your filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
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
                      Patient: <strong className="text-foreground">{order.patientName}</strong> (ID: {order.patientId}) • Created {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" className="rounded-full text-xs shadow-sm" asChild>
                    <Link href={`/pharmacy/orders/${order.id}`}>
                      Open Workspace
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Items & Delivery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-muted-foreground text-[11px] uppercase font-semibold">Prescription Items</span>
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-secondary/30 rounded-xl px-3 py-1.5 border border-border/40">
                        <span className="font-medium text-foreground">
                          {item.medicineName} ({item.dosage})
                        </span>
                        <span className="font-mono text-muted-foreground">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 rounded-2xl bg-secondary/20 p-3.5 border border-border/50">
                  <span className="text-muted-foreground text-[11px] uppercase font-semibold">Fulfillment Info</span>
                  <p className="font-medium text-foreground">
                    {order.fulfillmentType === "delivery" ? "Courier Doorstep" : "In-Store Pickup"}
                  </p>
                  <p className="text-muted-foreground text-[11px] truncate">
                    {order.fulfillmentType === "delivery"
                      ? typeof order.deliveryAddress === "object"
                        ? `${order.deliveryAddress.city}, ${order.deliveryAddress.state}`
                        : order.deliveryAddress || "Palo Alto"
                      : "Counter Pickup"}
                  </p>
                  <p className="font-mono font-bold text-foreground pt-1 border-t border-border/40">
                    Total: ${order.pricing.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
