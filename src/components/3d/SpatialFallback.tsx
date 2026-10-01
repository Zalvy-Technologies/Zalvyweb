"use client";

interface SpatialFallbackProps {
  className?: string;
}

export function SpatialFallback({ className = "" }: SpatialFallbackProps) {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      {/* Primary depth wash — top-right atmospheric bloom */}
      <div
        className="absolute -top-[10%] -right-[5%] h-[55rem] w-[55rem] rounded-full opacity-[0.45] blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgb(var(--token-accent) / 0.12) 0%, rgb(var(--token-iris) / 0.04) 50%, transparent 75%)",
        }}
      />

      {/* Secondary depth wash — bottom-left anchor */}
      <div
        className="absolute -bottom-[15%] -left-[10%] h-[50rem] w-[50rem] rounded-full opacity-[0.35] blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, rgb(var(--token-iris) / 0.09) 0%, transparent 70%)",
        }}
      />

      {/* Architectural coordinate grid — ultra-subtle 96px cadence */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--token-foreground)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--token-foreground)) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          maskImage:
            "radial-gradient(ellipse 90% 75% at 50% 30%, #000 25%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 75% at 50% 30%, #000 25%, transparent 75%)",
        }}
      />

      {/* Subtle SVG spatial telemetry threads & computational anchors */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.12]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <linearGradient id="zalvy-thread-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(var(--token-accent))" stopOpacity="0.8" />
            <stop offset="50%" stopColor="rgb(var(--token-iris))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(var(--token-accent))" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Subtle geometric pathways */}
        <line
          x1="20%"
          y1="15%"
          x2="55%"
          y2="35%"
          stroke="url(#zalvy-thread-grad)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <line
          x1="55%"
          y1="35%"
          x2="85%"
          y2="28%"
          stroke="url(#zalvy-thread-grad)"
          strokeWidth="1"
        />
        <line
          x1="55%"
          y1="35%"
          x2="65%"
          y2="60%"
          stroke="url(#zalvy-thread-grad)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        {/* Abstract coordinate node markers */}
        <circle cx="20%" cy="15%" r="2.5" fill="rgb(var(--token-accent))" opacity="0.6" />
        <circle cx="55%" cy="35%" r="3.5" fill="rgb(var(--token-accent))" opacity="0.8" />
        <circle cx="85%" cy="28%" r="2" fill="rgb(var(--token-iris))" opacity="0.5" />
        <circle cx="65%" cy="60%" r="2" fill="rgb(var(--token-accent))" opacity="0.4" />
      </svg>

      {/* Central text-safe vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 20%, rgb(var(--token-canvas) / 0.7) 100%)",
        }}
      />
    </div>
  );
}
