import { describe, expect, it } from 'vitest';
import { C, fromEV, toEV, toNM } from './constants';
import {
  bohrState,
  matterWave,
  photoelectric,
  planck,
  radialProbability,
  rayleighJeans,
  scattering,
  scatteringPath,
  transition,
  spectralRegion,
  wavelengthColor,
} from './models';

describe('constants and unit conversions', () => {
  it('converts electron volts to SI and back', () => {
    expect(fromEV(1)).toBe(1.602176634e-19);
    expect(toEV(fromEV(13.6))).toBeCloseTo(13.6, 12);
    expect(toNM(1e-9)).toBe(1);
  });
});
describe('infinite-mass Bohr model', () => {
  it('recovers the ground state and Bohr radius', () => {
    const h = bohrState(1);
    expect(toEV(h.energyJ)).toBeCloseTo(-13.605693, 5);
    expect(h.radiusM).toBe(C.bohrRadius);
  });
  it('follows nuclear-charge and principal-number scaling', () => {
    for (let n = 1; n <= 6; n++)
      for (let z = 1; z <= 3; z++) {
        expect(bohrState(n, z).energyJ / bohrState(n).energyJ).toBeCloseTo(z ** 2, 12);
        expect(bohrState(n, z).radiusM / bohrState(1).radiusM).toBeCloseTo(n ** 2 / z, 12);
      }
  });
  it('conserves energy for reciprocal emission and absorption', () => {
    const emission = transition(3, 2),
      absorption = transition(2, 3);
    expect(emission.kind).toBe('emission');
    expect(absorption.kind).toBe('absorption');
    expect(emission.deltaJ).toBe(-absorption.deltaJ);
    expect(emission.wavelengthM).toBe(absorption.wavelengthM);
    expect((C.h * C.c) / emission.wavelengthM / emission.photonJ).toBeCloseTo(1, 14);
    expect(toNM(emission.wavelengthM)).toBeCloseTo(656.112, 3);
  });
  it('rejects invalid quantum states and zero-energy transitions', () => {
    for (const n of [0, -1, 1.5, NaN, Infinity]) expect(() => bohrState(n)).toThrow(RangeError);
    expect(() => bohrState(1, 0)).toThrow(RangeError);
    expect(() => transition(2, 2)).toThrow(RangeError);
  });
});
describe('point-Coulomb Rutherford scattering', () => {
  const energy = fromEV(5e6);
  it('gives backscatter at zero impact parameter', () =>
    expect(scattering(energy, 0).angleRad).toBe(Math.PI));
  it('decreases deflection as impact parameter or energy increases', () => {
    expect(scattering(energy, 20e-15).angleRad).toBeGreaterThan(
      scattering(energy, 100e-15).angleRad,
    );
    expect(scattering(energy, 60e-15).angleRad).toBeGreaterThan(
      scattering(energy * 2, 60e-15).angleRad,
    );
  });
  it('matches hyperbolic closest approach and outgoing asymptote', () => {
    for (const b of [0, 30, 60, 200]) {
      const path = scatteringPath(energy, b * 1e-15);
      const r = scattering(energy, b * 1e-15);
      const minimum = Math.min(...path.map((p) => Math.hypot(p.xM, p.yM)));
      expect(minimum / r.closestM).toBeCloseTo(1, 12);
      const last = path.at(-1)!,
        prev = path.at(-2)!;
      expect(Math.atan2(last.yM - prev.yM, last.xM - prev.xM)).toBeCloseTo(r.angleRad, 3);
    }
  });
  it('rejects negative impact parameters and nonpositive energies', () => {
    expect(() => scattering(energy, -1)).toThrow();
    expect(() => scattering(0, 1)).toThrow();
  });
});
describe('blackbody spectral radiance', () => {
  it('peaks at the Wien wavelength', () => {
    for (const t of [2500, 5500, 9000]) {
      const peak = C.wien / t;
      expect(planck(peak, t)).toBeGreaterThan(planck(peak * 0.99, t));
      expect(planck(peak, t)).toBeGreaterThan(planck(peak * 1.01, t));
    }
  });
  it('increases with temperature and approaches the classical long-wave limit', () => {
    expect(planck(500e-9, 6000)).toBeGreaterThan(planck(500e-9, 3000));
    expect(planck(0.01, 5500) / rayleighJeans(0.01, 5500)).toBeCloseTo(1, 3);
  });
  it('remains finite and nonnegative throughout the UI domain', () => {
    for (const t of [2500, 9000])
      for (let nm = 100; nm <= 2500; nm += 5) {
        const value = planck(nm * 1e-9, t);
        expect(Number.isFinite(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
      }
    expect(() => planck(0, 3000)).toThrow();
  });
});
describe('photoelectric threshold', () => {
  it('blocks emission below photon energy threshold', () => {
    const r = photoelectric(800e-9, fromEV(2.3));
    expect(r.emits).toBe(false);
    expect(r.kineticJ).toBe(0);
  });
  it('conserves photon energy and gives the stopping potential', () => {
    const r = photoelectric(350e-9, fromEV(2.3));
    expect(r.emits).toBe(true);
    expect(toEV(r.photonJ - r.kineticJ)).toBeCloseTo(2.3, 12);
    expect(r.stoppingV).toBeCloseTo(1.24240567, 6);
    expect(photoelectric(250e-9, fromEV(2.3)).kineticJ).toBeGreaterThan(r.kineticJ);
  });
  it('rejects unsupported inputs', () => {
    expect(() => photoelectric(-1, 1)).toThrow();
    expect(() => photoelectric(1, NaN)).toThrow();
  });
});
describe('matter waves and hydrogen radial distributions', () => {
  it('matches the electron wavelength and inverse square-root scaling', () => {
    expect(toNM(matterWave(150))).toBeCloseTo(0.100138, 5);
    expect(matterWave(40) / matterWave(10)).toBeCloseTo(0.5, 14);
    expect(() => matterWave(0)).toThrow();
  });
  for (const state of ['1s', '2s', '2p'] as const)
    it(`normalizes ${state} radial probability`, () => {
      let sum = 0;
      const dx = 0.002;
      for (let i = 1; i < 50000; i++) sum += radialProbability(i * dx, state) * dx;
      expect(sum).toBeCloseTo(1, 6);
    });
  it('has the correct 2s node and 1s probability maximum', () => {
    expect(radialProbability(2, '2s')).toBe(0);
    expect(radialProbability(1, '1s')).toBeGreaterThan(radialProbability(0.99, '1s'));
    expect(radialProbability(1, '1s')).toBeGreaterThan(radialProbability(1.01, '1s'));
    expect(() => radialProbability(-1, '1s')).toThrow();
  });
  it('labels invisible wavelengths without assigning visible light colors', () => {
    expect(spectralRegion(121)).toBe('紫外 UV');
    expect(spectralRegion(1875)).toBe('红外 IR');
    expect(spectralRegion(656)).toBe('可见光');
    expect(wavelengthColor(121)).toBe(wavelengthColor(1875));
  });
});
