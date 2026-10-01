import React, { type ElementType, type HTMLAttributes, type ReactNode, forwardRef } from "react";

import { cn } from "@/lib/cn";

type ContainerElement = ElementType;
type ContainerWidth = "default" | "narrow" | "wide" | "full";

const widthMap: Record<ContainerWidth, string> = {
  full: "w-full",
  default: "w-full max-w-container mx-auto",
  narrow: "w-full max-w-container-narrow mx-auto",
  wide: "w-full max-w-container-wide mx-auto",
};

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ContainerElement;
  children: ReactNode;
  width?: ContainerWidth;
  /** Disable the responsive horizontal padding so callers can fully control gutters. */
  flush?: boolean;
  /** Render without the auto-x centering (useful for full-bleed sections). */
  inline?: boolean;
}

/**
 * `Container` — ZALVY's single breakpoint-aware content channel.
 *
 * Every responsive page section should be wrapped in <Container>. Tuning widths
 * here cascades site-wide, preventing one-off `max-w-[...]` utilities that
 * fragment the design system across files.
 */
export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { as: Component = "div", children, width = "default", flush = false, inline = false, className, ...rest },
  ref,
) {
  return React.createElement(Component, {
    ref,
    className: cn(
      "relative",
      widthMap[width],
      !inline && "mx-auto",
      !flush && "px-[var(--container-gutter)]",
      className,
    ),
    ...rest,
  }, children);
});
