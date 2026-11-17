# AtomScope — Technical Architecture

> [!info] Document Status
> - Document Type: Technical Architecture
> - Status: Accepted
> - Version: 0.1
> - Last Updated: 2026-11-17

## 1. Purpose

This document defines the initial software architecture and technology baseline for AtomScope. It should be refined as the first working modules reveal concrete requirements.

## 2. Technology Baseline

| Area | Technology | Responsibility |
|---|---|---|
| UI framework | React | Pages, reusable UI components, interaction |
| Language | TypeScript | Application logic, data types, physics interfaces |
| Build tooling | Vite | Development server and production build |
| Vector graphics | SVG | Diagrams and many 2D scientific visualizations |
| Dynamic rendering | Canvas | Particle-heavy or continuously updated scenes where appropriate |
| Mathematical typesetting | KaTeX in Rutherford | Accessible MathML/HTML equations with linked quantity controls |
| Styling | CSS / CSS Modules or chosen styling approach | Design system and responsive layout |

React + TypeScript + Vite is the accepted starting stack. Specific visualization and charting libraries remain open until a concrete need is identified.

## 3. Architectural Principles

### 3.1 Separate Physics from Presentation

Physical calculations must not depend on React components, DOM elements, SVG nodes, or Canvas rendering.

A physics function should be independently callable and testable.

### 3.2 Separate Content from Rendering

Knowledge metadata and explanatory content should be represented independently from the components that render them.

### 3.3 Reuse Without Forcing Uniformity

Shared layout and interaction components should be reusable, while Model, Experiment, and Data visualizations may use different internal renderers and layouts.

### 3.4 Make Units and Types Explicit

Use typed interfaces for physical quantities, simulation parameters, and result data. Avoid ambiguous unlabelled numbers at module boundaries.

## 4. Logical Layers

```text
Application Shell
├── Knowledge Navigation
├── Knowledge Module Workspace
│   ├── Visualization Selector
│   ├── Visualization Canvas
│   ├── Side Panel
│   │   ├── Controls
│   │   └── Contextual Information
│   ├── Workspace / Presentation Mode
│   └── Knowledge Details
├── Content Layer
│   ├── Knowledge Metadata
│   ├── Explanatory Content
│   └── Supplementary Information
├── Visualization Layer
│   ├── Model Views
│   ├── Experiment Views
│   └── Data Views
└── Physics / Computation Layer
    ├── Constants and Units
    ├── Physical Models
    ├── Numerical Solvers
    └── Derived Quantities
```

This is a logical separation, not a mandatory one-to-one folder structure.

## 5. Suggested Source Structure

```text
src/
├── app/
│   ├── App.tsx
│   ├── routes/
│   └── navigation/
├── content/
│   ├── knowledge-map/
│   ├── modules/
│   └── supplementary/
├── features/
│   ├── knowledge-map/
│   ├── knowledge-module/
│   └── visualization-workspace/
├── visualizations/
│   ├── model/
│   ├── experiment/
│   └── data/
├── physics/
│   ├── constants/
│   ├── units/
│   ├── models/
│   └── solvers/
├── components/
│   ├── layout/
│   ├── controls/
│   ├── information/
│   └── mathematics/
├── styles/
└── types/
```

The structure is provisional. Split or merge folders based on real complexity rather than creating empty abstractions.

## 6. Knowledge Module Data

A knowledge module should be representable through structured metadata, including:
- Stable topic identifier.
- Title and course location.
- Knowledge priority/category where applicable.
- Short description.
- One or more visualization identifiers.
- Contextual information references.
- Knowledge Details content.
- Supplementary information.
- Related knowledge identifiers.

The exact schema should be designed when the first content-driven page is implemented.

## 7. Visualization Interfaces

A visualization should receive explicit input parameters and expose its relevant state or results through typed interfaces.

The application shell should not need to know the numerical details of every visualization.

Prefer:
- Physics functions that return typed results.
- Visualization components that consume those results.
- UI controls that update parameters through explicit state.
- Shared formatting functions for units and display precision.

## 8. State Management

Start with React state and component composition where sufficient.

Introduce a shared state-management library only when cross-view synchronization or application-wide state becomes difficult to manage.

For coordinated visualizations, define a clear shared source of truth for the physical parameters and derived results.

## 9. Rendering Strategy

- Use SVG for crisp diagrams, labels, energy levels, spectra, and moderate-complexity 2D interactions.
- Use Canvas when many objects or frequent drawing updates make it more suitable.
- Use HTML for controls, descriptions, and accessible text.
- Introduce 3D rendering only when a specific learning objective requires it.

## 10. Performance and Lifecycle

- Keep expensive calculations out of unnecessary React render cycles.
- Separate simulation stepping from visual rendering where needed.
- Provide a predictable pause/reset lifecycle.
- Avoid unbounded animation loops.
- Clean up rendering resources when a visualization unmounts.
- Measure performance before introducing workers or more complex rendering infrastructure.

## 11. Open Implementation Decisions

The following should be decided during implementation, not prematurely:
- Routing library.
- State-management library.
- Charting library.
- Styling methodology.
- Whether a particular simulation needs a worker.
- Whether a specific visualization requires WebGL or 3D.

## 12. Initial Implementation Decisions — 2026-11-11

- Hash-based routes keep local navigation and direct topic links independent of server rewrites. See ADR-0005.
- React component state is sufficient. Topic parameters are shared across the module's visualizations and retained while changing view, side-panel content, or display mode. Leaving a topic resets its parameters on the next visit.
- Plain CSS and browser-native SVG implement the design and all current views. No chart library, global state library, WebGL engine, numerical solver, or worker is required.
- Unicode equations are used initially; KaTeX remains a candidate for future derivation-heavy content.
- Constants and pure models live in `src/physics/`; course metadata and content in `src/content/`; the shared workspace in `src/features/`; scientific renderers in `src/visualizations/`.
- Vitest checks pure calculations and course links. Playwright checks desktop and mobile interactions using installed Chrome. Separate include patterns prevent the runners from collecting one another's tests.
- Development and preview servers bind to loopback. There is no backend or external service dependency at runtime.

## 13. Rutherford Extension — 2026-11-17

- `src/physics/rutherford/` owns validated SI mechanics, cross sections and counting statistics. Legacy `scattering` and `scatteringPath` delegate to it; SVG never owns a second physical model.
- `src/content/rutherfordDerivations.ts` and `rutherfordQuantities.ts` hold structured steps, algebra, quantity definitions and computation explanations independently of presentation.
- `src/features/rutherford/` is a specialized workspace within the existing module shell. All three views share one React-owned parameter state; live point, solution and measurement outputs are derived/memoized. No global store or backend is needed.
- The feature and bundled KaTeX styles/fonts load lazily. Other course modules do not pay the initial KaTeX download cost. Equations provide MathML for assistive reading and equivalent native buttons for keyboard quantity inspection; mouse clicks on displayed tokens share the same quantity IDs.
- The trajectory parameter is deterministic and explicitly not uniform time. Playback timers clean up on pause, view change and unmount; reduced-motion mode disables automatic playback while retaining the manual scrubber.
- Workspace/presentation switching preserves all model/measurement parameters, derivation step, current orbit point, random seed, selected quantity and pinned snapshot. On screens ≤760 px the controls are a top drawer; selecting a quantity opens it. Reset restores E=5 MeV, Z=79, b=40 fm, middle orbit position, default overlays, measurement inputs and seed 42, while retaining the current view/derivation route.
