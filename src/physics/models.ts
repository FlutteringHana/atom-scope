import { C, fromEV, toEV } from './constants';

function positive(value: number, name: string) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be finite and positive`);
}
function quantum(n: number, z: number) {
  positive(n, 'n'); positive(z, 'Z');
  if (!Number.isInteger(n) || !Number.isInteger(z)) throw new RangeError('n and Z must be integers');
}
export function bohrState(n: number, z = 1) {
  quantum(n, z);
  return { energyJ: -C.h * C.c * C.rydberg * z ** 2 / n ** 2, radiusM: C.bohrRadius * n ** 2 / z };
}
export function transition(initial: number, final: number, z = 1) {
  const deltaJ = bohrState(final, z).energyJ - bohrState(initial, z).energyJ;
  if (deltaJ === 0) throw new RangeError('Transition states must differ');
  return { deltaJ, photonJ: Math.abs(deltaJ), wavelengthM: C.h * C.c / Math.abs(deltaJ), frequencyHz: Math.abs(deltaJ) / C.h, kind: deltaJ < 0 ? 'emission' : 'absorption' } as const;
}
export function scattering(energyJ: number, impactM: number, z = 79) {
  positive(energyJ, 'energy'); positive(z, 'Z');
  if (!Number.isFinite(impactM) || impactM < 0) throw new RangeError('Impact parameter must be nonnegative');
  const a = 2 * z * C.e ** 2 / (4 * Math.PI * C.epsilon0) / (2 * energyJ);
  return { angleRad: 2 * Math.atan2(a, impactM), aM: a, closestM: a + Math.hypot(a, impactM) };
}
export function scatteringPath(energyJ: number, impactM: number): { xM: number; yM: number }[] {
  const { aM: a } = scattering(energyJ, impactM);
  const q = impactM / a;
  const eccentricity = Math.hypot(1, q);
  return Array.from({ length: 301 }, (_, i) => {
    const u = -6 + i * 12 / 300;
    const x = a * (eccentricity + Math.cosh(u));
    const y = a * q * Math.sinh(u);
    return { xM: (-x + q * y) / eccentricity, yM: (q * x + y) / eccentricity };
  });
}
export function planck(wavelengthM: number, temperatureK: number) {
  positive(wavelengthM, 'wavelength'); positive(temperatureK, 'temperature');
  return 2 * C.h * C.c ** 2 / wavelengthM ** 5 / Math.expm1(C.h * C.c / (wavelengthM * C.kB * temperatureK));
}
export function rayleighJeans(wavelengthM: number, temperatureK: number) {
  positive(wavelengthM, 'wavelength'); positive(temperatureK, 'temperature');
  return 2 * C.c * C.kB * temperatureK / wavelengthM ** 4;
}
export function photoelectric(wavelengthM: number, workFunctionJ: number) {
  positive(wavelengthM, 'wavelength'); positive(workFunctionJ, 'work function');
  const photonJ = C.h * C.c / wavelengthM;
  const kineticJ = Math.max(0, photonJ - workFunctionJ);
  return { photonJ, kineticJ, emits: kineticJ > 0, stoppingV: toEV(kineticJ), thresholdM: C.h * C.c / workFunctionJ };
}
export function matterWave(energyEV: number) {
  positive(energyEV, 'energy');
  return C.h / Math.sqrt(2 * C.electronMass * fromEV(energyEV));
}
export type Orbital = '1s' | '2s' | '2p';
export function radialProbability(x: number, state: Orbital) {
  if (!Number.isFinite(x) || x < 0) throw new RangeError('Radius must be nonnegative');
  switch (state) {
    case '1s': return 4 * x ** 2 * Math.exp(-2 * x);
    case '2s': return x ** 2 * (2 - x) ** 2 * Math.exp(-x) / 8;
    case '2p': return x ** 4 * Math.exp(-x) / 24;
    default: throw new RangeError('Unsupported orbital');
  }
}
export function spectralRegion(wavelengthNM: number) {
  return wavelengthNM < 380 ? '紫外 UV' : wavelengthNM > 780 ? '红外 IR' : '可见光';
}
/** Approximate display mapping only; never use to encode UV or IR as visible light. */
export function wavelengthColor(nm: number) {
  if (nm < 380 || nm > 780) return '#b9c4d2';
  const stops = [[380, 270], [440, 245], [490, 185], [510, 125], [580, 55], [645, 0], [780, 0]];
  const i = stops.findIndex(([w]) => w >= nm);
  if (i === 0) return 'hsl(270 80% 68%)';
  const [w0, h0] = stops[i - 1]; const [w1, h1] = stops[i];
  return `hsl(${h0 + (h1 - h0) * (nm - w0) / (w1 - w0)} 80% 65%)`;
}
