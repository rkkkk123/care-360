"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Sparkles, 
  Stethoscope, 
  Store, 
  ShieldCheck, 
  User, 
  Loader2,
  Activity,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { auth } from "@/lib/auth/auth-service";

export function Hero() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = React.useState<string | null>(null);

  const [isHovering, setIsHovering] = React.useState(false);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Different spring configs for the dispersion effect
  const smoothMouseX1 = useSpring(mouseX, { damping: 20, stiffness: 100, mass: 0.5 });
  const smoothMouseY1 = useSpring(mouseY, { damping: 20, stiffness: 100, mass: 0.5 });

  const smoothMouseX2 = useSpring(mouseX, { damping: 30, stiffness: 80, mass: 0.8 });
  const smoothMouseY2 = useSpring(mouseY, { damping: 30, stiffness: 80, mass: 0.8 });

  const smoothMouseX3 = useSpring(mouseX, { damping: 40, stiffness: 60, mass: 1.2 });
  const smoothMouseY3 = useSpring(mouseY, { damping: 40, stiffness: 60, mass: 1.2 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleQuickLaunch = async (role: "patient" | "doctor" | "pharmacy" | "admin") => {
    setLoadingRole(role);
    const emails: Record<string, string> = {
      patient: "jane.doe@care360.health",
      doctor: "dr.sharma@care360.health",
      pharmacy: "pharmacy@care360.health",
      admin: "admin@care360.health",
    };

    try {
      await auth.signIn({
        email: emails[role],
        password: "Care360Secure!",
      });
    } catch {}

    setTimeout(() => {
      router.push(`/${role}`);
    }, 350);
  };

  return (
    <section 
      className="relative overflow-hidden pt-28 pb-20 md:pt-44 md:pb-32 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cinematic seamless blend: Transparent at the top/middle for full image impact, fading to background color at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-background z-0 pointer-events-none" />

      {/* Anti-gravity Tri-color Cursor Dispersion Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ opacity: isHovering ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Layer 1: Saffron */}
          <motion.div 
            style={{ x: smoothMouseX1, y: smoothMouseY1, translateX: '-50%', translateY: '-50%' }} 
            className="absolute top-0 left-0 w-[180px] h-[180px] bg-[#FF9933] blur-[40px] rounded-full opacity-90 z-20 pointer-events-none"
          />
          
          {/* Layer 2: White (Center Core) */}
          <motion.div 
            style={{ x: smoothMouseX2, y: smoothMouseY2, translateX: '-50%', translateY: '-50%' }} 
            className="absolute top-0 left-0 w-[100px] h-[100px] bg-white blur-[15px] rounded-full opacity-100 z-30 pointer-events-none shadow-[0_0_50px_rgba(255,255,255,1)]"
          />

          {/* Layer 3: Green */}
          <motion.div 
            style={{ x: smoothMouseX3, y: smoothMouseY3, translateX: '-50%', translateY: '-50%' }} 
            className="absolute top-0 left-0 w-[180px] h-[180px] bg-[#138808] blur-[40px] rounded-full opacity-90 z-10 pointer-events-none"
          />
        </motion.div>
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Ecosystem Pill Badge */}
          <FadeIn>
            <div className="inline-flex items-center rounded-full border border-border bg-background/50 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-foreground mb-8 shadow-apple-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary mr-2 animate-pulse" />
              <span>The Next-Generation Healthcare Infrastructure</span>
            </div>
          </FadeIn>
          
          {/* Main Title */}
          <FadeIn delay={0.1}>
            <h1 
              className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter text-foreground mb-6" 
              style={{ lineHeight: 0.95 }}
            >
              Healthcare, <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">architected for life.</span>
            </h1>
          </FadeIn>
          
          {/* Subheadings */}
          <FadeIn delay={0.2}>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto font-medium leading-relaxed tracking-tight">
              A million-dollar ecosystem integrating Patients, Doctors, Pharmacies, and AI into a single, cohesive, frictionless platform.
            </p>
            <p className="text-xs text-muted-foreground/60 font-semibold tracking-widest uppercase mb-12">
              Visionary Technology • Infinite Scale • Ultimate Care
            </p>
          </FadeIn>
          
          {/* Primary Action Buttons */}
          <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Button 
              size="lg" 
              disabled={loadingRole !== null}
              onClick={() => handleQuickLaunch("patient")}
              className="w-full sm:w-auto h-14 px-8 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] shadow-apple-md"
            >
              {loadingRole === "patient" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Initializing Core...</span>
                </>
              ) : (
                <>
                  <span>Enter Platform</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto h-14 px-8 rounded-full border-border bg-background/50 backdrop-blur-sm text-foreground font-semibold text-sm hover:bg-secondary transition-all duration-200 active:scale-[0.98]" 
              asChild
            >
              <Link href="/how-it-works">
                View Architecture
              </Link>
            </Button>
          </FadeIn>

          {/* Quick Launch Role Ribbon */}
          <FadeIn delay={0.4} className="mt-12 w-full max-w-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-background/40 backdrop-blur-md border border-border/50 py-3 px-6 rounded-full shadow-apple-sm">
              <span className="text-muted-foreground font-semibold tracking-wide text-xs shrink-0 uppercase">
                Access Portals:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleQuickLaunch("patient")}
                  disabled={loadingRole !== null}
                  className="inline-flex items-center gap-1.5 text-foreground text-sm font-semibold hover:text-primary transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" /> Patient
                </button>
                <span className="text-border text-xs">•</span>
                <button
                  type="button"
                  onClick={() => handleQuickLaunch("doctor")}
                  disabled={loadingRole !== null}
                  className="inline-flex items-center gap-1.5 text-foreground text-sm font-semibold hover:text-primary transition-colors cursor-pointer"
                >
                  <Stethoscope className="w-3.5 h-3.5" /> Doctor
                </button>
                <span className="text-border text-xs">•</span>
                <button
                  type="button"
                  onClick={() => handleQuickLaunch("pharmacy")}
                  disabled={loadingRole !== null}
                  className="inline-flex items-center gap-1.5 text-foreground text-sm font-semibold hover:text-primary transition-colors cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5" /> Pharmacy
                </button>
                <span className="text-border text-xs">•</span>
                <button
                  type="button"
                  onClick={() => handleQuickLaunch("admin")}
                  disabled={loadingRole !== null}
                  className="inline-flex items-center gap-1.5 text-foreground text-sm font-semibold hover:text-primary transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin
                </button>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* World-Class Architecture Diagram */}
        <FadeIn delay={0.5} className="mt-24 md:mt-32">
          <div className="relative mx-auto max-w-6xl rounded-[2.5rem] bg-card/60 backdrop-blur-2xl border border-border/80 shadow-apple-lg overflow-hidden p-10 md:p-16">
            
            <div className="text-center mb-12 relative z-10">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Platform Architecture Topology</h3>
              <p className="text-sm text-muted-foreground font-medium mt-2">Real-time symmetric data replication across 4 dedicated clinical sub-systems.</p>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center justify-center w-full">
              
              {/* Left Column (Inputs) */}
              <div className="flex flex-col gap-8">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-background rounded-3xl border border-border shadow-apple-sm p-6 relative group"
                >
                  <div className="absolute -right-4 top-1/2 w-8 h-[2px] bg-border hidden md:block" />
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground border border-border">
                      <User className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Patient Node</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">End-User Interface</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Telemetry, symptom logs, and WebRTC streaming origin.</p>
                </motion.div>

                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-background rounded-3xl border border-border shadow-apple-sm p-6 relative group"
                >
                  <div className="absolute -right-4 top-1/2 w-8 h-[2px] bg-border hidden md:block" />
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground border border-border">
                      <Store className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Pharmacy Node</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">Fulfillment API</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Inventory synchronization and e-Rx cryptographic fulfillment.</p>
                </motion.div>
              </div>

              {/* Center Column (Core Brain) */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative flex flex-col items-center justify-center"
              >
                {/* Connecting Lines Desktop */}
                <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-border -z-10 hidden md:block" />
                <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-border -z-10 hidden md:block" />

                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-background border border-border flex flex-col items-center justify-center shadow-apple-lg relative">
                  <div className="absolute inset-0 rounded-full border border-border/50 animate-[spin_10s_linear_infinite]" style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }} />
                  <div className="absolute inset-2 rounded-full border border-border/50 animate-[spin_15s_linear_infinite_reverse]" style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent' }} />
                  
                  <Cpu className="w-10 h-10 text-foreground stroke-[1.5] mb-3" />
                  <h3 className="text-xl font-bold tracking-tight text-foreground">CARE360 Core</h3>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Central Brain</span>
                  
                  <div className="absolute -bottom-3 bg-secondary border border-border px-3 py-1 rounded-full flex items-center gap-1.5 shadow-apple-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-foreground" />
                    <span className="text-[10px] font-semibold text-foreground uppercase tracking-wide">Encrypted Engine</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Column (Outputs) */}
              <div className="flex flex-col gap-8">
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="bg-background rounded-3xl border border-border shadow-apple-sm p-6 relative group"
                >
                  <div className="absolute -left-4 top-1/2 w-8 h-[2px] bg-border hidden md:block" />
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground border border-border">
                      <Stethoscope className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Physician Node</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">Clinical Workspace</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Diagnostic dashboard with AI Copilot guardrails and WebRTC.</p>
                </motion.div>

                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="bg-background rounded-3xl border border-border shadow-apple-sm p-6 relative group"
                >
                  <div className="absolute -left-4 top-1/2 w-8 h-[2px] bg-border hidden md:block" />
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground border border-border">
                      <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Governance Node</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">Admin Telemetry</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Real-time credential verification and system oversight.</p>
                </motion.div>
              </div>

            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
