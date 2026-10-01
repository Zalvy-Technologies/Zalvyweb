/**
 * ZALVY — Performance utilities.
 *
 * Tree-shakeable primitives for:
 *  - Web Vitals reporting (CWV → analytics pipeline)
 *  - Intersection Observer lazy-load hook
 *  - Resource hint helpers (prefetch, preconnect, preload)
 *  - Performance budget constants
 *
 * @module lib/performance
 */

// ─────────────────────── PERFORMANCE BUDGET ───────────────────────
/** Hard limits enforced at build time and monitored at runtime. */
export const PERF_BUDGET = {
  /** Max first-party JS (gzip), in KB. */
  jsBundle: 120,
  /** Max first-party CSS (gzip), in KB. */
  cssBundle: 30,
  /** Max total page weight (all resources, gzip), in KB. */
  totalWeight: 500,
  /** Target Time to First Byte, in ms. */
  ttfb: 200,
  /** Target Largest Contentful Paint, in ms. */
  lcp: 1200,
  /** Target First Input Delay, in ms. */
  fid: 50,
  /** Target Cumulative Layout Shift (unitless). */
  cls: 0.05,
  /** Target Interaction to Next Paint, in ms. */
  inp: 100,
  /** Target First Contentful Paint, in ms. */
  fcp: 800,
} as const;

// ─────────────────────── WEB VITALS ───────────────────────

/**
 * Metric shape from web-vitals library (subset).
 * We avoid importing the library itself — Next.js reports via `reportWebVitals`
 * in `instrumentation.ts` (App Router) or the layout. This type allows
 * analytics adapters to consume metrics uniformly.
 */
export interface WebVitalMetric {
  id: string;
  name: "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  navigationType:
    "navigate" | "reload" | "back-forward" | "back-forward-cache" | "prerender" | "restore";
}

/**
 * Sends a Web Vitals metric to the analytics endpoint.
 * Uses `navigator.sendBeacon` for fire-and-forget reliability during unload.
 *
 * @example
 * ```ts
 * // In Next.js App Router instrumentation:
 * export function reportWebVitals(metric: WebVitalMetric) {
 *   sendVitalMetric(metric);
 * }
 * ```
 */
export function sendVitalMetric(metric: WebVitalMetric): void {
  const body = JSON.stringify({
    id: metric.id,
    name: metric.name,
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    rating: metric.rating,
    delta: Math.round(metric.delta),
    page: typeof window !== "undefined" ? window.location.pathname : "",
    ts: Date.now(),
  });

  // Prefer sendBeacon (non-blocking), fall back to fetch with keepalive.
  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    navigator.sendBeacon("/api/vitals", body);
  } else if (typeof fetch !== "undefined") {
    void fetch("/api/vitals", {
      method: "POST",
      body,
      keepalive: true,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ─────────────────────── RESOURCE HINTS ───────────────────────

/** Origins to preconnect to — DNS + TCP + TLS handshake happens early. */
export const PRECONNECT_ORIGINS = [
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
] as const;

/** Routes likely to be navigated next — prefetched on idle. */
export const PREFETCH_ROUTES = ["/services", "/contact", "/platform/agents"] as const;

/**
 * Injects `<link rel="prefetch">` into `<head>` for a route.
 * Uses `requestIdleCallback` to avoid impacting main-thread work.
 * Idempotent — skips if the link already exists.
 */
export function prefetchRoute(href: string): void {
  if (typeof document === "undefined") return;
  if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return;

  const cb = () => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    link.as = "document";
    document.head.appendChild(link);
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(cb, { timeout: 3000 });
  } else {
    setTimeout(cb, 200);
  }
}

// ─────────────────────── IMAGE OPTIMIZATION HELPERS ───────────────────────

/**
 * Generates responsive `srcSet` and `sizes` for a given image path.
 * Works with Next.js `<Image>` component conventions.
 */
export const IMAGE_BREAKPOINTS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840] as const;

/**
 * Returns a sizes string optimised for the ZALVY grid layout.
 * This eliminates layout shift by giving the browser correct size hints.
 */
export function responsiveSizes(
  layout: "full" | "contained" | "card" | "avatar" = "contained",
): string {
  switch (layout) {
    case "full":
      return "100vw";
    case "contained":
      return "(min-width: 1280px) 1200px, (min-width: 768px) 90vw, 100vw";
    case "card":
      return "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";
    case "avatar":
      return "48px";
  }
}

// ─────────────────────── CLS PREVENTION ───────────────────────

/**
 * CSS aspect-ratio helper — prevents CLS by reserving space before images load.
 * Returns an inline style object for the container.
 */
export function aspectRatioStyle(width: number, height: number): React.CSSProperties {
  return {
    aspectRatio: `${String(width)} / ${String(height)}`,
    width: "100%",
    height: "auto",
  };
}
