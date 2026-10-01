"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { NetworkEdge, NetworkNode } from "./IntelligenceNetwork";
import type { CognitivePhase } from "./CoreGeometry";

interface SignalPathsProps {
  edges: NetworkEdge[];
  nodes: NetworkNode[];
  reduceMotion?: boolean;
  enableSignals?: boolean;
  activeSection?: string;
  phase?: CognitivePhase;
  eventActive?: boolean;
  rhythmIntensity?: number;
}

interface SignalPacket {
  edgeIndex: number;
  progress: number;
  baseSpeed: number;
  wait: number;
  reverse: boolean;
  active: boolean;
  /** Trail history: last N positions for fading trail */
  trail: THREE.Vector3[];
}

const PRIMARY_SIGNAL_COUNT = 7;
const TRAIL_LENGTH = 5;
const BURST_SIGNAL_COUNT = 4;

/* ─────────────────────────────────────────────────────────────────────────── */
/* Layer E — Flowing Information Signals                                      */
/*                                                                           */
/* Intelligent signal packets that travel through the network with:           */
/*  • Fading trail of smaller spheres behind each signal                     */
/*  • Acceleration curve (bell curve velocity along path)                    */
/*  • Phase-synchronized spawning (more signals during orchestrate/execute)  */
/*  • Branching at primary nodes during orchestrate phase                    */
/*  • Color variation: primary = electric sky, burst = celestial iris        */
/* ─────────────────────────────────────────────────────────────────────────── */

export function SignalPaths({
  edges,
  nodes,
  reduceMotion = false,
  enableSignals = true,
  activeSection = "hero",
  phase = "observe",
  eventActive = false,
  rhythmIntensity = 0.15,
}: SignalPathsProps) {
  const primaryMeshRef = useRef<THREE.InstancedMesh>(null);
  const trailMeshRef = useRef<THREE.InstancedMesh>(null);
  const burstMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // ── Primary signal packets ─────────────────────────────────────────
  const primarySignals = useMemo<SignalPacket[]>(() => {
    if (!edges.length) return [];
    return Array.from({ length: PRIMARY_SIGNAL_COUNT }, (_, i) => ({
      edgeIndex: i % edges.length,
      progress: (i / PRIMARY_SIGNAL_COUNT) * 0.8,
      baseSpeed: 0.22 + (i % 3) * 0.07,
      wait: (i * 0.5) % 1.8,
      reverse: i % 2 === 1,
      active: true,
      trail: Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3(999, 999, 999)),
    }));
  }, [edges.length]);

  // ── Burst signals (activated during orchestrate/execute) ───────────
  const burstSignals = useMemo<SignalPacket[]>(() => {
    if (!edges.length) return [];
    return Array.from({ length: BURST_SIGNAL_COUNT }, (_, i) => ({
      edgeIndex: (i * 3) % edges.length,
      progress: 0,
      baseSpeed: 0.35 + (i % 2) * 0.1,
      wait: 0.5 + i * 0.3,
      reverse: i % 2 === 0,
      active: false,
      trail: Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3(999, 999, 999)),
    }));
  }, [edges.length]);

  // ── Materials ──────────────────────────────────────────────────────
  const primarySignalMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#38bdf8"), // Electric sky
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      }),
    []
  );

  const trailMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#38bdf8"),
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      }),
    []
  );

  const burstSignalMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#818cf8"), // Celestial iris
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      }),
    []
  );

  const signalGeometry = useMemo(
    () => new THREE.SphereGeometry(0.048, 12, 12),
    []
  );
  const trailGeometry = useMemo(
    () => new THREE.SphereGeometry(0.028, 8, 8),
    []
  );

  /** Advance a signal packet along its current edge and handle routing */
  function advanceSignal(
    sig: SignalPacket,
    dt: number,
    phaseMultiplier: number,
    _signalIndex: number
  ) {
    if (sig.wait > 0) {
      sig.wait -= dt * phaseMultiplier;
      return null; // Signal is waiting at a node
    }

    // Physics: bell curve velocity — accelerate mid-transit, decelerate near nodes
    const bellCurve = Math.sin(sig.progress * Math.PI);
    const velocityCurve = 0.5 + bellCurve * 1.0;
    sig.progress += dt * sig.baseSpeed * phaseMultiplier * velocityCurve;

    if (sig.progress >= 1.0) {
      // Arrived at destination node
      sig.progress = 0;
      // Pause briefly at node for computation
      sig.wait =
        phase === "execute" || eventActive
          ? 0.12
          : 0.4 + ((_signalIndex * 0.2) % 0.8);

      const currentEdge = edges[sig.edgeIndex];
      if (currentEdge) {
        const targetNodeIndex = sig.reverse
          ? currentEdge.fromIndex
          : currentEdge.toIndex;

        // Branch / find adjacent connected edges
        const nextEdgeCandidates = edges
          .map((e, idx) => ({ edge: e, idx }))
          .filter(
            ({ edge, idx }) =>
              idx !== sig.edgeIndex &&
              (edge.fromIndex === targetNodeIndex ||
                edge.toIndex === targetNodeIndex)
          );

        if (nextEdgeCandidates.length > 0) {
          const chosen =
            nextEdgeCandidates[
              Math.floor(
                (Math.abs(Math.sin(targetNodeIndex * 127.1 + sig.edgeIndex * 311.7) * 43758.5453) % 1) *
                  nextEdgeCandidates.length
              )
            ];
          if (chosen) {
            sig.edgeIndex = chosen.idx;
            sig.reverse = chosen.edge.toIndex === targetNodeIndex;
          }
        } else {
          sig.edgeIndex = (sig.edgeIndex + 1) % edges.length;
        }
      }
    }

    // Compute current position
    const edge = edges[sig.edgeIndex];
    if (!edge) return null;
    const startNode = sig.reverse
      ? nodes[edge.toIndex]
      : nodes[edge.fromIndex];
    const endNode = sig.reverse
      ? nodes[edge.fromIndex]
      : nodes[edge.toIndex];
    if (!startNode || !endNode) return null;

    const pos = new THREE.Vector3().lerpVectors(
      startNode.position,
      endNode.position,
      Math.min(sig.progress, 1.0)
    );
    return pos;
  }

  useFrame((_, delta) => {
    if (reduceMotion || !enableSignals || !edges.length) return;

    const dt = Math.min(delta, 0.05);

    // Global speed modifier linked to cognitive cycle
    let phaseMultiplier = 1.0;
    if (phase === "orchestrate") phaseMultiplier = 1.35;
    else if (phase === "execute" || eventActive) phaseMultiplier = 1.75;
    else if (activeSection === "automation") phaseMultiplier = 1.4;
    else if (phase === "observe" || phase === "reset") phaseMultiplier = 0.7;

    // ── Primary signals ──────────────────────────────────────────────
    if (primaryMeshRef.current) {
      primarySignals.forEach((sig, i) => {
        const pos = advanceSignal(sig, dt, phaseMultiplier, i);

        if (!pos) {
          // Park outside view while waiting
          dummy.position.set(999, 999, 999);
          dummy.scale.set(0, 0, 0);
        } else {
          // Update trail history (shift positions)
          for (let t = TRAIL_LENGTH - 1; t > 0; t--) {
            const trailItem = sig.trail[t];
            const prevTrailItem = sig.trail[t - 1];
            if (trailItem && prevTrailItem) {
              trailItem.copy(prevTrailItem);
            }
          }
          const firstTrail = sig.trail[0];
          if (firstTrail) {
            firstTrail.copy(pos);
          }

          dummy.position.copy(pos);
          // Luminous pulse scale during transit
          const pulse = 1.0 + Math.sin(sig.progress * Math.PI) * 0.4;
          dummy.scale.set(pulse, pulse, pulse);
        }

        dummy.updateMatrix();
        primaryMeshRef.current?.setMatrixAt(i, dummy.matrix);
      });
      primaryMeshRef.current.instanceMatrix.needsUpdate = true;

      // Signal opacity modulation with rhythm
      const mat = primaryMeshRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = 0.7 + rhythmIntensity * 0.3;
      mat.opacity += (targetOpacity - mat.opacity) * 0.03;
    }

    // ── Trail rendering ──────────────────────────────────────────────
    if (trailMeshRef.current) {
      let trailIdx = 0;
      primarySignals.forEach((sig) => {
        sig.trail.forEach((trailPos, t) => {
          if (trailIdx >= PRIMARY_SIGNAL_COUNT * TRAIL_LENGTH) return;
          if (trailPos.x > 900) {
            dummy.position.set(999, 999, 999);
            dummy.scale.set(0, 0, 0);
          } else {
            dummy.position.copy(trailPos);
            // Each successive trail point is smaller and more transparent
            const scale = 0.7 - t * 0.12;
            dummy.scale.set(
              Math.max(scale, 0.1),
              Math.max(scale, 0.1),
              Math.max(scale, 0.1)
            );
          }
          dummy.updateMatrix();
          trailMeshRef.current?.setMatrixAt(trailIdx, dummy.matrix);
          trailIdx++;
        });
      });
      trailMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // ── Burst signals (phase-synchronized) ───────────────────────────
    if (burstMeshRef.current) {
      const burstActive =
        phase === "orchestrate" || phase === "execute" || eventActive;

      burstSignals.forEach((sig, i) => {
        if (!burstActive && !sig.active) {
          dummy.position.set(999, 999, 999);
          dummy.scale.set(0, 0, 0);
          dummy.updateMatrix();
          burstMeshRef.current?.setMatrixAt(i, dummy.matrix);
          return;
        }

        // Activate burst signals when entering orchestrate/execute
        if (burstActive && !sig.active) {
          sig.active = true;
          sig.progress = 0;
          sig.wait = 0.2 + i * 0.15;
          sig.edgeIndex = (i * 5) % edges.length;
        }

        // Deactivate when leaving peak phases
        if (!burstActive && sig.active && sig.progress >= 1.0) {
          sig.active = false;
        }

        const pos = advanceSignal(sig, dt, phaseMultiplier * 1.2, i + 100);
        if (!pos) {
          dummy.position.set(999, 999, 999);
          dummy.scale.set(0, 0, 0);
        } else {
          dummy.position.copy(pos);
          const pulse = 0.9 + Math.sin(sig.progress * Math.PI) * 0.5;
          dummy.scale.set(pulse, pulse, pulse);
        }
        dummy.updateMatrix();
        burstMeshRef.current?.setMatrixAt(i, dummy.matrix);
      });
      burstMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  if (reduceMotion || !enableSignals || !edges.length) return null;

  return (
    <>
      {/* Primary signal packets */}
      <instancedMesh
        ref={primaryMeshRef}
        args={[signalGeometry, primarySignalMaterial, PRIMARY_SIGNAL_COUNT]}
      />

      {/* Signal trails (fading history) */}
      <instancedMesh
        ref={trailMeshRef}
        args={[
          trailGeometry,
          trailMaterial,
          PRIMARY_SIGNAL_COUNT * TRAIL_LENGTH,
        ]}
      />

      {/* Burst signals (iris-colored, phase-activated) */}
      <instancedMesh
        ref={burstMeshRef}
        args={[signalGeometry, burstSignalMaterial, BURST_SIGNAL_COUNT]}
      />
    </>
  );
}
