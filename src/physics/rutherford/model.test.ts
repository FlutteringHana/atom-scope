import { describe, expect, it } from 'vitest';
import { C } from '../constants';
import {
  BARN,
  FM,
  MEV,
  degrees,
  effectivePotentialJ,
  impactAtAngleM,
  invariants,
  magnitude,
  pointAtParameter,
  radians,
  solveRutherford,
} from './coulomb';
import {
  differentialCrossSectionBarnPerSr as differential,
  ringBinCrossSectionBarn as ring,
  ringSolidAngleSr,
} from './crossSection';
import {
  conditionalEvents,
  measurementDefaults,
  predictMeasurement,
  samplePoisson,
  seededRandom,
} from './experiment';

const gold = { energyMeV: 5, nuclearCharge: 79, impactFm: 40 };
describe('Rutherford numeric reference cases and boundaries', () => {
  it('matches the supplied gold/alpha acceptance values', () => {
    const s = invariants(gold);
    expect(s.aM / FM).toBeCloseTo(22.7514, 4);
    expect(degrees(invariants({ ...gold, impactFm: s.aM / FM }).angleRad)).toBeCloseTo(90, 12);
    expect(invariants({ ...gold, impactFm: 20 }).closestM / FM).toBeCloseTo(53.0438, 4);
    expect(differential(Math.PI / 2, gold)).toBeCloseTo(5.17628, 5);
    expect(differential(radians(60), gold) / differential(radians(120), gold)).toBeCloseTo(9, 12);
  });
  it('handles the head-on radial turning point without NaN', () => {
    const p = { ...gold, impactFm: 0 },
      s = solveRutherford(p),
      atTurn = pointAtParameter(p, 0);
    expect(s.angleRad).toBe(Math.PI);
    expect(s.closestM).toBe(2 * s.aM);
    expect(magnitude(atTurn.velocityMS)).toBe(0);
    expect(atTurn.positionM.y).toBe(0);
    expect(atTurn.forceN.x).toBeLessThan(0);
    expect(s.trajectory.every((t) => Number.isFinite(t.timeS))).toBe(true);
  });
  it('inverts b ↔ θ and respects E and Z scaling', () => {
    for (const angle of [1, 30, 60, 90, 170, 180]) {
      const theta = radians(angle),
        b = impactAtAngleM(theta, gold) / FM;
      expect(invariants({ ...gold, impactFm: b }).angleRad).toBeCloseTo(theta, 12);
    }
    expect(differential(1, { ...gold, energyMeV: 10 }) / differential(1, gold)).toBeCloseTo(
      0.25,
      12,
    );
    expect(differential(1, { ...gold, nuclearCharge: 158 }) / differential(1, gold)).toBeCloseTo(
      4,
      12,
    );
  });
  it('rejects nonphysical input and divergent endpoints', () => {
    for (const value of [0, -1, NaN, Infinity])
      expect(() => solveRutherford({ ...gold, energyMeV: value })).toThrow();
    expect(() => solveRutherford({ ...gold, impactFm: -1 })).toThrow();
    expect(() => solveRutherford({ ...gold, nuclearCharge: 79.5 })).toThrow();
    for (const angle of [0, -1, Math.PI + 0.01, Infinity])
      expect(() => differential(angle, gold)).toThrow();
    expect(() => ring(1, 0.5, gold)).toThrow();
    expect(() => effectivePotentialJ(0, gold)).toThrow();
  });
});
describe('exact hyperbola, vectors and conserved quantities', () => {
  for (const b of [0, 1, 20, 200])
    it(`conserves E and signed L for b=${b} fm`, () => {
      const p = { ...gold, impactFm: b },
        s = solveRutherford(p);
      for (const t of s.trajectory) {
        const kinetic = 0.5 * C.alphaMass * magnitude(t.velocityMS) ** 2;
        expect((kinetic + s.kappaJM / t.radiusM) / s.energyJ).toBeCloseTo(1, 11);
        const signedL =
          C.alphaMass * (t.positionM.x * t.velocityMS.y - t.positionM.y * t.velocityMS.x);
        expect((signedL + s.angularMomentumJS) / (s.angularMomentumJS || 1)).toBeCloseTo(0, 10);
        const crossForce = t.positionM.x * t.forceN.y - t.positionM.y * t.forceN.x;
        expect(crossForce / (magnitude(t.forceN) * t.radiusM)).toBeCloseTo(0, 13);
      }
      expect(effectivePotentialJ(s.closestM, p) / s.energyJ).toBeCloseTo(1, 12);
    });
  it('matches finite-difference tangents and Newton acceleration', () => {
    for (const u of [-3, -0.5, 0, 0.5, 3]) {
      const h = 1e-5,
        left = pointAtParameter(gold, u - h),
        right = pointAtParameter(gold, u + h),
        center = pointAtParameter(gold, u);
      const dt = right.timeS - left.timeS;
      for (const key of ['x', 'y'] as const) {
        expect(
          (right.positionM[key] - left.positionM[key]) / dt / center.velocityMS[key],
        ).toBeCloseTo(1, 7);
        expect(
          (((right.velocityMS[key] - left.velocityMS[key]) / dt) * C.alphaMass) /
            center.forceN[key],
        ).toBeCloseTo(1, 6);
      }
    }
  });
  it('measures θ from asymptotic velocity directions and matches polar-orbit equation', () => {
    const s = invariants(gold),
      incoming = pointAtParameter(gold, -12),
      outgoing = pointAtParameter(gold, 12);
    const ai = Math.atan2(incoming.velocityMS.y, incoming.velocityMS.x),
      af = Math.atan2(outgoing.velocityMS.y, outgoing.velocityMS.x);
    expect(af - ai).toBeCloseTo(s.angleRad, 8);
    const p = (gold.impactFm * FM) ** 2 / s.aM,
      phiP = (Math.PI + s.angleRad) / 2;
    for (const u of [-2, 0, 2]) {
      const t = pointAtParameter(gold, u);
      expect(p / (s.eccentricity * Math.cos(t.polarRad - phiP) - 1) / t.radiusM).toBeCloseTo(1, 10);
    }
  });
});
describe('cross sections and finite acceptance', () => {
  it('agrees with independent solid-angle quadrature and annular area', () => {
    const lower = radians(60),
      upper = radians(70),
      steps = 20000,
      dx = (upper - lower) / steps;
    let integral = 0;
    for (let i = 0; i < steps; i++) {
      const theta = lower + (i + 0.5) * dx;
      integral += differential(theta, gold) * 2 * Math.PI * Math.sin(theta) * dx;
    }
    expect(integral / ring(lower, upper, gold)).toBeCloseTo(1, 9);
    const areaM2 = Math.PI * (impactAtAngleM(lower, gold) ** 2 - impactAtAngleM(upper, gold) ** 2);
    expect(areaM2 / BARN).toBeCloseTo(ring(lower, upper, gold), 12);
    expect(ringSolidAngleSr(lower, upper)).toBeCloseTo(
      2 * Math.PI * (Math.cos(lower) - Math.cos(upper)),
      14,
    );
  });
  it('implements the Jacobian independently by differentiating b(θ)', () => {
    const theta = radians(85),
      h = 1e-5,
      b = impactAtAngleM(theta, gold);
    const derivative =
      (impactAtAngleM(theta + h, gold) - impactAtAngleM(theta - h, gold)) / (2 * h);
    expect(
      ((b / Math.sin(theta)) * Math.abs(derivative)) / BARN / differential(theta, gold),
    ).toBeCloseTo(1, 8);
  });
  it('uses m² for density/probability and separates detector efficiency', () => {
    const m = { ...measurementDefaults, efficiency: 0.4 },
      r = predictMeasurement(gold, m);
    expect(r.valid).toBe(true);
    expect(r.probability).toBeCloseTo(m.arealDensityM2 * r.crossSectionBarn! * BARN, 15);
    expect(r.expectedCount).toBeCloseTo(m.incidentCount * r.probability! * 0.4, 12);
    expect(predictMeasurement(gold, { ...m, incidentCount: 0 }).expectedCount).toBe(0);
    expect(predictMeasurement(gold, { ...m, efficiency: 0 }).expectedCount).toBe(0);
    expect(predictMeasurement(gold, { ...m, arealDensityM2: 0 }).probability).toBe(0);
  });
  it('labels the patch approximation with its own acceptance', () => {
    const m = { ...measurementDefaults, mode: 'patch' as const },
      r = predictMeasurement(gold, m);
    expect(r.valid).toBe(true);
    expect(r.crossSectionBarn).toBeCloseTo(
      differential(radians(m.centerDeg), gold) * m.patchSr,
      12,
    );
    expect(r.solidAngleSr).toBe(m.patchSr);
    expect(predictMeasurement(gold, { ...m, patchSr: 1 }).valid).toBe(false);
  });
  it('withholds invalid probabilities rather than clipping or reporting infinity', () => {
    for (const overrides of [
      { lowerDeg: 0 },
      { lowerDeg: 75 },
      { lowerDeg: 5 },
      { cutoffDeg: 0 },
      { arealDensityM2: 1e30 },
      { incidentCount: 1.5 },
      { efficiency: 1.1 },
      { mode: 'patch' as const, centerDeg: 1 },
    ]) {
      const r = predictMeasurement(gold, { ...measurementDefaults, ...overrides });
      expect(r.valid).toBe(false);
      expect(r.warnings.length).toBeGreaterThan(0);
      expect(r.probability).toBeNull();
      expect(r.expectedCount).toBeNull();
    }
  });
});
describe('reproducible statistics and conditional events', () => {
  it('repeats an observation with the same seed and never changes prediction', () => {
    const lambda = predictMeasurement(gold, measurementDefaults).expectedCount!;
    expect(samplePoisson(lambda, seededRandom(42))).toBe(samplePoisson(lambda, seededRandom(42)));
    const observed = Array.from({ length: 10 }, (_, i) => samplePoisson(lambda, seededRandom(i)));
    expect(new Set(observed).size).toBeGreaterThan(1);
    expect(predictMeasurement(gold, measurementDefaults).expectedCount).toBe(lambda);
    expect(predictMeasurement({ ...gold, impactFm: 80 }, measurementDefaults).expectedCount).toBe(
      lambda,
    );
  });
  for (const mean of [2, 50, 1000])
    it(`has Poisson mean and variance for λ=${mean}`, () => {
      const random = seededRandom(2031),
        n = 20000;
      let sum = 0,
        sumSquares = 0;
      for (let i = 0; i < n; i++) {
        const k = samplePoisson(mean, random);
        expect(Number.isInteger(k) && k >= 0).toBe(true);
        sum += k;
        sumSquares += k * k;
      }
      const measuredMean = sum / n,
        variance = sumSquares / n - measuredMean ** 2;
      expect(Math.abs(measuredMean - mean)).toBeLessThan(5 * Math.sqrt(mean / n));
      expect(variance / mean).toBeCloseTo(1, 1);
    });
  it('samples b by area, not uniformly by radius', () => {
    const cutoff = radians(10),
      bMax = impactAtAngleM(cutoff, gold),
      events = conditionalEvents(gold, cutoff, 10000, 5);
    const meanSquaredRadius =
      events.reduce((sum, e) => sum + (e.impactM / bMax) ** 2, 0) / events.length;
    expect(meanSquaredRadius).toBeCloseTo(0.5, 2);
    expect(events.every((e) => e.angleRad >= cutoff && e.angleRad <= Math.PI)).toBe(true);
    expect(conditionalEvents(gold, cutoff, 3, 5)).toEqual(events.slice(0, 3));
    expect(samplePoisson(0, seededRandom(1))).toBe(0);
    expect(() => samplePoisson(-1, seededRandom(1))).toThrow();
  });
  it('keeps dimensions explicit', () => {
    expect(MEV / C.e).toBe(1e6);
    expect(FM ** 2 / BARN).toBeCloseTo(0.01, 14);
  });
});
