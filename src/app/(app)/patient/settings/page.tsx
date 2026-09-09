import * as React from "react";
import { Settings } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export default function SettingsPage() {
  return (
    <div className="py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-foreground">Settings</h1>
        <p className="mt-2 text-base text-muted-foreground">Manage preferences, privacy, and accessibility.</p>
      </div>
      <EmptyState
        icon={Settings}
        title="Settings & Preferences"
        description="Global application settings including accessibility, reduced motion, and simple mode are currently being architected."
      />
    </div>
  );
}
