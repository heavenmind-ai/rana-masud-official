"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastReportedPath = useRef<string>("");

  useEffect(() => {
    // Don't track admin pages or internal API routes to keep serverless usage low
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // Avoid duplicate reporting if path hasn't changed
    if (lastReportedPath.current === fullPath) {
      return;
    }
    lastReportedPath.current = fullPath;

    // Get or create dynamic anonymous session UUID
    let sessionId = "";
    try {
      sessionId = localStorage.getItem("analytics_session_id") || "";
      if (!sessionId) {
        sessionId = `sess_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
        localStorage.setItem("analytics_session_id", sessionId);
      }
    } catch {
      sessionId = "anonymous_session";
    }

    // Report Page View with sendBeacon or fetch fallback (non-blocking)
    const payload = JSON.stringify({
      type: "pageview",
      path: fullPath,
      referrer: typeof document !== "undefined" ? document.referrer || "" : "",
      sessionId,
    });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
    } else {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {
        // Silently catch to avoid crashing user experience
      });
    }
  }, [pathname, searchParams]);

  return null;
}

