"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Loader2, 
  Mail, 
  Lock, 
  ArrowRight, 
  User, 
  Stethoscope, 
  Store, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2
} from "lucide-react";

import { loginSchema, LoginFormValues } from "@/features/auth/schemas/login.schema";
import { auth } from "@/lib/auth/auth-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const [error, setError] = React.useState<string | null>(null);
  const [activeDemoRole, setActiveDemoRole] = React.useState<string | null>(null);
  const [isEntering, setIsEntering] = React.useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    setIsEntering(true);
    try {
      const { user, error: authError } = await auth.signIn({
        email: data.email,
        password: data.password,
      });

      if (authError || !user) {
        setError(authError?.message || "Invalid credentials. Please verify your email and password.");
        setIsEntering(false);
        return;
      }

      // Smooth state transition
      setTimeout(() => {
        const dest = redirectPath === "/" ? `/${user.role}` : redirectPath;
        router.push(dest);
      }, 400);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsEntering(false);
    }
  };

  const handleInstantDemoLogin = async (
    role: "patient" | "doctor" | "pharmacy" | "admin",
    email: string,
    pass: string
  ) => {
    setActiveDemoRole(role);
    setIsEntering(true);
    setError(null);
    form.setValue("email", email);
    form.setValue("password", pass);

    try {
      const { user } = await auth.signIn({ email, password: pass });
      setTimeout(() => {
        if (user) {
          const dest = redirectPath === "/" ? `/${user.role}` : redirectPath;
          router.push(dest);
        } else {
          router.push(`/${role}`);
        }
      }, 500);
    } catch {
      router.push(`/${role}`);
    }
  };

  const demoAccounts = [
    {
      role: "patient" as const,
      name: "Jane Doe",
      email: "jane.doe@care360.health",
      pass: "Care360Secure!",
      title: "Patient Portal",
      sub: "AI Scanners, Appointments & Rx",
      icon: User,
      color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    },
    {
      role: "doctor" as const,
      name: "Dr. Ananya Sharma",
      email: "dr.sharma@care360.health",
      pass: "Care360Secure!",
      title: "Doctor Portal",
      sub: "Telehealth & Clinical Copilot",
      icon: Stethoscope,
      color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      role: "pharmacy" as const,
      name: "Walgreens #4190",
      email: "pharmacy@care360.health",
      pass: "Care360Secure!",
      title: "Pharmacy Portal",
      sub: "Rx Dispensing & Courier Orders",
      icon: Store,
      color: "text-orange-600 bg-orange-500/10 border-orange-500/20",
    },
    {
      role: "admin" as const,
      name: "System Governance",
      email: "admin@care360.health",
      pass: "Care360Secure!",
      title: "Admin Portal",
      sub: "Audits, Analytics & Verifications",
      icon: ShieldCheck,
      color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="w-full max-w-lg mx-auto py-4">
      {/* Top Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CARE360 Secure Ecosystem Access</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Welcome to CARE360
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto font-light">
          Your health. One connected ecosystem. Sign in or launch instant demo access.
        </p>
      </div>

      {/* Main Apple-Grade Card */}
      <div className="relative rounded-3xl border border-border bg-card/90 backdrop-blur-xl p-6 sm:p-9 shadow-xl space-y-8">
        {/* Role Quick-Launch Switcher */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              1-Click Instant Demo Launchpad
            </span>
            <span className="text-[10px] text-muted-foreground/80 font-mono">
              Pre-Configured
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {demoAccounts.map((acc) => {
              const Icon = acc.icon;
              const isSelected = activeDemoRole === acc.role;
              return (
                <button
                  key={acc.role}
                  type="button"
                  disabled={isEntering}
                  onClick={() => handleInstantDemoLogin(acc.role, acc.email, acc.pass)}
                  className={`group text-left p-3.5 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20 scale-[1.02]"
                      : "border-border/80 bg-secondary/30 hover:bg-secondary/70 hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-xl border ${acc.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-foreground tracking-tight flex items-center gap-1">
                      <span>{acc.title}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{acc.name}</p>
                    <p className="text-[10px] text-primary/80 font-medium truncate mt-0.5">{acc.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-border/80 w-full" />
          <span className="bg-card px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold shrink-0">
            or sign in with credentials
          </span>
          <div className="border-t border-border/80 w-full" />
        </div>

        {/* Credentials Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-5">
            <FormField
              control={form.control as any}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-semibold text-foreground">
                    Email Address
                  </FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <FormControl>
                      <Input
                        placeholder="you@care360.health"
                        autoComplete="email"
                        className="pl-10 h-11 rounded-xl bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-semibold text-foreground">
                      Password
                    </FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <FormControl>
                      <PasswordInput
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                        className="pl-10 h-11 rounded-xl bg-background border-border/80 text-foreground text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            {error && (
              <div className="p-3.5 text-xs text-destructive bg-destructive/10 rounded-2xl border border-destructive/20 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-destructive shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={form.formState.isSubmitting || isEntering}
              className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {(form.formState.isSubmitting || isEntering) ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Entering CARE360 Dashboard...</span>
                </>
              ) : (
                <>
                  <span>Enter CARE360</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        Don&apos;t have an account yet?{" "}
        <Link href="/role" className="font-semibold text-primary hover:underline">
          Select role & get started
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
