import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional variant shape of the skeleton */
  variant?: "text" | "circular" | "rectangular" | "card";
}

/**
 * Skeleton — Accessible, GPU-accelerated shimmer placeholder for dynamic data fetching.
 *
 * Implements WCAG aria-busy and role="status" to notify assistive technologies
 * that content is actively loading.
 */
export function Skeleton({ variant = "text", className, ...props }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading..."
      className={cn(
        "bg-surface-raised/80 border-border/40 relative overflow-hidden border",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[zalvy-shimmer_2s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "motion-reduce:before:animate-none",
        variant === "text" && "h-4 w-full rounded-md",
        variant === "circular" && "shrink-0 rounded-full",
        variant === "rectangular" && "rounded-lg",
        variant === "card" && "flex h-48 w-full flex-col justify-between rounded-xl p-6",
        className,
      )}
      {...props}
    >
      <span className="sr-only">Loading content...</span>
    </div>
  );
}
