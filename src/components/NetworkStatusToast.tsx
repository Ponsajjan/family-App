"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/Toast";

/**
 * App-wide "you're offline" notice. Fires whenever the browser loses
 * connectivity, so pages served from stale cache while offline still let
 * the user know the data they're seeing may not be current.
 */
export default function NetworkStatusToast() {
  const toast = useToast();
  const pathname = usePathname();
  const hasWarnedRef = useRef(false);

  useEffect(() => {
    if (pathname === "/~offline") return;

    const notifyOffline = () => {
      if (hasWarnedRef.current) return;
      hasWarnedRef.current = true;
      toast?.show("You're currently offline", "warning", 8000);
    };
    const notifyOnline = () => {
      hasWarnedRef.current = false;
    };

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      notifyOffline();
    }

    window.addEventListener("offline", notifyOffline);
    window.addEventListener("online", notifyOnline);
    return () => {
      window.removeEventListener("offline", notifyOffline);
      window.removeEventListener("online", notifyOnline);
    };
  }, [pathname, toast]);

  return null;
}
