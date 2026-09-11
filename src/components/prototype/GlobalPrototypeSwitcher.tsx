"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { User, Stethoscope, Store, Shield, Settings2, X, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth/auth-service";

const roles = [
  {
    id: "patient",
    name: "Patient Portal",
    icon: User,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    email: "jane.doe@care360.health",
    path: "/patient"
  },
  {
    id: "doctor",
    name: "Doctor Dashboard",
    icon: Stethoscope,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    email: "dr.sharma@care360.health",
    path: "/doctor"
  },
  {
    id: "pharmacy",
    name: "Pharmacy Hub",
    icon: Store,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    email: "pharmacy@care360.health",
    path: "/pharmacy"
  },
  {
    id: "admin",
    name: "Admin Platform",
    icon: Shield,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    email: "admin@care360.health",
    path: "/admin"
  }
];

export function GlobalPrototypeSwitcher() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSwitching, setIsSwitching] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => setMounted(true), []);

  const handleSwitch = (role: typeof roles[0]) => {
    setIsSwitching(role.id);
    router.push(role.path);
    setTimeout(() => {
      setIsOpen(false);
      setIsSwitching(null);
    }, 200);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[9999] h-12 w-12 md:h-14 md:w-14 rounded-full bg-foreground text-background shadow-apple-lg flex items-center justify-center border-2 border-background/20 backdrop-blur-md hover:shadow-apple-xl transition-shadow"
      >
        <Settings2 className="w-5 h-5 md:w-6 md:h-6" />
      </motion.button>

      {/* Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[9998] bg-background/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-36 right-4 left-4 sm:left-auto sm:right-6 z-[9999] sm:w-[320px] rounded-3xl bg-card border border-border shadow-apple-xl overflow-hidden"
            >
              <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Prototype Switcher</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Instant ecosystem navigation</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-background transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="p-2 space-y-1">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleSwitch(role)}
                    disabled={isSwitching !== null}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-secondary/80 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${role.bg} ${role.color}`}>
                        <role.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm flex items-center gap-2">
                          {role.name}
                          {isSwitching === role.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"
                            />
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{role.email}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
