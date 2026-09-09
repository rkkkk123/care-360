"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  Stethoscope,
  Pill,
  Store,
  Calendar,
  Clock,
  UploadCloud,
  FileText,
  AlertCircle,
  Home,
  Shield,
  ArrowRight,
  X,
  Mic,
  Activity,
  Camera,
} from "lucide-react";

interface CommandItem {
  id: string;
  category: "AI & Clinical Tools" | "Care & Doctors" | "Pharmacy & Medications" | "Portals & Personas";
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const commands: CommandItem[] = [
  // AI & Clinical Tools
  {
    id: "ai-scanner",
    category: "AI & Clinical Tools",
    title: "AI Vision Scanner (Medicine • Plants • Skin)",
    description: "Scan pills for side effects, identify Ayurvedic leaves, or check skin lesions.",
    href: "/patient/ai/scanner",
    icon: Camera,
  },
  {
    id: "ai-voice",
    category: "AI & Clinical Tools",
    title: "Bilingual Voice Assistant (English / हिन्दी)",
    description: "Hands-free speech dictation and audio responses in your native language.",
    href: "/patient/ai",
    icon: Mic,
  },
  {
    id: "upload-report",
    category: "AI & Clinical Tools",
    title: "Upload Medical Lab Report",
    description: "Extract biomarkers, abnormal values, and plain-language explanation.",
    href: "/patient/reports/upload",
    icon: UploadCloud,
  },
  {
    id: "health-trends",
    category: "AI & Clinical Tools",
    title: "Longitudinal Health Trends",
    description: "Track glycemic control, lipid profiles, and vitals graphs over time.",
    href: "/patient/health/trends",
    icon: Activity,
  },
  {
    id: "timeline",
    category: "AI & Clinical Tools",
    title: "Chronological Health Timeline",
    description: "One unified historical timeline connecting reports, consults, and medicines.",
    href: "/patient/timeline",
    icon: Clock,
  },

  // Care & Doctors
  {
    id: "find-doctors",
    category: "Care & Doctors",
    title: "Find & Compare Doctors",
    description: "Search by specialty, real-time availability, and AI clinical match %.",
    href: "/patient/doctors",
    icon: Stethoscope,
  },
  {
    id: "appointments",
    category: "Care & Doctors",
    title: "Appointments & Consultation Room",
    description: "View scheduled tele-consultations or in-person visits.",
    href: "/patient/appointments",
    icon: Calendar,
  },
  {
    id: "home-visit",
    category: "Care & Doctors",
    title: "Book In-Home Healthcare Visit",
    description: "Doctor house calls, phlebotomy blood draws, and home nursing care.",
    href: "/patient/home-visit",
    icon: Home,
  },
  {
    id: "sos-emergency",
    category: "Care & Doctors",
    title: "Rapid SOS Emergency Hub",
    description: "1-tap ambulance dispatch simulation, nearest ER maps, and Medical ID.",
    href: "/patient/emergency",
    icon: AlertCircle,
  },

  // Pharmacy & Medications
  {
    id: "prescriptions",
    category: "Pharmacy & Medications",
    title: "Active Digital Prescriptions (e-Rx)",
    description: "Cryptographically verified digital prescriptions signed by physicians.",
    href: "/patient/prescriptions",
    icon: Pill,
  },
  {
    id: "pharmacies",
    category: "Pharmacy & Medications",
    title: "Nearby Connected Pharmacies Directory",
    description: "Search dispensing pharmacies by location and open hours.",
    href: "/patient/pharmacies",
    icon: Store,
  },
  {
    id: "compare-pharmacies",
    category: "Pharmacy & Medications",
    title: "Compare Pharmacy Stock & Pricing",
    description: "Find the nearest pharmacy with all prescribed medicines in stock.",
    href: "/patient/pharmacies/compare",
    icon: Search,
  },
  {
    id: "orders",
    category: "Pharmacy & Medications",
    title: "Track Medicine Orders & Deliveries",
    description: "Live status tracker from pharmacist review to courier delivery.",
    href: "/patient/orders",
    icon: Clock,
  },

  // Portals & Personas
  {
    id: "portal-patient",
    category: "Portals & Personas",
    title: "Patient Portal (Jane Doe)",
    description: "Personal health dashboard, lab reports, and doctor bookings.",
    href: "/patient",
    icon: Home,
  },
  {
    id: "portal-doctor",
    category: "Portals & Personas",
    title: "Doctor Portal (Dr. Priya Sharma, MD)",
    description: "Clinical consultation queue, patient history, and e-Rx authoring.",
    href: "/doctor",
    icon: Stethoscope,
  },
  {
    id: "portal-pharmacy",
    category: "Portals & Personas",
    title: "Pharmacy Portal (Central Pharmacy)",
    description: "Dispensing orders queue, catalog inventory, and courier dispatch.",
    href: "/pharmacy",
    icon: Store,
  },
  {
    id: "portal-admin",
    category: "Portals & Personas",
    title: "Admin Portal (Executive Control)",
    description: "Doctor & pharmacy credentialing, user management, and compliance.",
    href: "/admin",
    icon: Shield,
  },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  const filteredCommands = React.useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? Math.max(0, filteredCommands.length - 1) : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          handleSelect(filteredCommands[selectedIndex].href);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredCommands, selectedIndex]);

  if (!open) return null;

  // Group by category
  const categories = Array.from(new Set(filteredCommands.map((c) => c.category)));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border gap-3">
          <Search className="h-5 w-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search all CARE360 tools, doctors, prescriptions, or switch roles..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No matching clinical tool or route found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            categories.map((category) => {
              const items = filteredCommands.filter((c) => c.category === category);
              return (
                <div key={category} className="space-y-1">
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    {category}
                  </div>
                  {items.map((item) => {
                    const globalIdx = filteredCommands.findIndex((c) => c.id === item.id);
                    const isSelected = globalIdx === selectedIndex;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.href)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-colors ${
                          isSelected
                            ? "bg-primary/10 border border-primary/20 text-foreground"
                            : "hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl border shrink-0 ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-secondary text-primary border-border"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-foreground">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <ArrowRight
                          className={`h-4 w-4 shrink-0 transition-transform ${
                            isSelected ? "text-primary translate-x-0.5" : "opacity-0"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/40 border-t border-border text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono text-[10px]">↑</kbd>{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono text-[10px]">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono text-[10px]">↵</kbd> to select
            </span>
          </div>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-card border border-border font-mono text-[10px]">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
