# ZALVY Living AI-Native 3D Intelligence System

## Architectural & Technical Specification

### 1. Vision & Core Concept
The ZALVY 3D background is an **AI-native living computational structure** designed to communicate that an intelligent system is operating behind the interface. It rejects generic metaphors (no globes, no literal brains, no robotic avatars, no simple floating spheres) in favor of an **abstract computational intelligence architecture**.

The visual architecture is constructed from five coordinated layers:
- **Layer A — Central Computational Core (`CoreGeometry.tsx`)**: An engineered icosahedral structural cage with architectural gaps, an octahedral counter-rotating lattice with translucent structural plates on high tiers, and an inner glowing dodecahedral kernel.
- **Layer B & D — Concentric Intelligence Rings (`IntelligenceRings.tsx`)**: Three segmented elliptical orbital rings with precise architectural gap spacing, synchronized counter-rotations, and orbital marker tracking nodes.
- **Layer C — Morphing Neural Network (`IntelligenceNetwork.tsx`)**: Dynamically clustered nodes that re-orient and morph topology based on user navigation and active site sections (e.g., distributed swarm for Agents, pipeline stream for Automation, lattice for Security).
- **Layer E — Flowing Information Signals (`SignalPaths.tsx`)**: High-speed computational energy pulses that traverse network pathways with directional acceleration, fading phosphor trails, and bursts during orchestration/execution phases.
- **Layer F — Atmospheric & Depth Fields (`AtmosphericLayer.tsx`, `ParticleField.tsx`, `SceneLighting.tsx`)**: Sub-surface obsidian glow, multi-harmonic spatial drift, directional lighting evolution, and subtle rear rim lighting for crisp silhouette separation.

---

### 2. Cognitive Cycle & Visual Rhythm

The system operates across a 7-phase cognitive thinking cycle that loops continuously:
1. **Observe (3.2s)**: Calm baseline state. Low pulse rate, stable network topology.
2. **Connect (2.6s)**: Initial synapse formation. Nodes drift inward, signal flow initiates.
3. **Process (2.8s)**: Core compression. Geometry tightens, higher rotation frequency, computation density increases.
4. **Orchestrate (3.2s)**: Structural expansion. Multi-axis orbital alignment, signal branching across wider pathways.
5. **Execute (2.2s)**: Peak radiance. Brightness boost, directional key light sweep, high-speed burst signals.
6. **Result (2.8s)**: Harmonious alignment. Pulsing settles, energy disperses cleanly into the atmospheric field.
7. **Reset (2.4s)**: Peaceful contraction returning the computational structure to baseline.

In addition, occasional randomized intelligence events trigger at 12–18 second intervals, introducing subtle bursts of activity that keep the background alive without being distracting.

---

### 3. Device Quality Tiers & Performance Optimization

To maintain FAANG-grade 60 FPS performance across device profiles, the system dynamically configures rendering parameters using `DeviceQuality.ts`:

| Quality Tier | Max Nodes | Signals | DPR | Rings | Translucent Panels | Particle Count |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **High** (Dedicated GPU / Desktop) | 48 | Yes (with trails) | 1.5 | 3 Rings | MeshPhysicalMaterial | 36 |
| **Medium** (Integrated GPU / Laptop) | 28 | Yes | 1.0 | 2 Rings | MeshStandardMaterial | 18 |
| **Low** (Mobile / Low power) | 14 | Simplified | 1.0 | 1 Ring | Wireframe only | 8 |
| **Fallback** (Reduced motion / WebGL loss) | N/A | Static gradient | N/A | N/A | N/A | N/A |

#### Key Performance Protections:
- **Zero Heavy Postprocessing**: No bloom passes, SSAO, or depth-of-field shaders. All luminescence is achieved using additive blending and emissive material properties.
- **Background Tab Inactivation**: When `document.visibilityState !== "visible"`, the canvas `frameloop` switches to `"never"`, dropping GPU utilization to 0%.
- **Context Loss Handling**: Automated recovery and fallback to `SpatialFallback.tsx` in case of WebGL context loss.
- **Safe-Zone Overlay**: A radial gradient overlay shields typography on the left-center viewport, guaranteeing WCAG AAA text contrast regardless of 3D activity.

---

### 4. Route Isolation Strategy
- **Full Narrative Routes (`/`, `/solutions`, `/agents`, `/automation`, `/platform`)**: Full 3D canvas rendering with section-reactive topology morphing.
- **Subtle Routes (`/about`, `/projects`, `/services`, `/studio`)**: Reduced node and particle count for quieter reading experience.
- **Static Routes (`/pricing`, `/legal`, `/contact`)**: Pure CSS radial backdrop without WebGL execution to guarantee instant interaction.
