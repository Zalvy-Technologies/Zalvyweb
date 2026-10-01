"use client";

import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * `Input` — Accessible form input with consistent ZALVY styling.
 *
 * Uses design tokens for border, background, focus ring, and error states.
 * Includes optional label, error message, and helper text.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, helperText, className, id, ...rest }, ref) {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-caption font-semibold t-subtle mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={`${error ? errorId : ""} ${helperText ? helperId : ""}`.trim() || undefined}
          className={cn(
            "w-full rounded-xl border border-border bg-surface/50 px-3.5 py-2.5 text-body-sm text-foreground placeholder:text-foreground-subtle",
            "transition-all duration-quick",
            "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:border-border-strong",
            error && "border-danger focus:ring-danger/40 focus:border-danger",
            className,
          )}
          {...rest}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-caption text-danger" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-caption t-subtle">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";