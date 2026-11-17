# Rutherford scattering — implementation contract

> - Document Type: Physics / Feature Specification
> - Status: Accepted for the implementation scope below
> - Version: 0.1
> - Last Updated: 2026-11-17
> - Source: [User-supplied development proposal](../../02-product/RUTHERFORD_SCATTERING_DEVELOPMENT_SPEC.md), retained verbatim as a review draft

## Scope and adopted decisions

Implement P0–P3: exact geometry and quantity inspection, vector and radial derivation routes, differential/finite-bin cross sections, and thin-target counting. Use the existing React/SVG shell, a specialized Rutherford workspace, and KaTeX for equations. Essential steps appear individually with optional algebra explanations. The advanced analytical-mechanics route remains a labelled conceptual preview, pending the specific derivation; it is not claimed complete. No 3D apparatus, recoil, screened potential, nuclear force, or quantum-scattering engine is introduced.

The draft's suggested folder tree and API are design suggestions. Computation lives in `src/physics/rutherford`, educational steps in `src/content/rutherfordDerivations.ts`, and views in `src/features/rutherford`. The public route remains `#/topic/rutherford`. All views share one parameter state. Energy at infinity E=5 MeV, Z=79, b=40 fm are defaults; UI trial ranges E=2–10 MeV, integer Z=20–90, b=0–200 fm are not validity bounds.

## Model and coordinate convention

Fixed point target, alpha charge z=2, mass 6.644657345e-27 kg from [NIST CODATA 2022](https://physics.nist.gov/cuu/pdf/all.pdf). Incoming velocity is +x, incoming asymptote y=b≥0, counterclockwise polar position angle φ decreases; signed Lz is negative, while displayed L is its magnitude. θ is between asymptotic velocity directions and differs from live φ.

All mechanical computations are SI. Explicit constants convert MeV, fm, barn (1 barn=1e-28 m²=100 fm²). κ=2Ze²/(4πε₀), a=κ/(2E), θ=2atan2(a,b), rmin=a+√(a²+b²). Head-on b=0 has θ=π and a separate radial limit, with no division by b.

The renderer uses the equivalent stable hyperbolic parameterization rather than sampling the divergent polar endpoints. With q=b/a, ε=√(1+q²), X=a(ε+cosh u), Y=aq sinh u, set x=(-X+qY)/ε, y=(qX+Y)/ε. Then r=a(ε cosh u+1), t=(a/v∞)(ε sinh u+u), dt/du=r/v∞. Analytical derivatives give tangent velocity and radially outward force κr/r³. The scrubber is explicitly an orbit parameter, not uniform physical time. The viewport rescales with the computed geometry; both spatial axes use equal scale. Vector arrows are direction indicators labelled not to scale, with numeric SI magnitudes in the inspector.

The incoming/outgoing asymptotes obey y=b and x sinθ−y cosθ=−b. An angle guide shows translated velocity directions, not an angle between arbitrary position vectors. Position, force, velocity, b and rmin overlays use the same computed points as readouts. Selections are persistent, keyboard-accessible and non-color-only; pinned values are snapshots.

## Derivation routes

Vector route: Newton/Coulomb → dt=−mr²dφ/L → cancellation of r² → integrate both Cartesian components → match v∞(cosθ−1,sinθ) → tan(θ/2)=κ/(2Eb). The hodograph and accumulated velocity change use exact computed velocities; ∆v is referenced to the asymptotic incoming velocity.

Radial route: E=mṙ²/2+Veff, Veff=κ/r+L²/(2mr²) → turning point → outgoing radial integral → u=1/r → Φ=atan(b/a), θ=π−2Φ. An effective-potential chart shares E, L and rmin. The integrable square-root singularity at the turning point is explained, not sampled as a finite value. At b=0, transformations dividing by L are unavailable; the head-on limit is explicitly explained.

## Cross section, measurement and validation

The exact Jacobian, Rutherford sin⁻⁴ law, finite ring integral, area/solid-angle mapping, and all numerical acceptance targets follow §§3.4–3.6 and §10 of the source draft. The contract for counts and random samples is [Rutherford measurement](../experiment-simulation-specifications/RUTHERFORD_MEASUREMENT.md). Independent checks use [NUS §§9.3,9.6,9.8,9.10](https://phyweb.physics.nus.edu.sg/pc3232/restricted/docs/particle-matter-interactions/radiation-matter_01_cross-sections.html) and [MSU PHY321 central-force/scattering notes](https://mhjensen.github.io/Physics321/doc/LectureNotes/_build/html/chapter6.html). These references sometimes use CM variables; our heavy fixed target is the explicitly stated limit, not a silent LAB/CM conversion.

Unit tests check numerical targets, finite-difference velocity/acceleration, energy/angular momentum conservation, asymptotic directions, inverse mappings, independent cross-section quadrature, and seeded counting statistics. Interaction tests check highlights, both derivations, preserved state, detector modes, warnings, reduced motion and mobile layout.
