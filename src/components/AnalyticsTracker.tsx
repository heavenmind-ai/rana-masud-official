"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get or create dynamic anonymous session UUID
    let sessionId = localStorage.getItem("analytics_session_id");
    if (!sessionId) {
      sessionId = `sess_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
      localStorage.setItem("analytics_session_id", sessionId);
    }

    // Track Page View
    const reportPageView = async () => {
      // Don't track admin pages to keep logs clean
      if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
        return;
      }

      const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "pageview",
            path: fullPath,
            referrer: document.referrer || "",
            sessionId,
          }),
        });
      } catch (err) {
        console.warn("Analytics reporting failed:", err);
      }
    };

    reportPageView();
  }, [pathname, searchParams]);

  useEffect(() => {
    // Get session
    const getSessionId = () => {
      let sessionId = localStorage.getItem("analytics_session_id");
      if (!sessionId) {
        sessionId = `sess_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
        localStorage.setItem("analytics_session_id", sessionId);
      }
      return sessionId;
    };

    // Track Click Events
    const handleGlobalClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest("a, button, [role='button']");

      if (clickable) {
        // Skip clicks inside admin panel paths
        if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
          return;
        }

        const label = (clickable.textContent || (clickable as any).value || clickable.getAttribute("aria-label") || "element").trim().substring(0, 50);
        const href = clickable.getAttribute("href") || "";

        try {
          await fetch("/api/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "click",
              path: pathname,
              referrer: document.referrer || "",
              sessionId: getSessionId(),
              clickData: {
                label: label || "Unknown Action",
                targetUrl: href || "#",
              },
            }),
          });
        } catch (err) {
          console.warn("Analytics click logging failed:", err);
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [pathname]);

  return null;
}
