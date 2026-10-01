"use client";

/**
 * ZALVY — Route Prefetch Warmer.
 *
 * On idle, prefetches the highest-traffic routes so subsequent navigations
 * feel instant. Uses `requestIdleCallback` to avoid interfering with
 * initial paint or interactivity metrics.
 *
 * Mount once in the root layout alongside `<WebVitalsReporter />`.
 *
 * @module components/analytics/route-prefetch
 */

import { useEffect } from "react";
import { prefetchRoute, PREFETCH_ROUTES } from "@/lib/performance";

export function RoutePrefetch() {
  useEffect(() => {
    // Delay prefetching until the page is fully idle.
    const timer = setTimeout(() => {
      for (const route of PREFETCH_ROUTES) {
        prefetchRoute(route);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return null;
}
