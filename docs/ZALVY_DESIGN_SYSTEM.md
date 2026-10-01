# ZALVY DESIGN SYSTEM
Version: Phase 2
Date: 2026-09-15

## 1. Design Philosophy
Intelligence, Precision, Depth, Motion, Restraint, Trust.
Concept: INTELLIGENT DIGITAL SPACE

## 2. Color System
Semantic tokens: background, background-elevated, surface, surface-elevated, surface-interactive
foreground, foreground-secondary, foreground-muted, foreground-disabled
border variants, primary, accent, semantic states
Existing tokens preserved and extended for 3D lighting

## 3. Surface System
Layers 0-5 page to overlay with defined background, border, shadow, blur

## 4. Spatial Design
Background -> Atmosphere -> Content -> Interactive -> Primary Action

## 5. Typography
Existing display/mono/base fonts kept. Scale: display-xl/lg/md, heading-xl/lg/md/sm, body-lg/md/sm, label, caption, micro
Fluid scaling, balance, measure controlled

## 6. Grid
Max width 1280px, gutters, section spacing, 12-col fluid, text measure 60-75ch

## 7. Radius
radius-sm/md/lg/xl/pill controlled scale

## 8. Shadow
shadow-subtle/card/elevated/floating/modal

## 9. Border
subtle/standard/strong/interactive/focus

## 10. Motion
Durations instant/fast/normal/slow/cinematic
Easings standard/emphasized/entrance/exit/spring
Intents fade/fade-up/down/scale/slide/reveal/stagger/hover/press/page-enter/exit

## 11. Scroll
Section entrance, text reveal, image depth, sticky storytelling, minimal progress

## 12. 3D Architecture
React Three Fiber + Drei + Motion dynamic import
components/3d Scene/SceneCanvas/CameraRig/Lighting/Environment/InteractiveObject/DeviceAwareQuality/Fallback

## 13. Hero 3D Concept
AI + CONNECTION + INTELLIGENCE
Interconnected nodes, intelligent network, spatial data field
No generic sphere/earth/cube

## 14. 3D Interaction
Subtle pointer, scroll, hover, CTA reaction

## 15. 3D Fallback
Intentional 2D/DOM fallback

## 16. Accessibility
3D enhancement only, prefers-reduced-motion respected, WCAG 2.2 AA

## 17. Components
Reuse Radix, add Surface/MagneticButton where needed

## 18. Buttons, Cards, Nav, Transitions defined

## 19. Admin
No cinematic 3D, clarity over decoration

## 20. AI UX
Real state representation

## 21. Responsive
Behavior per breakpoint, ultra-wide handling

## 22. Performance Budget
Initial JS <200KB gz, 3D dynamic <300KB, 60fps

PHASE 2 DESIGN SYSTEM COMPLETE

