import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
}

const SectionHeading = React.forwardRef<HTMLDivElement, SectionHeadingProps>(
  ({ className, title, subtitle, align = "center", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-4 mb-12",
          align === "center" ? "items-center text-center" : "items-start text-left",
          className
        )}
        {...props}
      >
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground max-w-[800px]">
            {subtitle}
          </p>
        )}
      </div>
    );
  }
);

SectionHeading.displayName = "SectionHeading";

export { SectionHeading };
