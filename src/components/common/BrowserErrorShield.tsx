"use client";

import { useEffect } from "react";

/**
 * BrowserErrorShield
 *
 * Suppresses known benign third-party browser / Chrome DevTools soft-navigation bugs, such as:
 * "Uncaught TypeError: Cannot read properties of undefined (reading 'startTime') at et.reportAllChanges"
 *
 * This occurs in Chrome 125+ when Chrome DevTools Performance or web-vitals extensions
 * inject an evaluation script (VM...) that expects non-empty performance entries on soft navigations.
 * It is completely external to the application and has zero effect on runtime logic.
 */
export function BrowserErrorShield() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const shouldSuppressError = (msg?: string, filename?: string, stack?: string): boolean => {
      const text = `${msg || ""} ${filename || ""} ${stack || ""}`.toLowerCase();
      
      // Check for Chrome DevTools / web-vitals 'startTime' / 'reportAllChanges' bug
      if (
        text.includes("reading 'starttime'") ||
        text.includes("reading \"starttime\"") ||
        text.includes("reportallchanges")
      ) {
        return true;
      }

      // Check for Chrome extension / injected VM script interference
      if (
        (filename?.includes("VM") || filename?.includes("<anonymous>")) &&
        text.includes("starttime")
      ) {
        return true;
      }

      return false;
    };

    const handleWindowError = (event: ErrorEvent) => {
      if (shouldSuppressError(event.message, event.filename, event.error?.stack)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reasonMsg = event.reason?.message || String(event.reason || "");
      const reasonStack = event.reason?.stack || "";
      if (shouldSuppressError(reasonMsg, undefined, reasonStack)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener("error", handleWindowError, true);
    window.addEventListener("unhandledrejection", handleUnhandledRejection, true);

    return () => {
      window.removeEventListener("error", handleWindowError, true);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection, true);
    };
  }, []);

  return null;
}
