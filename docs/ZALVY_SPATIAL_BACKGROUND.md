# ZALVY — Spatial 3D Intelligence Background System

## 1. Visual Philosophy: "Spatial Intelligence"

The ZALVY 3D Spatial Background transforms the digital surface into an intentional, computational environment that reflects **"Spatial Intelligence"**.

Rather than decorative spectacle, spinning globes, or gaming effects, the system communicates:
- **Intelligent infrastructure**: Connected nodes behaving as enterprise compute anchors.
- **AI orchestration in motion**: Hairline pathways that actively route signals between components.
- **Atmospheric depth**: Multi-layer spatial coordinates that ground the interface into ZALVY's obsidian design palette.
- **Editorial restraint ("The 20% Less Rule")**: Subtle, damped motion that prioritizes content readability and enterprise confidence over visual noise.

---

## 2. Depth Layers Architecture

The spatial environment is structured across 4 distinct depth layers:

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 4: Depth Particles (Sparse harmonic floating dust)    │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: Intelligent Network (Primary, routing, satellites) │
│          + SignalPaths (Directional packet pulses)          │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Spatial Geometry (Datum rings & coordinate guides) │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: Atmospheric Depth (Radial bloom, vignette, haze)   │
└─────────────────────────────────────────────────────────────┘
```

1. **Layer 1 — Atmospheric Depth (`AtmosphericLayer.tsx`)**:
   - Soft radial illumination matching `--token-canvas` (`#080a0f`), `--token-accent` (`#38bdf8`), and `--token-iris` (`#818cf8`).
   - Smooth custom shader with vignette attenuation to prevent color banding.
   - Built-in text safe-zone attenuation behind primary headlines and CTAs.

2. **Layer 2 — Spatial Geometry (`SpatialGeometry.tsx`)**:
   - Mathematical coordinate guide rings (elliptical datum loops) tilted subtly in 3D space.
   - Crosshair datum markers placed at strategic spatial reference coordinates.
   - Section-reactive geometry density (expands on `/solutions` and `/platform`, stabilizes on `/security`).

3. **Layer 3 — Intelligent Network (`IntelligenceNetwork.tsx` + `SignalPaths.tsx`)**:
   - **Primary compute anchors (5 nodes)**: Luminous nodes enclosed in delicate octahedral coordinate brackets.
   - **Secondary routing nodes (12 nodes)**: Intermediate routing nodes connecting clusters.
   - **Peripheral satellites (18–24 nodes)**: Delicate outer perimeter nodes.
   - **Hairline connection paths**: Optimized `LineSegments` buffer geometry linking adjacent nodes.
   - **Signal packets (`SignalPaths.tsx`)**: Traveling signal pulses navigating along connections (`NODE → PATH → NODE → SIGNAL → NODE`).
   - **Asymmetric composition**: Network center is shifted to the right (`x ~ 1.0 to 1.8`) to protect left-aligned hero copy and buttons.

4. **Layer 4 — Depth Particles (`ParticleField.tsx`)**:
   - Extremely sparse (18–30 particles max).
   - Multi-depth layering (`z: -7 to +4`) with varied radii and low opacity (0.10–0.22).
   - Independent harmonic oscillation frequencies (no repetitive mechanical synchronization).
   - Dynamic exclusion zone around main typography.

---

## 3. Component Hierarchy

```
src/components/3d/
├── ZalvySpatialBackground.tsx  # Master container: route tiering, dynamic loading, fallback
├── ZalvySpatialCanvas.tsx      # WebGL Canvas: DPR capping, context recovery, visibility observer
├── CameraRig.tsx               # Cinematic camera: micro idle drift, pointer parallax, scroll depth
├── SceneLighting.tsx           # Enterprise soft key (electric cyan) & fill (celestial iris)
├── AtmosphericLayer.tsx        # Layer 1: Radial volumetric shader plane
├── SpatialGeometry.tsx         # Layer 2: Hairline datum rings & coordinate guides
├── IntelligenceNetwork.tsx     # Layer 3: Signature asymmetric node hierarchy & connections
├── SignalPaths.tsx             # Layer 3: Discrete luminous packet traversals
├── ParticleField.tsx           # Layer 4: Sparse multi-depth floating particles
├── SpatialFallback.tsx         # Non-WebGL CSS/SVG atmospheric fallback
├── DeviceQuality.ts            # Tier evaluation (High / Medium / Low / Fallback)
└── ReducedMotion.ts            # SSR-safe prefers-reduced-motion hook
```

---

## 4. Route Awareness & Section Awareness

### Route Tiers

| Route Group | Tier | Behavior |
| --- | --- | --- |
| `/`, `/solutions`, `/agents`, `/automation`, `/platform` | **Full 3D** | Full node hierarchy, signal pulses, spatial geometry, and camera parallax |
| `/about`, `/projects`, `/services`, `/studio` | **Subtle 3D** | Reduced node count, signals muted, serene atmospheric spatial presence |
| `/pricing`, `/security`, `/careers`, `/contact`, `/blog`, `/legal`, `/login`, `/verify`, `/admin` | **Static Fallback** | Pure non-WebGL CSS/SVG atmospheric backdrop (zero WebGL memory/GPU overhead) |

### Section Transitions

When scrolling on the homepage or navigating between sections, the active section triggers smooth transformations:
- **`hero`**: Standard asymmetric composition, active signals, subtle breathing.
- **`solutions`**: Structured geometry, tightened coordinate alignment.
- **`agents`**: Clustered multi-agent routing relationships.
- **`automation`**: Accelerated directional signal flow along linear axes.
- **`platform`**: Expanded panoramic datum rings and infrastructural scale.
- **`security` / `quiet`**: Reduced opacity, stabilized geometric anchors.

---

## 5. Device Quality Tiers

`DeviceQuality.ts` evaluates client hardware before configuring the WebGL context:

| Tier | Criteria | Max DPR | Max Nodes | Particles | Signals | Parallax |
| --- | --- | --- | --- | --- | --- | --- |
| **High** | Desktop, >=8 cores, >=8GB RAM | 1.75 | 42 | 30 | Enabled | Enabled |
| **Medium** | Laptop / Mid-range, 4–7 cores | 1.50 | 28 | 18 | Enabled | Enabled |
| **Low** | Mobile / Low-power, <4 cores | 1.25 | 18 | 10 | Disabled | Disabled |
| **Fallback** | No WebGL / context lost / mobile battery-saver | N/A | 0 | 0 | Disabled | Disabled |

---

## 6. Interaction Model

1. **Micro Idle Drift**:
   - Ultra-slow dual-harmonic sinusoidal wander (`period ~ 35s–50s`).
   - Prevents the scene from feeling frozen without distracting the eye.

2. **Pointer Parallax**:
   - Desktop mouse displacement is mapped to normalized offsets and heavily damped (`lerp factor = dt * 1.8`).
   - Maximum displacement is restricted to +/- 0.35 units.
   - User feels spatial response intuitively before noticing camera movement consciously.

3. **Scroll Parallax**:
   - Window scroll smoothly pushes camera depth and elevation (`scrollOffset` mapped to `y` and `z`).
   - Background layers drift slower than foreground elements for physical depth separation.

---

## 7. Performance & Core Web Vitals Strategy

- **Zero Hydration Impact**: Canvas is loaded with `next/dynamic` (`ssr: false`). Initial SSR and streaming HTML are 100% lightweight and instant.
- **Target Metrics**:
  - LCP: <= 2.5s (Server-rendered Hero and TrustBar paint unimpeded)
  - CLS: 0.00 (Fixed layout background container)
  - INP: <= 200ms (All pointer calculations use passive listeners and `useFrame` interpolation)
- **Visibility Detection**: WebGL animation loop automatically halts (`frameloop="never"`) when the browser tab is hidden (`document.visibilityState !== "visible"`).
- **Instanced Meshes**: Signals, particles, and node geometry use single draw calls via `THREE.InstancedMesh` and shared `BufferGeometry`.

---

## 8. Reduced Motion & Accessibility

- Strictly respects `prefers-reduced-motion: reduce`.
- When active:
  - All camera drift, pointer parallax, and scroll displacement are disabled.
  - Camera rests at static coordinates `[0, 0, 13.5]`.
  - Signal packet travel and particle float animations are paused.
  - The scene maintains high visual elegance in a calm, static resting state.
- Decorative isolation:
  - Container element has `aria-hidden="true"`, `role="presentation"`.
  - `pointer-events: none` ensures complete transparency to user clicks, selection, and accessibility trees.
  - Z-index: Canvas is locked to `z-[1]`, safely below content `z-[10]` and headers `z-[200]`.

---

## 9. Future Maintenance Rules

1. **Adding New Routes**:
   - Register high-narrative routes in `SPATIAL_FULL_ROUTES` within `src/components/3d/ZalvySpatialBackground.tsx`.
   - Register ambient content routes in `SPATIAL_SUBTLE_ROUTES`.
   - Conversion/form/utility pages should default to static fallback to keep user focus on input tasks.

2. **Color Synchronization**:
   - All materials must derive from ZALVY design tokens (`--token-canvas`, `--token-accent`, `--token-iris`, `--token-foreground`).
   - Never introduce saturated purples, neon pinks, or chromatic aberration.

3. **Restraint In Modifications**:
   - Always verify that additions pass the **"20% Less Rule"**: if the scene draws attention away from the hero typography or product metrics, decrease opacity and amplitude.
