"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Store,
  ShieldCheck,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Package,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingShell } from "@/components/auth/OnboardingShell";
import { auth } from "@/lib/auth/auth-service";

export default function PharmacyOnboarding() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [isEntering, setIsEntering] = React.useState(false);

  // Pharmacy Form State
  const [pharmacyName, setPharmacyName] = React.useState("Walgreens Digital Care #4190");
  const [address, setAddress] = React.useState("859 El Camino Real, Palo Alto, CA 94301");
  const [phone, setPhone] = React.useState("(650) 555-0192");

  const [licenseNumber, setLicenseNumber] = React.useState("CA-PHY-99214");
  const [nabpNumber, setNabpNumber] = React.useState("0582910");

  const [dispatchRadius, setDispatchRadius] = React.useState("10");
  const [fulfillmentModes, setFulfillmentModes] = React.useState<string[]>([
    "Same-Day Courier Delivery",
    "In-Store Express Pickup",
  ]);

  const toggleMode = (m: string) => {
    setFulfillmentModes((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
    );
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setIsEntering(true);
      try {
        await auth.updateProfile({
          firstName: pharmacyName,
          lastName: "", // Pharmacies might not have a last name, or we can use it for unit number
          onboardingStatus: "completed",
        });
      } catch (err) {
        console.error(err);
      }
      setTimeout(() => {
        window.location.href = "/pharmacy";
      }, 400);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const titles = [
    "Pharmacy Identity & Location",
    "State Board License & NABP",
    "Courier & Fulfillment Capacity",
    "Review & Launch Pharmacy Portal",
  ];

  const descriptions = [
    "Specify your pharmacy location, contact lines, and local community service area.",
    "State Board of Pharmacy license and National Association of Boards of Pharmacy record.",
    "Set local courier dispatch radius and patient in-store pickup options.",
    "Your pharmacy is verified and ready to fulfill electronic prescriptions.",
  ];

  return (
    <OnboardingShell
      title={titles[step - 1]}
      description={descriptions[step - 1]}
      currentStep={step}
      totalSteps={4}
    >
      <div className="space-y-6 mb-8">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pharmacy Name & Unit Number
              </label>
              <input
                type="text"
                value={pharmacyName}
                onChange={(e) => setPharmacyName(e.target.value)}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Physical Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Direct Dispensary Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
              />
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                California Pharmacy Board License Number
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                NABP e-Profile Number
              </label>
              <input
                type="text"
                value={nabpNumber}
                onChange={(e) => setNabpNumber(e.target.value)}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
              />
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">Active Courier Dispatch Radius</span>
                <span className="font-mono font-bold text-orange-600">{dispatchRadius} Miles</span>
              </div>
              <input
                type="range"
                min="2"
                max="25"
                step="1"
                value={dispatchRadius}
                onChange={(e) => setDispatchRadius(e.target.value)}
                className="w-full accent-orange-600 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Fulfillment Capabilities
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["Same-Day Courier Delivery", "In-Store Express Pickup"].map((mode) => {
                  const isSelected = fulfillmentModes.includes(mode);
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => toggleMode(mode)}
                      className={`p-3.5 rounded-2xl text-xs font-medium border text-left transition-all ${
                        isSelected
                          ? "border-orange-500/40 bg-orange-500/10 text-orange-600 font-semibold"
                          : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{mode}</span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-orange-600 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="rounded-3xl border border-orange-500/30 bg-orange-500/5 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
                    <Store className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{pharmacyName}</h3>
                    <p className="text-xs text-muted-foreground">{address}</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  License Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-2xl bg-card p-3 border border-border space-y-1">
                  <span className="text-muted-foreground text-[10px] uppercase font-semibold">License</span>
                  <p className="font-semibold text-foreground">{licenseNumber}</p>
                </div>
                <div className="rounded-2xl bg-card p-3 border border-border space-y-1">
                  <span className="text-muted-foreground text-[10px] uppercase font-semibold">NABP</span>
                  <p className="font-semibold text-foreground">{nabpNumber}</p>
                </div>
                <div className="rounded-2xl bg-card p-3 border border-border space-y-1">
                  <span className="text-muted-foreground text-[10px] uppercase font-semibold">Dispatch</span>
                  <p className="font-semibold text-orange-600">{dispatchRadius} Mi Radius</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Dispensing Hub Live</p>
              <p>You can now manage inventory, process electronic prescriptions, and coordinate couriers.</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="rounded-full text-xs px-5"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={isEntering}
          className="rounded-full text-xs px-6 shadow-sm bg-orange-600 hover:bg-orange-700 text-white font-semibold transition-all duration-200 cursor-pointer"
        >
          {isEntering ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Entering Hub...</span>
            </span>
          ) : step === 4 ? (
            <span className="flex items-center gap-1.5">
              <span>Enter Pharmacy Hub</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          )}
        </Button>
      </div>
    </OnboardingShell>
  );
}
