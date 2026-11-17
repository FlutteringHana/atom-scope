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

The first local application is implemented. It includes all three Parts, 17 topic entries, nine interactive modules built on six independently tested physics engines, eight concept-note modules, knowledge relationships, and a shared workspace with a presentation mode.

Interactive modules:
- Rutherford scattering: exact trajectories/vectors, linked quantity inspection, vector-impulse and radial derivations, cross sections, and seeded thin-target detector counts.
- Bohr atom, hydrogen-like ions, atomic transitions, and spectroscopy: coordinated atom, energy, and spectrum views.
- Blackbody radiation: Planck and Rayleigh–Jeans curves.
- Photoelectric effect: threshold, kinetic energy, and relative-intensity controls.
- de Broglie matter waves: energy-dependent electron wavelength.
- Hydrogen orbitals: normalized 1s, 2s, and 2p radial probability distributions.

Concept notes explicitly identify deferred interactive features. They are not experimental simulators. See the [implemented model specification](docs/03-physics/physical-model-specifications/IMPLEMENTED_MODELS.md) for scientific assumptions, conventions, and validation targets, and the [roadmap](docs/05-planning/ROADMAP.md) for remaining scope.

### Rutherford mathematical exploration

Open `#/topic/rutherford` for three synchronized views: **Geometry**, **Derivation**, and **Cross Section & Measurement**. They share E, Z and b. Click an equation symbol or a diagram quantity to inspect its definition, computed value and unit; use the equivalent keyboard buttons below equations. Drag the incident line, scrub the exact orbit, toggle vectors, and pin a numeric snapshot. Presentation mode preserves state; narrow screens expose controls in a collapsible top drawer.

The vector route integrates both velocity components with the correct sign of polar-angle change. The radial route includes effective potential, turning point and integral evaluation. A method-comparison table connects their premises and results. The advanced analytical-mechanics route is explicitly a preview pending the specific reference.

Measurement distinguishes exact full-azimuth ring integration from a small-patch approximation, theoretical detector expectations from seeded Poisson observations, and a separate 300-event conditional histogram from the actual incident particle count. Invalid angle bounds and failed thin-target conditions suppress probability and count outputs rather than clamping them.

The supplied [development proposal](docs/02-product/RUTHERFORD_SCATTERING_DEVELOPMENT_SPEC.md) is retained verbatim as a review draft. Adopted choices and authoritative assumptions are in the [Rutherford model contract](docs/03-physics/physical-model-specifications/RUTHERFORD_SCATTERING_MODEL.md) and [measurement contract](docs/03-physics/experiment-simulation-specifications/RUTHERFORD_MEASUREMENT.md).

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

Navigation uses hash routes (`#/part/2`, `#/topic/bohr`, `#/reference`) so direct topic links work without a server-side routing configuration. Parameter state is retained across workspace/presentation changes and view/panel switches; opening another topic starts that topic at its documented defaults. Animations start paused and respect reduced-motion settings.

The desktop header's leftmost button collapses or restores the course navigation, allowing more room for the active visualization without resetting its parameters. This choice is retained while navigating within the app. The module's **Presentation Mode / 演示模式** independently hides its controls and deeper-reading area; use the visible return button or Escape to return to the workspace. Mobile uses the existing directory drawer.

## GitHub Pages deployment

The repository includes [a GitHub Actions workflow](.github/workflows/pages.yml) that validates formatting, runs unit tests, builds `dist/`, and deploys it to GitHub Pages on pushes to `main`. It can also be run manually from the Actions tab. Deployment uses the built-in `GITHUB_TOKEN` with job-specific permissions; no personal token or `gh-pages` branch is required.

In [repository Settings → Pages](https://github.com/FlutteringHana/atom-scope/settings/pages), set **Build and deployment → Source → GitHub Actions** before the first run. The workflow reads the site's actual base path from `configure-pages`, so project paths and a future custom domain use the correct asset URLs. Local development continues to use `/`.

To verify the project path locally in PowerShell:

```powershell
$env:VITE_BASE_PATH = '/atom-scope/'
npm run build
npm run preview
# Open http://127.0.0.1:4173/atom-scope/
# Remove-Item Env:VITE_BASE_PATH when finished
```

Workflow status is available on the [Actions page](https://github.com/FlutteringHana/atom-scope/actions/workflows/pages.yml). A successful deployment reports the final site URL in the `github-pages` environment.

## Source structure

```text
src/app/             Application shell, navigation, map, shared reference
src/content/         Course metadata, explanations, and conceptual links
src/features/        Knowledge workspace, parameters, readouts, details
src/visualizations/  SVG models, schematics, spectra, and probability plots
src/components/      Reusable chart presentation
src/physics/         SI constants and pure, independently tested calculations
src/physics/rutherford/ Exact Coulomb motion, cross sections and counting statistics
src/features/rutherford/ Specialized coordinated learning workspace (loaded on demand)
src/styles/          Responsive editorial/laboratory design system
tests/               Desktop and mobile interaction tests
```

Physical constants are recorded from [NIST 2022 CODATA](https://physics.nist.gov/cuu/pdf/all.pdf). All charts use theoretical predictions; no measured experimental datasets are bundled. The Bohr calculation uses the infinite-nuclear-mass R∞ convention, so its vacuum wavelengths differ from measured air wavelengths. Radial orbital probability is distinguished from three-dimensional probability density.
