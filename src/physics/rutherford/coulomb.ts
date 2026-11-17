import { C, fromEV } from '../constants';
import type { OrbitPoint, RutherfordParams, RutherfordSolution } from './types';

export const FM = 1e-15;
export const BARN = 1e-28;
export const MEV = fromEV(1e6);
export const radians = (degrees: number) => (degrees * Math.PI) / 180;
export const degrees = (rad: number) => (rad * 180) / Math.PI;
export const magnitude = (v: { x: number; y: number }) => Math.hypot(v.x, v.y);
export function validateParams(p: RutherfordParams) {
  if (
    !Number.isFinite(p.energyMeV) ||
    p.energyMeV <= 0 ||
    !Number.isInteger(p.nuclearCharge) ||
    p.nuclearCharge <= 0 ||
    !Number.isFinite(p.impactFm) ||
    p.impactFm < 0
  )
    throw new RangeError('Require E > 0, integer Z > 0 and b ≥ 0');
}
export function invariants(p: RutherfordParams) {
  validateParams(p);
  const energyJ = p.energyMeV * MEV;
  const kappaJM = (2 * p.nuclearCharge * C.e ** 2) / (4 * Math.PI * C.epsilon0);
  const aM = kappaJM / (2 * energyJ);
  const impactM = p.impactFm * FM;
  const speedInfinityMS = Math.sqrt((2 * energyJ) / C.alphaMass);
  return {
    energyJ,
    kappaJM,
    kappaMeVFm: kappaJM / MEV / FM,
    aM,
    angleRad: 2 * Math.atan2(aM, impactM),
    closestM: aM + Math.hypot(aM, impactM),
    speedInfinityMS,
    angularMomentumJS: C.alphaMass * speedInfinityMS * impactM,
    eccentricity: Math.hypot(1, impactM / aM),
  };
}
/** Exact repulsive hyperbola, including the b=0 radial limit. Parameter u is not time. */
export function pointAtParameter(p: RutherfordParams, u: number): OrbitPoint {
  if (!Number.isFinite(u) || Math.abs(u) > 20)
    throw new RangeError('Finite orbit parameter |u| ≤ 20 required');
  const s = invariants(p);
  const q = (p.impactFm * FM) / s.aM,
    e = s.eccentricity;
  const sh = Math.sinh(u),
    ch = Math.cosh(u);
  const x = s.aM * (e + ch),
    y = s.aM * q * sh;
  const positionM = { x: (-x + q * y) / e, y: (q * x + y) / e };
  const radiusM = s.aM * (e * ch + 1);
  const duDT = s.speedInfinityMS / radiusM;
  const velocityMS = {
    x: ((s.aM * (-sh + q * q * ch)) / e) * duDT,
    y: ((s.aM * q * (sh + ch)) / e) * duDT,
  };
  const forceN = {
    x: (s.kappaJM * positionM.x) / radiusM ** 3,
    y: (s.kappaJM * positionM.y) / radiusM ** 3,
  };
  return {
    positionM,
    velocityMS,
    forceN,
    radiusM,
    polarRad: Math.atan2(positionM.y, positionM.x),
    timeS: (s.aM / s.speedInfinityMS) * (e * sh + u),
    orbitParameter: u,
  };
}
export function solveRutherford(p: RutherfordParams): RutherfordSolution {
  const s = invariants(p);
  const edgeM = Math.max(s.closestM * 4, p.impactFm * FM * 4, 300 * FM);
  const maxOrbitParameter = Math.acosh((edgeM / s.aM - 1) / s.eccentricity);
  const trajectory = Array.from({ length: 241 }, (_, i) =>
    pointAtParameter(p, maxOrbitParameter * (i / 120 - 1)),
  );
  return { params: { ...p }, ...s, maxOrbitParameter, trajectory };
}
export function effectivePotentialJ(radiusM: number, p: RutherfordParams) {
  if (!Number.isFinite(radiusM) || radiusM <= 0) throw new RangeError('r > 0 required');
  const s = invariants(p);
  return s.kappaJM / radiusM + s.angularMomentumJS ** 2 / (2 * C.alphaMass * radiusM ** 2);
}
export function impactAtAngleM(theta: number, p: RutherfordParams) {
  if (!Number.isFinite(theta) || theta <= 0 || theta > Math.PI)
    throw new RangeError('Require 0 < θ ≤ π; unscreened θ=0 diverges');
  return theta === Math.PI ? 0 : invariants(p).aM / Math.tan(theta / 2);
}
