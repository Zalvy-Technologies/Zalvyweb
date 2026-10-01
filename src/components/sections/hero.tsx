"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { Badge } from "@/components/ui/badge";
import { AnimatedText } from "@/components/ui/animated-text";
import { InfinityFlowVisual } from "@/components/sections/hero-visual";
import { MagneticButton } from "@/components/ui/magnetic-button";

const EASE = [0.2, 0, 0, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yVisual = useTransform(scrollYProgress, [0, 1], [0, 42]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-headline"
      className="relative min-h-[100dvh] flex items-center overflow-hidden isolate"
    >
      {/* ─── Canvas depth — layered ambient washes ─── */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { opacity: opacityBg }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[var(--token-gradient-canvas)] opacity-[0.35]" />

        {/* Hairline grid — 96px, ultra-subtle, masked — infinity DNA */}
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--token-foreground)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--token-foreground)) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
            maskImage: "radial-gradient(ellipse 92% 85% at 50% 18%, #000 28%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse 92% 85% at 50% 18%, #000 28%, transparent 72%)",
          }}
        />

        {/* Primary accent wash — cinematic top bloom */}
        <div className="absolute inset-x-0 top-0 h-[56rem] bg-[radial-gradient(ellipse_88%_62%_at_50%_0%,rgb(var(--token-accent)/0.06),transparent_58%)]" />

        {/* Secondary iris wash — right depth */}
        <div className="absolute right-[-4%] top-[8%] hidden h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(closest-side,rgb(var(--token-iris)/0.04),transparent_72%)] blur-[0.5px] lg:block" />

        {/* Tertiary veil — bottom anchor */}
        <div className="absolute bottom-0 left-[18%] h-[28rem] w-[48rem] bg-[radial-gradient(closest-side,rgb(var(--token-iris)/0.025),transparent_72%)]" />

        {/* Hairline horizon + infinity thread */}
        <div className="absolute inset-x-0 top-[var(--header-h)] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="hidden lg:block absolute left-[calc(50%+1rem)] top-[42%] h-px w-[7%] bg-gradient-to-r from-[rgb(var(--token-accent)/0.35)] to-transparent opacity-60" />
      </motion.div>

      <Container className="relative py-20 sm:py-24 lg:py-32 xl:py-36">
        <div className="grid grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
          {/* Left — editorial headline */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-6 flex flex-col gap-7 lg:pr-4 xl:pr-8">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.65, ease: EASE }}
              className="flex flex-col gap-4"
            >
              <Link href="/changelog" className="inline-flex self-start">
                <Badge
                  variant="iris"
                  size="lg"
                  className="group gap-2.5 backdrop-blur-xl bg-white/[0.035] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.11] hover:scale-[1.005] transition-all duration-300 shadow-[var(--shadow-premium-card)]"
                >
                  <span className="relative flex size-1.5">
                    <span className="absolute inset-0 rounded-full bg-[rgb(var(--token-accent))] animate-ping opacity-30" />
                    <span className="relative size-1.5 rounded-full bg-[rgb(var(--token-accent))] shadow-[0_0_8px_rgb(var(--token-accent)/0.6)]" />
                  </span>
                  <span className="font-medium tracking-[-0.01em] text-[0.8125rem]">ZALVY Agents v4</span>
                  <span aria-hidden className="h-3 w-px bg-white/[0.08]" />
                  <span className="inline-flex items-center gap-1.5 text-foreground-muted group-hover:text-foreground transition-colors text-[0.8125rem]">
                    Changelog <ArrowRight size={11} strokeWidth={2} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Badge>
              </Link>

              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-[rgb(var(--token-accent)/0.45)]" aria-hidden />
                <span className="t-overline text-[0.6875rem] tracking-[0.20em] text-foreground-subtle/90">Building Intelligent Systems</span>
              </div>
            </motion.div>

            <h1
              id="hero-headline"
              className="t-display-1 font-[680] tracking-[-0.045em] leading-[0.86] text-foreground"
              style={{ fontVariationSettings: "'opsz' 32" }}
            >
              <span className="block font-[310] tracking-[-0.042em] text-foreground/85">
                <AnimatedText animation="word-reveal" delay={reduce ? 0 : 0.08} stagger={0.06} duration={0.65}>
                  BUILDING
                </AnimatedText>
              </span>
              <span className="block font-[650] tracking-[-0.045em]">
                <AnimatedText animation="word-reveal" delay={reduce ? 0 : 0.20} stagger={0.06} duration={0.65}>
                  INTELLIGENT
                </AnimatedText>
              </span>
              <span className="block relative font-[800] tracking-[-0.05em]">
                <span className="bg-gradient-to-r from-[rgb(var(--token-accent))] via-[rgb(var(--token-iris))] to-[rgb(var(--token-accent))] bg-[length:200%_auto] bg-clip-text text-transparent">
                  <AnimatedText animation="word-reveal" delay={reduce ? 0 : 0.32} stagger={0.06} duration={0.65}>
                    SYSTEMS.
                  </AnimatedText>
                </span>
                {!reduce && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{
                      delay: 1.05,
                      duration: 1,
                      repeat: 3,
                      ease: "linear",
                    }}
                    className="inline-block w-[2px] h-[0.68em] bg-[rgb(var(--token-accent))] ml-[0.07em] align-baseline rounded-full shadow-[0_0_14px_rgb(var(--token-accent)/0.6)]"
                    aria-hidden
                  />
                )}
              </span>
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.55, ease: EASE }}
              className="t-body-lg t-muted max-w-[33rem] leading-[1.65] tracking-[-0.012em] text-[1.0625rem]"
            >
              Autonomous <span className="text-foreground font-[500]">AI agents</span>, business automation and intelligent software — and the engineers who build what&rsquo;s next.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.45, ease: EASE }}
              className="flex flex-col sm:flex-row gap-3 pt-1"
            >
              <MagneticButton>
                <Button asChild variant="primary" size="lg" className="min-w-[15rem] h-[3.2rem] text-[0.9375rem] font-[600] tracking-[-0.01em] group shadow-[0_0_0_1px_rgb(var(--token-accent)/0.18),0_8px_32px_-8px_rgb(var(--token-accent)/0.38)]">
                  <Link href="/solutions" className="inline-flex items-center gap-2.5">
                    Explore AI Solutions
                    <span className="inline-flex size-[1.35rem] items-center justify-center rounded-full bg-white/15 group-hover:bg-white/20 transition-colors">
                      <Icon
                        icon={ArrowRight}
                        size="xs"
                        aria-hidden
                        strokeWidth={2}
                        className="transition-transform group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
                      />
                    </span>
                  </Link>
                </Button>
              </MagneticButton>
              <Button asChild variant="secondary" size="lg" className="min-w-[15rem] h-[3.2rem] bg-white/[0.035] backdrop-blur-md border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.11] font-[500] text-[0.9375rem]">
                <Link href="/careers/internship">Explore Internships</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={reduce ? undefined : { opacity: 1 }}
              transition={{ delay: 0.78, duration: 0.4 }}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1.5"
            >
              <span className="inline-flex items-center gap-2 text-[0.8rem] leading-none text-foreground-subtle">
                <span className="relative inline-flex size-1.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25" />
                  <span className="relative size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.55)]" aria-hidden />
                </span>
                Autonomous · Observable · Policy-gated
              </span>
              <span aria-hidden className="hidden sm:inline h-3 w-px bg-white/[0.08]" />
              <Link href="/security" className="inline-flex items-center gap-1 text-[0.8rem] text-foreground-subtle hover:text-foreground underline-offset-4 hover:underline transition-colors">
                Enterprise trust <ArrowRight size={11} aria-hidden />
              </Link>
            </motion.div>
          </div>

          {/* Right — proprietary system visual — parallax */}
          <motion.div
            style={reduce ? undefined : { y: yVisual }}
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.986 }}
            animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.30, duration: 0.8, ease: EASE }}
            className="col-span-12 lg:col-span-5 xl:col-span-6 will-change-transform"
          >
            <InfinityFlowVisual />
            <p className="t-caption text-center text-foreground-subtle/60 mt-4 tracking-[0.015em] font-mono text-[0.6875rem]">
              Input → Reasoning → Tools → Actions → Results — continuous · observed · policy-gated
            </p>
          </motion.div>
        </div>
      </Container>

      {/* ─── Cinematic bottom vignette — infinity DNA continuity ─── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[rgb(var(--token-canvas))] via-[rgb(var(--token-canvas)/0.75)] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 h-32 w-px bg-gradient-to-b from-[rgb(var(--token-accent)/0.18)] to-transparent opacity-50 hidden lg:block"
      />
    </section>
  );
}


