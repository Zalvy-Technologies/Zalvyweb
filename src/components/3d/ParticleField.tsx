"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  reduceMotion?: boolean;
}

interface ParticleData {
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  speed: number;
  phase: number;
}

export function ParticleField({
  count = 28,
  reduceMotion = false,
}: ParticleFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate sparse, multi-depth particles avoiding dense text regions
  const particles = useMemo<ParticleData[]>(() => {
    const arr: ParticleData[] = [];
    for (let i = 0; i < count; i++) {
      // Avoid left-middle text safe zone (x: -4.5 to 0, y: -2 to 3)
      let x = (((i * 17.3 + 11) % 18) - 9);
      if (x > -4.5 && x < 0.2) {
        // Shift outward into peripheral space
        x = x < -2 ? x - 3.5 : x + 3.5;
      }
      const y = (((i * 23.1 + 7) % 14) - 7);
      const z = (((i * 13.7 + 3) % 11) - 7); // Depths from -7 to +4
      const size = 0.02 + ((i * 7) % 5) * 0.008;

      arr.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        size,
        speed: 0.15 + (i % 4) * 0.05,
        phase: i * 0.7,
      });
    }
    return arr;
  }, [count]);

  const particleGeometry = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);

  const particleMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#38bdf8"), // Electric sky
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = reduceMotion ? 0 : state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      const ox = reduceMotion ? 0 : Math.sin(t * p.speed + p.phase) * 0.18;
      const oy = reduceMotion ? 0 : Math.cos(t * p.speed * 0.8 + p.phase) * 0.22;
      const oz = reduceMotion ? 0 : Math.sin(t * p.speed * 0.5 + p.phase) * 0.12;

      dummy.position.set(p.baseX + ox, p.baseY + oy, p.baseZ + oz);
      dummy.scale.set(p.size, p.size, p.size);
      dummy.updateMatrix();

      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[particleGeometry, particleMaterial, particles.length]}
    />
  );
}
