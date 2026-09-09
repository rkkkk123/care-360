"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Store,
  MapPin,
  Clock,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  ArrowLeft,
  Pill,
  ChevronRight,
  Info,
  DollarSign,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Prescription } from "@/types/models/prescription";
import type { PharmacyComparisonMatch } from "@/types/models/pharmacy";
import type { FulfillmentType } from "@/types/models/order";

function PharmacyCompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrescriptionId = searchParams?.get("prescriptionId") || "";

  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = React.useState(initialPrescriptionId);
  const [currentPrescription, setCurrentPrescription] = React.useState<Prescription | null>(null);

  const [matches, setMatches] = React.useState<PharmacyComparisonMatch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [comparing, setComparing] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<"best_match" | "price" | "distance" | "fastest">("best_match");

  // AI search bar
  const [aiQuery, setAiQuery] = React.useState("");
  const [aiSearching, setAiSearching] = React.useState(false);
  const [aiExplanation, setAiExplanation] = React.useState<string | null>(null);

  // Order Placement Modal State
  const [selectedMatch, setSelectedMatch] = React.useState<PharmacyComparisonMatch | null>(null);
  const [fulfillmentType, setFulfillmentType] = React.useState<FulfillmentType>("pickup");
  const [deliveryAddress, setDeliveryAddress] = React.useState("1248 Waverley St, Palo Alto, CA 94301");
  const [deliveryNotes, setDeliveryNotes] = React.useState("Leave with front desk / doorman");
  const [isSubmittingOrder, setIsSubmittingOrder] = React.useState(false);
  const [orderError, setOrderError] = React.useState<string | null>(null);

  // 1. Fetch available prescriptions
  React.useEffect(() => {
    async function loadPrescriptions() {
      try {
        const res = await fetch("/api/prescriptions");
        if (res.ok) {
          const data = await res.json();
          const list: Prescription[] = data.prescriptions || [];
          setPrescriptions(list);

          if (!selectedPrescriptionId && list.length > 0) {
            setSelectedPrescriptionId(list[0].id);
            setCurrentPrescription(list[0]);
          } else if (selectedPrescriptionId) {
            const found = list.find((p) => p.id === selectedPrescriptionId);
            if (found) setCurrentPrescription(found);
          }
        }
      } catch (err) {
        console.error("Failed to fetch prescriptions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPrescriptions();
  }, [selectedPrescriptionId]);

  // 2. Perform comparison whenever prescription or sort changes
  const runComparison = React.useCallback(async (rxId: string, sort: string) => {
    if (!rxId) return;
    setComparing(true);
    try {
      const res = await fetch("/api/pharmacies/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prescriptionId: rxId,
          userLocation: { lat: 37.4419, lng: -122.143 }, // Palo Alto coords
          sortPreference: sort,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
        if (data.prescription) {
          setCurrentPrescription(data.prescription);
        }
      }
    } catch (err) {
      console.error("Failed to compare pharmacies:", err);
    } finally {
      setComparing(false);
    }
  }, []);

  React.useEffect(() => {
    if (selectedPrescriptionId) {
      runComparison(selectedPrescriptionId, sortBy);
    }
  }, [selectedPrescriptionId, sortBy, runComparison]);

  // Handle AI Copilot Filter
  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiSearching(true);
    setAiExplanation(null);

    try {
      // Direct fast local interpretation + comparison sorting
      const lower = aiQuery.toLowerCase();
      let matchedSort: typeof sortBy = "best_match";
      let filterExplanation = "";

      if (lower.includes("cheap") || lower.includes("price") || lower.includes("cost") || lower.includes("affordable")) {
        matchedSort = "price";
        filterExplanation = "Prioritized pharmacies with the lowest total prescription and dispensing cost.";
      } else if (lower.includes("fast") || lower.includes("quick") || lower.includes("urgent") || lower.includes("soon") || lower.includes("now")) {
        matchedSort = "fastest";
        filterExplanation = "Ranked pharmacies by fastest turnaround and immediate in-stock readiness.";
      } else if (lower.includes("close") || lower.includes("near") || lower.includes("distance") || lower.includes("mile")) {
        matchedSort = "distance";
        filterExplanation = "Filtered and sorted by closest geographical distance to your location.";
      } else if (lower.includes("delivery") || lower.includes("doorstep") || lower.includes("courier")) {
        matchedSort = "fastest";
        filterExplanation = "Showing connected pharmacies offering direct courier delivery to your address.";
      } else {
        filterExplanation = `Analyzed your request for: "${aiQuery}". Sorted by highest verified inventory compatibility.`;
      }

      setSortBy(matchedSort);
      setAiExplanation(filterExplanation);
      await runComparison(selectedPrescriptionId, matchedSort);
    } catch (err) {
      console.error(err);
    } finally {
      setAiSearching(false);
    }
  };

  // Open Order Modal
  const openOrderModal = (match: PharmacyComparisonMatch) => {
    setSelectedMatch(match);
    // Set default fulfillment mode based on pharmacy capabilities
    if (match.pharmacy.deliveryAvailable) {
      setFulfillmentType("delivery");
    } else {
      setFulfillmentType("pickup");
    }
    setOrderError(null);
  };

  // Submit Order to Backend
  const handlePlaceOrder = async () => {
    if (!selectedMatch || !currentPrescription) return;
    setIsSubmittingOrder(true);
    setOrderError(null);

    try {
      const itemsPayload = currentPrescription.items.map((item) => {
        // Find unit price from match item if available
        const matchedItem = selectedMatch.itemDetails.find((d) => d.medicineId === item.medicineId);
        const unitPrice = matchedItem ? matchedItem.unitPrice : 15.0;
        return {
          medicineId: item.medicineId,
          medicineName: item.medicineName,
          dosage: item.dosage,
          form: item.form,
          quantity: item.quantity,
          unitPrice,
          totalPrice: unitPrice * item.quantity,
          instructions: item.instructions,
        };
      });

      const orderPayload = {
        prescriptionId: currentPrescription.id,
        pharmacyId: selectedMatch.pharmacy.id,
        fulfillmentType,
        items: itemsPayload,
        deliveryAddress: fulfillmentType === "delivery" ? deliveryAddress : undefined,
        deliveryNotes: fulfillmentType === "delivery" ? deliveryNotes : undefined,
        copayAmount: selectedMatch.pricing.totalPrice,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order. Inventory may have changed.");
      }

      // Success! Navigate to live order tracking
      router.push(`/patient/orders/${data.order.id}`);
    } catch (err: any) {
      setOrderError(err.message || "Failed to submit order. Please try again.");
      setIsSubmittingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3 max-w-4xl mx-auto">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading connected pharmacy network...</p>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/patient/prescriptions"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Prescriptions
          </Link>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Compare Network Pharmacies
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time stock availability, transparent pricing, and instant electronic routing.
          </p>
        </div>

        {/* Prescription Selector */}
        {prescriptions.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Prescription:</span>
            <select
              value={selectedPrescriptionId}
              onChange={(e) => setSelectedPrescriptionId(e.target.value)}
              className="text-xs rounded-xl border border-border bg-card px-3 py-2 text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {prescriptions.map((rx) => (
                <option key={rx.id} value={rx.id}>
                  {rx.prescriptionNumber} — {rx.items[0]?.medicineName || "Prescription"}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Selected Prescription Summary Card */}
      {currentPrescription && (
        <div className="rounded-3xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
              <Pill className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-primary">
                  {currentPrescription.prescriptionNumber}
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Authorized by {currentPrescription.doctorName}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                <span>
                  Medication:{" "}
                  <strong className="text-foreground">
                    {currentPrescription.items.map((i) => `${i.medicineName} (${i.dosage})`).join(", ")}
                  </strong>
                </span>
                <span>•</span>
                <span>Diagnosis: {currentPrescription.diagnosis || "Clinical Care"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
              <Link href={`/patient/prescriptions/${currentPrescription.id}`}>
                View Rx Details
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* AI Pharmacy Search Copilot */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3">
        <form onSubmit={handleAiSearch} className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <input
              type="text"
              placeholder="Ask CARE360 Copilot (e.g. 'Show cheapest with delivery' or 'Closest pharmacy open 24h')..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-border bg-secondary/30 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={aiSearching || !aiQuery.trim()}
            className="rounded-2xl text-xs px-4 h-10 w-full sm:w-auto shrink-0"
          >
            {aiSearching ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Filtering...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5" />
                AI Match
              </span>
            )}
          </Button>
        </form>

        {aiExplanation && (
          <div className="flex items-center gap-2 rounded-2xl bg-primary/5 px-3.5 py-2 text-xs text-primary border border-primary/10">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>{aiExplanation}</span>
          </div>
        )}

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto text-xs scrollbar-none">
          <span className="text-muted-foreground text-[11px] shrink-0 font-medium">Sort by:</span>
          {(
            [
              { id: "best_match", label: "Best Match" },
              { id: "price", label: "Lowest Price" },
              { id: "distance", label: "Nearest Distance" },
              { id: "fastest", label: "Fastest Turnaround" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setSortBy(item.id)}
              className={`rounded-full px-3 py-1 text-xs transition whitespace-nowrap ${
                sortBy === item.id
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Results */}
      {comparing ? (
        <div className="py-16 text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Checking live pharmacy inventories & pricing...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-sm space-y-3">
          <Store className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-medium text-foreground">No Pharmacy Matches Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            We could not find verified pharmacies meeting this criteria in your immediate area.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match) => {
            const isFullStock = match.stockStatus === "all_in_stock";
            return (
              <div
                key={match.pharmacy.id}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col justify-between space-y-6"
              >
                {/* Pharmacy Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-foreground">
                          {match.pharmacy.name}
                        </h3>
                        {match.pharmacy.verificationStatus === "verified" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary shrink-0" />
                        {match.pharmacy.address.street}, {match.pharmacy.address.city} •{" "}
                        <strong className="text-foreground">{match.distanceMiles} miles</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Est. Cost</span>
                      <p className="text-xl font-bold text-foreground">
                        ${match.pricing.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Badges / Turnaround */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    {isFullStock ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        100% In Stock ({match.matchedCount}/{match.totalItemsCount})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <AlertTriangle className="h-3 w-3" />
                        Partial Stock ({match.matchedCount}/{match.totalItemsCount})
                      </span>
                    )}

                    <span className="rounded-md bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {match.estimatedReadyTime}
                    </span>

                    {match.pharmacy.deliveryAvailable && (
                      <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        Courier Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Items Breakdown */}
                <div className="space-y-2 rounded-2xl bg-secondary/30 p-4 border border-border/60 text-xs">
                  <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider block">
                    Item Inventory & Pricing
                  </span>
                  {match.itemDetails.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0">
                      <div className="space-y-0.5">
                        <p className="font-medium text-foreground">{item.medicineName}</p>
                        <span className="text-[10px] text-muted-foreground">Qty: {item.quantity}</span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-semibold ${
                            item.stockStatus === "in_stock"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : item.stockStatus === "low_stock"
                              ? "text-amber-500"
                              : "text-destructive"
                          }`}
                        >
                          {item.stockStatus === "in_stock"
                            ? "In Stock"
                            : item.stockStatus === "low_stock"
                            ? "Low Stock"
                            : "Unavailable"}
                        </span>
                        <p className="text-[11px] font-mono text-muted-foreground">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Action */}
                <div className="pt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs flex-1"
                    asChild
                  >
                    <Link href={`/patient/pharmacies/${match.pharmacy.id}`}>
                      View Pharmacy
                    </Link>
                  </Button>

                  <Button
                    size="sm"
                    disabled={!isFullStock && match.matchedCount === 0}
                    onClick={() => openOrderModal(match)}
                    className="rounded-full text-xs flex-1 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                  >
                    Select & Review Order
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ORDER REVIEW MODAL / DRAWER */}
      {selectedMatch && currentPrescription && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Review & Confirm Fulfillment</h3>
                <p className="text-xs text-muted-foreground">
                  Fulfilling with <strong className="text-foreground">{selectedMatch.pharmacy.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="h-8 w-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Error banner if any */}
            {orderError && (
              <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{orderError}</span>
              </div>
            )}

            {/* Prescription details summary */}
            <div className="rounded-2xl bg-secondary/30 p-4 border border-border/60 text-xs space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                <span>Rx: {currentPrescription.prescriptionNumber}</span>
                <span>Doctor: {currentPrescription.doctorName}</span>
              </div>
              <div className="space-y-1 pt-1 border-t border-border/40">
                {currentPrescription.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-foreground">
                    <span>
                      {it.medicineName} ({it.dosage}) x {it.quantity}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      ${((selectedMatch.itemDetails.find((d) => d.medicineId === it.medicineId)?.unitPrice || 15) * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fulfillment Type Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Fulfillment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentType("pickup")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    fulfillmentType === "pickup"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MapPin className="h-5 w-5 mb-2" />
                  <p className="text-sm font-semibold text-foreground">In-Store Pickup</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Free • Ready in {selectedMatch.estimatedReadyTime}
                  </p>
                </button>

                <button
                  type="button"
                  disabled={!selectedMatch.pharmacy.deliveryAvailable}
                  onClick={() => setFulfillmentType("delivery")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    !selectedMatch.pharmacy.deliveryAvailable
                      ? "opacity-50 cursor-not-allowed border-border"
                      : fulfillmentType === "delivery"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Truck className="h-5 w-5 mb-2" />
                  <p className="text-sm font-semibold text-foreground">Courier Delivery</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {selectedMatch.pricing.deliveryFee > 0
                      ? `$${selectedMatch.pricing.deliveryFee.toFixed(2)} fee • Doorstep`
                      : "Free same-day delivery"}
                  </p>
                </button>
              </div>
            </div>

            {/* Delivery details if selected */}
            {fulfillmentType === "delivery" ? (
              <div className="space-y-3 rounded-2xl bg-secondary/20 p-4 border border-border/60 text-xs">
                <label className="text-xs font-semibold text-foreground block">
                  Delivery Destination
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Street Address, City, State, ZIP"
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Delivery instructions (e.g. Ring Apt 4B)"
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            ) : (
              <div className="rounded-2xl bg-secondary/20 p-4 border border-border/60 text-xs space-y-1">
                <p className="font-semibold text-foreground">Pickup Location:</p>
                <p className="text-muted-foreground">
                  {selectedMatch.pharmacy.name}
                  <br />
                  {selectedMatch.pharmacy.address.street}, {selectedMatch.pharmacy.address.city}, {selectedMatch.pharmacy.address.state} {selectedMatch.pharmacy.address.zip}
                </p>
              </div>
            )}

            {/* Pricing Total */}
            <div className="space-y-1.5 pt-3 border-t border-border text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Medication Subtotal:</span>
                <span className="font-mono text-foreground">${selectedMatch.pricing.itemsSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Fulfillment Fee:</span>
                <span className="font-mono text-foreground">
                  {fulfillmentType === "delivery"
                    ? `$${selectedMatch.pricing.deliveryFee.toFixed(2)}`
                    : "Free"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-foreground pt-1 border-t border-border/40">
                <span>Estimated Total Co-Pay:</span>
                <span className="text-primary font-mono">
                  $
                  {(
                    selectedMatch.pricing.itemsSubtotal +
                    (fulfillmentType === "delivery" ? selectedMatch.pricing.deliveryFee : 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Safety & Compliance note */}
            <div className="rounded-xl bg-primary/5 p-3 text-[11px] text-muted-foreground flex items-center gap-2 border border-primary/10">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>
                Stock is reserved atomically upon order confirmation. The pharmacist will verify this order before dispensing.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedMatch(null)}
                className="rounded-full text-xs flex-1"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isSubmittingOrder}
                onClick={handlePlaceOrder}
                className="rounded-full text-xs flex-1 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                {isSubmittingOrder ? (
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Reserving Stock & Routing...
                  </span>
                ) : (
                  <span>Confirm & Place Order</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PharmacyComparePage() {
  return (
    <React.Suspense fallback={<div className="py-20 text-center text-sm text-muted-foreground">Loading pharmacy comparison network...</div>}>
      <PharmacyCompareContent />
    </React.Suspense>
  );
}
