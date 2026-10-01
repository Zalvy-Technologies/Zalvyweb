import Image from "next/image";
import { type HTMLAttributes, memo } from "react";
import { cn } from "@/lib/cn";

export interface LogoProps extends HTMLAttributes<HTMLSpanElement> {
  /** Width/size in `px`. */
  width?: number;
  /** Height in `px` (defaults to width if not specified). */
  height?: number;
  /** When `true`, omits the wordmark and renders mark alone. */
  markOnly?: boolean;
  /** Custom className */
  className?: string;
  /** Priority loading */
  priority?: boolean;
}

/**
 * `Logo` — ZALVY's official brand logo mark and wordmark.
 * Uses the official `zalvy-final.png` image asset.
 */
export const Logo = memo(function Logo({
  width = 34,
  height,
  markOnly = false,
  className,
  priority = true,
  ...props
}: LogoProps) {
  const size = width;
  const imgHeight = height ?? size;

  const mark = (
    <Image
      src="/icons/zalvy-final.png"
      alt="ZALVY logo"
      width={size}
      height={imgHeight}
      priority={priority}
      className="rounded-lg object-contain transition-transform duration-200 group-hover:scale-105"
      style={{
        width: `${String(size)}px`,
        height: `${String(imgHeight)}px`,
      }}
    />
  );

  if (markOnly) {
    return (
      <span
        className={cn("inline-flex items-center justify-center shrink-0", className)}
        {...props}
      >
        {mark}
      </span>
    );
  }

  return (
    <span
      className={cn("group inline-flex items-center gap-2.5 select-none", className)}
      {...props}
    >
      {mark}
      <span
        className="font-display text-foreground text-[1.125rem] leading-none font-semibold tracking-tight transition-colors group-hover:text-accent"
        style={{ letterSpacing: "-0.02em" }}
      >
        ZALVY
      </span>
    </span>
  );
});
