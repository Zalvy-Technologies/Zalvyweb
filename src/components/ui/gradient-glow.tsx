"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

export interface GradientGlowProps {
  className?: string;
  color?: "iris" | "accent" | "sage" | "purple" | "mixed";
  size?: "sm" | "md" | "lg" | "xl";
  position?: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  intensity?: number; // 0-1
}

const positionMap = {
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  "top-left": "top-[10%] left-[10%]",
  "top-right": "top-[10%] right-[10%]",
  "bottom-left": "bottom-[10%] left-[10%]",
  "bottom-right": "bottom-[10%] right-[10%]",
};

const sizeMap = {
  sm: "w-[20rem] h-[20rem]",
  md: "w-[32rem] h-[32rem]",
  lg: "w-[48rem] h-[48rem]",
  xl: "w-[64rem] h-[64rem]",
};

/**
 * `GradientGlow` — Ambient gradient orb for premium section backgrounds.
 *
 * Very subtle, non-interactive ambient lighting. Used behind hero sections,
 * cards, and feature areas to create depth without distraction.
 */
export function GradientGlow({
  className,
  color = "mixed",
  size = "lg",
  position = "center",
  intensity = 0.18,
}: GradientGlowProps) {
  const intensityStr = String(intensity);
  const intensityHalf = String(intensity * 0.6);
  const colorGradients = {
    iris: `radial-gradient(closest-side, rgb(var(--token-iris) / ${intensityStr}), transparent 70%)`,
    accent: `radial-gradient(closest-side, rgb(var(--token-accent) / ${intensityStr}), transparent 70%)`,
    sage: `radial-gradient(closest-side, rgb(var(--token-sage) / ${intensityStr}), transparent 70%)`,
    purple: `radial-gradient(closest-side, rgb(var(--token-purple-accent) / ${intensityStr}), transparent 70%)`,
    mixed: `radial-gradient(closest-side, rgb(var(--token-iris) / ${intensityHalf}), rgb(var(--token-accent) / ${intensityStr}) 50%, transparent 70%)`,
  };

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2.5, ease: "easeOut" }}
      className={cn(
        "pointer-events-none absolute rounded-full blur-[120px]",
        positionMap[position],
        sizeMap[size],
        className,
      )}
      style={{
        background: colorGradients[color],
      }}
    />
  );
}
