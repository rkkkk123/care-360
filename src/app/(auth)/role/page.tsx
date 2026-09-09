"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { UserCircle, Stethoscope, Store, Shield } from "lucide-react";

const roles = [
  {
    id: "patient",
    title: "Patient",
    description: "Understand and manage your health.",
    icon: UserCircle,
    color: "text-primary",
    bg: "group-hover:bg-primary/10",
    border: "group-hover:border-primary/50",
    href: "/register?role=patient",
  },
  {
    id: "doctor",
    title: "Doctor",
    description: "Provide informed, connected care.",
    icon: Stethoscope,
    color: "text-blue-500",
    bg: "group-hover:bg-blue-500/10",
    border: "group-hover:border-blue-500/50",
    href: "/register?role=doctor",
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    description: "Connect prescriptions with fulfillment.",
    icon: Store,
    color: "text-orange-500",
    bg: "group-hover:bg-orange-500/10",
    border: "group-hover:border-orange-500/50",
    href: "/register?role=pharmacy",
  },
  {
    id: "admin",
    title: "Administrator",
    description: "Manage and protect the ecosystem.",
    icon: Shield,
    color: "text-muted-foreground",
    bg: "group-hover:bg-secondary",
    border: "group-hover:border-border",
    href: "/login", // Admins can only log in
    adminMessage: "Administrator access is restricted. Sign in below.",
  }
];

export default function RoleSelectionPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light tracking-tight text-foreground">
          Join CARE360
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select how you will use the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map((role) => (
          <Link key={role.id} href={role.href} className="group outline-none">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`h-full relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors ${role.bg} ${role.border} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
            >
              <div className="flex flex-col h-full">
                <role.icon className={`w-8 h-8 ${role.color} mb-4 transition-transform group-hover:scale-110`} />
                <h3 className="text-lg font-medium text-foreground">{role.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground flex-1">
                  {role.description}
                </p>
                {role.id === "admin" && (
                  <p className="mt-4 text-xs text-orange-500 font-medium">
                    {role.adminMessage}
                  </p>
                )}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </>
  );
}
