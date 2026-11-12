# AtomScope — Validation Strategy

> [!info] Document Status
> - Document Type: Verification and Validation Specification
> - Status: Accepted
> - Version: 0.1
> - Last Updated: 2026-11-11

## 1. Purpose

AtomScope must validate both software behavior and physical correctness. A visualization that renders smoothly is not necessarily scientifically correct.

## 2. Validation Layers

### 2.1 Mathematical Unit Tests

Test pure functions independently of the UI:
- Formula implementation.
- Unit conversions.
- Boundary conditions.
- Expected numerical values.
- Invalid input handling.

### 2.2 Physical Model Validation

Check whether the implemented model follows its stated assumptions and governing equations.

Examples:
- Verify energy-level calculations against the relevant model.
- Verify hydrogen-like scaling relationships.
- Verify transition energy and wavelength consistency.
- Verify the expected qualitative behavior of a scattering model.

### 2.3 Numerical Validation

For numerical solvers:
- Compare with analytical solutions where available.
- Check convergence as step size changes.
- Check conservation laws where applicable.
- Document numerical tolerances.
- Test extreme but valid parameter values.
- Identify regimes where the numerical method becomes unreliable.

### 2.4 Visualization Validation

Check that:
- Displayed values match computed values.
- Labels and units are correct.
- Axes and scales are not misleading.
- Model assumptions are discoverable.
- Data provenance is identified.
- Visual states correspond to the underlying simulation state.

### 2.5 Integration and Interaction Testing

Check:
- Controls update the correct visualization.
- Related views remain synchronized.
- Workspace / immersive switching preserves state where required.
- Side-panel changes do not reset the simulation unexpectedly.
- Reset and playback controls behave consistently.
- Navigation preserves the correct knowledge context.

## 3. Scientific Data Provenance

Every plotted or displayed data set should be identifiable as one of:
- Experimental measurement.
- Published reference data.
- Theoretical prediction.
- Simulation-generated data.
- Illustrative or schematic data.

Do not present illustrative data as experimental evidence.

## 4. Topic Validation Examples

| Topic | Candidate validation |
|---|---|
| Rutherford scattering | Compare numerical trajectory/scattering angle with analytical results under the same assumptions; inspect energy and angular momentum behavior |
| Bohr hydrogen | Compare energy and radius calculations with the specified Bohr relationships |
| Hydrogen-like systems | Check nuclear-charge scaling |
| Atomic transitions | Check energy conservation between atomic transition and photon |
| Hydrogen spectrum | Compare selected wavelengths with trusted reference values and declared convention |
| Blackbody radiation | Check limiting behavior and curve response against the implemented laws |
| Photoelectric effect | Check threshold and energy relationships |
| Franck-Hertz | Check the relationship between excitation energy and observable curve features |
| de Broglie waves | Check wavelength-momentum relationship |
| Wave functions | Check normalization and probability-density calculations for supported states |
| Atomic orbitals | Check probability and nodal properties against the chosen solutions |

These are validation directions, not a claim that every module is already implemented or validated.

## 5. Acceptance Requirements

A physics feature should not be considered complete until:
- Its model assumptions are documented.
- Its equations and units are reviewed.
- Core calculation tests pass.
- Relevant analytical or reference comparisons are recorded.
- The visualization displays the intended physical meaning.
- Known limitations are documented.

## 6. Test Organization

Keep tests close to the relevant physics modules or in a dedicated test directory, depending on project scale.

Prioritize testing pure physics calculations before UI-level tests. UI tests cannot substitute for mathematical validation.

## 7. Initial Validation Record — 2026-11-11

- `npm test`: 22 passing checks across physical calculations, invalid inputs, constants/units, and knowledge-link integrity.
- `npm run build`: strict TypeScript checking and production bundle generation.
- `npm run test:e2e`: six interaction scenarios on both desktop and mobile Chrome, 12 passing browser tests. Includes all 17 topic routes, parameter readouts, synchronized views, workspace/immersive preservation, reset, playback, reduced motion, keyboard access, search/filtering, relationships, and horizontal-overflow checks.
- Desktop and mobile full-page screenshots cover the knowledge map and Bohr workspace. Additional desktop captures cover scattering, blackbody, photoelectric, matter-wave and orbital views. These were visually reviewed for labels, scales, clipping and layout. Generated artifacts are ignored by Git.
- Wavelength comparisons use the explicitly declared infinite-mass, vacuum convention. Theoretical curves are not validated against experimental datasets because none are bundled.
- Rutherford validation compares the analytical hyperbola with its closest approach and asymptote, rather than claiming numerical integration/conservation checks for a solver that is not used.
- Radial normalization is integrated to 100 a₀; the display intentionally ends at 20 a₀.

These checks establish the initial educational implementation. A full accessibility conformance audit and lecture-note review are not yet claimed.
