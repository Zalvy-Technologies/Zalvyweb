import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * ZALVY — Next.js production configuration.
 * Optimized for: edge-ready performance, strict security headers, modern image formats,
 * zero-bloat bundles, and Core Web Vitals (LCP/INP/CLS) at 100/100 Lighthouse.
 *
 * Security: CSP is set dynamically in middleware with per-request nonces.
 * Middleware also injects CSRF tokens, rate limits, and security headers.
 */
const isVercel = Boolean(process.env.VERCEL);

const nextConfig: NextConfig = {
  // Produces a minimal self-contained server used by the production Docker image.
  // Disabled on Vercel as Vercel manages its own serverless output tracing.
  output: isVercel ? undefined : "standalone",
  // Anchor standalone tracing to this project — avoids workspace-root inference
  // when sibling lockfiles exist outside the repo.
  outputFileTracingRoot: isVercel ? undefined : dirname(fileURLToPath(import.meta.url)),
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compress: true,
  typescript: { ignoreBuildErrors: true },

  // ─── IMAGE OPTIMIZATION ───
  // AVIF primary, WebP fallback. Device-specific breakpoints prevent oversized
  // images, and `minimumCacheTTL` ensures CDN-layer caching for 1 year.
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year — immutable after build
    remotePatterns: [
      { protocol: "https", hostname: "**.zalvy.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ─── BUNDLE OPTIMIZATION ───
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-switch",
      "@radix-ui/react-label",
      "motion",
    ],
    webpackBuildWorker: true,
  },

  // ─── CACHING HEADERS ───
  async headers() {
    return [
      // Global security headers — every route.
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },

      // Static assets — immutable, 1-year cache. Next.js hashes filenames,
      // so aggressive caching is safe and eliminates re-fetches.
      // Optimised images — long cache with stale-while-revalidate.
      // Public static assets (icons, fonts, etc.) — immutable after deploy.
      {
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // Fonts — immutable, CORS-friendly for CDN edge serving.
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },

  // ─── REDIRECTS ───
  async redirects() {
    return [
      // Normalise trailing slashes.
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
