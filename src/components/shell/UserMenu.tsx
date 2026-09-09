"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  User,
  Settings,
  Stethoscope,
  Store,
  Shield,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/auth-service";

export function UserMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const isDoctor = pathname?.startsWith("/doctor");
  const isPharmacy = pathname?.startsWith("/pharmacy");
  const isAdmin = pathname?.startsWith("/admin");

  const currentRole = isDoctor
    ? "Doctor"
    : isPharmacy
    ? "Pharmacy"
    : isAdmin
    ? "Admin"
    : "Patient";

  const currentName = isDoctor
    ? "Dr. Priya Sharma, MD"
    : isPharmacy
    ? "Walgreens Digital Hub"
    : isAdmin
    ? "Roshan (Platform Admin)"
    : "Jane Doe";

  const currentEmail = isDoctor
    ? "doctor@care360.health"
    : isPharmacy
    ? "pharmacy@care360.health"
    : isAdmin
    ? "admin@care360.health"
    : "patient@care360.health";

  const handleSignOut = async () => {
    await auth.signOut();
    router.push("/login");
  };

  const handleSwitchPersona = async (targetHref: string) => {
    setIsOpen(false);
    
    let email = "patient@care360.health";
    if (targetHref === "/doctor") email = "dr.sharma@care360.health";
    else if (targetHref === "/pharmacy") email = "pharmacy@care360.health";
    else if (targetHref === "/admin") email = "admin@care360.health";
    else if (targetHref === "/patient") email = "jane.doe@care360.health";

    try {
      await auth.signIn({ email, password: "Care360Secure!" });
      window.location.href = targetHref;
    } catch (e) {
      console.error("Failed to switch persona", e);
    }
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm"
        className="rounded-full bg-secondary/50 border border-border px-2.5 py-1.5 h-auto flex items-center gap-2 hover:bg-secondary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
          {currentName.charAt(0)}
        </div>
        <span className="text-xs font-medium text-foreground hidden sm:inline-block max-w-[120px] truncate">
          {currentName.split(" ")[0]}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary hidden md:inline-block">
          {currentRole}
        </span>
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            {/* User Header */}
            <div className="px-4 py-3 border-b border-border bg-secondary/20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">{currentName}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-primary/10 text-primary">
                  {currentRole}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">{currentEmail}</p>
            </div>

            {/* Persona Quick Switcher */}
            <div className="p-2 border-b border-border bg-secondary/10">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Switch Ecosystem Persona
              </div>
              <div className="grid grid-cols-2 gap-1 pt-1">
                <button
                  onClick={() => handleSwitchPersona("/patient")}
                  className={`flex items-center gap-1.5 p-1.5 rounded-xl text-xs font-medium transition-colors text-left ${
                    currentRole === "Patient"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <User className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Patient</span>
                  {currentRole === "Patient" && <Check className="h-3 w-3 ml-auto" />}
                </button>

                <button
                  onClick={() => handleSwitchPersona("/doctor")}
                  className={`flex items-center gap-1.5 p-1.5 rounded-xl text-xs font-medium transition-colors text-left ${
                    currentRole === "Doctor"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Stethoscope className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Doctor</span>
                  {currentRole === "Doctor" && <Check className="h-3 w-3 ml-auto" />}
                </button>

                <button
                  onClick={() => handleSwitchPersona("/pharmacy")}
                  className={`flex items-center gap-1.5 p-1.5 rounded-xl text-xs font-medium transition-colors text-left ${
                    currentRole === "Pharmacy"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Store className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Pharmacy</span>
                  {currentRole === "Pharmacy" && <Check className="h-3 w-3 ml-auto" />}
                </button>

                <button
                  onClick={() => handleSwitchPersona("/admin")}
                  className={`flex items-center gap-1.5 p-1.5 rounded-xl text-xs font-medium transition-colors text-left ${
                    currentRole === "Admin"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Shield className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Admin</span>
                  {currentRole === "Admin" && <Check className="h-3 w-3 ml-auto" />}
                </button>
              </div>
            </div>

            {/* Profile & Settings Navigation */}
            <div className="p-1 text-xs">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs rounded-xl h-8"
                onClick={() => {
                  router.push(isDoctor ? "/doctor/settings" : isPharmacy ? "/pharmacy/settings" : isAdmin ? "/admin/settings" : "/patient/settings");
                  setIsOpen(false);
                }}
              >
                <Settings className="mr-2 h-3.5 w-3.5" />
                {currentRole} Settings
              </Button>
            </div>

            {/* Sign out */}
            <div className="p-1 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 rounded-xl h-8"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sign out
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
