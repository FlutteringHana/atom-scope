import type { RutherfordParams } from './types';
import { BARN, impactAtAngleM, invariants } from './coulomb';

export function differentialCrossSectionBarnPerSr(theta: number, p: RutherfordParams) {
  impactAtAngleM(theta, p); // Validate the angular domain, including the finite θ=π limit.
  return invariants(p).aM ** 2 / (4 * Math.sin(theta / 2) ** 4) / BARN;
}
export function ringBinCrossSectionBarn(lower: number, upper: number, p: RutherfordParams) {
  if (lower >= upper) throw new RangeError('Require 0 < θ₁ < θ₂ ≤ π');
  const b1 = impactAtAngleM(lower, p),
    b2 = impactAtAngleM(upper, p);
  return (Math.PI * (b1 - b2) * (b1 + b2)) / BARN;
}
export function ringSolidAngleSr(lower: number, upper: number) {
  if (
    !Number.isFinite(lower) ||
    !Number.isFinite(upper) ||
    lower <= 0 ||
    lower >= upper ||
    upper > Math.PI
  )
    throw new RangeError('Invalid angular bin');
  return 2 * Math.PI * (Math.cos(lower) - Math.cos(upper));
}
