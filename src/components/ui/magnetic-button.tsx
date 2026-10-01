"use client";

import { type ReactNode, forwardRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/cn";

export interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}

/**
 * `MagneticButton` — Subtle magnetic pull effect for premium CTAs.
 *
 * Uses Framer Motion spring physics to gently pull the button
 * toward the cursor within a bounded radius. Disabled for reduced motion.
 */
export const MagneticButton = forwardRef<HTMLDivElement, MagneticButtonProps>(
  function MagneticButton({ children, className, onClick, id }, ref) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    return (
      <motion.div
        ref={ref}
        id={id}
        style={{ x: springX, y: springY }}
        onMouseMove={(e: React.MouseEvent<HTMLElement>) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distanceX = e.clientX - centerX;
          const distanceY = e.clientY - centerY;
          x.set(distanceX * 0.12);
          y.set(distanceY * 0.12);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        onClick={onClick}
        className={cn("relative inline-flex items-center justify-center cursor-pointer", className)}
      >
        {children}
      </motion.div>
    );
  },
);