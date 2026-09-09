import * as React from "react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/ui/brand-logo";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md", ...props }: LogoProps) {
  // Sizing mapping
  const sizeStyles = {
    sm: {
      gap: "gap-1.5",
      care: "text-xl",
      iconSize: "w-6 h-6",
    },
    md: {
      gap: "gap-2",
      care: "text-2xl",
      iconSize: "w-8 h-8",
    },
    lg: {
      gap: "gap-3",
      care: "text-4xl",
      iconSize: "w-12 h-12",
    }
  };

  const s = sizeStyles[size];

  return (
    <div className={cn("flex items-center", s.gap, className)} {...props}>
      <BrandLogo className={s.iconSize} />
      <div className="flex items-center">
        <span className={cn("font-bold tracking-tight text-orange-500", s.care)}>CARE</span>
        <span className={cn("font-light tracking-tight text-primary", s.care)}>360</span>
      </div>
    </div>
  );
}
