"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { CognitivePhase } from "./CoreGeometry";

interface SceneLightingProps {
  phase?: CognitivePhase;
  eventActive?: boolean;
  rhythmIntensity?: number;
}

export function SceneLighting({
  phase = "observe",
  eventActive = false,
  rhythmIntensity = 0.15,
}: SceneLightingProps) {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  const primaryColor = useMemo(() => new THREE.Color("#38bdf8"), []); // ZALVY Electric Sky
  const secondaryColor = useMemo(() => new THREE.Color("#818cf8"), []); // ZALVY Celestial Iris
  const rimColor = useMemo(() => new THREE.Color("#60a5fa"), []); // Soft cyan-blue rim
  const ambientColor = useMemo(() => new THREE.Color("#0c131f"), []); // Deep muted blue-slate

  const orbitAngle = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // Subtle breathing illumination linked to cognitive peak, events, and rhythm intensity
    const isPeak = phase === "execute" || phase === "orchestrate" || eventActive;
    const peakBoost = isPeak ? 0.2 : 0.0;
    const rhythmBoost = rhythmIntensity * 0.25;

    const targetKey = 0.85 + peakBoost + rhythmBoost;
    const targetFill = 0.32 + peakBoost * 0.5 + rhythmBoost * 0.5;
    const targetPoint = 0.42 + peakBoost * 0.8 + rhythmBoost * 0.6;
    const targetRim = 0.25 + peakBoost * 0.6 + rhythmBoost * 0.4;

    if (keyLightRef.current) {
      keyLightRef.current.intensity +=
        (targetKey - keyLightRef.current.intensity) * dt * 1.8;

      // Slow orbital drift of key light during peak/orchestration
      if (isPeak) {
        orbitAngle.current += dt * 0.4;
      } else {
        orbitAngle.current += (0 - orbitAngle.current) * dt * 0.5;
      }
      const baseAngle = Math.atan2(6, 8);
      const currentAngle = baseAngle + Math.sin(orbitAngle.current) * 0.12;
      const radius = Math.sqrt(8 * 8 + 6 * 6);
      keyLightRef.current.position.x = Math.cos(currentAngle) * radius;
      keyLightRef.current.position.z = Math.sin(currentAngle) * radius;
    }

    if (fillLightRef.current) {
      fillLightRef.current.intensity +=
        (targetFill - fillLightRef.current.intensity) * dt * 1.5;
    }

    if (pointLightRef.current) {
      pointLightRef.current.intensity +=
        (targetPoint - pointLightRef.current.intensity) * dt * 1.5;
    }

    if (rimLightRef.current) {
      rimLightRef.current.intensity +=
        (targetRim - rimLightRef.current.intensity) * dt * 1.5;
    }
  });

  return (
    <>
      {/* Low ambient illumination for depth */}
      <ambientLight intensity={0.4} color={ambientColor} />

      {/* Primary directional key light from upper right with subtle orbital evolution */}
      <directionalLight
        ref={keyLightRef}
        position={[8, 10, 6]}
        intensity={0.85}
        color={primaryColor}
      />

      {/* Subtle secondary fill light from lower left */}
      <directionalLight
        ref={fillLightRef}
        position={[-8, -6, -4]}
        intensity={0.32}
        color={secondaryColor}
      />

      {/* Rear rim light for silhouette separation and depth edge accent */}
      <directionalLight
        ref={rimLightRef}
        position={[-4, 8, -6]}
        intensity={0.25}
        color={rimColor}
      />

      {/* Soft depth point light near the central intelligence core */}
      <pointLight
        ref={pointLightRef}
        position={[1.4, 0.2, 3]}
        intensity={0.42}
        color={primaryColor}
        distance={24}
        decay={2}
      />
    </>
  );
}
