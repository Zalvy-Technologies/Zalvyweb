"use client";

import { useId } from "react";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * `ThemeToggle` — ZALVY's switchable affordance for light/dark.
 *
 * A11y pattern (per Apple HIG + W3C APG for disclosure switches):
 *  - Renders as a labeled button (not a real checkbox) so it works precisely
 *    on touch the same as on desktop. The press label communicates current state.
 *  - Tooltip is delivered by the host form-factor (no extra widget needed).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolved, toggle } = useTheme();
  const isDark = resolved === "dark";
  const id = useId();
  const stateId = `zalvy-theme-toggle-${id}`;

  return (
    <Button
      id={stateId}
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggle}
      className={cn("transition-colors", className)}
      data-theme-toggle
    >
      <Icon
        icon={isDark ? Sun : Moon}
        size="sm"
        aria-hidden
        className="motion-safe:rotate-0 motion-safe:transition motion-safe:duration-300 motion-safe:hover:rotate-12"
      />
    </Button>
  );
}
