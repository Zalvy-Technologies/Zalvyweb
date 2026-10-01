"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { Reveal } from "@/components/ui/reveal";

interface ImpactStat {
  value: number;
  /** Display formatter — allows %.1f style precision. */
  format: { decimals?: number; prefix?: string; suffix?: string };
  label: string;
  description: string;
}

const STATS: ImpactStat[] = [
  {
    value: 99.95,
    format: { decimals: 2, suffix: "%" },
    label: "Uptime SLA",
    description: "Enterprise availability commitment across managed agents and serving.",
  },
  {
    value: 100,
    format: { decimals: 0, prefix: "≤", suffix: "ms" },
    label: "Inference p99 target",
    description: "Serving latency target for production agents, chatbots, and automation.",
  },
  {
    value: 12,
    format: { decimals: 0, suffix: " weeks" },
    label: "Paid internship",
    description: "Hands-on apprenticeship under senior staff engineers, building real systems.",
  },
  {
    value: 3,
    format: { decimals: 0, suffix: " continents" },
    label: "Serving footprint",
    description: "Active capacity across US, EU, and APAC regions.",
  },
];

/**
 * ZALVY `Impact` — dramatic number wall.
 *
 * Each number animates upward from zero using rAF; on users with
 * `prefers-reduced-motion`, the final value renders immediately.
 *
 * Redesigned: numbers use display-2 scale, each stat gets its own
 * ambient glow, full-width immersive treatment creates a "statement wall"
 * that makes visitors pause and absorb.
 */
export function Impact() {
  return (
    <section
      id="impact"
      className="relative overflow-hidden py-28 md:py-40"
    >
      {/* Ambient background — immersive */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--token-surface)/0.5)] via-transparent to-[rgb(var(--token-surface)/0.5)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[80rem] bg-[radial-gradient(closest-side,rgb(var(--token-accent)/0.06),transparent_70%)] opacity-80" />
      </div>

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-gutter)]">
        <header className="mb-16 md:mb-20 flex max-w-[42rem] flex-col gap-4">
          <span className="t-eyebrow" data-eyebrow>Operate</span>
          <h2 className="t-h2 text-foreground is-balanced">The picture after the demo.</h2>
          <p className="t-body-lg t-muted max-w-[36rem]">
            Demos sell the early adopter. ZALVY&rsquo;s first promise is to operate exactly the same in month 14 as it did in week 1.
          </p>
        </header>

        <dl className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal
              key={stat.label}
              as="div"
              delay={i * 100}
              className="group relative border-t border-white/[0.07] px-6 py-8 sm:py-10 lg:border-t-0 lg:border-l lg:px-8 lg:py-0 first:lg:border-l-0"
            >
              {/* Per-stat ambient glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_20%,rgb(var(--token-accent)/0.04),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <CountUp {...stat} />
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

function CountUp({ value, format, label, description }: ImpactStat) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(() => formatValue(value, format));
  const reduce = useReducedMotion();
  const startedRef = useRef(false);

  useEffect(() => {
    const target = ref.current;
    if (!target || reduce || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const duration = 1600;
            const from = 0;
            const tick = (now: number) => {
              const elapsed = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - elapsed, 3);
              setDisplay(formatValue(from + (value - from) * eased, format));
              if (elapsed < 1) requestAnimationFrame(tick);
              else setDisplay(formatValue(value, format));
            };
            requestAnimationFrame(tick);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [value, format, reduce]);

  return (
    <div ref={ref} className="relative flex flex-col gap-3">
      <dd className="t-display-2 t-gradient-iris t-num-tabular leading-none tracking-tight font-[650]">
        {display}
      </dd>
      <dt className="t-h4 text-foreground mt-1">{label}</dt>
      <p className="t-body-sm t-muted max-w-[18rem] leading-snug">{description}</p>
    </div>
  );
}

function formatValue(v: number, format: ImpactStat["format"]): string {
  const decimals = format.decimals ?? 0;
  const prefix = format.prefix ?? "";
  const suffix = format.suffix ?? "";
  const value = Math.abs(v) < 0.0001 ? 0 : v;
  return `${prefix}${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;
}
