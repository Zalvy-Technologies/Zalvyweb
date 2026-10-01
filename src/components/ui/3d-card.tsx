"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type Props = React.PropsWithChildren<{
  className?: string;
}>;

export function ThreeDCard({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={cn("perspective-none", className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("relative [perspective:1200px]", className)}
      whileHover={{ rotateX: 2, rotateY: -2 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
