"use client";

import * as React from "react";
import Link from "next/link";
import {
  Store,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Pill,
  ArrowRight,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pharmacy } from "@/types/models/pharmacy";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

export default function PharmaciesDirectoryPage() {
  const [pharmacies, setPharmacies] = React.useState<Pharmacy[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterMode, setFilterMode] = React.useState<"all" | "delivery" | "24h" | "verified">("all");
  const [viewState, setViewState] = React.useState({
    longitude: 77.2090,
    latitude: 28.6139,
    zoom: 11
  });
  const [selectedPharmacy, setSelectedPharmacy] = React.useState<Pharmacy | null>(null);
  const [locationSearchQuery, setLocationSearchQuery] = React.useState("");
  const [isGeocoding, setIsGeocoding] = React.useState(false);
  
  const MAPBOX_TOKEN =
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    "";

  React.useEffect(() => {
    async function loadPharmacies() {
      try {
        const res = await fetch("/api/pharmacies");
        if (res.ok) {
          const data = await res.json();
          setPharmacies(data.pharmacies || []);
        }
      } catch (err) {
        console.error("Failed to load pharmacies:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPharmacies();
  }, []);

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationSearchQuery.trim() || !MAPBOX_TOKEN) return;
    
    setIsGeocoding(true);
    try {
      const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationSearchQuery)}.json?access_token=${MAPBOX_TOKEN}&types=place,postcode,address`);
      if (res.ok) {
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setViewState((prev) => ({ ...prev, longitude: lng, latitude: lat, zoom: 12 }));
        }
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    } finally {
      setIsGeocoding(false);
    }
  };

  const filtered = pharmacies.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      p.name.toLowerCase().includes(q) ||
      p.address.street.toLowerCase().includes(q) ||
      p.address.city.toLowerCase().includes(q) ||
      p.licenseNumber.toLowerCase().includes(q);

    if (!matchesQuery) return false;

    if (filterMode === "delivery") return p.deliveryAvailable;
    if (filterMode === "24h") return p.is24Hours;
    if (filterMode === "verified") return p.verificationStatus === "verified";
    return true;
  });

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8 pb-24 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            Licensed Pharmacy Fulfillment Network
          </div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Connected Pharmacies
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Verified pharmacy partners for seamless e-prescription routing, same-day pickup, and delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs" asChild>
            <Link href="/patient/prescriptions">
              <Pill className="h-3.5 w-3.5 mr-1.5 text-primary" />
              My Prescriptions
            </Link>
          </Button>

          <Button size="sm" className="rounded-full text-xs shadow-sm" asChild>
            <Link href="/patient/pharmacies/compare">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Compare Stock & Pricing
            </Link>
          </Button>
        </div>
      </div>

      {/* Network Guarantee */}
      <div className="rounded-3xl border border-primary/20 bg-primary/[0.04] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4" />
            <span>Automated Prescription Transmission</span>
          </div>
          <p className="text-sm text-muted-foreground">
            When your CARE360 physician writes an e-prescription, it transmits directly to your chosen pharmacy with insurance pre-check and real-time inventory reservation.
          </p>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pharmacies by name, city, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-border bg-card shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs scrollbar-none">
          {(
            [
              { id: "all", label: "All Pharmacies" },
              { id: "verified", label: "Verified Only" },
              { id: "delivery", label: "Courier Delivery" },
              { id: "24h", label: "Open 24 Hours" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id)}
              className={`rounded-full px-3.5 py-2 text-xs transition whitespace-nowrap ${
                filterMode === tab.id
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Mapbox */}
      {!loading && MAPBOX_TOKEN && filtered.length > 0 && (
        <div className="h-[400px] md:h-[550px] w-full rounded-[2.5rem] overflow-hidden border border-primary/20 shadow-2xl relative group ring-1 ring-border/50">
          {/* Map Location Search Overlay */}
          <div className="absolute top-4 left-4 z-10 w-64 md:w-80">
            <form onSubmit={handleLocationSearch} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search location on map..."
                value={locationSearchQuery}
                onChange={(e) => setLocationSearchQuery(e.target.value)}
                className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl pl-10 pr-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              {isGeocoding && (
                <div className="absolute right-3.5 h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              )}
            </form>
          </div>

          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            <NavigationControl position="top-right" />
            
            {filtered.map(pharm => (
              <Marker
                key={pharm.id}
                longitude={pharm.address.lng}
                latitude={pharm.address.lat}
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setSelectedPharmacy(pharm);
                }}
              >
                <div className="relative flex items-center justify-center group cursor-pointer z-10">
                  <div className="absolute -inset-2 rounded-full bg-primary/40 animate-ping opacity-75" />
                  <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-xl border-4 border-background group-hover:scale-110 transition-transform duration-300 z-10">
                    <Store className="h-6 w-6" />
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-20 border border-border">
                    {pharm.name}
                  </div>
                </div>
              </Marker>
            ))}

            {selectedPharmacy && (
              <Popup
                longitude={selectedPharmacy.address.lng}
                latitude={selectedPharmacy.address.lat}
                anchor="bottom"
                onClose={() => setSelectedPharmacy(null)}
                closeOnClick={false}
                className="rounded-2xl overflow-hidden shadow-lg"
                maxWidth="300px"
              >
                <div className="p-3 bg-card text-foreground rounded-2xl border border-border space-y-2">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{selectedPharmacy.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{selectedPharmacy.address.street}, {selectedPharmacy.address.city}</p>
                  <Button size="sm" className="w-full h-8 text-xs rounded-full" asChild>
                    <Link href={`/patient/pharmacies/${selectedPharmacy.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </Popup>
            )}
          </Map>
        </div>
      )}

      {/* Pharmacy List */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading connected pharmacies...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-sm space-y-3">
          <Store className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-medium text-foreground">No matching pharmacies</h3>
          <p className="text-xs text-muted-foreground">
            No pharmacies matched your filters. Try clearing filters or search terms.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((pharm) => {
            return (
              <div
                key={pharm.id}
                className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm hover:border-primary/30 transition-all space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-foreground border border-border shrink-0">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-medium text-foreground">{pharm.name}</h3>
                        {pharm.verificationStatus === "verified" && (
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Verified Network Partner
                          </span>
                        )}
                        {pharm.is24Hours && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            24 Hours
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        License #{pharm.licenseNumber} • NABP: {pharm.nabpNumber || pharm.ncpdpNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {pharm.pickupAvailable && (
                      <span className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary" /> In-Store Pickup
                      </span>
                    )}
                    {pharm.deliveryAvailable && (
                      <span className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground flex items-center gap-1">
                        <Truck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Courier Delivery
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{pharm.address.street}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {pharm.address.city}, {pharm.address.state} {pharm.address.zip}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Hours of Operation</p>
                      <p className="text-[11px] text-muted-foreground">{pharm.hours}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Phone & Support</p>
                      <p className="text-[11px] text-muted-foreground">{pharm.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/50">
                  <span className="text-xs text-muted-foreground w-full sm:w-auto text-center sm:text-left">
                    Connected to CARE360 e-Prescribing Gateway
                  </span>

                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="rounded-full text-xs w-full sm:w-auto" asChild>
                      <Link href={`/patient/pharmacies/${pharm.id}`}>
                        View Profile & Inventory
                      </Link>
                    </Button>
                    <Button size="sm" className="rounded-full text-xs w-full sm:w-auto" asChild>
                      <Link href={`/patient/pharmacies/compare`}>
                        Compare & Order
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
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
