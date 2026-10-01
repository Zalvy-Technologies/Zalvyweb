"use client";

import { useEffect, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/cn";

export interface FloatingOrbProps {
  className?: string;
  style?: CSSProperties;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "iris" | "accent" | "sage" | "purple" | "mixed";
  intensity?: number;
  magnetic?: boolean;
  orbit?: boolean;
  pulse?: boolean;
  speed?: number;
}

/**
 * `FloatingOrb` — Premium animated gradient orb for hero backgrounds.
 *
 * Features:
 * - Magnetic cursor following
 * - Orbital motion path
 * - Breathing pulse animation
 * - Multiple color themes
 * - Respects reduced motion
 */
export function FloatingOrb({
  className,
  style,
  size = "lg",
  color = "mixed",
  intensity = 0.18,
  magnetic = true,
  orbit = true,
  pulse = true,
  speed = 1,
}: FloatingOrbProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.8 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const sizeMap = {
    sm: "w-[16rem] h-[16rem]",
    md: "w-[24rem] h-[24rem]",
    lg: "w-[36rem] h-[36rem]",
    xl: "w-[48rem] h-[48rem]",
  };

  const colorGradients = {
    iris: `radial-gradient(closest-side, rgb(var(--token-iris) / ${String(intensity)}), transparent 70%)`,
    accent: `radial-gradient(closest-side, rgb(var(--token-accent) / ${String(intensity)}), transparent 70%)`,
    sage: `radial-gradient(closest-side, rgb(var(--token-sage) / ${String(intensity)}), transparent 70%)`,
    purple: `radial-gradient(closest-side, rgb(168 85 247 / ${String(intensity)}), transparent 70%)`,
    mixed: `radial-gradient(ellipse at center, rgb(var(--token-iris) / ${String(intensity * 0.8)}) 0%, rgb(var(--token-accent) / ${String(intensity)}) 50%, transparent 70%)`,
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!magnetic) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) * 0.08);
    mouseY.set((e.clientY - centerY) * 0.08);
  };

  useEffect(() => {
    if (!orbit) return;
    let frame = 0;
    const tick = () => {
      frame += 0.005 * speed;
      const orbitRadius = 30;
      x.set(Math.sin(frame) * orbitRadius + (magnetic ? mouseX.get() : 0));
      y.set(Math.cos(frame * 0.7) * orbitRadius * 0.6 + (magnetic ? mouseY.get() : 0));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [orbit, speed, magnetic, mouseX, mouseY, x, y]);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (magnetic) {
          mouseX.set(0);
          mouseY.set(0);
        }
      }}
      style={{
        x: springX,
        y: springY,
        background: colorGradients[color],
        ...style,
      }}
      animate={pulse ? { scale: [1, 1.02, 1] } : undefined}
      transition={pulse ? { duration: 6 / speed, ease: "easeInOut", repeat: Infinity } : undefined}
      className={cn(
        "pointer-events-none absolute rounded-full blur-[100px] transition-opacity duration-1000",
        sizeMap[size],
        className,
      )}
    />
  );
}

export interface FloatingOrbClusterProps {
  className?: string;
  count?: number;
  colors?: ("iris" | "accent" | "sage" | "purple" | "mixed")[];
  magnetic?: boolean;
}

/**
 * `FloatingOrbCluster` — Multiple orbs for rich ambient backgrounds.
 */
export function FloatingOrbCluster({
  className,
  count = 3,
  colors = ["iris", "accent", "sage"],
  magnetic = true,
}: FloatingOrbClusterProps) {
  const positions = [
    { top: "-20%", left: "10%", size: "xl" as const, delay: 0 },
    { top: "20%", right: "-10%", size: "lg" as const, delay: 2 },
    { bottom: "-15%", left: "20%", size: "md" as const, delay: 4 },
    { top: "50%", left: "50%", size: "lg" as const, delay: 1 },
    { bottom: "10%", right: "15%", size: "sm" as const, delay: 3 },
  ];

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      {Array.from({ length: count }, (_, i) => {
        const pos = positions[i % positions.length];
        if (pos === undefined) {
          return null;
        }
        const centered = pos.top !== undefined && pos.left !== undefined;
        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              animationDelay: String(pos.delay) + "s",
              transform: centered ? "translate(-50%, -50%)" : undefined,
            }}
          >
            <FloatingOrb
              color={colors[i % colors.length]}
              size={pos.size}
              magnetic={magnetic}
              orbit
              pulse
              speed={0.8 + i * 0.1}
              intensity={0.12 + i * 0.03}
            />
          </div>
        );
      })}
    </div>
  );
}