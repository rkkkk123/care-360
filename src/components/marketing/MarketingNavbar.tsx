"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Sparkles, Clock, Network, Store, Activity, BrainCircuit } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { motion, AnimatePresence } from "framer-motion";

const navSections = [
  { 
    name: "AI Intelligence", 
    id: "ai",
    title: "Gemini Vision AI Engine",
    description: "Multi-modal AI scanning for real-time medical image analysis, pill identification, and dermatological screening.",
    icon: BrainCircuit,
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  { 
    name: "Care Network", 
    id: "care",
    title: "Unified Provider Ecosystem",
    description: "Seamlessly connect with verified specialists, manage appointments, and enable end-to-end encrypted telehealth video.",
    icon: Network,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  { 
    name: "Pharmacy Hub", 
    id: "pharmacy",
    title: "Automated E-Prescribing",
    description: "Direct prescription routing to local pharmacies for rapid fulfillment, inventory tracking, and home delivery.",
    icon: Store,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  { 
    name: "Health Timeline", 
    id: "timeline",
    title: "Longitudinal Patient Record",
    description: "A chronological, visually stunning journey of your health history, lab results, and predictive wellness metrics.",
    icon: Activity,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
];

export function MarketingNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  // Track which section was clicked to show "Future Phase"
  const [clickedSection, setClickedSection] = React.useState<string | null>(null);

  React.useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSectionClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    // Currently no-op or you can add scroll logic here if needed
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            <Logo size="sm" />
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-1 bg-secondary/30 backdrop-blur-md border border-border/50 rounded-full p-1.5 shadow-sm relative">
          {navSections.map((item) => {
            const isClicked = clickedSection === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={(e) => handleSectionClick(item.id, e)}
                  className={cn(
                    "relative flex items-center justify-center h-9 px-5 rounded-full text-sm font-medium outline-none transition-colors duration-200 z-10",
                    isClicked ? "text-primary" : "text-foreground/80 group-hover:text-foreground group-hover:bg-background/50"
                  )}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {isClicked && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-primary/10 rounded-full border border-primary/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  <div className="relative z-20 flex items-center justify-center overflow-hidden h-full min-w-[100px]">
                    <span className="whitespace-nowrap">
                      {item.name}
                    </span>
                  </div>
                </button>

                {/* Industry-Grade Hover Card Popup */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[340px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50 pointer-events-none">
                  <div className="bg-card/95 backdrop-blur-xl border border-border/60 shadow-apple-lg rounded-3xl p-5 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-foreground pointer-events-none">
                      <item.icon className="w-32 h-32 -mt-4 -mr-4" />
                    </div>
                    <div className="relative z-10 flex items-start gap-4">
                      <div className={cn("shrink-0 p-2.5 rounded-2xl border border-border/50", item.bg, item.color)}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-3">
          <Button variant="ghost" asChild className="text-foreground hover:text-primary">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20 px-5 font-semibold transition-all duration-200">
            <Link href="/login">Enter CARE360</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-5 sm:max-w-sm sm:ring-1 sm:ring-border">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center" onClick={() => setMobileMenuOpen(false)}>
                <Logo size="sm" />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-2 py-6">
                  {navSections.map((item) => {
                    const isClicked = clickedSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={(e) => handleSectionClick(item.id, e)}
                        className={cn(
                          "w-full text-left -mx-3 block rounded-lg px-3 py-3 text-base font-semibold leading-7 transition-colors",
                          isClicked ? "bg-primary/10 text-primary" : "hover:bg-accent text-foreground"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{item.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="py-6 flex flex-col gap-3">
                  <Button variant="outline" asChild className="w-full justify-center text-foreground">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                  </Button>
                  <Button asChild className="w-full justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Enter CARE360</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
