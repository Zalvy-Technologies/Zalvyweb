import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `cn` — ZALVY's single class-name combiner.
 *
 * Combines the ergonomic conditional API of `clsx` with the deduplication and
 * conflict-resolution of `tailwind-merge`, so callers can compose Tailwind
 * utility classes without fear of specificity wars.
 *
 * @example
 *   cn("px-2 py-1", isActive && "bg-accent", className)
 *
 * @returns a single, de-duplicated, ordered className string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
