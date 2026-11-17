# Rutherford cross sections and measurement

> - Document Type: Experiment Simulation Specification
> - Status: Accepted
> - Version: 0.1
> - Last Updated: 2026-11-17

Uses the [fixed-target Rutherford model](../physical-model-specifications/RUTHERFORD_SCATTERING_MODEL.md). All data are theoretical predictions or explicitly labelled synthetic samples; no historical measurements are bundled.

- Full-azimuth ring: 0<θ₁<θ₂≤π; σbin=π[b(θ₁)²−b(θ₂)²]; ΔΩ=2π(cosθ₁−cosθ₂). The incoming annulus is an area, the outgoing band represents solid angle on the sphere. Both are projections, with units visible.
- Small patch: σaccept≈(dσ/dΩ)(θc)ΔΩ, labelled a small-acceptance approximation and drawn as a local cap, not a full ring. For an equivalent circular cap δ=acos(1−ΔΩ/(2π)), require δ≤5° and δ≤0.2min(θc,π−θc). These are conservative UI approximation gates, not universal physical cutoffs.
- Explicit θmin=10° default; chart and conditional sampling cover θmin..180°. Bins/patches must stay inside this range. Invalid bounds produce visible messages and unavailable quantities, not clamped probabilities or Infinity.
- Thin-target teaching gate: τ=nₜσ(θmin..π)≤0.05. Above it, retain finite cross-section results but suppress probability, expected counts and stochastic observations. This cutoff-conditioned gate does not establish that all forward scattering is rare; screening and multiple small-angle deflections remain unmodelled.
- Pbin≈nₜσaccept; expected detected count=N₀Pbinη. Defaults nₜ=1e22 nuclei/m², N₀=1e7, η=1, ring 60°..70°. nₜ and N₀ are direct inputs; do not invent a foil material/thickness calibration.
- Synthetic detected count: seeded Poisson draw with the theoretical expectation; valid only for the rare independent event limit. Knuth inversion for small means and Hörmann PTRS rejection for large means; no unlabelled normal approximation. Re-sampling changes the seed only. Reference algorithm: [NumPy distribution implementation](https://github.com/numpy/numpy/blob/main/numpy/random/src/distributions/distributions.c).
- Representative histogram: 300 events conditioned on θ≥θmin; draw b=bmax√U with bmax=b(θmin). Bars are representative event counts, with their own count axis and normalized theoretical bin expectation, never literal one-for-one rendering of N₀ or barn/sr. This is separate from the Poisson detector count.

Tests cover exact integral versus independent quadrature, area-weighted sampling, E⁻² and Z² scaling, zero intensity/efficiency/count, deterministic seeds, empirical Poisson mean/variance, invalid domains and thin-target rejection.
