"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { NotificationButton } from "./NotificationButton";
import { GlobalAIButton } from "./GlobalAIButton";
import { CommandPalette } from "./CommandPalette";

export interface AppTopBarProps {
  className?: string;
}

export function AppTopBar({ className }: AppTopBarProps = {}) {
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 ${className || ""}`}>
        <div className="flex flex-1 gap-x-2 sm:gap-x-4 self-stretch lg:gap-x-6">
          
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground shrink-0"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>

          {/* Search / Command trigger */}
          <div className="relative flex flex-1 items-center">
            <button 
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 w-full max-w-md bg-secondary/50 hover:bg-secondary border border-border/50 text-muted-foreground hover:text-foreground text-xs sm:text-sm rounded-full px-3 sm:px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-left"
            >
              <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
              <span className="hidden sm:inline">Search CARE360 ecosystem...</span>
              <span className="sm:hidden">Search...</span>
              <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">&#8984;</span>K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-x-2 sm:gap-x-3">
            <Link
              href="/patient/emergency"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border border-rose-500/20 transition-colors shadow-xs"
              title="Emergency SOS Response"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>SOS</span>
            </Link>

            <GlobalAIButton />
            <NotificationButton />
            
            <div className="hidden sm:block h-6 w-px bg-border mx-1" aria-hidden="true" />
            
            <UserMenu />
          </div>
        </div>
      </header>

      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
}

export default AppTopBar;
