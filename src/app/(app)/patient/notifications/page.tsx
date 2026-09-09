import * as React from "react";
import { Bell } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export default function NotificationsPage() {
  return (
    <div className="py-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-foreground">Notifications</h1>
          <p className="mt-2 text-base text-muted-foreground">Important updates regarding your care.</p>
        </div>
      </div>
      <EmptyState
        icon={Bell}
        title="You're all caught up."
        description="There are no new notifications at this time."
      />
    </div>
  );
}
