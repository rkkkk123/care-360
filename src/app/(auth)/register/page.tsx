"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

import { registerSchema, RegisterFormValues } from "@/features/auth/schemas/register.schema";
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

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") as "patient" | "doctor" | "pharmacy" | null;
  
  React.useEffect(() => {
    if (!roleParam || !["patient", "doctor", "pharmacy"].includes(roleParam)) {
      router.replace("/role");
    }
  }, [roleParam, router]);

  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: roleParam || "patient",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    try {
      const { user, error: authError } = await auth.signUp({
        email: data.email,
        password: data.password,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      if (authError || !user) {
        setError(authError?.message || "Registration failed. Please verify your details.");
        return;
      }

      window.location.href = "/verify";
    } catch {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  if (!roleParam || !["patient", "doctor", "pharmacy"].includes(roleParam)) {
    return null;
  }

  const roleTitles = {
    patient: "Create Patient Account",
    doctor: "Provider Registration",
    pharmacy: "Pharmacy Dispensary Setup",
  };

  const roleDescriptions = {
    patient: "Access AI health tools, book appointments, and manage prescriptions securely.",
    doctor: "Join our verified physician network with integrated clinical copilot and telehealth.",
    pharmacy: "Connect your inventory, receive verified e-prescriptions, and manage deliveries.",
  };

  return (
    <div className="w-full max-w-lg mx-auto py-4">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-2 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>CARE360 Verified Registration</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground capitalize">
          {roleTitles[roleParam]}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-sm mx-auto font-light">
          {roleDescriptions[roleParam]}
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card/90 backdrop-blur-xl p-6 sm:p-9 shadow-xl space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
            {(roleParam === "patient" || roleParam === "doctor") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold text-foreground">First Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Jane" 
                            autoComplete="given-name" 
                            className="pl-10 h-11 rounded-xl bg-background border-border/80 text-foreground text-sm"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold text-foreground">Last Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Doe" 
                            autoComplete="family-name" 
                            className="pl-10 h-11 rounded-xl bg-background border-border/80 text-foreground text-sm"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-destructive" />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control as any}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-semibold text-foreground">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="you@care360.health" 
                        type="email" 
                        autoComplete="email" 
                        className="pl-10 h-11 rounded-xl bg-background border-border/80 text-foreground text-sm"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-semibold text-foreground">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <PasswordInput 
                        autoComplete="new-password" 
                        placeholder="••••••••••••"
                        className="pl-10 h-11 rounded-xl bg-background border-border/80 text-foreground text-sm"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-semibold text-foreground">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <PasswordInput 
                        autoComplete="new-password" 
                        placeholder="••••••••••••"
                        className="pl-10 h-11 rounded-xl bg-background border-border/80 text-foreground text-sm"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            {error && (
              <div className="p-3 text-xs text-destructive bg-destructive/10 rounded-2xl border border-destructive/20 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-destructive shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200 mt-2 flex items-center justify-center gap-2 cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="mt-8 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}>
      <RegisterContent />
    </Suspense>
  );
}
