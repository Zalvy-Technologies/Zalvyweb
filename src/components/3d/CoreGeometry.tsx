"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type CognitivePhase =
  | "observe"
  | "connect"
  | "process"
  | "orchestrate"
  | "execute"
  | "result"
  | "reset";

interface CoreGeometryProps {
  reduceMotion?: boolean;
  phase?: CognitivePhase;
  eventActive?: boolean;
  rhythmIntensity?: number;
  qualityTier?: "high" | "medium" | "low" | "fallback";
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Layer A — The Central Computational Core                                   */
/*                                                                           */
/* Abstract 3D computational architecture:                                    */
/*  • Outer segmented icosahedral cage with controlled gaps                   */
/*  • Mid octahedral structural frame with translucent faceted panels         */
/*  • Inner dodecahedral intelligence kernel with emissive breathing          */
/*  • Structural accent plates at asymmetric angles                           */
/*  • Multi-axis counter-rotation with sinusoidal oscillation overlays        */
/*                                                                           */
/* NEVER a sphere, brain, globe, or robot.                                    */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Creates a segmented wireframe with architectural gaps.
 * Unlike a full WireframeGeometry, this produces cleaner edges
 * with intentional discontinuities that read as "engineered".
 */
function createSegmentedFrame(
  baseGeometry: THREE.BufferGeometry,
  gapProbability: number
): THREE.BufferGeometry {
  const wireframe = new THREE.WireframeGeometry(baseGeometry);
  const positions = wireframe.getAttribute("position");
  const arr = positions.array as Float32Array;
  const keptSegments: number[] = [];
  const segmentCount = arr.length / 6; // 2 vertices × 3 components per segment

  for (let i = 0; i < segmentCount; i++) {
    // Use deterministic pseudo-random based on vertex positions
    const x = arr[i * 6] ?? 0;
    const y = arr[i * 6 + 1] ?? 0;
    const seed = Math.abs(Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1;
    if (seed > gapProbability) {
      for (let j = 0; j < 6; j++) {
        keptSegments.push(arr[i * 6 + j] ?? 0);
      }
    }
  }

  const result = new THREE.BufferGeometry();
  result.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(keptSegments, 3)
  );
  return result;
}

/**
 * Creates asymmetric translucent structural plates.
 * 3–4 thin triangular panels at varying angles around the core.
 */
function createStructuralPlates(): {
  positions: THREE.Vector3[];
  rotations: THREE.Euler[];
}[] {
  return [
    {
      positions: [
        new THREE.Vector3(-0.6, 0.35, 0.15),
        new THREE.Vector3(0.45, 0.55, -0.1),
        new THREE.Vector3(0.1, -0.35, 0.4),
      ],
      rotations: [new THREE.Euler(0.3, 0.2, 0.1)],
    },
    {
      positions: [
        new THREE.Vector3(0.55, -0.2, -0.35),
        new THREE.Vector3(-0.3, -0.5, -0.15),
        new THREE.Vector3(0.15, 0.4, -0.5),
      ],
      rotations: [new THREE.Euler(-0.2, 0.35, -0.15)],
    },
    {
      positions: [
        new THREE.Vector3(-0.45, -0.15, -0.3),
        new THREE.Vector3(0.1, 0.6, 0.2),
        new THREE.Vector3(0.5, -0.3, 0.35),
      ],
      rotations: [new THREE.Euler(0.15, -0.25, 0.3)],
    },
  ];
}

export function CoreGeometry({
  reduceMotion = false,
  phase = "observe",
  eventActive = false,
  rhythmIntensity = 0.15,
  qualityTier = "high",
}: CoreGeometryProps) {
  const outerCageRef = useRef<THREE.Group>(null);
  const outerLineRef = useRef<THREE.LineSegments>(null);
  const innerCoreRef = useRef<THREE.Group>(null);
  const latticeRef = useRef<THREE.Group>(null);
  const midLineRef = useRef<THREE.LineSegments>(null);
  const platesRef = useRef<THREE.Group>(null);
  const kernelMeshRef = useRef<THREE.Mesh>(null);

  // ── Geometries ─────────────────────────────────────────────────────────
  const outerBaseGeom = useMemo(() => new THREE.IcosahedronGeometry(0.95, 0), []);
  const outerSegmented = useMemo(
    () => createSegmentedFrame(outerBaseGeom, 0.18),
    [outerBaseGeom]
  );

  const midBaseGeom = useMemo(() => new THREE.OctahedronGeometry(0.68, 0), []);
  const midSegmented = useMemo(
    () => createSegmentedFrame(midBaseGeom, 0.12),
    [midBaseGeom]
  );

  const innerGeometry = useMemo(
    () => new THREE.DodecahedronGeometry(0.42, 0),
    []
  );

  // Structural plate geometries (only on high/medium tiers)
  const plateData = useMemo(() => createStructuralPlates(), []);
  const plateGeometries = useMemo(() => {
    if (qualityTier === "low" || qualityTier === "fallback") return [];
    return plateData.map((plate) => {
      const geom = new THREE.BufferGeometry();
      const verts = new Float32Array(
        plate.positions.flatMap((v) => [v.x, v.y, v.z])
      );
      geom.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
      geom.computeVertexNormals();
      return { geometry: geom, rotation: plate.rotations[0] };
    });
  }, [plateData, qualityTier]);

  // ── Materials (ZALVY design tokens) ────────────────────────────────────
  const outerEdgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#38bdf8"), // Electric sky
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      }),
    []
  );

  const midEdgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#818cf8"), // Celestial iris
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    []
  );

  // Inner kernel: translucent facets with emissive breathing
  const innerFacetMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0c131f"), // Deep obsidian slate
        emissive: new THREE.Color("#0284c7"),
        emissiveIntensity: 0.22,
        roughness: 0.35,
        metalness: 0.65,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
      }),
    []
  );

  // Translucent structural plates (premium tier only)
  const plateMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#0e1a2e"),
        emissive: new THREE.Color("#0284c7"),
        emissiveIntensity: 0.06,
        roughness: 0.15,
        metalness: 0.7,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  );

  // ── Per-frame animation ────────────────────────────────────────────────
  useFrame((state) => {
    if (reduceMotion) return;
    const t = state.clock.getElapsedTime();

    // Multi-axis multidirectional rotation — different layers, different speeds
    // Sinusoidal oscillation overlays prevent pure linear rotation
    if (outerCageRef.current) {
      outerCageRef.current.rotation.x =
        t * 0.032 + Math.sin(t * 0.015) * 0.12;
      outerCageRef.current.rotation.y =
        t * 0.048 + Math.cos(t * 0.018) * 0.08;
      outerCageRef.current.rotation.z = Math.sin(t * 0.02) * 0.18;
    }

    // Inner core counter-rotates on opposite axes
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.x =
        -t * 0.058 + Math.cos(t * 0.022) * 0.1;
      innerCoreRef.current.rotation.y =
        -t * 0.042 + Math.sin(t * 0.012) * 0.14;
      innerCoreRef.current.rotation.z = t * 0.028;
    }

    // Mid lattice rotates independently
    if (latticeRef.current) {
      latticeRef.current.rotation.y =
        t * 0.068 + Math.sin(t * 0.025) * 0.06;
      latticeRef.current.rotation.x =
        Math.cos(t * 0.035) * 0.22 + Math.sin(t * 0.01) * 0.05;
    }

    // Structural plates — very slow independent drift
    if (platesRef.current) {
      platesRef.current.rotation.y = t * 0.015;
      platesRef.current.rotation.z = Math.sin(t * 0.012) * 0.08;
    }

    // ── Phase-responsive breathing scale ──────────────────────────────
    let targetScale = 1.0;
    if (phase === "process") {
      targetScale = 0.88; // Core tightens & compresses during heavy compute
    } else if (phase === "orchestrate") {
      targetScale = 1.06; // Core expands as signals organize
    } else if (phase === "execute" || eventActive) {
      targetScale = 1.14; // Peak radiance & scale during execution
    } else if (phase === "result") {
      targetScale = 1.03; // Settles into stable harmony
    } else if (phase === "reset") {
      targetScale = 0.97; // Gentle contraction returning to rest
    }

    // Rhythm intensity adds subtle breathing overlay
    targetScale += Math.sin(t * 0.8) * rhythmIntensity * 0.04;

    if (outerCageRef.current) {
      const s = outerCageRef.current.scale;
      s.x += (targetScale - s.x) * 0.025;
      s.y += (targetScale - s.y) * 0.025;
      s.z += (targetScale - s.z) * 0.025;
    }

    // ── Emissive intensity breathing linked to rhythm ─────────────────
    if (kernelMeshRef.current) {
      const mat = kernelMeshRef.current.material as THREE.MeshStandardMaterial;
      const targetEmissive = 0.18 + rhythmIntensity * 0.28;
      mat.emissiveIntensity +=
        (targetEmissive - mat.emissiveIntensity) * 0.03;
    }

    // ── Edge opacity modulation ──────────────────────────────────────
    if (outerLineRef.current) {
      const mat = outerLineRef.current.material as THREE.LineBasicMaterial;
      const targetOuterOpacity = 0.22 + rhythmIntensity * 0.18;
      mat.opacity += (targetOuterOpacity - mat.opacity) * 0.025;
    }

    if (midLineRef.current) {
      const mat = midLineRef.current.material as THREE.LineBasicMaterial;
      const targetMidOpacity = 0.18 + rhythmIntensity * 0.14;
      mat.opacity += (targetMidOpacity - mat.opacity) * 0.025;
    }

    // Plate opacity breathes with rhythm
    if (platesRef.current) {
      const targetPlateOpacity = 0.08 + rhythmIntensity * 0.12;
      platesRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.Material;
          mat.opacity += (targetPlateOpacity - mat.opacity) * 0.02;
        }
      });
    }
  });

  return (
    <group position={[1.4, 0.2, 0]}>
      {/* Outer segmented computational cage */}
      <group ref={outerCageRef}>
        <lineSegments
          ref={outerLineRef}
          geometry={outerSegmented}
          material={outerEdgeMaterial}
        />
      </group>

      {/* Mid octahedral counter-rotating structural frame */}
      <group ref={latticeRef}>
        <lineSegments
          ref={midLineRef}
          geometry={midSegmented}
          material={midEdgeMaterial}
        />
      </group>

      {/* Translucent structural accent plates (high/medium only) */}
      {plateGeometries.length > 0 && (
        <group ref={platesRef}>
          {plateGeometries.map((plate, i) => (
            <mesh
              key={i}
              geometry={plate.geometry}
              material={plateMaterial}
              rotation={plate.rotation}
            />
          ))}
        </group>
      )}

      {/* Inner intelligence kernel with emissive breathing */}
      <group ref={innerCoreRef}>
        <mesh
          ref={kernelMeshRef}
          geometry={innerGeometry}
          material={innerFacetMaterial}
        />
      </group>
    </group>
  );
}
