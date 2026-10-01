"use client";

import { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { getDeviceQuality, type QualityConfig } from "./DeviceQuality";
import { useReducedMotionPreference } from "./ReducedMotion";
import { SpatialFallback } from "./SpatialFallback";

// Dynamically import WebGL canvas with ssr: false so SSR is 100% lightweight and non-blocking
const ZalvySpatialCanvas = dynamic(
  () =>
    import("./ZalvySpatialCanvas").then((mod) => ({
      default: mod.ZalvySpatialCanvas,
    })),
  {
    ssr: false,
    loading: () => <SpatialFallback />,
  }
);

// High-narrative routes that receive the full 3D spatial experience
function isFullRoute(path: string): boolean {
  if (
    path === "/" ||
    path === "/solutions" ||
    path === "/agents" ||
    path === "/automation" ||
    path === "/platform"
  ) {
    return true;
  }
  if (
    path.startsWith("/platform/") ||
    path.startsWith("/solutions/") ||
    path.startsWith("/agents/") ||
    path.startsWith("/automation/")
  ) {
    return true;
  }
  return false;
}

// Subtle / reduced 3D routes
function isSubtleRoute(path: string): boolean {
  if (
    path === "/about" ||
    path === "/projects" ||
    path === "/services" ||
    path === "/studio"
  ) {
    return true;
  }
  if (
    path.startsWith("/about/") ||
    path.startsWith("/projects/") ||
    path.startsWith("/services/") ||
    path.startsWith("/studio/")
  ) {
    return true;
  }
  return false;
}

function noop() {
  // SSR external store subscription noop
}

function emptySubscribe() {
  return noop;
}

export function ZalvySpatialBackground() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotionPreference();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [contextFailed, setContextFailed] = useState(false);
  const [activeScrollSection, setActiveScrollSection] = useState("hero");

  // Derive section: on non-homepage, derived from pathname; on homepage, from scroll observer
  const activeSection = useMemo(() => {
    if (!pathname || pathname === "/") {
      return activeScrollSection;
    }
    const clean = pathname.replace("/", "");
    return clean.length > 0 ? clean : "hero";
  }, [pathname, activeScrollSection]);

  // Determine route tier
  const routeTier = useMemo<"full" | "subtle" | "static">(() => {
    if (!pathname) return "full";
    if (isFullRoute(pathname)) return "full";
    if (isSubtleRoute(pathname)) return "subtle";
    return "static";
  }, [pathname]);

  // Evaluate device quality on client mount
  const quality = useMemo<QualityConfig>(() => {
    if (!mounted) {
      return {
        tier: "medium",
        dpr: 1,
        maxNodes: 28,
        particleCount: 18,
        enableSignals: true,
        enableParallax: false,
        enableGeometryRings: true,
      };
    }
    const q = getDeviceQuality();
    // If route is subtle tier, tone down nodes and particles
    if (routeTier === "subtle") {
      return {
        ...q,
        maxNodes: Math.min(q.maxNodes, 18),
        particleCount: Math.min(q.particleCount, 12),
        enableSignals: false,
      };
    }
    return q;
  }, [mounted, routeTier]);

  // Section observer on homepage
  useEffect(() => {
    if (pathname !== "/") return;

    const sections = document.querySelectorAll("section[id], section[aria-labelledby]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            const id = entry.target.getAttribute("id") ?? "";
            if (id.includes("solution")) setActiveScrollSection("solutions");
            else if (id.includes("agent") || id.includes("swarm")) setActiveScrollSection("agents");
            else if (id.includes("auto") || id.includes("workflow")) setActiveScrollSection("automation");
            else if (id.includes("platform") || id.includes("capabilit")) setActiveScrollSection("platform");
            else if (id.includes("security") || id.includes("trust")) setActiveScrollSection("security");
            else setActiveScrollSection("hero");
          }
        });
      },
      { threshold: [0.25, 0.5] }
    );

    sections.forEach((sec) => {
      observer.observe(sec);
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  // Fallback conditions: SSR, static route, failed context, or fallback quality tier
  if (!mounted || routeTier === "static" || quality.tier === "fallback" || contextFailed) {
    return <SpatialFallback />;
  }

  return (
    <div
      aria-hidden="true"
      role="presentation"
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full overflow-hidden"
    >
      {/* Underlying atmospheric gradient base */}
      <SpatialFallback />

      {/* Primary 3D Spatial Canvas */}
      <ZalvySpatialCanvas
        quality={quality}
        reduceMotion={reduceMotion}
        activeSection={activeSection}
        onContextLost={() => {
          setContextFailed(true);
        }}
      />

      {/* Dynamic visual safe-zone overlay: preserves typography contrast */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 30% 45%, rgb(var(--token-canvas) / 0.5) 0%, transparent 80%)",
        }}
      />
    </div>
  );
}
