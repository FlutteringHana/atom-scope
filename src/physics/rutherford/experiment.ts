import { BARN, impactAtAngleM, invariants, radians } from './coulomb';
import {
  differentialCrossSectionBarnPerSr,
  ringBinCrossSectionBarn,
  ringSolidAngleSr,
} from './crossSection';
import type { MeasurementParams, MeasurementResult, RutherfordParams } from './types';

export const THIN_TARGET_LIMIT = 0.05;
export const measurementDefaults: MeasurementParams = {
  mode: 'ring',
  lowerDeg: 60,
  upperDeg: 70,
  centerDeg: 65,
  patchSr: 0.01,
  cutoffDeg: 10,
  arealDensityM2: 1e22,
  incidentCount: 1e7,
  efficiency: 1,
};
export function predictMeasurement(p: RutherfordParams, m: MeasurementParams): MeasurementResult {
  invariants(p);
  const warnings: string[] = [];
  const empty = (): MeasurementResult => ({
    valid: false,
    warnings,
    crossSectionBarn: null,
    solidAngleSr: null,
    opticalDepth: null,
    probability: null,
    expectedCount: null,
  });
  if (!Number.isFinite(m.cutoffDeg) || m.cutoffDeg <= 0 || m.cutoffDeg >= 180)
    warnings.push('角度截止必须满足 0° < θmin < 180°；θ → 0 时理想库仑总截面发散。');
  if (
    !Number.isFinite(m.arealDensityM2) ||
    m.arealDensityM2 < 0 ||
    !Number.isSafeInteger(m.incidentCount) ||
    m.incidentCount < 0 ||
    m.incidentCount > 1e12 ||
    !Number.isFinite(m.efficiency) ||
    m.efficiency < 0 ||
    m.efficiency > 1
  )
    warnings.push('需要非负靶面密度、非负整数 N₀，以及 0 ≤ η ≤ 1。');
  if (m.mode === 'ring') {
    if (
      !Number.isFinite(m.lowerDeg) ||
      !Number.isFinite(m.upperDeg) ||
      m.lowerDeg <= 0 ||
      m.lowerDeg >= m.upperDeg ||
      m.upperDeg > 180
    )
      warnings.push('环带必须满足 0° < θ₁ < θ₂ ≤ 180°；不计算发散或倒置的区间。');
    else if (m.lowerDeg < m.cutoffDeg)
      warnings.push(
        '环带下界低于显式角度截止；请调整 θ₁ 或 θmin，避免把未纳入模型的前向区域混入计数。',
      );
  } else if (m.mode === 'patch') {
    if (
      !Number.isFinite(m.centerDeg) ||
      m.centerDeg <= 0 ||
      m.centerDeg >= 180 ||
      !Number.isFinite(m.patchSr) ||
      m.patchSr <= 0 ||
      m.patchSr > 4 * Math.PI
    )
      warnings.push('小面元需要 0° < θc < 180° 与正的有限立体角 ΔΩ。');
    else {
      const capRadius = Math.acos(1 - m.patchSr / (2 * Math.PI));
      if (
        capRadius > radians(5) ||
        capRadius > radians(Math.min(m.centerDeg, 180 - m.centerDeg)) * 0.2
      )
        warnings.push('面元角宽过大：中心值乘 ΔΩ 的小接受度近似不可靠，请缩小 ΔΩ 或改用精确环带。');
      if (m.centerDeg - (capRadius * 180) / Math.PI < m.cutoffDeg)
        warnings.push('面元超出 θmin 截止范围，请增大中心角或缩小接受度。');
    }
  } else warnings.push('请选择明确的探测器几何。');
  if (warnings.length) return empty();
  const cutoff = radians(m.cutoffDeg);
  const opticalDepth = m.arealDensityM2 * BARN * ringBinCrossSectionBarn(cutoff, Math.PI, p);
  const crossSectionBarn =
    m.mode === 'ring'
      ? ringBinCrossSectionBarn(radians(m.lowerDeg), radians(m.upperDeg), p)
      : differentialCrossSectionBarnPerSr(radians(m.centerDeg), p) * m.patchSr;
  const solidAngleSr =
    m.mode === 'ring' ? ringSolidAngleSr(radians(m.lowerDeg), radians(m.upperDeg)) : m.patchSr;
  if (!Number.isFinite(opticalDepth) || opticalDepth > THIN_TARGET_LIMIT) {
    warnings.push(
      '薄靶条件失效：截止范围内 nₜσ > 0.05，暂停概率、预期计数和抽样。不要将它截断为 100% 或解释为多次散射模型。',
    );
    return { ...empty(), crossSectionBarn, solidAngleSr, opticalDepth };
  }
  const probability = m.arealDensityM2 * crossSectionBarn * BARN;
  return {
    valid: true,
    warnings,
    crossSectionBarn,
    solidAngleSr,
    opticalDepth,
    probability,
    expectedCount: m.incidentCount * probability * m.efficiency,
  };
}
export function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function logFactorial(k: number) {
  if (k < 32) {
    let result = 0;
    for (let i = 2; i <= k; i++) result += Math.log(i);
    return result;
  }
  const x = k + 1;
  return (
    (x - 0.5) * Math.log(x) -
    x +
    0.5 * Math.log(2 * Math.PI) +
    1 / (12 * x) -
    1 / (360 * x ** 3) +
    1 / (1260 * x ** 5)
  );
}
/** Knuth inversion / Hörmann PTRS rejection; no Gaussian pseudo-counts. */
export function samplePoisson(lambda: number, random: () => number) {
  if (!Number.isFinite(lambda) || lambda < 0 || lambda > 1e12)
    throw new RangeError('Finite 0 ≤ λ ≤ 10¹² required');
  if (lambda === 0) return 0;
  if (lambda < 30) {
    const limit = Math.exp(-lambda);
    let k = 0,
      product = 1;
    do {
      k++;
      product *= random();
    } while (product > limit);
    return k - 1;
  }
  const sqrt = Math.sqrt(lambda),
    b = 0.931 + 2.53 * sqrt,
    a = -0.059 + 0.02483 * b;
  const inverseAlpha = 1.1239 + 1.1328 / (b - 3.4),
    vr = 0.9277 - 3.6224 / (b - 2);
  for (;;) {
    const u = random() - 0.5,
      v = random(),
      us = 0.5 - Math.abs(u);
    if (us === 0) continue;
    const k = Math.floor(((2 * a) / us + b) * u + lambda + 0.43);
    if (k >= 0 && us >= 0.07 && v <= vr) return k;
    if (k < 0 || (us < 0.013 && v > us)) continue;
    if (
      Math.log((v * inverseAlpha) / (a / us ** 2 + b)) <=
      -lambda + k * Math.log(lambda) - logFactorial(k)
    )
      return k;
  }
}
export function conditionalEvents(
  p: RutherfordParams,
  cutoffRad: number,
  count: number,
  seed: number,
) {
  if (!Number.isInteger(count) || count < 0 || count > 10000)
    throw new RangeError('Invalid sample size');
  const bMaxM = impactAtAngleM(cutoffRad, p),
    s = invariants(p),
    random = seededRandom(seed);
  return Array.from({ length: count }, () => {
    const bM = bMaxM * Math.sqrt(random());
    return { impactM: bM, angleRad: 2 * Math.atan2(s.aM, bM) };
  });
}
