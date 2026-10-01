export type QualityTier = "high" | "medium" | "low" | "fallback";

export interface QualityConfig {
  tier: QualityTier;
  dpr: number;
  maxNodes: number;
  particleCount: number;
  enableSignals: boolean;
  enableParallax: boolean;
  enableGeometryRings: boolean;
}

export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function getDeviceQuality(): QualityConfig {
  if (typeof window === "undefined") {
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

  if (!isWebGLAvailable()) {
    return {
      tier: "fallback",
      dpr: 1,
      maxNodes: 0,
      particleCount: 0,
      enableSignals: false,
      enableParallax: false,
      enableGeometryRings: false,
    };
  }

  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const cores = (navigator as unknown as { hardwareConcurrency?: number }).hardwareConcurrency ?? 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;

  const currentDpr = window.devicePixelRatio ? window.devicePixelRatio : 1;

  if (isMobile || cores < 4 || memory < 4) {
    return {
      tier: "low",
      dpr: Math.min(currentDpr, 1.25),
      maxNodes: 18,
      particleCount: 10,
      enableSignals: false,
      enableParallax: false,
      enableGeometryRings: false,
    };
  }

  if (cores < 8 || memory < 8) {
    return {
      tier: "medium",
      dpr: Math.min(currentDpr, 1.5),
      maxNodes: 28,
      particleCount: 18,
      enableSignals: true,
      enableParallax: true,
      enableGeometryRings: true,
    };
  }

  return {
    tier: "high",
    dpr: Math.min(currentDpr, 1.75),
    maxNodes: 42,
    particleCount: 30,
    enableSignals: true,
    enableParallax: true,
    enableGeometryRings: true,
  };
}
