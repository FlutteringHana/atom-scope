# AtomScope — Development Roadmap

> [!info] Document Status
> - Document Type: Development Plan
> - Status: Accepted
> - Version: 0.1
> - Last Updated: 2026-11-17

## 1. Planning Principles

The roadmap defines milestone outcomes, not a duplicate list of coding tasks. Detailed implementation tasks should be tracked in the project's issue tracker.

Milestones may be adjusted when implementation reveals new constraints. Changes to scope or architecture should be reflected in the relevant specifications.

## 2. Milestones

### Implementation snapshot — 2026-11-11

| Milestone | Current state | Evidence / remaining scope |
| --- | --- | --- |
| M0 | Complete | Original documentation baseline retained |
| M1 | Complete | React/TypeScript/Vite, three Parts, 17 topics, responsive navigation and content schema |
| M2 | Complete | Bohr module: validated SI calculations, coordinated model/energy/spectrum views, controls/context, immersive mode, deeper details, interaction tests |
| M3 | In progress | Nine interactive modules on six engines; eight other topics have concept notes. Dedicated cathode-ray, Thomson, Bohr–Sommerfeld, Franck–Hertz, diffraction, and general wave-equation simulations remain deferred |
| M4 | In progress | Typed related links, relationship view, shared reference, mobile layout and reduced-motion support implemented; deeper course-material review and broader accessibility/content refinement remain |

The implemented physics scope and limitations are defined in [Implemented Models](../03-physics/physical-model-specifications/IMPLEMENTED_MODELS.md). This snapshot reports implementation and does not redefine the course architecture or imply that every module is fully simulated.

### Rutherford extension snapshot — 2026-11-17

The owner's imported development draft is retained separately from the adopted [model contract](../03-physics/physical-model-specifications/RUTHERFORD_SCATTERING_MODEL.md) and [measurement contract](../03-physics/experiment-simulation-specifications/RUTHERFORD_MEASUREMENT.md).

| Phase | Status | Delivered / remaining |
| --- | --- | --- |
| P0 | Complete | Exact mechanics, derivative-based vectors, cross sections, explicit units, thin-target gates and seeded sampling; numerical/reference tests |
| P1 | Complete | Rescaling geometry, asymptotes, vectors, selectable quantities, linked equations, pinning, drag/scrub/playback, presets and immersive preservation |
| P2 | Complete for core routes | Vector and radial methods, optional algebra, hodograph/effective-potential views and method comparison |
| P3 | Complete | Area-to-solid-angle mapping, log/linear curve, keyboard/draggable acceptance bounds, exact ring and approximate patch, P/counts, Poisson observation and separate conditional histogram |
| P4 | Partial | Keyboard/reduced-motion/mobile-drawer support implemented. The third analytical-mechanics route awaits the specific reference; student review and wider accessibility conformance auditing remain |

M3 and M4 remain in progress for the wider course. This extends Rutherford without claiming the remaining course modules or advanced mechanics route are complete.

### M0 — Documentation and Product Foundation

**Objective:** Establish a coherent product and documentation baseline.

Deliverables:
- Project documentation structure.
- Physics Knowledge Architecture included as the course-level source of truth.
- Product and information architecture specifications.
- GUI and visualization system specifications.
- Initial technical architecture and validation strategy.
- Initial ADRs.

Exit criteria:
- Core product positioning is accepted.
- Knowledge navigation and visualization-first behavior are documented.
- Initial technology baseline is confirmed.
- Remaining open decisions are clearly identified.

### M1 — Application Foundation and Knowledge Map

**Objective:** Build the application shell and primary navigation.

Deliverables:
- React + TypeScript + Vite application.
- Global layout and design tokens.
- Knowledge Map with three major Parts.
- Part and topic navigation.
- Initial knowledge-module shell.

Exit criteria:
- Users can navigate from the home map to a knowledge module.
- Layout works at the target desktop size and adapts to narrower screens.
- Content metadata is separated from presentation.

### M2 — First Complete Visualization Module

**Objective:** Validate the complete product pattern with one representative topic.

Candidate: Rutherford scattering or Bohr hydrogen, selected based on implementation readiness.

Deliverables:
- A working physical calculation module.
- Interactive visualization.
- Side-panel controls and contextual information.
- Workspace / immersive toggle.
- Knowledge Details entry.
- Physics and interaction tests.

Exit criteria:
- The module demonstrates the intended visualization-first experience.
- Calculations have documented validation.
- The page structure can be reused without forcing identical visualization internals.

### M3 — Core Atomic Physics Modules

**Objective:** Expand the product across the initial course scope.

Potential deliverables:
- Rutherford model and scattering.
- Bohr model and energy levels.
- Hydrogen-like systems.
- Atomic transitions and hydrogen spectrum.
- Selected quantization and experiment visualizations.
- Introductory quantum mechanics visualizations as scoped by the course architecture.

The exact implementation order should be based on dependencies and learning value.

### M4 — Integration and Refinement

**Objective:** Improve consistency and cross-topic exploration.

Potential deliverables:
- Coordinated visualizations within knowledge modules.
- Cross-topic relationships.
- Improved mathematical and supplementary information.
- Responsive and accessibility refinement.
- Broader validation coverage.

## 3. Deferred Work

The following should not block the initial product:
- Full quiz and scoring system.
- Advanced quantum topics outside the initial course scope.
- General-purpose 3D simulation framework.
- User accounts and cloud-based learning analytics.

## 4. Task Management

Use issues or a project board for:
- Implementation tasks.
- Bugs.
- Small design questions.
- Testing tasks.
- Documentation updates.

Keep this roadmap focused on milestone objectives and exit criteria.
