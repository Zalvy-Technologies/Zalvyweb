import { type ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { PageTransition } from "@/components/layout/PageTransition";
import { ZalvySpatialBackground } from "@/components/3d/ZalvySpatialBackground";

/**
 * Marketing layout — used for the homepage and any narrative-driven page
 * that needs the global Header/Footer chrome. App Router group folders let
 * us hang this layout on a specific set of routes without polluting route URLs.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ZalvySpatialBackground />
      <Header />
      <main id="main" tabIndex={-1} className="relative z-[10] pt-[var(--header-h)] focus:outline-none">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
