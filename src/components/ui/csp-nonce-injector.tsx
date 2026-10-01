"use client";

import { useEffect } from "react";

/**
 * Client component to inject CSP nonce into inline scripts and meta tag.
 * Reads nonce from cookie set by middleware and applies to script elements.
 */
export function CspNonceInjector() {
  useEffect(() => {
    // Read nonce from cookie
    const cookies = document.cookie.split("; ").reduce<Record<string, string>>((acc, cookie) => {
      const [key, value] = cookie.split("=");
      if (key !== undefined && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const nonce = cookies["csp-nonce"];
    if (!nonce) return;

    // Update meta tag for reference
    const meta = document.querySelector('meta[name="csp-nonce"]');
    if (meta) {
      meta.setAttribute("content", nonce);
    }

    // Apply nonce to all inline scripts without nonce
    document.querySelectorAll('script:not([nonce])').forEach((script) => {
      if (script.textContent && script.textContent.trim().length > 0) {
        script.setAttribute("nonce", nonce);
      }
    });
  }, []);

  return null;
}