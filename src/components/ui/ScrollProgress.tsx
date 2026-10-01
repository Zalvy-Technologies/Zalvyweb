"use client";

import { useSyncExternalStore } from "react";
import { motion, useScroll, useSpring } from "motion/react";

function noop() {
  // SSR external store subscription noop
}

function emptySubscribe() {
  return noop;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) return null;

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[var(--z-header)] h-px origin-left bg-gradient-to-r from-[rgb(var(--token-accent))] via-[rgb(var(--token-iris))] to-[rgb(var(--token-accent))] opacity-80"
    />
  );
}
