# AtomScope — Development Roadmap

> [!info] Document Status
> - Document Type: Development Plan
> - Status: Accepted
> - Version: 0.1
> - Last Updated: 2026-11-11

## 1. Planning Principles

The roadmap defines milestone outcomes, not a duplicate list of coding tasks. Detailed implementation tasks should be tracked in the project's issue tracker.

Milestones may be adjusted when implementation reveals new constraints. Changes to scope or architecture should be reflected in the relevant specifications.

## 2. Milestones

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
