"use client";

import { type ButtonHTMLAttributes, type MouseEvent, type ReactNode, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

/**
 * Button visual recipe — authored against ZALVY tokens; matches Linear-grade
 * surface controlled by precisely one token-per-axis (bg/fg/border/shadow).
 */
const buttonVariants = cva(
  [
    "group relative inline-flex items-center justify-center gap-2",
    "font-sans font-medium select-none",
    "tracking-snug leading-none whitespace-nowrap",
    "ease-standard transition-[transform,background-color,box-shadow,color,border-color] duration-200",
    "active:scale-[0.98] motion-reduce:active:scale-100",
    "disabled:pointer-events-none disabled:opacity-50",
    "motion-reduce:transition-none motion-reduce:hover:transform-none",
    "focus-visible:outline-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "text-accent-foreground bg-accent",
          "shadow-[0_0_0_1px_rgb(var(--token-accent)/0.2),0_4px_16px_-2px_rgb(var(--token-accent)/0.25)]",
          "hover:shadow-[0_0_0_1px_rgb(var(--token-accent)/0.3),0_8px_24px_-4px_rgb(var(--token-accent)/0.35)]",
          "hover:brightness-[1.06] active:brightness-[0.97]",
          "before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-white/12 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200",
        ].join(" "),
        secondary: [
          "text-foreground surface-raised bg-surface",
          "border-border-strong border",
          "hover:bg-surface-overlay hover:border-strong",
          "shadow-sm hover:shadow-md",
        ].join(" "),
        gradient: [
          "text-iris-foreground",
          "border-border-strong border",
          "shadow-sm hover:shadow-lg",
          "bg-gradient-to-br from-[rgb(var(--token-accent))] via-[rgb(var(--token-iris)/0.85)] to-[rgb(var(--token-iris))]",
          "hover:brightness-[1.03] active:brightness-[0.98]",
        ].join(" "),
        ghost: ["text-foreground", "hover:bg-surface-overlay", "active:bg-surface-raised"].join(
          " ",
        ),
        outline: [
          "text-foreground bg-transparent",
          "border-border-strong border",
          "hover:bg-surface-overlay hover:border-border-strong",
        ].join(" "),
        link: [
          "text-accent hover:text-iris",
          "h-auto p-0",
          "underline-offset-4 hover:underline",
          "active:text-accent/80",
        ].join(" "),
      },
      size: {
        xs: "h-7 rounded-md px-2.5 text-[0.8125rem]",
        sm: "h-8 rounded-md px-3.5 text-[0.875rem]",
        md: "h-10 rounded-md px-5 text-[0.9375rem]",
        lg: "h-12 rounded-lg px-6 text-base",
        xl: "h-14 rounded-xl px-8 text-base",
        icon: "size-10 rounded-md",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-12 rounded-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
    compoundVariants: [{ variant: "link", size: "md", className: "h-auto px-0" }],
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Visually hidden label for icon-only buttons — required for a11y. */
  "aria-label"?: string;
  children?: ReactNode;
  /** Softly triggers a press-pulse without overriding consumer handlers. */
  pulse?: boolean;
}

/**
 * ZALVY `Button` — accessible, polymorphic, variant-driven.
 *
 * - Renders a native `<button>` by default; with `asChild` it forwards classes
 *   through Radix Slot so callers can attach this style to a Next `<Link>`,
 *   in-app anchor, or any forwardRef host.
 * - Honors `prefers-reduced-motion` (handled at base.css).
 * - Always provides a keyboard-accessible ring via :focus-visible.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    asChild = false,
    variant,
    size,
    fullWidth,
    className,
    children,
    disabled,
    onClick,
    pulse = false,
    type: typeProp = "button",
    ...rest
  },
  ref,
) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  const classes = cn(
    buttonVariants({ variant, size, fullWidth }),
    pulse && "a-pulse-ring [animation:zalvy-pulse-ring_1.8s_cubic-bezier(0.4,0,0.6,1)_infinite]",
    className,
  );

  const content = children;
  const shared = {
    ...rest,
    className: classes,
    "aria-disabled": disabled ?? undefined,
    "data-button": true,
    ref: asChild ? undefined : ref,
    disabled: asChild ? false : disabled,
    onClick: asChild ? undefined : handleClick,
    type: asChild ? undefined : typeProp,
  } as const;

  if (asChild) {
    return (
      <Slot {...shared} ref={ref}>
        {content}
      </Slot>
    );
  }

  return <button {...shared}>{content}</button>;
});

export { buttonVariants };
