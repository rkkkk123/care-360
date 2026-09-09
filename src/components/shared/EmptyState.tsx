import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
      <div className="bg-secondary/50 p-4 rounded-full mb-6">
        <Icon className="w-8 h-8 text-muted-foreground/70" />
      </div>
      <h3 className="text-xl font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-8">
        {description}
      </p>
      
      {actionLabel && actionHref && (
        <Button className="rounded-full" asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
