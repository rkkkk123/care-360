import * as React from "react";
import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement>;

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("py-16 md:py-24 lg:py-32 overflow-hidden", className)}
        {...props}
      />
    );
  }
);

Section.displayName = "Section";

export { Section };
