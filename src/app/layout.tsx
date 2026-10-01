import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { type ReactNode } from "react";

import "@/styles/globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { WebVitalsReporter } from "@/components/analytics/web-vitals";
import { RoutePrefetch } from "@/components/analytics/route-prefetch";
import { ChatWidget } from "@/components/ai/chat-widget";
import { CspNonceInjector } from "@/components/ui/csp-nonce-injector";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { site } from "@/lib/site";

/**
 * Pre-hydration theme resolver — runs synchronously before paint to avoid FOUC.
 * Reads from localStorage before React hydrates and sets `data-theme` on <html>.
 * Loaded as an external same-origin script (allowed by `script-src 'self'`) —
 * inline scripts are blocked by the nonce-based CSP, which only nonces scripts
 * that the App Router renderer manages itself.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  keywords: [
    "AI agents",
    "enterprise automation",
    "AI chatbots",
    "developer tools",
    "AI internship program",
    "intelligent systems",
    "LLM infrastructure",
    "ZALVY",
  ],
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${site.url}/rss.xml` },
  },
  icons: {
    icon: [
      { url: "/icons/zalvy-final.png", type: "image/png" },
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/icons/zalvy-final.png", sizes: "180x180" },
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    siteName: site.name,
    images: [
      { url: site.ogImage, width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitterHandle,
    creator: site.twitterHandle,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [site.ogImage],
  },
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07090d" },
    { media: "(prefers-color-scheme: light)", color: "#fcfbf8" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Pre-hydration theme resolver — runs before paint to avoid FOUC. */}
        <Script src="/scripts/theme-init.js" strategy="beforeInteractive" />

        {/* CSP nonce meta tag — injected by middleware */}
        <meta name="csp-nonce" content="" />

        {/* ─── Resource Hints: eliminate connection latency ─── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <a
          href="#main"
          className="focus:rounded-pill focus:bg-surface focus:text-foreground focus:border-border sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[var(--z-toast)] focus:border focus:px-4 focus:py-2 focus:shadow-lg"
        >
          Skip to content
        </a>
        <ThemeProvider defaultTheme="dark" enableSystem>
        <ScrollProgress />
          {children}
          <ChatWidget />
          <CspNonceInjector />
        </ThemeProvider>
        <WebVitalsReporter />
        <RoutePrefetch />
      </body>
    </html>
  );
}
