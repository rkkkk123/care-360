"use client";

import * as React from "react";
import Link from "next/link";
import {
  Pill,
  Search,
  Save,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  DollarSign,
  Plus,
  Minus,
  ShieldCheck,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PharmacyInventoryItem } from "@/types/models/pharmacy";

export default function PharmacyInventoryPage() {
  const pharmacyId = "pharm_1"; // Default demo pharmacy Walgreens Palo Alto

  const [items, setItems] = React.useState<PharmacyInventoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const loadInventory = async () => {
    try {
      const res = await fetch(`/api/pharmacies/${pharmacyId}/inventory`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.inventory || []);
      }
    } catch (err) {
      console.error("Failed to load inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadInventory();
  }, []);

  const updateField = (id: string, field: keyof PharmacyInventoryItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "stockQuantity") {
            updated.inStock = Number(value) > 0;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleSaveItem = async (item: PharmacyInventoryItem) => {
    setSaving(item.id);
    setSaveSuccess(null);
    setError(null);

    try {
      const res = await fetch(`/api/pharmacies/${pharmacyId}/inventory`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicineId: item.medicineId,
          stockQuantity: item.stockQuantity,
          unitPrice: item.unitPrice,
          inStock: item.inStock,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update item");

      setSaveSuccess(`Updated ${item.medicineName} successfully.`);
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update item");
    } finally {
      setSaving(null);
    }
  };

  const filtered = items.filter((i) => {
    const q = searchQuery.toLowerCase();
    return (
      i.medicineName.toLowerCase().includes(q) ||
      (i.ndc && i.ndc.toLowerCase().includes(q)) ||
      (i.form && i.form.toLowerCase().includes(q))
    );
  });

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/pharmacy"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Medication Inventory & Pricing
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Walgreens Digital Care #4190 • Stock levels feed real-time patient pharmacy matching.
          </p>
        </div>

        <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={loadInventory}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Refresh Stock
        </Button>
      </div>

      {/* Save Toast Notification */}
      {saveSuccess && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-xs text-destructive flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search catalog by drug name, NDC, or form..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-border bg-card shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading pharmacy inventory...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-sm space-y-3">
          <Package className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-medium text-foreground">No medications match</h3>
          <p className="text-xs text-muted-foreground">Try clearing your search query.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-secondary/40 border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Medication & NDC</th>
                  <th className="py-3.5 px-4">Dosage / Form</th>
                  <th className="py-3.5 px-4">Physical Stock</th>
                  <th className="py-3.5 px-4">Reserved</th>
                  <th className="py-3.5 px-4">Available</th>
                  <th className="py-3.5 px-4">Unit Price ($)</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((item) => {
                  const available = Math.max(0, item.stockQuantity - item.reservedQuantity);
                  return (
                    <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-foreground text-sm">{item.medicineName}</p>
                          <p className="font-mono text-[11px] text-muted-foreground">NDC: {item.ndc}</p>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-muted-foreground">
                        <span className="font-medium text-foreground">{item.dosage}</span>
                        <br />
                        <span className="capitalize text-[11px]">{item.form}</span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateField(item.id, "stockQuantity", Math.max(0, item.stockQuantity - 10))}
                            className="p-1 rounded bg-secondary hover:bg-secondary/80 text-muted-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <input
                            type="number"
                            value={item.stockQuantity}
                            onChange={(e) => updateField(item.id, "stockQuantity", Number(e.target.value))}
                            className="w-16 text-center font-mono py-1 rounded-lg border border-border bg-card text-foreground font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => updateField(item.id, "stockQuantity", item.stockQuantity + 10)}
                            className="p-1 rounded bg-secondary hover:bg-secondary/80 text-muted-foreground"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-muted-foreground">
                        {item.reservedQuantity}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`font-mono font-bold ${
                            available > 5
                              ? "text-emerald-600 dark:text-emerald-400"
                              : available > 0
                              ? "text-amber-500"
                              : "text-destructive"
                          }`}
                        >
                          {available}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="relative w-24">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateField(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                            className="w-full pl-6 pr-2 py-1 font-mono rounded-lg border border-border bg-card text-foreground font-semibold"
                          />
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Button
                          size="sm"
                          disabled={saving === item.id}
                          onClick={() => handleSaveItem(item)}
                          className="rounded-full text-xs h-8 px-3"
                        >
                          {saving === item.id ? (
                            <span className="inline-block h-3 w-3 animate-spin rounded-full border border-primary-foreground border-t-transparent" />
                          ) : (
                            <span className="flex items-center gap-1">
                              <Save className="h-3 w-3" />
                              Save
                            </span>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
