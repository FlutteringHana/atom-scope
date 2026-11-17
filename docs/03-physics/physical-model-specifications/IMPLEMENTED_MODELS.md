# Implemented educational models

> - Document Type: Physics Specification
> - Status: Accepted
> - Version: 0.1
> - Last Updated: 2026-11-17
> - Scope: Implemented educational models

All output is theoretical prediction unless explicitly marked schematic or synthetic. There are no experimental measurements bundled with the application. Shared calculations live in `src/physics/models.ts`; specialized Rutherford calculations and tests live in `src/physics/rutherford/`. SI is used internally; eV, MeV, nm, fm and barn are explicit boundary conversions.

## Constants

Use the [NIST 2022 CODATA table](https://physics.nist.gov/cuu/pdf/all.pdf): h = 6.62607015e-34 J s, c = 299792458 m/s, e = 1.602176634e-19 C, k_B = 1.380649e-23 J/K (exact SI definitions); m_e = 9.1093837139e-31 kg, a_0 = 5.29177210544e-11 m, R_infinity = 10973731.568157 m^-1, epsilon_0 = 8.8541878188e-12 F/m. Precision on screen is intentionally lower.

## Bohr and hydrogen-like systems / transitions / spectroscopy

- Inputs: integer Z = 1..3; initial/final n = 1..6, distinct for a transition.
- E_n = -hc R_infinity Z²/n² (joules); r_n = a_0 n²/Z (metres).
- Delta E = E_final - E_initial; photon energy = |Delta E|; lambda = hc/|Delta E| in vacuum. Downward transitions emit; upward transitions absorb.
- Infinite nuclear mass, nonrelativistic one-electron Coulomb system; no fine structure, selection rules, recoil, line intensities, or lifetimes. The n-only diagram cannot establish electric-dipole allowedness.
- Orbit display has radius proportional to n/√Z (a square-root compression of n²/Z), explicitly marked schematic. Energy chart uses a true linear energy scale. Spectra show a fixed final state for emission and fixed initial state for absorption; selecting a line updates the coordinated state pair.
- Animation is pausable and illustrative; its speed is unrelated to physical orbital frequency. A transition is selected as a state pair; animation does not change energy or transition state.
- Spectral lines are theoretical monochromatic vacuum wavelengths. Nonvisible lines are marked UV/IR without an invented visible color. Line height is schematic, not intensity.
- Tests: E1 near -13.6057 eV, a0, Z² and 1/Z scaling, reciprocal emission/absorption, Balmer 3→2 near 656.112 nm under the declared infinite-mass convention (not measured air H-alpha).

## Rutherford scattering

The authoritative equations, coordinate convention and numerical contracts are now in [Rutherford Scattering Model](RUTHERFORD_SCATTERING_MODEL.md); counting and acceptance are in [Rutherford Measurement](../experiment-simulation-specifications/RUTHERFORD_MEASUREMENT.md). The earlier apparatus/deflection demonstration is replaced by three coordinated geometry, derivation and cross-section views. Legacy SI helpers delegate to the same new physics core.

Defaults E=5 MeV, Z=79, b=40 fm; UI ranges E=2–10 MeV, Z=20–90, b=0–200 fm. The fixed-point-nucleus approximation is unchanged. Alpha mass is centralized in `src/physics/constants.ts`. Exact mechanical vectors, finite ring cross sections, explicitly approximate local patches and seeded Poisson counts are implemented; measured datasets, screening, recoil and multiple scattering remain excluded.

## Blackbody radiation

- Inputs: temperature 2500..9000 K, wavelengths 100..2500 nm.
- B_lambda = (2hc²/lambda^5)/(exp(hc/(lambda k_B T))-1), SI W sr^-1 m^-3. Display per micrometre by multiplying by 1e-6.
- Ideal equilibrium blackbody, emissivity 1. No apparatus or empirical measurements. Peak lambda = b/T, b = 2.897771955e-3 m K.
- Compare against Rayleigh–Jeans B_lambda = 2 c k_B T/lambda^4, dashed. The plot clips values above its labelled y limit rather than renormalizing the classical curve.
- Tests: Wien peak, temperature dependence, long-wavelength classical limit, finite nonnegative output.

## Photoelectric effect

- Inputs: wavelength 200..800 nm, work function 1.5..5.5 eV, relative intensity 0..100%.
- K_max = hc/lambda - phi when positive. At and below threshold there are no positive-energy emitted electrons. Stopping voltage in V is numerically K_max in eV.
- Ideal single-photon model. Intensity controls a schematic relative emission rate only, not K_max. No current calibration, material spectral response, thermal effects, or space charge.
- Tests: threshold/no emission, photon-energy conservation, intensity-independent K_max, emission direction versus photon energy.

## Matter waves

- Inputs: electron kinetic energy 10..200 eV.
- p = sqrt(2 m_e E); lambda = h/p. Nonrelativistic free electron; displayed sinusoid is a real-component phase illustration, not a localized electron or a probability-density plot. At most 200 eV, relativistic correction is small.
- Tests: 150 eV gives approximately 0.10014 nm; inverse square-root energy scaling.

## Hydrogen radial probability

- Inputs: hydrogen 1s, 2s or 2p; r = 0..20 a0.
- With x = r/a0, plot dimensionless a0 P(r), where P(r) = r² |R_nl(r)|², probability per unit radial length integrated over solid angle.
- a0 P_1s = 4x² exp(-2x); a0 P_2s = x²(2-x)² exp(-x)/8; a0 P_2p = x^4 exp(-x)/24.
- These are normalized analytic nonrelativistic Coulomb eigenfunctions. No spatial orbital shapes or angular densities are claimed. 2p radial distribution is independent of magnetic quantum number. Finite plotting domain omits a small tail; normalization tests integrate to 100 a0.
- Tests: integral equals one within 1e-6, 2s radial node at 2 a0, 1s maximum at a0, nonnegative probability.

## Content-only topics

Electron discovery, Thomson model, classical instability, Bohr–Sommerfeld, Franck–Hertz, wave-particle duality, wave functions and Schrödinger equation have structured explanatory pages, equations and related links. Dedicated interactive experiments/solvers for those topics are deferred. Bohr–Sommerfeld mathematical depth remains subject to the course-material clarification already recorded in the knowledge architecture.
