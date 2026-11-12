# AtomScope

**An interactive physics learning and exploration platform, beginning with Atomic Physics.**

AtomScope is organized around the course's physics knowledge structure. It combines interactive scientific visualizations, mathematical descriptions, experimental exploration, and supporting explanations in one learning environment.

The project is **knowledge-first and visualization-first**:
- The Physics Knowledge Architecture defines what knowledge is covered and how it is organized.
- Each knowledge module provides an interactive entry point into a physical model, experiment, or data relationship.
- Contextual information supports exploration without turning the main experience into a conventional article.
- Deeper explanations and supplementary material remain available through a separate Knowledge Details section.

## Current scope

The initial scope follows the course's Atomic Physics knowledge architecture:

1. Atomic Structure and Nuclear Model
2. Quantization and Atomic Energy States
3. Introduction to Quantum Mechanics

The authoritative course-level structure is maintained in:

`docs/01-knowledge/PHYSICS_KNOWLEDGE_ARCHITECTURE.md`

## Documentation

| Area | Purpose |
|---|---|
| [Project Overview](docs/00-foundation/PROJECT_OVERVIEW.md) | Product identity, objectives, scope, and principles |
| [Project Decision Log](docs/00-foundation/PROJECT_DECISION_LOG.md) | Records project-level meta-decisions and changes in project direction |
| [Documentation Guide](docs/00-foundation/DOCUMENTATION_GUIDE.md) | Documentation ownership and change rules |
| [Learning Content Spec](docs/01-knowledge/LEARNING_CONTENT_SPEC.md) | Structure of an individual knowledge module |
| [Product Spec](docs/02-product/PRODUCT_SPEC.md) | Product capabilities and requirements |
| [Information Architecture](docs/02-product/INFORMATION_ARCHITECTURE.md) | Knowledge map, hierarchy, and navigation |
| [GUI Design Spec](docs/02-product/GUI_DESIGN_SPEC.md) | Global interface and workspace behavior |
| [Visualization System Spec](docs/02-product/VISUALIZATION_SYSTEM_SPEC.md) | Model, Experiment, and Data visualization patterns |
| [Mathematical Reference](docs/03-physics/MATHEMATICAL_REFERENCE.md) | Formula and notation registry |
| [Technical Architecture](docs/04-engineering/TECHNICAL_ARCHITECTURE.md) | Frontend and software structure |
| [Validation Strategy](docs/04-engineering/VALIDATION_STRATEGY.md) | Physical and software correctness |
| [Roadmap](docs/05-planning/ROADMAP.md) | Milestones and delivery criteria |
| [Architecture Decisions](docs/06-decisions/) | Important design decisions and rationale |

## Technology baseline

- React
- TypeScript
- Vite

The visualization implementation will use the simplest suitable browser technology for each task. SVG and Canvas are the initial candidates; a specific charting or rendering library is not mandated at this stage.

## Development status

The first local application is implemented. It includes all three Parts, 17 topic entries, nine interactive modules built on six independently tested physics engines, eight concept-note modules, knowledge relationships, and a shared workspace with an immersive mode.

Interactive modules:
- Rutherford scattering: analytical trajectories, apparatus schematic, and deflection curve.
- Bohr atom, hydrogen-like ions, atomic transitions, and spectroscopy: coordinated atom, energy, and spectrum views.
- Blackbody radiation: Planck and Rayleigh–Jeans curves.
- Photoelectric effect: threshold, kinetic energy, and relative-intensity controls.
- de Broglie matter waves: energy-dependent electron wavelength.
- Hydrogen orbitals: normalized 1s, 2s, and 2p radial probability distributions.

Concept notes explicitly identify deferred interactive features. They are not experimental simulators. See the [implemented model specification](docs/03-physics/physical-model-specifications/IMPLEMENTED_MODELS.md) for scientific assumptions, conventions, and validation targets, and the [roadmap](docs/05-planning/ROADMAP.md) for remaining scope.

## Local development

Requires Node.js 22.12+ and npm. The UI is in Chinese with English scientific topic labels. No backend, account, or API key is needed.

```sh
npm ci
npm run dev
```

Open the printed loopback URL, normally `http://127.0.0.1:5173`. The development server binds only to the local machine. Nothing is published or pushed by these commands.

```sh
npm test          # Pure physics and knowledge-data checks
npm run build    # Strict TypeScript check and production bundle
npm run preview  # Inspect the built application locally
npm run test:e2e # Desktop and mobile Chromium interaction tests
npm run format:check # Check consistent source formatting
```

Browser tests use an installed Google Chrome (`channel: chrome`). If it is unavailable, install Chrome or change `playwright.config.ts` to use Playwright Chromium and run `npx playwright install chromium`. Screenshots are saved to ignored `artifacts/`; failed-test traces go to ignored `test-results/`.

Navigation uses hash routes (`#/part/2`, `#/topic/bohr`, `#/reference`) so direct topic links work without a server-side routing configuration. Parameter state is retained across workspace/immersive changes and view/panel switches; opening another topic starts that topic at its documented defaults. Animations start paused and respect reduced-motion settings.

## Source structure

```text
src/app/             Application shell, navigation, map, shared reference
src/content/         Course metadata, explanations, and conceptual links
src/features/        Knowledge workspace, parameters, readouts, details
src/visualizations/  SVG models, schematics, spectra, and probability plots
src/components/      Reusable chart presentation
src/physics/         SI constants and pure, independently tested calculations
src/styles/          Responsive editorial/laboratory design system
tests/               Desktop and mobile interaction tests
```

Physical constants are recorded from [NIST 2022 CODATA](https://physics.nist.gov/cuu/pdf/all.pdf). All charts use theoretical predictions; no measured experimental datasets are bundled. The Bohr calculation uses the infinite-nuclear-mass R∞ convention, so its vacuum wavelengths differ from measured air wavelengths. Radial orbital probability is distinguished from three-dimensional probability density.
