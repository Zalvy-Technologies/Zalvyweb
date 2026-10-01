"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { CognitivePhase } from "./CoreGeometry";

export interface NetworkNode {
  id: number;
  position: THREE.Vector3;
  basePosition: THREE.Vector3;
  convergedPosition: THREE.Vector3;
  structuredPosition: THREE.Vector3;
  autonomousOffset: THREE.Vector3;
  flowPosition: THREE.Vector3;
  size: number;
  type: "primary" | "secondary" | "peripheral";
  phase: number;
  speed: number;
  harmonic2: number;
  harmonic3: number;
}

export interface NetworkEdge {
  fromIndex: number;
  toIndex: number;
  from: THREE.Vector3;
  to: THREE.Vector3;
}

const CORE_CENTER = new THREE.Vector3(1.4, 0.2, 0);

/* ─────────────────────────────────────────────────────────────────────────── */
/* Deterministic generation of the asymmetric ZALVY Intelligence Network.     */
/* Asymmetric editorial bias: centered around x ~ 1.2 to 2.2 to preserve    */
/* text readability on the left side.                                         */
/* ─────────────────────────────────────────────────────────────────────────── */

function createNetworkData(maxNodes = 42): {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
} {
  const nodes: NetworkNode[] = [];
  const edges: NetworkEdge[] = [];

  // 1. Primary compute anchors (5 strategic nodes)
  const primaryAnchors: [number, number, number, number][] = [
    [0.9, 0.6, 0.4, 0.16], // Core Orchestrator
    [2.3, 1.3, -0.5, 0.14], // Reasoning Engine
    [1.9, -1.1, 0.7, 0.15], // Consensus Swarm
    [3.1, -0.1, -0.4, 0.13], // Execution Sandbox
    [-0.5, 1.1, 0.2, 0.12], // Edge Gateway
  ];

  primaryAnchors.forEach(([x, y, z, size], i) => {
    const base = new THREE.Vector3(x, y, z);
    const conv = base.clone().lerp(CORE_CENTER, 0.55);
    const dir = base.clone().sub(CORE_CENTER).normalize();
    const struct = CORE_CENTER.clone().add(
      dir.multiplyScalar(1.25 + i * 0.15)
    );
    // Autonomous: slightly more random drift offset
    const autoDir = new THREE.Vector3(
      Math.sin(i * 2.3) * 0.4,
      Math.cos(i * 1.7) * 0.3,
      Math.sin(i * 3.1) * 0.2
    );
    const autonomous = base.clone().add(autoDir);
    // Flow: aligned along a directional axis
    const flow = new THREE.Vector3(
      base.x + i * 0.25 - 0.5,
      base.y * 0.3,
      base.z * 0.5
    );

    nodes.push({
      id: i,
      position: base.clone(),
      basePosition: base.clone(),
      convergedPosition: conv,
      structuredPosition: struct,
      autonomousOffset: autonomous,
      flowPosition: flow,
      size,
      type: "primary",
      phase: i * 1.3,
      speed: 0.25 + (i % 3) * 0.1,
      harmonic2: 0.4 + (i % 4) * 0.15,
      harmonic3: 0.12 + (i % 5) * 0.08,
    });
  });

  // 2. Secondary routing nodes (12 nodes)
  const secondaryCoords: [number, number, number][] = [
    [0.4, -0.4, 0.6],
    [1.5, 0.3, 1.2],
    [1.7, 2.1, -0.2],
    [2.7, 1.7, -1.1],
    [3.7, 0.7, 0.2],
    [2.5, -1.7, 0.4],
    [1.3, -1.9, -0.7],
    [3.3, -1.3, -0.9],
    [-0.2, -0.9, 0.3],
    [-0.9, 0.3, -0.5],
    [0.7, 1.7, -0.7],
    [2.5, -0.5, 1.5],
  ];

  const secCount = Math.max(6, Math.floor(maxNodes * 0.35));
  secondaryCoords.slice(0, secCount).forEach(([x, y, z], idx) => {
    const base = new THREE.Vector3(x, y, z);
    const conv = base.clone().lerp(CORE_CENTER, 0.65);
    const dir = base.clone().sub(CORE_CENTER).normalize();
    const struct = CORE_CENTER.clone().add(
      dir.multiplyScalar(1.85 + (idx % 3) * 0.2)
    );
    const autonomous = base
      .clone()
      .add(
        new THREE.Vector3(
          Math.sin(idx * 3.1) * 0.5,
          Math.cos(idx * 2.3) * 0.35,
          Math.sin(idx * 1.7) * 0.25
        )
      );
    const flow = new THREE.Vector3(
      base.x + idx * 0.18 - 0.4,
      base.y * 0.25,
      base.z * 0.4
    );

    nodes.push({
      id: nodes.length,
      position: base.clone(),
      basePosition: base.clone(),
      convergedPosition: conv,
      structuredPosition: struct,
      autonomousOffset: autonomous,
      flowPosition: flow,
      size: 0.085,
      type: "secondary",
      phase: idx * 0.9 + 2.0,
      speed: 0.3 + (idx % 4) * 0.08,
      harmonic2: 0.35 + (idx % 3) * 0.12,
      harmonic3: 0.1 + (idx % 4) * 0.06,
    });
  });

  // 3. Peripheral satellite nodes (remaining budget)
  const peripheralCount = Math.max(0, maxNodes - nodes.length);
  for (let i = 0; i < peripheralCount; i++) {
    const phi = (i / peripheralCount) * Math.PI * 2;
    const rad = 2.4 + ((i * 7) % 19) * 0.12;
    const zOffset = (((i * 11) % 13) - 6) * 0.25;
    const x = CORE_CENTER.x + Math.cos(phi) * rad * 1.1;
    const y = CORE_CENTER.y + Math.sin(phi) * rad * 0.75;
    const base = new THREE.Vector3(x, y, zOffset);
    const conv = base.clone().lerp(CORE_CENTER, 0.75);
    const dir = base.clone().sub(CORE_CENTER).normalize();
    const struct = CORE_CENTER.clone().add(
      dir.multiplyScalar(2.6 + ((i * 3) % 4) * 0.15)
    );
    const autonomous = base
      .clone()
      .add(
        new THREE.Vector3(
          Math.sin(i * 4.1) * 0.6,
          Math.cos(i * 2.9) * 0.45,
          Math.sin(i * 1.3) * 0.3
        )
      );
    const flow = new THREE.Vector3(
      base.x + i * 0.12,
      base.y * 0.15,
      base.z * 0.3
    );

    nodes.push({
      id: nodes.length,
      position: base.clone(),
      basePosition: base.clone(),
      convergedPosition: conv,
      structuredPosition: struct,
      autonomousOffset: autonomous,
      flowPosition: flow,
      size: 0.045,
      type: "peripheral",
      phase: i * 0.6 + 4.0,
      speed: 0.35 + (i % 3) * 0.1,
      harmonic2: 0.3 + (i % 5) * 0.1,
      harmonic3: 0.08 + (i % 3) * 0.05,
    });
  }

  // Generate logical infrastructure connections
  for (let i = 0; i < nodes.length; i++) {
    const nodeI = nodes[i];
    if (!nodeI) continue;
    const neighbors: { index: number; dist: number }[] = [];
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeJ = nodes[j];
      if (!nodeJ) continue;
      const dist = nodeI.basePosition.distanceTo(nodeJ.basePosition);
      if (dist < 2.3) {
        neighbors.push({ index: j, dist });
      }
    }
    neighbors.sort((a, b) => a.dist - b.dist);
    const connectionCount = nodeI.type === "primary" ? 3 : 2;
    neighbors.slice(0, connectionCount).forEach((n) => {
      const targetNode = nodes[n.index];
      if (!targetNode) return;
      edges.push({
        fromIndex: i,
        toIndex: n.index,
        from: nodeI.position,
        to: targetNode.position,
      });
    });
  }

  return { nodes, edges };
}

interface IntelligenceNetworkProps {
  maxNodes?: number;
  reduceMotion?: boolean;
  activeSection?: string;
  phase?: CognitivePhase;
  eventActive?: boolean;
  rhythmIntensity?: number;
  onNetworkData?: (data: {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
  }) => void;
}

// Reusable temp vector to avoid allocations in useFrame
const _tempTarget = new THREE.Vector3();
const _tempDrift = new THREE.Vector3();

export function IntelligenceNetwork({
  maxNodes = 42,
  reduceMotion = false,
  activeSection = "hero",
  phase = "observe",
  eventActive = false,
  rhythmIntensity = 0.15,
  onNetworkData,
}: IntelligenceNetworkProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  // Track smooth morph progress for organic transitions
  const morphProgress = useRef(0);
  const prevPhase = useRef<CognitivePhase>(phase);

  // Generate deterministic network layout
  const { nodes, edges } = useMemo(() => {
    const data = createNetworkData(maxNodes);
    if (onNetworkData) {
      onNetworkData(data);
    }
    return data;
  }, [maxNodes, onNetworkData]);

  // Buffer geometry for dynamic hairline lines
  const linesGeometry = useMemo(() => {
    const positions = new Float32Array(edges.length * 2 * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    return geometry;
  }, [edges.length]);

  // Materials conforming to ZALVY design tokens
  const primaryMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#38bdf8"),
        emissive: new THREE.Color("#0284c7"),
        emissiveIntensity: 0.38,
        metalness: 0.45,
        roughness: 0.35,
      }),
    []
  );

  const secondaryMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#818cf8"),
        emissive: new THREE.Color("#4f46e5"),
        emissiveIntensity: 0.28,
        metalness: 0.3,
        roughness: 0.45,
      }),
    []
  );

  const peripheralMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#94a3b8"),
        emissive: new THREE.Color("#0ea5e9"),
        emissiveIntensity: 0.15,
        metalness: 0.2,
        roughness: 0.5,
        transparent: true,
        opacity: 0.65,
      }),
    []
  );

  const bracketMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#38bdf8"),
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
      }),
    []
  );

  const bracketGeometry = useMemo(
    () => new THREE.OctahedronGeometry(0.24, 0),
    []
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.getElapsedTime();

    // ── Smooth morph progress tracking ───────────────────────────────
    // When phase changes, smoothly transition morphProgress from 0→1
    if (phase !== prevPhase.current) {
      morphProgress.current = 0;
      prevPhase.current = phase;
    }
    if (morphProgress.current < 1) {
      // Ease-in-out interpolation over ~2s
      morphProgress.current = Math.min(morphProgress.current + dt * 0.5, 1);
    }
    const morphEase =
      morphProgress.current < 0.5
        ? 2 * morphProgress.current * morphProgress.current
        : 1 - Math.pow(-2 * morphProgress.current + 2, 2) / 2;

    // ── Procedural morphing: determine target per node ────────────────
    nodes.forEach((node) => {
      if (reduceMotion) {
        node.position.copy(node.basePosition);
        return;
      }

      // Section-reactive topology target selection
      let target: THREE.Vector3;
      if (activeSection === "agents") {
        // Autonomous swarm: more independent drift
        target = node.autonomousOffset;
      } else if (activeSection === "automation") {
        // Directional flow alignment
        target = node.flowPosition;
      } else if (activeSection === "security") {
        // Tightened structured formation
        target = node.structuredPosition;
      } else {
        // Default: cognitive phase-driven morphing
        switch (phase) {
          case "connect":
          case "process":
            target = node.convergedPosition;
            break;
          case "orchestrate":
          case "result":
            target = node.structuredPosition;
            break;
          case "execute":
            target = eventActive ? node.basePosition : node.structuredPosition;
            break;
          default:
            target = node.basePosition;
        }
      }

      // Multi-frequency harmonic drift for organic feel
      // Primary oscillation
      const ox1 = Math.sin(t * node.speed + node.phase) * 0.03;
      const oy1 = Math.cos(t * node.speed * 0.8 + node.phase) * 0.03;
      const oz1 = Math.sin(t * node.speed * 0.5 + node.phase) * 0.02;
      // Secondary harmonic
      const ox2 =
        Math.sin(t * node.harmonic2 + node.phase * 1.7) * 0.015;
      const oy2 =
        Math.cos(t * node.harmonic2 * 0.9 + node.phase * 2.1) * 0.012;
      // Tertiary harmonic (very subtle)
      const ox3 = Math.sin(t * node.harmonic3 + node.phase * 3.1) * 0.006;

      _tempDrift.set(ox1 + ox2 + ox3, oy1 + oy2, oz1);
      _tempTarget.copy(target).add(_tempDrift);

      // Damped morphing: smoother when morph is mid-transition
      const lerpSpeed = morphEase < 0.5 ? 1.2 : 1.8;
      node.position.lerp(_tempTarget, dt * lerpSpeed);
    });

    // ── Synchronize connection lines with morphing node positions ─────
    const posAttr = linesGeometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    let idx = 0;
    for (const edge of edges) {
      const fromNode = nodes[edge.fromIndex];
      const toNode = nodes[edge.toIndex];
      if (!fromNode || !toNode) continue;
      const from = fromNode.position;
      const to = toNode.position;
      arr[idx++] = from.x;
      arr[idx++] = from.y;
      arr[idx++] = from.z;
      arr[idx++] = to.x;
      arr[idx++] = to.y;
      arr[idx++] = to.z;
    }
    posAttr.needsUpdate = true;

    // ── Line opacity breathing linked to rhythm ──────────────────────
    if (lineMaterialRef.current) {
      let targetOpacity = 0.12 + rhythmIntensity * 0.18;
      if (phase === "connect" || phase === "process")
        targetOpacity += 0.06;
      if (phase === "orchestrate" || phase === "execute" || eventActive)
        targetOpacity += 0.1;
      if (activeSection === "about" || activeSection === "quiet")
        targetOpacity = 0.06;

      lineMaterialRef.current.opacity +=
        (targetOpacity - lineMaterialRef.current.opacity) * dt * 1.8;
    }

    // ── Primary node emissive intensity modulation ───────────────────
    if (groupRef.current) {
      const targetPrimaryEmissive = 0.28 + rhythmIntensity * 0.25;
      groupRef.current.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.emissiveIntensity +=
            (targetPrimaryEmissive - child.material.emissiveIntensity) * dt * 2.0;
        }
      });
    }

    // ── Section-reactive positioning ─────────────────────────────────
    if (groupRef.current) {
      let targetX = 0;
      if (activeSection === "agents") targetX = -0.3;
      else if (activeSection === "automation") targetX = 0.4;
      else if (activeSection === "platform") targetX = -0.15;

      groupRef.current.position.x +=
        (targetX - groupRef.current.position.x) * dt * 1.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Network connection lines */}
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial
          ref={lineMaterialRef}
          attach="material"
          color="#38bdf8"
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </lineSegments>

      {/* Nodes + geometric framing brackets for primary anchors */}
      {nodes.map((node) => {
        const mat =
          node.type === "primary"
            ? primaryMaterial
            : node.type === "secondary"
              ? secondaryMaterial
              : peripheralMaterial;

        return (
          <group key={node.id} position={node.position}>
            <mesh>
              <sphereGeometry args={[node.size, 16, 16]} />
              <primitive object={mat} attach="material" />
            </mesh>

            {/* Subtle computational bracket around primary compute nodes */}
            {node.type === "primary" && (
              <lineSegments
                geometry={bracketGeometry}
                material={bracketMaterial}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}
