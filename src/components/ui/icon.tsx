import { type HTMLAttributes, type ReactNode, memo, forwardRef } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";

import { cn } from "@/lib/cn";

const sizePx = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

type IconSize = keyof typeof sizePx;

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  /** The Lucide icon component to render. */
  icon: LucideIcon;
  /** Brand-aligned sizes ("xs".."xl" only — no magic pixelation). */
  size?: IconSize;
  /** Stroke width — defaults to 1.75 for the elegant ZALVY look. */
  strokeWidth?: number;
}

/**
 * `Icon` — ZALVY's unified Lucide wrapper.
 *
 * Wraps any Lucide icon with:
 *  - Brand-aligned sizes ("xs".."xl" only — no magic pixelation).
 *  - `currentColor` inheritance — icons sit inside text without overrides.
 *  - `aria-hidden` unless caller passes an explicit `aria-label` (icon-only btn).
 *  - slotted `<span>` wrapper so consumers can target via className.
 *
 * Designed to keep page bundles small — call sites pass the icon component
 * directly so runtime tree-shaking keeps every route lean.
 */
export const Icon = memo(
  forwardRef<HTMLSpanElement, IconProps>(function Icon(
    {
      icon: Lucide,
      size = "md",
      strokeWidth = 1.75,
      "aria-label": ariaLabel,
      className,
      style,
      ...htmlAttrs
    },
    ref,
  ) {
    const accessible = Boolean(ariaLabel);
    const lucideProps: LucideProps = {
      size: sizePx[size],
      strokeWidth,
      "aria-hidden": accessible ? undefined : true,
    };
    const Lucide_ = Lucide;
    return (
      <span
        ref={ref}
        className={cn("inline-flex shrink-0 items-center justify-center", className)}
        aria-hidden={!accessible || undefined}
        role={accessible ? "img" : undefined}
        aria-label={ariaLabel}
        style={style}
        {...htmlAttrs}
      >
        <Lucide_ {...lucideProps} />
      </span>
    );
  }),
);

export type { ReactNode };
