export interface RutherfordParams {
  energyMeV: number;
  nuclearCharge: number;
  impactFm: number;
}
export interface Vector {
  x: number;
  y: number;
}
export interface OrbitPoint {
  positionM: Vector;
  velocityMS: Vector;
  forceN: Vector;
  radiusM: number;
  polarRad: number;
  timeS: number;
  orbitParameter: number;
}
export interface RutherfordSolution {
  params: RutherfordParams;
  energyJ: number;
  kappaJM: number;
  kappaMeVFm: number;
  aM: number;
  angleRad: number;
  closestM: number;
  speedInfinityMS: number;
  angularMomentumJS: number;
  eccentricity: number;
  maxOrbitParameter: number;
  trajectory: OrbitPoint[];
}
export type QuantityId =
  | 'energy'
  | 'nuclear-charge'
  | 'impact-parameter'
  | 'scattering-angle'
  | 'distance'
  | 'closest-approach'
  | 'force'
  | 'velocity'
  | 'angular-momentum'
  | 'solid-angle'
  | 'differential-cross-section'
  | 'bin-cross-section'
  | 'target-areal-density'
  | 'probability'
  | 'detector-count';
export interface MeasurementParams {
  mode: 'ring' | 'patch';
  lowerDeg: number;
  upperDeg: number;
  centerDeg: number;
  patchSr: number;
  cutoffDeg: number;
  arealDensityM2: number;
  incidentCount: number;
  efficiency: number;
}
export interface MeasurementResult {
  valid: boolean;
  warnings: string[];
  crossSectionBarn: number | null;
  solidAngleSr: number | null;
  opticalDepth: number | null;
  probability: number | null;
  expectedCount: number | null;
}
