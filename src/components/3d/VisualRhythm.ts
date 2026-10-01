"use client";

import { useRef, useCallback, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";

/* ─────────────────────────────────────────────────────────────────────────── */
/* VISUAL RHYTHM — Centralized animation timing controller.                   */
/*                                                                           */
/* Drives the "idle → build → peak → release → idle" cinematic pacing        */
/* that all 3D components consume for coordinated, non-uniform animation.    */
/* Also manages randomized intelligence events that fire during peak moments.*/
/* ─────────────────────────────────────────────────────────────────────────── */

export type RhythmPhase = "idle" | "build" | "peak" | "release";

export type IntelligenceEventType = 1 | 2 | 3 | 4 | 5 | 6;

export interface VisualRhythmState {
  /** Current rhythm phase in the idle→build→peak→release cycle */
  rhythmPhase: RhythmPhase;
  /** 0–1 float: overall energy level, smoothly interpolated */
  rhythmIntensity: number;
  /** Whether a random intelligence event is currently active */
  eventTrigger: boolean;
  /** Which intelligence event type (1–6), only meaningful when eventTrigger is true */
  eventType: IntelligenceEventType;
  /** 0–1 float: progress within the current rhythm phase */
  phaseProgress: number;
}

/* ── Phase durations in seconds (base, before jitter) ────────────────────── */
const PHASE_BASE_DURATIONS: Record<RhythmPhase, number> = {
  idle: 5.0,
  build: 3.0,
  peak: 2.0,
  release: 3.0,
};

const PHASE_ORDER: RhythmPhase[] = ["idle", "build", "peak", "release"];

/** Deterministic-ish pseudo-random with seed (avoids Math.random() in render) */
function seededJitter(seed: number): number {
  // Returns 0.8–1.2 range for ±20% jitter
  return 0.8 + ((Math.sin(seed * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1 * 0.4;
}

/**
 * Central animation rhythm hook. Call ONCE in the scene root component.
 * All child components receive the returned state via props.
 *
 * The hook uses `useFrame` to advance the rhythm state every frame,
 * ensuring perfectly smooth intensity interpolation without setTimeout jitter.
 */
export function useVisualRhythm(options: {
  reduceMotion: boolean;
  isVisible: boolean;
}): RefObject<VisualRhythmState> {
  const { reduceMotion, isVisible } = options;

  const state = useRef<{
    phaseIndex: number;
    elapsed: number;
    phaseDuration: number;
    cycleCount: number;
    intensity: number;
    eventActive: boolean;
    eventType: IntelligenceEventType;
    eventTimer: number;
    eventDuration: number;
  }>({
    phaseIndex: 0,
    elapsed: 0,
    phaseDuration: PHASE_BASE_DURATIONS.idle,
    cycleCount: 0,
    intensity: 0,
    eventActive: false,
    eventType: 1,
    eventTimer: 0,
    eventDuration: 1.8,
  });

  const result = useRef<VisualRhythmState>({
    rhythmPhase: "idle",
    rhythmIntensity: 0,
    eventTrigger: false,
    eventType: 1,
    phaseProgress: 0,
  });

  const advancePhase = useCallback(() => {
    const s = state.current;
    s.phaseIndex = (s.phaseIndex + 1) % PHASE_ORDER.length;
    s.elapsed = 0;
    s.cycleCount += 1;

    const nextPhase = PHASE_ORDER[s.phaseIndex] ?? "idle";
    const baseDuration = PHASE_BASE_DURATIONS[nextPhase];
    s.phaseDuration = baseDuration * seededJitter(s.cycleCount);

    // Fire intelligence event during peak with ~60% probability,
    // or occasionally during build with ~15% probability
    if (nextPhase === "peak") {
      const roll = ((Math.sin(s.cycleCount * 41.3) * 43758.5453) % 1 + 1) % 1;
      if (roll < 0.6) {
        s.eventActive = true;
        s.eventTimer = 0;
        s.eventDuration = 1.4 + roll * 0.8; // 1.4–2.2s
        s.eventType = (((s.cycleCount % 6) + 1) as IntelligenceEventType);
      }
    } else if (nextPhase === "build") {
      const roll = ((Math.sin(s.cycleCount * 73.7) * 43758.5453) % 1 + 1) % 1;
      if (roll < 0.15) {
        s.eventActive = true;
        s.eventTimer = 0;
        s.eventDuration = 1.0 + roll * 0.6;
        s.eventType = (((s.cycleCount % 6) + 1) as IntelligenceEventType);
      }
    }
  }, []);

  useFrame((_, delta) => {
    if (reduceMotion || !isVisible) {
      result.current.rhythmPhase = "idle";
      result.current.rhythmIntensity = 0;
      result.current.eventTrigger = false;
      result.current.phaseProgress = 0;
      return;
    }

    const dt = Math.min(delta, 0.05);
    const s = state.current;

    // Advance elapsed time within current phase
    s.elapsed += dt;
    const progress = Math.min(s.elapsed / s.phaseDuration, 1.0);

    // Advance to next phase when duration exceeded
    if (progress >= 1.0) {
      advancePhase();
    }

    // Calculate target intensity based on rhythm phase
    const currentPhase = PHASE_ORDER[s.phaseIndex] ?? "idle";
    let targetIntensity = 0;
    switch (currentPhase) {
      case "idle":
        targetIntensity = 0.1 + Math.sin(progress * Math.PI) * 0.05;
        break;
      case "build":
        // Smooth ease-in ramp from ~0.15 → 0.7
        targetIntensity = 0.15 + progress * progress * 0.55;
        break;
      case "peak":
        // Hold high with subtle pulse
        targetIntensity = 0.75 + Math.sin(progress * Math.PI * 2) * 0.1;
        break;
      case "release":
        // Smooth ease-out decay from ~0.7 → 0.1
        targetIntensity = 0.7 * (1 - progress * progress) + 0.1;
        break;
    }

    // Smooth damped interpolation for intensity (never snaps)
    s.intensity += (targetIntensity - s.intensity) * dt * 3.5;

    // Intelligence event timer
    if (s.eventActive) {
      s.eventTimer += dt;
      if (s.eventTimer >= s.eventDuration) {
        s.eventActive = false;
      }
    }

    // Write to result ref (no React state, avoids re-renders)
    result.current.rhythmPhase = currentPhase;
    result.current.rhythmIntensity = s.intensity;
    result.current.eventTrigger = s.eventActive;
    result.current.eventType = s.eventType;
    result.current.phaseProgress = progress;
  });

  return result;
}
