"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationButton() {
  const [hasUnread, setHasUnread] = React.useState(true);

  return (
    <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground rounded-full">
      <Bell className="w-5 h-5" />
      {hasUnread && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
      )}
      <span className="sr-only">View notifications</span>
    </Button>
  );
}
