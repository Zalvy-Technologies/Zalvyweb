"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SpatialGeometryProps {
  activeSection?: string;
  reduceMotion?: boolean;
}

/**
 * Layer 2 — Spatial Geometry
 * Abstract computational guides, hairline datum rings, and architectural coordinate frames.
 */
export function SpatialGeometry({
  activeSection = "hero",
  reduceMotion = false,
}: SpatialGeometryProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.LineLoop>(null);
  const ring2Ref = useRef<THREE.LineLoop>(null);

  // Elliptical coordinate guide ring 1
  const ringGeometry1 = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 96;
    const radiusX = 6.2;
    const radiusY = 3.6;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(theta) * radiusX,
          Math.sin(theta) * radiusY,
          Math.sin(theta * 2) * 0.4
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // Secondary offset datum ring
  const ringGeometry2 = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 72;
    const radiusX = 4.8;
    const radiusY = 2.8;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(theta) * radiusX,
          Math.sin(theta) * radiusY,
          -Math.cos(theta * 2) * 0.3
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // Subtle coordinate datum axes / tick lines
  const datumLinesGeometry = useMemo(() => {
    const lines: THREE.Vector3[] = [];
    // 4 subtle crosshair datum ticks
    const coords: [number, number, number][] = [
      [-5.5, 2.8, -1],
      [5.5, 2.2, 0.5],
      [-4.8, -2.5, 1],
      [5.2, -2.8, -0.5],
    ];
    for (const coord of coords) {
      const [x, y, z] = coord;
      // Horizontal tick
      lines.push(new THREE.Vector3(x - 0.25, y, z));
      lines.push(new THREE.Vector3(x + 0.25, y, z));
      // Vertical tick
      lines.push(new THREE.Vector3(x, y - 0.25, z));
      lines.push(new THREE.Vector3(x, y + 0.25, z));
    }
    return new THREE.BufferGeometry().setFromPoints(lines);
  }, []);

  // Material with controlled subtle opacity
  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#38bdf8"),
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      }),
    []
  );

  const ringMaterial2 = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#818cf8"),
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
      }),
    []
  );

  const datumMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#94a3b8"),
        transparent: true,
        opacity: 0.15,
        depthWrite: false,
      }),
    []
  );

  useFrame((state, delta) => {
    if (reduceMotion || !groupRef.current) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.getElapsedTime();

    // Subtle micro-rotation for guide rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = Math.sin(t * 0.04) * 0.08;
      ring1Ref.current.rotation.x = 0.45 + Math.cos(t * 0.03) * 0.04;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -Math.sin(t * 0.035) * 0.06;
      ring2Ref.current.rotation.y = 0.35 + Math.sin(t * 0.025) * 0.05;
    }

    // Adapt overall orientation slightly based on active section
    let targetRotY = 0;
    let targetRotX = 0;
    let targetScale = 1.0;

    if (activeSection === "automation") {
      targetRotY = 0.15;
      targetRotX = -0.1;
    } else if (activeSection === "solutions" || activeSection === "platform") {
      targetRotY = -0.12;
      targetScale = 1.05;
    } else if (activeSection === "security") {
      targetScale = 0.95;
    } else if (activeSection === "about" || activeSection === "quiet") {
      targetScale = 0.85;
    }

    groupRef.current.rotation.y +=
      (targetRotY - groupRef.current.rotation.y) * dt * 1.5;
    groupRef.current.rotation.x +=
      (targetRotX - groupRef.current.rotation.x) * dt * 1.5;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      dt * 1.5
    );
  });

  return (
    <group ref={groupRef} position={[0.8, 0, 0]}>
      {/* Primary computational guide ring */}
      <lineLoop ref={ring1Ref} geometry={ringGeometry1} material={lineMaterial} />

      {/* Secondary offset datum ring */}
      <lineLoop
        ref={ring2Ref}
        geometry={ringGeometry2}
        material={ringMaterial2}
        rotation={[0.3, 0.2, 0.1]}
      />

      {/* Crosshair coordinate markers */}
      <lineSegments geometry={datumLinesGeometry} material={datumMaterial} />
    </group>
  );
}
