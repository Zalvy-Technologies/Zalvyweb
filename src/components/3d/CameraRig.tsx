"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  reduceMotion?: boolean;
  enableParallax?: boolean;
}

export function CameraRig({
  reduceMotion = false,
  enableParallax = true,
}: CameraRigProps) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 13.5));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  const pointer = useRef({ x: 0, y: 0 });
  const scrollOffset = useRef(0);

  useEffect(() => {
    if (reduceMotion) return;

    const onPointerMove = (e: PointerEvent) => {
      // Normalize to -1..1 relative to screen center
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      pointer.current = { x, y };
    };

    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollOffset.current = Math.min(window.scrollY / maxScroll, 1);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduceMotion]);

  useFrame((state, delta) => {
    // Clamp delta to avoid large jump frames when returning to tab
    const dt = Math.min(delta, 0.05);

    if (reduceMotion) {
      targetPos.current.set(0, 0, 13.5);
      targetLookAt.current.set(0, 0, 0);
      camera.position.lerp(targetPos.current, dt * 2.0);
      currentLookAt.current.lerp(targetLookAt.current, dt * 2.0);
      camera.lookAt(currentLookAt.current);
      return;
    }

    const t = state.clock.getElapsedTime();

    // 1. Ultra-slow micro idle drift (harmonic drift, no synchronized mechanical loop)
    const driftX = Math.sin(t * 0.18) * 0.18 + Math.cos(t * 0.07) * 0.08;
    const driftY = Math.cos(t * 0.14) * 0.12 + Math.sin(t * 0.09) * 0.06;

    // 2. Subconscious pointer parallax (subtle, restrained displacement)
    const pointerX = enableParallax ? pointer.current.x * 0.32 : 0;
    const pointerY = enableParallax ? -pointer.current.y * 0.22 : 0;

    // 3. Subtle scroll depth shift
    const scrollY = -scrollOffset.current * 1.8;
    const scrollZ = scrollOffset.current * 0.8;

    // Target camera position
    targetPos.current.x = driftX + pointerX;
    targetPos.current.y = driftY + pointerY + scrollY;
    targetPos.current.z = 13.5 + scrollZ;

    // Damped camera movement (smooth physical damping)
    camera.position.lerp(targetPos.current, dt * 1.8);

    // Subtle lookAt tracking with offset
    targetLookAt.current.x = pointerX * 0.15;
    targetLookAt.current.y = scrollY * 0.4;
    targetLookAt.current.z = 0;
    currentLookAt.current.lerp(targetLookAt.current, dt * 2.0);

    camera.lookAt(currentLookAt.current);
  });

  return null;
}
