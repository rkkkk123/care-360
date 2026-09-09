import * as React from "react";
import { MarketingNavbar } from "./MarketingNavbar";
import { MarketingFooter } from "./MarketingFooter";

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <MarketingNavbar />
      <main className="flex-1 w-full pt-16">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
