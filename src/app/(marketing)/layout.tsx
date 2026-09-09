import * as React from "react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

export default function MarketingGroupedLayout({ children }: { children: React.ReactNode }) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
