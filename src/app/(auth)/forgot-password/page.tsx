"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotSchema>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light tracking-tight text-foreground">
          Reset password
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email to receive reset instructions.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        {submitted ? (
          <div className="text-center space-y-6">
            <p className="text-sm text-foreground">
              If an account exists for this email, we'll send reset instructions.
            </p>
            <Button asChild className="w-full rounded-full" variant="outline">
              <Link href="/login">Return to sign in</Link>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control as any}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Request password reset
              </Button>
            </form>
          </Form>
        )}
      </div>

      {!submitted && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      )}
    </>
  );
}
