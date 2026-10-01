import { type HTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5",
    "rounded-pill",
    "h-6 px-2.5",
    "text-[0.8125rem] leading-none font-medium",
    "border",
    "tracking-snug whitespace-nowrap",
    "duration-quick ease-standard transition-colors",
  ].join(" "),
  {
    variants: {
      variant: {
        neutral: ["bg-surface text-foreground-muted", "border-border"].join(" "),
        outline: ["text-foreground bg-transparent", "border-border-strong"].join(" "),
        accent: ["bg-accent-subtle text-accent", "border-accent/20"].join(" "),
        iris: [
          "bg-[rgb(var(--token-iris)/0.08)] text-[rgb(var(--token-iris))]",
          "border-[rgb(var(--token-iris)/0.2)]",
        ].join(" "),
        success: [
          "text-success bg-[rgb(var(--token-success)/0.08)]",
          "border-[rgb(var(--token-success)/0.2)]",
        ].join(" "),
        warning: [
          "text-warning bg-[rgb(var(--token-warning)/0.08)]",
          "border-[rgb(var(--token-warning)/0.2)]",
        ].join(" "),
        danger: [
          "text-danger bg-[rgb(var(--token-danger)/0.08)]",
          "border-[rgb(var(--token-danger)/0.2)]",
        ].join(" "),
      },
      size: {
        sm: "h-5 px-2 text-[0.6875rem]",
        md: "h-6 px-2.5",
        lg: "h-7 px-3 text-[0.875rem]",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

/**
 * `Badge` — Ear-tagging chip used above section eyebrows, list rows, status flags.
 *
 * Always text-bearing; pair with optional leading Icon component when needed.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant, size, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...rest}>
      {children}
    </span>
  );
});
