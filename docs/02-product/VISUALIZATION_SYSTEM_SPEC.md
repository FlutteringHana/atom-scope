# AtomScope — Visualization System Specification

> [!info] Document Status
> - Document Type: Visualization Specification
> - Status: Accepted
> - Version: 0.1
> - Last Updated: 2026-11-17

## 1. Purpose

This document defines the visualization categories and shared interaction principles used by AtomScope.

The three categories are **Model**, **Experiment**, and **Data**. They are content-oriented categories, not mutually exclusive page types. A single knowledge module may combine multiple categories.

## 2. Core Principle

A visualization is an interactive representation of a physical object, process, or quantitative relationship.

It must have a clear learning purpose and a documented physical basis. It should not be included merely for decoration.

A visualization may be:
- Interactive or primarily observational.
- Animated or static.
- Two-dimensional or three-dimensional where justified.
- A standalone view or part of a coordinated set of views.

## 3. Visualization Categories

### 3.1 Model Visualization

Purpose: help users understand the structure, assumptions, behavior, and mathematical relationships of a physical model.

Examples from the course scope:
- Thomson atomic model.
- Rutherford nuclear model.
- Bohr model.
- Hydrogen-like atomic systems.
- Bohr-Sommerfeld model.
- Matter-wave and standing-wave representations.
- Wave functions and atomic orbitals.

Common capabilities where relevant:
- Adjust model parameters.
- Select states or configurations.
- Inspect physical quantities.
- Show mathematical relationships.
- Compare model states.
- Display assumptions and limitations.

A model visualization must distinguish a schematic representation from a quantitatively scaled representation.

### 3.2 Experiment Visualization

Purpose: help users understand experimental apparatus, procedure, observations, and the relationship between evidence and theory.

Examples:
- Cathode ray experiment.
- Rutherford gold foil experiment.
- Blackbody radiation measurements.
- Photoelectric effect experiment.
- Hydrogen spectroscopy.
- Franck-Hertz experiment.
- Davisson-Germer experiment.

Common capabilities where relevant:
- Inspect or configure the apparatus.
- Adjust experimental parameters.
- Observe the process.
- Display measured or simulated observables.
- Compare observations with theoretical predictions.
- Explain what the experiment does and does not establish.

Always distinguish actual experimental data, published reference data, theoretical predictions, and simulation-generated data.

### 3.3 Data Visualization

Purpose: make quantitative relationships observable, comparable, and interpretable.

Examples:
- Blackbody spectral distributions.
- Energy-level diagrams.
- Atomic emission and absorption spectra.
- Scattering-angle distributions.
- Photoelectric current or kinetic-energy relationships.
- Franck-Hertz current-voltage curves.
- Radial probability distributions.

Common capabilities where relevant:
- Clearly labeled axes and units.
- Legends and series identification.
- Value inspection.
- Parameter-dependent updates.
- Comparison of multiple curves or data sets.
- Explicit distinction between measured and generated data.

## 4. Combined Visualizations

The categories may be combined within a knowledge module.

Examples:
- Rutherford: experiment apparatus + particle-scattering model + angular or trajectory data.
- Bohr model: atomic representation + energy-level diagram + transition information.
- Hydrogen spectroscopy: energy transitions + spectral-line display + wavelength data.
- Franck-Hertz: apparatus + collision process + collector-current curve.

The module should make the relationship between views clear. Where possible, views should share the same underlying physical state or parameter source rather than behaving as disconnected demonstrations.

## 5. Shared Visualization Experience

Where appropriate, visualizations should share:
- A title and concise purpose.
- Relevant parameter controls.
- Reset and playback controls when applicable.
- Displayed physical quantities with units.
- A way to inspect relevant values.
- Contextual information.
- Assumptions and limitations.
- A route to deeper Knowledge Details.

Do not add irrelevant controls to a visualization simply to make all modules look identical.

## 6. Interaction Principles

- User input should produce a physically meaningful change.
- Displayed values should update consistently with the visualization.
- Reset should restore a documented initial state.
- Playback controls should behave consistently.
- Simulation speed should not silently alter the physical model.
- Parameter ranges should respect the model's valid domain.
- Invalid or unsupported configurations should be prevented or clearly explained.
- A visualization should remain understandable without requiring the user to read a long article first.

## 7. Scientific Presentation Rules

Every quantitative visualization should:
- Identify plotted quantities.
- Display units.
- Use meaningful scales and labels.
- Distinguish data series.
- Avoid misleading axis ranges.
- State whether data are experimental, theoretical, or simulated.

Every physical model visualization should:
- Identify important assumptions.
- Explain whether geometry is schematic or to scale.
- Avoid presenting model constructs as literal reality when that is not justified.
- Distinguish classical orbits from quantum orbitals.

## 8. Implementation Guidance

The visualization system should be renderer-agnostic at the specification level.

Initial browser technologies:
- SVG for diagrams, energy levels, spectra, vectors, and many interactive 2D views.
- Canvas for particle-heavy or continuously updated scenes where it is beneficial.
- HTML/CSS for labels, controls, annotations, and layout.
- A charting library may be introduced when it materially reduces implementation effort without compromising scientific control.

Do not introduce a large 3D or physics engine before a specific visualization requires it.

## 9. Per-Visualization Specification

Before implementation, document:
1. Knowledge topic and learning purpose.
2. Category: Model, Experiment, Data, or combination.
3. Physical system and assumptions.
4. Inputs and valid parameter ranges.
5. Outputs and displayed quantities.
6. User interactions.
7. Mathematical/computational basis.
8. Expected qualitative behavior.
9. Validation references or tests.
10. Known limitations.

## 10. Deferred Capabilities

A full guided quiz, scoring, or assessment framework is deferred. Lightweight observation prompts may be included later if they arise naturally from a specific visualization, but they are not a required shared system in the initial release.

## 11. Rutherford Mathematical Exploration — 2026-11-17

The [imported development proposal](RUTHERFORD_SCATTERING_DEVELOPMENT_SPEC.md) motivates a specialized three-view composition: Geometry, Derivation, and Cross Section & Measurement. Shared parameter state and quantity IDs connect equation tokens, inspection controls, numerical values and matching graphics. This extends the visualization-first module pattern with mathematics as an active learning interface rather than long explanatory articles.

Geometry opens with a physically computed canvas and linked formula directly below it. Essential derivation steps are revealed one at a time, with optional intermediate algebra. Measurement equations sit beside the corresponding acceptance/curve/count representation. Native keyboard controls mirror clickable math tokens; non-color selection cues and reduced-motion support are required. Narrow-screen parameter/quantity controls use an expandable drawer near the view selector.

Scientific behavior, adopted defaults, head-on limits, cutoff and detector approximations are owned by the [Rutherford model](../03-physics/physical-model-specifications/RUTHERFORD_SCATTERING_MODEL.md) and [measurement](../03-physics/experiment-simulation-specifications/RUTHERFORD_MEASUREMENT.md) contracts. The source's advanced third derivation is a labelled preview, not a completed route.
