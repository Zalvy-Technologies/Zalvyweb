"use client";

import { useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/cn";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface ParticleBgProps {
  className?: string;
  particleCount?: number;
  color?: "accent" | "iris" | "mixed" | "monochrome";
  interactive?: boolean;
  connectionDistance?: number;
  speed?: number;
}

const colorPalettes = {
  accent: ["rgba(124, 226, 240, ", "rgba(96, 165, 250, "],
  iris: ["rgba(96, 165, 250, ", "rgba(168, 85, 247, "],
  mixed: ["rgba(124, 226, 240, ", "rgba(96, 165, 250, ", "rgba(52, 211, 153, ", "rgba(168, 85, 247, "],
  monochrome: ["rgba(255, 255, 255, ", "rgba(165, 175, 190, ", "rgba(110, 120, 135, "],
};

/**
 * `ParticleBg` — Canvas-based particle system for premium backgrounds.
 *
 * Features:
 * - GPU-accelerated canvas rendering
 * - Mouse-interactive particle attraction/repulsion
 * - Particle connections (constellation effect)
 * - Respects prefers-reduced-motion
 * - Performance optimized with requestAnimationFrame
 */
export function ParticleBg({
  className,
  particleCount = 60,
  color = "mixed",
  interactive = true,
  connectionDistance = 140,
  speed = 1,
}: ParticleBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const reducedMotionRef = useRef(false);

  const palette = useMemo(() => colorPalettes[color], [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mediaQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mediaQuery.addEventListener("change", onMotionChange);

    const initParticles = (width: number, height: number) => {
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5 * speed,
          vy: (Math.random() - 0.5) * 0.5 * speed,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.4 + 0.1,
          color: palette[Math.floor(Math.random() * palette.length)] ?? "rgba(124, 226, 240, ",
          life: 0,
          maxLife: Math.random() * 200 + 100,
        });
      }
      particlesRef.current = particles;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const tick = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) {
        animationRef.current = requestAnimationFrame(tick);
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initParticles(width, height);
      }

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life > p.maxLife) {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.life = 0;
          p.maxLife = Math.random() * 200 + 100;
          p.vx = (Math.random() - 0.5) * 0.5 * speed;
          p.vy = (Math.random() - 0.5) * 0.5 * speed;
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        if (interactive && mouseRef.current.active && !reducedMotionRef.current) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            const force = ((150 - dist) / 150) * 0.02;
            p.vx -= (dx / dist) * force;
            p.vy -= (dy / dist) * force;
          }
        }

        const fade = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${String(Math.max(0.05, p.opacity * fade))})`;
        ctx.fill();
      });

      if (!reducedMotionRef.current) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            if (p1 === undefined || p2 === undefined) {
              continue;
            }
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
              const opacity = (1 - dist / connectionDistance) * 0.15;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(124, 226, 240, ${String(opacity)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      mediaQuery.removeEventListener("change", onMotionChange);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [particleCount, connectionDistance, speed, interactive, palette]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "absolute inset-0 w-full h-full -z-10 pointer-events-none",
        className,
      )}
    />
  );
}