# DESIGN DECISIONS
Date: 2026-09-15

## Decision 1
Use React Three Fiber only for selected marketing experiences
Reason: Spatial depth while keeping majority DOM-based
Tradeoff: WebGL complexity and bundle cost
Mitigation: Dynamic loading + fallback + device aware quality

## Decision 2
Extend existing design tokens, do not duplicate
Reason: Maintain consistency and avoid drift
Tradeoff: Constraint on new colors
Mitigation: Semantic layer added on top

## Decision 3
Page transitions subtle and non-blocking
Reason: Continuity without performance hit
Tradeoff: Complexity with App Router
Mitigation: Use Motion with proper hydration guards

## Decision 4
Admin remains 2D focused
Reason: Productivity over decoration
Tradeoff: Visual disparity
Mitigation: Consistent motion and depth language without 3D

PHASE 2 DESIGN DECISIONS COMPLETE

