"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

/**
 * ZALVY `HeroParticles` — Lightweight ambient particle field.
 *
 * Pure CSS dots with deterministic float animations. On desktop, the
 * entire container responds to cursor position via CSS translate,
 * creating a subtle parallax depth layer. Zero canvas, zero heavy
 * libraries — just 18 divs with transform animations.
 *
 * Respects `prefers-reduced-motion` — renders nothing if set.
 */

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
}

// Deterministic seed-based generation to guarantee 100% identical SSR/Client hydration
const PARTICLES: Particle[] = Array.from({ length: 18 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const rnd = seed / 233280;
  const seed2 = ((i + 7) * 9301 + 49297) % 233280;
  const rnd2 = seed2 / 233280;
  return {
    id: i,
    x: Math.round((((i * 19.3 + 12) % 94) + 3) * 10) / 10,
    y: Math.round((((i * 23.7 + 8) % 88) + 6) * 10) / 10,
    size: Math.round((1.5 + rnd * 2) * 10) / 10,
    opacity: Math.round((0.12 + rnd2 * 0.22) * 100) / 100,
    duration: Math.round((14 + rnd * 18) * 10) / 10,
    delay: Math.round((-(i * 2.1) % 15) * 10) / 10,
    drift: Math.round((8 + rnd2 * 14) * 10) / 10,
  };
});

function emptySubscribe() {
  return () => {
    // No-op subscription for static client-mounted state
  };
}

export function HeroParticles() {
  const reduce = useReducedMotion();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize to -1..1 range from center
    targetRef.current = {
      x: ((e.clientX - centerX) / (rect.width / 2)) * 12,
      y: ((e.clientY - centerY) / (rect.height / 2)) * 8,
    };
  }, []);

  useEffect(() => {
    if (reduce || !mounted) return;

    const animate = () => {
      const el = containerRef.current;
      if (!el) return;

      // Lerp toward target
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.04;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.04;

      el.style.transform = `translate(${String(currentRef.current.x)}px, ${String(currentRef.current.y)}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduce, mounted, handleMouseMove]);

  if (reduce || !mounted) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden will-change-transform"
      style={{
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, #000 20%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, #000 20%, transparent 70%)",
      }}
    >
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-[rgb(var(--token-accent))]"
          style={{
            left: `${String(p.x)}%`,
            top: `${String(p.y)}%`,
            width: `${String(p.size)}px`,
            height: `${String(p.size)}px`,
            opacity: p.opacity,
            animation: `zalvy-particle-drift ${String(p.duration)}s ease-in-out ${String(p.delay)}s infinite`,
            ["--particle-drift" as string]: `${String(p.drift)}px`,
          }}
        />
      ))}
    </div>
  );
}
