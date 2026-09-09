"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  navigation: NavItem[];
}

export function MobileBottomNav({ navigation }: MobileBottomNavProps) {
  const pathname = usePathname();
  const mobileItems = navigation.filter(item => item.mobileVisible).slice(0, 5); // Limit to 5

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom,1rem)]">
      <nav className="flex justify-around items-center h-16 px-2">
        {mobileItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
