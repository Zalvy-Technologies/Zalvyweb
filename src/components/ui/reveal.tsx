"use client";

import React, { type CSSProperties, type ElementType, type ReactNode, useEffect, useRef } from "react";

export interface RevealProps {
  as?: ElementType;
  children: ReactNode;
  delay?: number;
  animation?: "blur-in" | "rise" | "fade" | "scale-in";
  once?: boolean;
  rootMargin?: string;
  className?: string;
  id?: string;
}

/**
 * `Reveal` — A lightweight, IntersectionObserver-based scroll-driven reveal.
 *
 * Design considerations:
 *  - No JS animation library needed for these entry animations — pure CSS keyframes
 *    defined in motion.css composed against the `[data-reveal]` attribute.
 *  - Honors `prefers-reduced-motion` via the base.css media query block — that
 *    collapses `animation-duration` to 0.001ms so nothing is hidden forever.
 *  - Hydration-safe: the server render and the initial client render are
 *    identical (no `data-reveal` attribute, no `animation-name` inline style),
 *    so content is visible to crawlers and no-JS users. The reveal state is
 *    applied imperatively from effects after hydration, which never triggers
 *    a server/client attribute mismatch.
 */
export function Reveal({
  as,
  children,
  delay = 0,
  animation = "blur-in",
  once = true,
  rootMargin = "0px 0px -64px 0px",
  className,
  id,
}: RevealProps) {
  const Comp = as ?? "div";
  const ref = useRef<HTMLElement>(null);
  const ioSupported = typeof IntersectionObserver !== "undefined";

  useEffect(() => {
    const el = ref.current;
    if (!el || !ioSupported) return;

    el.dataset.reveal = "out";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.reveal = "in";
            el.style.animationName = `zalvy-${animation}`;
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            el.dataset.reveal = "out";
            el.style.animationName = "";
          }
        }
      },
      { threshold: 0.12, rootMargin },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [once, rootMargin, ioSupported, animation]);

  const style: CSSProperties = {
    ["--reveal-delay" as string]: `${String(delay)}ms`,
  };

  return React.createElement(Comp, {
    ref,
    id,
    className,
    style,
  }, children);
}