"use client";

/**
 * ZALVY — Web Vitals Reporter.
 *
 * Lightweight client component that loads `web-vitals` dynamically and
 * reports Core Web Vitals (LCP, FID, CLS, INP, FCP, TTFB) to `/api/vitals`.
 *
 * Uses `next/dynamic`-style lazy import so the web-vitals library never
 * appears in the critical JS bundle. The reporter is fire-and-forget via
 * `navigator.sendBeacon`.
 *
 * Mount this once in the root layout (invisible, zero DOM output).
 *
 * @module components/analytics/web-vitals
 */

import { useEffect } from "react";
import { sendVitalMetric, type WebVitalMetric } from "@/lib/performance";

/**
 * Reports Core Web Vitals to the telemetry endpoint.
 * Renders nothing — purely a side-effect component.
 */
export function WebVitalsReporter() {
  useEffect(() => {
    void import("web-vitals")
      .then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
        const report = (metric: unknown) => {
          sendVitalMetric(metric as WebVitalMetric);
        };
        onCLS(report);
        onFCP(report);
        onINP(report);
        onLCP(report);
        onTTFB(report);
      })
      .catch(() => {
        // Silently fail — vitals reporting is non-critical.
      });
  }, []);

  return null;
}
