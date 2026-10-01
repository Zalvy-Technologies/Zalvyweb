"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface IntelligenceRingsProps {
  reduceMotion?: boolean;
  eventActive?: boolean;
  rhythmIntensity?: number;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Layer B & D — Intelligence Rings & Orbital Architecture                    */
/*                                                                           */
/* Asymmetric concentric gimbal rings and orbital curved pathways wrapping    */
/* around the central intelligence core with independent multidirectional     */
/* rotation. Three ring layers + orbital node markers for depth.              */
/* ─────────────────────────────────────────────────────────────────────────── */

/** Creates a segmented arc with architectural gaps and varied gap widths. */
function createSegmentedArc(
  segments: number,
  radiusX: number,
  radiusY: number,
  zAmplitude: number,
  zFrequency: number,
  gapPattern: number[]
): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    // Check if this segment falls in a gap
    const normalizedPos = (i / segments) * 100;
    const inGap = gapPattern.some(
      (gapCenter) => Math.abs(normalizedPos - gapCenter) < 3.5
    );
    if (inGap) continue;

    const theta = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * radiusX,
        Math.sin(theta) * radiusY,
        Math.sin(theta * zFrequency) * zAmplitude
      )
    );
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

export function IntelligenceRings({
  reduceMotion = false,
  eventActive = false,
  rhythmIntensity = 0.15,
}: IntelligenceRingsProps) {
  const primaryRingRef = useRef<THREE.Group>(null);
  const secondaryRingRef = useRef<THREE.Group>(null);
  const tertiaryRingRef = useRef<THREE.Group>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const markersRef = useRef<THREE.InstancedMesh>(null);

  // ── Primary gimbal ring: segmented circular arc ────────────────────────
  const primaryRingGeometry = useMemo(
    () => createSegmentedArc(96, 2.1, 2.1, 0, 0, [22, 47, 73, 95]),
    []
  );

  // ── Secondary offset elliptical ring ───────────────────────────────────
  const secondaryRingGeometry = useMemo(
    () => createSegmentedArc(80, 2.8, 1.9, 0.3, 2, [18, 42, 68, 88]),
    []
  );

  // ── Tertiary wide asymmetric ring (NEW) ────────────────────────────────
  const tertiaryRingGeometry = useMemo(
    () => createSegmentedArc(64, 3.5, 2.4, 0.55, 3, [15, 38, 62, 85]),
    []
  );

  // ── Asymmetric orbital spline trajectory ───────────────────────────────
  const orbitCurveGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segs = 120;
    for (let i = 0; i <= segs; i++) {
      const u = i / segs;
      const theta = u * Math.PI * 2;
      const r = 3.4 + Math.sin(theta * 3) * 0.45;
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * (r * 0.65);
      const z = Math.cos(theta * 2) * 0.85;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // ── Tick markers on the outer ring ─────────────────────────────────────
  const ticksGeometry = useMemo(() => {
    const lines: THREE.Vector3[] = [];
    const count = 16;
    const radius = 2.1;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const x1 = Math.cos(theta) * (radius - 0.08);
      const y1 = Math.sin(theta) * (radius - 0.08);
      const x2 = Math.cos(theta) * (radius + 0.08);
      const y2 = Math.sin(theta) * (radius + 0.08);
      lines.push(new THREE.Vector3(x1, y1, 0));
      lines.push(new THREE.Vector3(x2, y2, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(lines);
  }, []);

  // ── Orbital marker positions (6 markers traversing the outer orbit) ────
  const MARKER_COUNT = 6;
  const markerGeometry = useMemo(() => new THREE.SphereGeometry(0.035, 8, 8), []);

  // ── Materials ──────────────────────────────────────────────────────────
  const primaryMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#38bdf8"),
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
      }),
    []
  );

  const secondaryMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#818cf8"),
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      }),
    []
  );

  const tertiaryMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#38bdf8"),
        transparent: true,
        opacity: 0.10,
        depthWrite: false,
      }),
    []
  );

  const orbitMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#38bdf8"),
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
      }),
    []
  );

  const markerMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#38bdf8"),
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      }),
    []
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (reduceMotion) return;
    const t = state.clock.getElapsedTime();

    // ── Primary gimbal ring multi-axis rotation ──────────────────────
    if (primaryRingRef.current) {
      primaryRingRef.current.rotation.z = t * 0.042;
      primaryRingRef.current.rotation.x =
        0.52 + Math.sin(t * 0.02) * 0.06;
      primaryRingRef.current.rotation.y = Math.cos(t * 0.025) * 0.08;
    }

    // ── Secondary offset ring counter-rotates ────────────────────────
    if (secondaryRingRef.current) {
      secondaryRingRef.current.rotation.z = -t * 0.031;
      secondaryRingRef.current.rotation.y =
        0.42 + Math.sin(t * 0.03) * 0.08;
      secondaryRingRef.current.rotation.x =
        -0.3 + Math.cos(t * 0.022) * 0.05;
    }

    // ── Tertiary wide ring — slowest, opposite tilt ──────────────────
    if (tertiaryRingRef.current) {
      tertiaryRingRef.current.rotation.z = t * 0.02;
      tertiaryRingRef.current.rotation.x =
        -0.65 + Math.sin(t * 0.015) * 0.04;
      tertiaryRingRef.current.rotation.y =
        0.25 + Math.cos(t * 0.018) * 0.06;
    }

    // ── Outer orbital trajectory slow precession ─────────────────────
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.z = t * 0.018;
      orbitGroupRef.current.rotation.y = t * 0.024;

      // Event-reactive orbital tilt
      const targetTilt = eventActive ? 0.4 : 0.0;
      orbitGroupRef.current.rotation.x +=
        (targetTilt - orbitGroupRef.current.rotation.x) * 0.035;
    }

    // ── Orbital marker dots traversing the orbit path ────────────────
    if (markersRef.current) {
      for (let i = 0; i < MARKER_COUNT; i++) {
        const baseAngle = (i / MARKER_COUNT) * Math.PI * 2;
        const theta = baseAngle + t * (0.06 + i * 0.008);
        const r = 3.4 + Math.sin(theta * 3) * 0.45;
        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * (r * 0.65);
        const z = Math.cos(theta * 2) * 0.85;

        dummy.position.set(x, y, z);
        // Subtle scale pulse
        const pulse = 0.8 + Math.sin(t * 1.2 + i * 1.5) * 0.3;
        dummy.scale.set(pulse, pulse, pulse);
        dummy.updateMatrix();
        markersRef.current.setMatrixAt(i, dummy.matrix);
      }
      markersRef.current.instanceMatrix.needsUpdate = true;
    }

    // ── Phase-linked opacity breathing ───────────────────────────────
    if (primaryRingRef.current) {
      const targetPrimaryOpacity = 0.18 + rhythmIntensity * 0.16;
      primaryRingRef.current.traverse((child) => {
        if (child instanceof THREE.LineSegments) {
          const mat = child.material as THREE.LineBasicMaterial;
          mat.opacity += (targetPrimaryOpacity - mat.opacity) * 0.025;
        }
      });
    }

    if (secondaryRingRef.current) {
      const targetSecondaryOpacity = 0.12 + rhythmIntensity * 0.14;
      const child = secondaryRingRef.current.children[0] as THREE.LineSegments | undefined;
      if (child) {
        const mat = child.material as THREE.LineBasicMaterial;
        mat.opacity += (targetSecondaryOpacity - mat.opacity) * 0.025;
      }
    }

    if (tertiaryRingRef.current) {
      const targetTertiaryOpacity = 0.06 + rhythmIntensity * 0.1;
      const child = tertiaryRingRef.current.children[0] as THREE.LineSegments | undefined;
      if (child) {
        const mat = child.material as THREE.LineBasicMaterial;
        mat.opacity += (targetTertiaryOpacity - mat.opacity) * 0.025;
      }
    }

    if (markersRef.current) {
      const targetMarkerOpacity = 0.3 + rhythmIntensity * 0.3;
      const mat = markersRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity += (targetMarkerOpacity - mat.opacity) * 0.025;
    }
  });

  return (
    <group position={[1.4, 0.2, 0]}>
      {/* Primary segmented gimbal ring with coordinate ticks */}
      <group ref={primaryRingRef}>
        <lineSegments
          geometry={primaryRingGeometry}
          material={primaryMaterial}
        />
        <lineSegments geometry={ticksGeometry} material={primaryMaterial} />
      </group>

      {/* Secondary offset elliptical ring */}
      <group ref={secondaryRingRef}>
        <lineSegments
          geometry={secondaryRingGeometry}
          material={secondaryMaterial}
        />
      </group>

      {/* Tertiary wide asymmetric ring */}
      <group ref={tertiaryRingRef}>
        <lineSegments
          geometry={tertiaryRingGeometry}
          material={tertiaryMaterial}
        />
      </group>

      {/* Outer asymmetric orbital trajectory */}
      <group ref={orbitGroupRef}>
        <lineLoop geometry={orbitCurveGeometry} material={orbitMaterial} />

        {/* Orbital marker dots traversing the orbit */}
        <instancedMesh
          ref={markersRef}
          args={[markerGeometry, markerMaterial, MARKER_COUNT]}
        />
      </group>
    </group>
  );
}
