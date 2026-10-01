import { type AnchorHTMLAttributes, type ReactNode, forwardRef } from "react";
import NextLink, { type LinkProps } from "next/link";

import { cn } from "@/lib/cn";

export interface LinkPropsZalvy
  extends
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    Pick<LinkProps, "href" | "prefetch" | "scroll" | "shallow" | "passHref" | "replace"> {
  children: ReactNode;
  /** Render anchor with `target="_blank"` + safe `rel` defaults. */
  external?: boolean;
  /** Surface a visible focus ring in keyboard navigation only. */
  silentFocus?: boolean;
  /** When used with Button's asChild, render the child element directly. */
  asChild?: boolean;
}

/**
 * `Link` — ZALVY's typed router-aware anchor.
 *
 * Wraps `next/link` so internal navigation keeps client transitions while
 * callers can still opt into real `<a target="_blank">` semantics for external
 * destinations, with hardened `rel` attributes for security.
 *
 * Supports `asChild` prop for composition with Button and other components.
 *
 * Always call this component instead of `<a>` in marketing contexts.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkPropsZalvy>(function Link(
  { children, href, external, className, silentFocus = false, asChild = false, ...rest },
  ref,
) {
  // When used as child of Button with asChild, the Button's Slot will pass
  // the className and other props. We should just render the child with those props.
  if (asChild) {
    return (
      <NextLink
        ref={ref}
        href={href}
        className={cn(silentFocus && "focus-visible:ring-0", className)}
        {...rest}
      >
        {children}
      </NextLink>
    );
  }

  const hrefStr = typeof href === "string" ? href : "";
  const isProtocol = hrefStr.startsWith("mailto:") || hrefStr.startsWith("tel:");
  const isHttpExternal = hrefStr.startsWith("http://") || hrefStr.startsWith("https://");
  const isExplicitExternal = external ?? isHttpExternal;

  if (isProtocol) {
    return (
      <a
        ref={ref}
        href={hrefStr}
        className={cn(silentFocus && "focus-visible:ring-0", className)}
        {...rest}
      >
        {children}
      </a>
    );
  }

  if (isExplicitExternal) {
    return (
      <a
        ref={ref}
        href={hrefStr || undefined}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={cn(silentFocus && "focus-visible:ring-0", className)}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink
      ref={ref}
      href={href}
      className={cn(silentFocus && "focus-visible:ring-0", className)}
      {...rest}
    >
      {children}
    </NextLink>
  );
});