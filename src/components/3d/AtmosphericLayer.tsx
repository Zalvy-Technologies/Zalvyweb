"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AtmosphericLayerProps {
  rhythmIntensity?: number;
}

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uColorBg;
  uniform vec3 uColorAccent;
  uniform vec3 uColorIris;
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    // Slow breathing drift for glow centers
    float driftX = sin(uTime * 0.15) * 0.02;
    float driftY = cos(uTime * 0.12) * 0.015;

    vec2 center1 = vec2(0.68 + driftX, 0.72 + driftY); // Top right glow
    vec2 center2 = vec2(0.25 - driftX * 0.5, 0.22 - driftY * 0.5); // Bottom left wash

    float d1 = distance(vUv, center1);
    float d2 = distance(vUv, center2);

    // Subtle radial glows with rhythm modulation
    float glowMod = 1.0 + uIntensity * 0.35;
    float glow1 = smoothstep(0.65, 0.0, d1) * 0.075 * glowMod;
    float glow2 = smoothstep(0.55, 0.0, d2) * 0.045 * glowMod;

    // Text safe-zone attenuation in left-center
    float textZone = smoothstep(0.15, 0.55, distance(vUv, vec2(0.35, 0.55)));
    float textDim = mix(0.75, 1.0, textZone);

    vec3 color = uColorBg + (uColorAccent * glow1 + uColorIris * glow2) * textDim;
    gl_FragColor = vec4(color, 0.95);
  }
`;

/**
 * Layer 1 — Atmospheric Depth
 * Soft volumetric glow and backdrop haze that anchors the 3D space
 * into ZALVY's obsidian token palette (--token-canvas / --token-accent).
 * Enhanced with subtle time-based breathing and rhythm-linked intensity.
 */
export function AtmosphericLayer({
  rhythmIntensity = 0.15,
}: AtmosphericLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uColorBg: { value: new THREE.Color("#080a0f") }, // Deep obsidian slate
      uColorAccent: { value: new THREE.Color("#38bdf8") }, // Electric sky
      uColorIris: { value: new THREE.Color("#818cf8") }, // Celestial iris
      uTime: { value: 0 },
      uIntensity: { value: 0.15 },
    }),
    []
  );

  useFrame((_, delta) => {
    const mat = meshRef.current?.material as THREE.ShaderMaterial | undefined;
    if (!mat) return;
    const dt = Math.min(delta, 0.05);
    const uTime = mat.uniforms.uTime as { value: number };
    const uIntensity = mat.uniforms.uIntensity as { value: number };
    uTime.value = uTime.value + dt;
    uIntensity.value =
      uIntensity.value + (rhythmIntensity - uIntensity.value) * dt * 2.0;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -8]}>
      <planeGeometry args={[42, 28]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        depthWrite={false}
        depthTest={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
