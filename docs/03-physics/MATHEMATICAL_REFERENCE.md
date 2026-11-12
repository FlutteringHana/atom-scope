# AtomScope — Mathematical Reference

> [!info] Document Status
> - Document Type: Mathematical Reference
> - Status: Accepted
> - Version: 0.1
> - Last Updated: 2026-11-11

## 1. Purpose

This document is the central index for mathematical notation, shared constants, units, and canonical equations used by AtomScope.

It is not a replacement for topic-specific physical derivations. Detailed assumptions and derivations belong in the relevant physics specification.

## 2. Ownership Rules

- Course-level topic coverage is defined by the Physics Knowledge Architecture.
- Shared symbols, units, and constants are registered here.
- Topic-specific equations and assumptions are defined in their Physics Specifications.
- This document may index equations from those specifications, but should not create conflicting duplicate definitions.

## 3. Unit and Notation Policy

Initial conventions:
- Use SI units internally for physical computation unless a documented numerical reason requires another representation.
- Convert to learner-friendly units such as eV and nm for display where appropriate.
- Display units alongside physical quantities.
- Use radians internally for angular calculations; convert for display when useful.
- Distinguish symbols that are reused with different meanings in different contexts.
- State whether a displayed value is exact, defined, measured, rounded, or approximate.

These conventions should be reviewed when the first computational modules are implemented.

## 4. Shared Constants Registry

The initial implementation uses [NIST 2022 CODATA](https://physics.nist.gov/cuu/pdf/all.pdf). Canonical numerical values are centralized in `src/physics/constants.ts` and also shown in the application's mathematical reference. Shared numerical precision and model conventions are documented in [Implemented Models](physical-model-specifications/IMPLEMENTED_MODELS.md).

| Constant | Symbol | SI unit | Notes |
|---|---|---|---|
| Elementary charge | e | C | Charge magnitude |
| Planck constant | h | J·s | |
| Reduced Planck constant | ℏ | J·s | h / 2π |
| Speed of light in vacuum | c | m·s⁻¹ | |
| Electron mass | mₑ | kg | |
| Vacuum permittivity | ε₀ | F·m⁻¹ | |
| Bohr radius | a₀ | m | |
| Rydberg constant | R∞ / R_H | m⁻¹ | Specify convention used |

The initial Bohr implementation uses R∞ = 10973731.568157 m⁻¹ (infinite nuclear mass), with energy computed as −hcR∞Z²/n². The course's −13.6 eV coefficient is the rounded form. Finite-mass R_H and measured air wavelengths are not used. Boltzmann's constant k_B = 1.380649e-23 J·K⁻¹ (exact) and Wien's displacement constant b = 2.897771955e-3 m·K are additionally used by the blackbody module.

## 5. Equation Index

This index follows the course knowledge structure. Full derivations and applicability conditions belong in topic-specific documents.

### Atomic Structure and Nuclear Model
- Coulomb's law.
- Classical particle dynamics.
- Rutherford scattering relationships.

### Quantization and Atomic Energy States
- Planck energy quantization.
- Photon energy.
- Photoelectric equation.
- Bohr angular momentum quantization.
- Hydrogen and hydrogen-like energy levels.
- Bohr radii.
- Atomic transition energy.
- Photon frequency and wavelength.
- Rydberg formula.

### Introduction to Quantum Mechanics
- de Broglie wavelength.
- Probability density.
- Wave-function normalization.
- Time-dependent Schrödinger equation.
- Time-independent Schrödinger equation.
- Non-relativistic Hamiltonian for a particle in a potential.

## 6. Equation Record Template

Use this structure when adding a canonical equation:

```markdown
### [Equation Name]

- Knowledge topic:
- Equation:
- Symbol definitions:
- Units:
- Assumptions:
- Validity conditions:
- Physical interpretation:
- Source / reference:
- Implemented in:
- Validation test:
```

## 7. Constants and Numerical Precision

Before a constant is used in production calculations:
- Record its source.
- Record the value and unit.
- Record the chosen precision.
- Avoid multiple hard-coded copies across modules.
- Test unit conversions independently.

Displayed precision should reflect the educational purpose and should not imply unsupported experimental accuracy.
