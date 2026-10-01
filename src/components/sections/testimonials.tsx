"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

interface Principle {
  id: string;
  category: string;
  body: string;
  owner: string;
  pillar: string;
}

const PRINCIPLES: Principle[] = [
  {
    id: "precision",
    category: "Infrastructure Posture",
    pillar: "01. PREDICTABILITY",
    body: "We treat intelligent systems with the discipline of core infrastructure — observable, strictly policy-bounded, and predictable, so teams never gamble on silent failure modes.",
    owner: "Core Systems Architecture",
  },
  {
    id: "removal",
    category: "System Simplification",
    pillar: "02. ESSENTIALISM",
    body: "We do not merely optimize complex workflows. We systematically remove the redundant latency layers, then measure end-to-end task cycles with verifiable telemetry.",
    owner: "Research & Applied AI",
  },
  {
    id: "latency",
    category: "Deterministic Runtime",
    pillar: "03. PERFORMANCE",
    body: "Sub-100ms deterministic execution is not something you ask a third-party vendor for. It is an engineering contract you build with rigorous trace harnesses and hardware-aware serving.",
    owner: "Inference Platform",
  },
  {
    id: "talent",
    category: "Engineering Craft",
    pillar: "04. FUTURE TALENT",
    body: "Apprentices write production code from day one under direct staff guidance. The talent we cultivate are the engineers we would trust with our own critical production panels.",
    owner: "Talent & Bench",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const headingId = useId();
  const sliderRef = useRef<HTMLDivElement>(null);

  const advance = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + PRINCIPLES.length) % PRINCIPLES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % PRINCIPLES.length);
    }, 7000);
    return () => {
      clearInterval(t);
    };
  }, [paused]);

  const current = PRINCIPLES[index];

  return (
    <Section
      id="testimonials"
      surface="raised"
      rhythm="spacious"
      eyebrow="Operating Code"
      title="Non-negotiable principles."
      align="left"
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-labelledby={`${headingId}-title`}
        className="grid grid-cols-12 gap-8 lg:gap-12 items-center"
        ref={sliderRef}
        onMouseEnter={() => { setPaused(true); }}
        onMouseLeave={() => { setPaused(false); }}
        onFocus={() => { setPaused(true); }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
        }}
      >
        <span id={`${headingId}-title`} className="sr-only">
          Our operating principles
        </span>

        {/* Left: context & slide controls */}
        <div className="col-span-12 lg:col-span-4 flex flex-col justify-between h-full">
          <div>
            <p className="t-body-lg t-muted leading-relaxed">
              Four fundamental commitments written into our engineering handbook. They govern every system we design, deploy, and support.
            </p>

            <div className="mt-8 flex flex-col gap-2">
              {PRINCIPLES.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { setIndex(i); }}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-200",
                    i === index
                      ? "bg-surface-overlay border border-accent/30 text-accent font-medium shadow-sm"
                      : "text-foreground-subtle hover:text-foreground hover:bg-surface/60 border border-transparent",
                  )}
                >
                  <span className="text-xs font-mono">{p.pillar}</span>
                  <span className="text-xs">{p.category}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Previous principle"
              onClick={() => { advance(-1); }}
            >
              <Icon icon={ChevronLeft} aria-hidden size="sm" />
            </Button>
            <div role="tablist" aria-label="Principle slides" className="flex items-center gap-2">
              {PRINCIPLES.map((t, i) => (
                <button
                  key={t.id}
                  role="tab"
                  type="button"
                  aria-label={`Go to principle ${String(i + 1)} of ${String(PRINCIPLES.length)}`}
                  aria-selected={i === index}
                  onClick={() => { setIndex(i); }}
                  className={cn(
                    "rounded-pill inline-flex h-1 transition-all duration-300",
                    i === index ? "bg-accent w-8" : "bg-border-strong hover:bg-foreground-subtle w-3",
                  )}
                />
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Next principle"
              onClick={() => { advance(1); }}
            >
              <Icon icon={ChevronRight} aria-hidden size="sm" />
            </Button>
          </div>
        </div>

        {/* Right: cinematic quote */}
        <div className="col-span-12 lg:col-span-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-surface-raised/80 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl">
            {/* Ambient accent background wash */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -right-16 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(var(--token-accent)/0.12),transparent_70%)]"
            />

            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.figure
                  key={current.id}
                  initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                  className="flex flex-col gap-8"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="iris" size="sm">
                      {current.pillar}
                    </Badge>
                    <span className="font-mono text-xs text-foreground-subtle">
                      {current.category}
                    </span>
                  </div>

                  <blockquote className="t-display-3 text-foreground font-display leading-[1.12] tracking-[-0.02em] font-[550] is-balanced">
                    &ldquo;{current.body}&rdquo;
                  </blockquote>

                  <figcaption className="flex items-center gap-3 border-t border-white/[0.06] pt-6">
                    <span className="size-2 rounded-full bg-accent shadow-[0_0_8px_rgb(var(--token-accent))]" aria-hidden />
                    <span className="t-overline tracking-widest uppercase text-foreground-subtle font-mono text-[0.75rem]">
                      Mandate — {current.owner}
                    </span>
                  </figcaption>
                </motion.figure>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}
