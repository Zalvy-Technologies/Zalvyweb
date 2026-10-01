"use client";

import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "raised" | "overlay" | "premium";
  intensity?: "subtle" | "medium" | "strong";
  glow?: boolean;
  border?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * `GlassCard` — Premium glassmorphism card for ZALVY.
 *
 * Uses backdrop-filter blur + subtle border + optional gradient glow.
 * Designed for dark surfaces (high contrast on dark canvas) with
 * very subtle transparency so content remains fully legible.
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(function GlassCard(
  { children, variant = "default", intensity = "subtle", glow = false, border = true, animated = false, className, ...rest },
  ref,
) {
  const intensityMap = {
    subtle: "bg-surface-raised/55 backdrop-blur-[14px]",
    medium: "bg-surface-raised/75 backdrop-blur-[18px]",
    strong: "bg-surface-raised backdrop-blur-[20px]",
  };

  const variantMap = {
    default: "",
    raised: "shadow-[var(--shadow-premium-card)]",
    overlay: "",
    premium: "shadow-[var(--shadow-premium-card)] relative overflow-hidden",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-[1.35rem] transition-[border-color,background-color,box-shadow,transform] duration-300",
        intensityMap[intensity],
        variantMap[variant],
        border && "border border-white/[0.06]",
        glow && "before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgb(var(--token-accent)/0.055),transparent_62%)] before:opacity-60",
        animated && "hover:border-white/[0.11] hover:shadow-[var(--shadow-premium-card)] hover:-translate-y-[1px] motion-reduce:hover:translate-y-0",
        className,
      )}
      {...rest}
    >
      {/* Premium variant restrained wash */}
      {variant === "premium" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--token-accent)/0.04),transparent_60%)]"
        />
      )}
      {/* Inner content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
});
