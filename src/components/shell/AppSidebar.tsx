"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/config/navigation";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  navigation: NavItem[];
}

export function AppSidebar({ navigation }: AppSidebarProps) {
  const pathname = usePathname();
  
  const primaryItems = navigation.filter(i => i.section === "primary");
  const secondaryItems = navigation.filter(i => i.section === "secondary");

  const NavGroup = ({ items }: { items: NavItem[] }) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "fill-primary/20")} />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card fixed inset-y-0 z-40">
      <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
        <Link href="/" className="flex items-center outline-none">
          <Logo size="sm" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-8 custom-scrollbar">
        <nav className="flex-1">
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Overview
          </div>
          <NavGroup items={primaryItems.slice(0, 6)} />
          
          <div className="px-3 mt-8 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Care Network
          </div>
          <NavGroup items={primaryItems.slice(6)} />
        </nav>

        <div className="mt-auto">
          <NavGroup items={secondaryItems} />
        </div>
      </div>
    </aside>
  );
}
