"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import type { QualityConfig } from "./DeviceQuality";
import { SceneLighting } from "./SceneLighting";
import { CameraRig } from "./CameraRig";
import { AtmosphericLayer } from "./AtmosphericLayer";
import { SpatialGeometry } from "./SpatialGeometry";
import {
  CoreGeometry,
  type CognitivePhase,
} from "./CoreGeometry";
import { IntelligenceRings } from "./IntelligenceRings";
import {
  IntelligenceNetwork,
  type NetworkEdge,
  type NetworkNode,
} from "./IntelligenceNetwork";
import { SignalPaths } from "./SignalPaths";
import { ParticleField } from "./ParticleField";

interface ZalvySpatialCanvasProps {
  quality: QualityConfig;
  reduceMotion: boolean;
  activeSection: string;
  onContextLost?: () => void;
}

const PHASES: CognitivePhase[] = [
  "observe",
  "connect",
  "process",
  "orchestrate",
  "execute",
  "result",
  "reset",
];

const PHASE_DURATIONS: Record<CognitivePhase, number> = {
  observe: 3200,
  connect: 2600,
  process: 2800,
  orchestrate: 3200,
  execute: 2200,
  result: 2800,
  reset: 2400,
};

const PHASE_INTENSITIES: Record<CognitivePhase, number> = {
  observe: 0.15,
  connect: 0.35,
  process: 0.58,
  orchestrate: 0.78,
  execute: 0.96,
  result: 0.62,
  reset: 0.18,
};

/**
 * Interactive Core Rig with subtle pointer torque and micro-reaction
 */
function LivingCoreRig({
  reduceMotion,
  enableParallax,
  children,
}: {
  reduceMotion: boolean;
  enableParallax: boolean;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduceMotion || !enableParallax) return;
    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduceMotion, enableParallax]);

  useFrame((_, delta) => {
    if (reduceMotion || !groupRef.current) return;
    const dt = Math.min(delta, 0.05);

    // Subtle pointer torque ("the system noticed me")
    const targetRotX = enableParallax ? -pointer.current.y * 0.08 : 0;
    const targetRotY = enableParallax ? pointer.current.x * 0.11 : 0;

    groupRef.current.rotation.x +=
      (targetRotX - groupRef.current.rotation.x) * dt * 1.6;
    groupRef.current.rotation.y +=
      (targetRotY - groupRef.current.rotation.y) * dt * 1.6;
  });

  return <group ref={groupRef}>{children}</group>;
}

export function ZalvySpatialCanvas({
  quality,
  reduceMotion,
  activeSection,
  onContextLost,
}: ZalvySpatialCanvasProps) {
  const [networkData, setNetworkData] = useState<{
    nodes: NetworkNode[];
    edges: NetworkEdge[];
  }>({ nodes: [], edges: [] });

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [eventActive, setEventActive] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPhase = PHASES[phaseIndex] ?? "observe";
  const rhythmIntensity = eventActive
    ? 1.0
    : PHASE_INTENSITIES[currentPhase];

  // Pause rendering loop when document is hidden (background tab)
  useEffect(() => {
    const handleVisibility = () => {
      setIsVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Continuous AI Cognitive Thinking Cycle
  useEffect(() => {
    if (reduceMotion || !isVisible) return;
    const duration = PHASE_DURATIONS[currentPhase];
    const timer = setTimeout(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, duration);
    return () => {
      clearTimeout(timer);
    };
  }, [currentPhase, reduceMotion, isVisible]);

  // Occasional randomized intelligence events (every 12 to 18 seconds)
  useEffect(() => {
    if (reduceMotion || !isVisible) return;
    const nextInterval = 12000 + Math.random() * 6000;
    const timer = setTimeout(() => {
      setEventActive(true);
      const resetTimer = setTimeout(() => {
        setEventActive(false);
      }, 1800);
      return () => {
        clearTimeout(resetTimer);
      };
    }, nextInterval);

    return () => {
      clearTimeout(timer);
    };
  }, [eventActive, reduceMotion, isVisible]);

  // WebGL context loss listener
  const handleCreated = useCallback(
    ({ gl }: { gl: { domElement: HTMLCanvasElement } }) => {
      const canvasEl = gl.domElement;
      const onLost = (e: Event) => {
        e.preventDefault();
        onContextLost?.();
      };
      canvasEl.addEventListener("webglcontextlost", onLost, false);
      return () => {
        canvasEl.removeEventListener("webglcontextlost", onLost);
      };
    },
    [onContextLost]
  );

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        frameloop={isVisible ? "always" : "never"}
        camera={{ position: [0, 0, 13.5], fov: 42 }}
        dpr={quality.dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "default",
          depth: true,
          stencil: false,
        }}
        onCreated={handleCreated}
      >
        <fog attach="fog" args={["#080a0f", 12, 34]} />
        <SceneLighting
          phase={currentPhase}
          eventActive={eventActive}
          rhythmIntensity={rhythmIntensity}
        />
        <CameraRig
          reduceMotion={reduceMotion}
          enableParallax={quality.enableParallax}
        />
        <AtmosphericLayer rhythmIntensity={rhythmIntensity} />
        <SpatialGeometry
          activeSection={activeSection}
          reduceMotion={reduceMotion}
        />

        {/* The ZALVY Living Intelligence Core */}
        <LivingCoreRig
          reduceMotion={reduceMotion}
          enableParallax={quality.enableParallax}
        >
          {/* Layer A — Central Computational Geometry */}
          <CoreGeometry
            reduceMotion={reduceMotion}
            phase={currentPhase}
            eventActive={eventActive}
            rhythmIntensity={rhythmIntensity}
            qualityTier={quality.tier}
          />

          {/* Layer B & D — Concentric Intelligence Rings & Orbital Architecture */}
          {quality.enableGeometryRings && (
            <IntelligenceRings
              reduceMotion={reduceMotion}
              eventActive={eventActive}
              rhythmIntensity={rhythmIntensity}
            />
          )}

          {/* Layer C — Morphing Neural Network Graph */}
          <IntelligenceNetwork
            maxNodes={quality.maxNodes}
            reduceMotion={reduceMotion}
            activeSection={activeSection}
            phase={currentPhase}
            eventActive={eventActive}
            rhythmIntensity={rhythmIntensity}
            onNetworkData={setNetworkData}
          />

          {/* Layer E — Flowing Information Signals */}
          <SignalPaths
            edges={networkData.edges}
            nodes={networkData.nodes}
            reduceMotion={reduceMotion}
            enableSignals={quality.enableSignals}
            activeSection={activeSection}
            phase={currentPhase}
            eventActive={eventActive}
            rhythmIntensity={rhythmIntensity}
          />
        </LivingCoreRig>

        {/* Layer F — Depth Particles */}
        <ParticleField
          count={quality.particleCount}
          reduceMotion={reduceMotion}
        />
      </Canvas>
    </div>
  );
}
