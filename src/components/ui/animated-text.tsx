"use client";

import { type HTMLAttributes, type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export interface AnimatedTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  animation?: "word-reveal" | "char-reveal" | "line-reveal" | "gradient-shift" | "typewriter";
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  onComplete?: () => void;
}

function toPlainText(children: ReactNode): string | null {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    const joined = children
      .map((child) => (typeof child === "string" || typeof child === "number" ? String(child) : ""))
      .join("");
    if (joined) return joined;
  }
  return null;
}

function TypewriterText({
  text,
  delay,
  className,
  ...props
}: { text: string; delay: number } & HTMLAttributes<HTMLSpanElement>) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, delay * 1000 + currentIndex * 30);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [currentIndex, text, delay]);

  return (
    <span className={cn("relative inline-flex", className)} {...props}>
      {displayText}
      {currentIndex < text.length && (
        <span className="ml-0.5 animate-[zalvy-caret-blink_1s_step-end_infinite]" aria-hidden>
          |
        </span>
      )}
    </span>
  );
}

/**
 * `AnimatedText` — Premium text animations for headlines and copy.
 *
 * Supports multiple animation modes:
 * - word-reveal: Staggered word-by-word reveal with blur
 * - char-reveal: Character-by-character scale-in
 * - line-reveal: Line-by-line rise
 * - gradient-shift: Animated gradient text
 * - typewriter: Classic typewriter effect
 */
export function AnimatedText({
  children,
  animation = "word-reveal",
  delay = 0,
  duration = 0.8,
  stagger = 0.08,
  className,
  onComplete,
  ...props
}: AnimatedTextProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, (delay + duration + stagger * 50) * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [delay, duration, stagger, onComplete]);

  const text = toPlainText(children);
  if (text === null) {
    return (
      <span className={className} {...props}>
        {children}
      </span>
    );
  }

  const words = text.split(" ").filter(Boolean);
  const chars = text.split("");
  const lines = text.split("\n").filter(Boolean);

  switch (animation) {
    case "word-reveal": {
      return (
        <span className={cn("inline-flex flex-wrap", className)} {...props}>
          {words.map((word, i) => (
            <span
              key={`${word}-${String(i)}`}
              style={{
                animationDelay: (delay + i * stagger).toFixed(3) + "s",
                animationDuration: duration.toFixed(3) + "s",
              }}
              className="a-blur-in inline-block opacity-0"
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </span>
      );
    }
    case "char-reveal": {
      return (
        <span className={cn("inline-flex", className)} {...props}>
          {chars.map((char, i) => (
            <span
              key={`${char}-${String(i)}`}
              style={{
                animationDelay: (delay + i * (stagger / 2)).toFixed(3) + "s",
                animationDuration: (duration * 0.6).toFixed(3) + "s",
              }}
              className="a-scale-in inline-block opacity-0"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      );
    }
    case "line-reveal": {
      return (
        <span className={cn("block", className)} {...props}>
          {lines.map((line, i) => (
            <span
              key={`${line}-${String(i)}`}
              style={{
                animationDelay: (delay + i * stagger * 3).toFixed(3) + "s",
                animationDuration: duration.toFixed(3) + "s",
              }}
              className="a-rise block opacity-0"
            >
              {line}
            </span>
          ))}
        </span>
      );
    }
    case "gradient-shift": {
      return (
        <span
          className={cn(
            "t-gradient-iris inline-block",
            "bg-[length:200%_auto] animate-[zalvy-gradient-shift_3s_ease-in-out_infinite]",
            className,
          )}
          {...props}
        >
          {children}
        </span>
      );
    }
    case "typewriter": {
      return <TypewriterText text={text} delay={delay} className={className} {...props} />;
    }
    default:
      return (
        <span className={className} {...props}>
          {children}
        </span>
      );
  }
}