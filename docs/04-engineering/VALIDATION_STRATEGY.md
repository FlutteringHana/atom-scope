# AtomScope — Validation Strategy

> [!info] Document Status
> - Document Type: Verification and Validation Specification
> - Status: Accepted
> - Version: 0.1
> - Last Updated: 2026-11-17

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

## 8. Rutherford Extension Validation — 2026-11-17

- `src/physics/rutherford/model.test.ts` adds 21 tests; the full unit suite contains 43 tests. Numeric targets include a≈22.7514 fm, θ=90° at b=a, rmin≈53.0438 fm at b=20 fm, 5.17628 barn/sr at 90°, the exact 60°/120° ratio 9, and E⁻²/Z² scaling.
- Verify analytical velocity against finite-difference position/time, acceleration against F/m, total E and signed Lz along several orbits including b=0, polar-orbit equivalence, and asymptotic velocity directions. No numerical integration engine or solver accuracy is claimed.
- Compare the finite ring cross section with 20,000-point independent quadrature and the differential Jacobian with a finite difference of b(θ). Check SI area conversions, efficiency/count boundaries, explicit cutoff and rejection of failed thin-target/local-patch regimes.
- Seeded Poisson tests compare empirical mean/variance at λ=2,50,1000 using 20,000 samples each. Conditional sampling tests check uniformity in b² rather than b.
- `tests/rutherford.spec.ts` adds six scenarios run on desktop and mobile (12 new browser tests; full suite 24). These cover linked quantities, both complete core derivations and expanded algebra, route/parameter preservation, sampling, acceptance modes, invalid inputs, keyboard controls, reduced motion, immersive pinning and responsive overflow. Generated screenshots cover all three views.
- Reference conventions and the fixed-target versus CM distinction are recorded in the adopted model contract. The original proposal's review-draft status is preserved. Third-route verification remains pending its reference source.
- Layout checks additionally cover 320 px and 768 px widths. A production `/atom-scope/` smoke check verifies the lazy module, bundled KaTeX fonts, radial derivation, detector expectation, and reference navigation without failed assets. No push/deployment is needed for this local verification.

## 9. Presentation and Navigation Controls — 2026-11-17

The current UI calls the display mode Presentation Mode / 演示模式. `tests/navigation.spec.ts` adds desktop/mobile scenarios for collapse/restore, reclaimed layout width, unchanged parameters, independent presentation switching, persistence across routes, responsive directory behavior and keyboard restoration. The existing 24 browser scenarios continue to cover the renamed mode and other modules; the combined suite now contains 26 scenarios. Screenshots additionally review expanded, collapsed and presentation layouts.
