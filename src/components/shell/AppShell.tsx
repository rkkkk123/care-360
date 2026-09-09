"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./AppSidebar";
import { AppTopBar } from "./AppTopBar";
import { MobileBottomNav } from "./MobileBottomNav";
import {
  patientNavigation,
  doctorNavigation,
  pharmacyNavigation,
  adminNavigation,
} from "@/config/navigation";
import { FadeIn } from "@/components/motion/FadeIn";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isConsultation = pathname?.includes("/consultation/");
  const isDoctorRoute = pathname?.startsWith("/doctor");
  const isPharmacyRoute = pathname?.startsWith("/pharmacy");
  const isAdminRoute = pathname?.startsWith("/admin");

  // In consultation mode, provide an immersive, dedicated clinical room without app chrome
  if (isConsultation) {
    return (
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
        <main className="h-screen w-full flex flex-col p-2 sm:p-4">
          {children}
        </main>
      </div>
    );
  }

  const navigation = isDoctorRoute
    ? doctorNavigation
    : isPharmacyRoute
    ? pharmacyNavigation
    : isAdminRoute
    ? adminNavigation
    : patientNavigation;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Desktop Sidebar */}
      <AppSidebar navigation={navigation} />

      {/* Main Content Wrapper */}
      <div className="md:pl-64 flex flex-col min-h-screen pb-16 md:pb-0">
        <AppTopBar />
        
        <main className="flex-1">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <FadeIn>
              {children}
            </FadeIn>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav navigation={navigation} />
    </div>
  );
}
