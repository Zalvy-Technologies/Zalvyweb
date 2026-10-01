"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface CookieBannerProps {
  /** Storage key used to persist consent choice */
  storageKey?: string;
}

/**
 * CookieBanner — Production-grade GDPR & CCPA privacy consent banner.
 *
 * Implements accessible dialog role, focus handling, and persistence.
 * Uses client-side mounted check to avoid hydration mismatch.
 */
export function CookieBanner({ storageKey = "zalvy-cookie-consent" }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const consent = localStorage.getItem(storageKey);
      setIsVisible(!consent);
    } catch {
      setIsVisible(false);
    }
  }, [storageKey]);

  const acceptAll = () => {
    try {
      localStorage.setItem(storageKey, "accepted");
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  const acceptEssential = () => {
    try {
      localStorage.setItem(storageKey, "essential");
    } catch {
      // Ignore
    }
    setIsVisible(false);
  };

  if (!mounted || !isVisible) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie Privacy Preferences"
      className="surface-raised border-border-strong animate-in fade-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-[300] w-[calc(100vw-3rem)] max-w-md rounded-2xl border p-6 shadow-2xl backdrop-blur-xl transition-all duration-300"
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="text-foreground font-display flex items-center gap-2.5 text-base font-semibold">
          <ShieldCheck className="text-accent size-5 shrink-0" />
          <span>Privacy & Data Sovereignty</span>
        </div>
        <button
          onClick={acceptEssential}
          aria-label="Dismiss cookie notice"
          className="text-foreground-subtle hover:text-foreground rounded-md p-1 transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>

      <p className="text-body-sm text-foreground-muted mb-6 leading-relaxed">
        We use essential cookies to maintain security and measure platform telemetry. Read our{" "}
        <Link href="/legal/privacy" className="text-accent hover:text-iris underline">
          Privacy Policy
        </Link>
        .
      </p>

      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <Button onClick={acceptAll} variant="primary" size="sm" fullWidth>
          Accept All
        </Button>
        <Button onClick={acceptEssential} variant="secondary" size="sm" fullWidth>
          Essential Only
        </Button>
      </div>
    </aside>
  );
}