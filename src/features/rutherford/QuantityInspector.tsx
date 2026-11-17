import { quantityNames } from '../../content/rutherfordQuantities';
import { useState } from 'react';
import { degrees, FM, magnitude, MEV } from '../../physics/rutherford/coulomb';
import { differentialCrossSectionBarnPerSr } from '../../physics/rutherford/crossSection';
import type {
  MeasurementParams,
  MeasurementResult,
  OrbitPoint,
  QuantityId,
  RutherfordSolution,
} from '../../physics/rutherford/types';

export const format = (value: number | null, digits = 3): string =>
  value === null || !Number.isFinite(value)
    ? '暂不可用'
    : value === 0
      ? '0'
      : Math.abs(value) < 0.001 || Math.abs(value) >= 1e6
        ? value.toExponential(digits)
        : Number(value.toPrecision(digits + 2)).toLocaleString('en-US', {
            maximumFractionDigits: digits + 2,
          });
export function quantityValues(
  solution: RutherfordSolution,
  point: OrbitPoint,
  measurement: MeasurementParams,
  result: MeasurementResult,
  inspectDeg: number,
): Record<QuantityId, [number | null, string]> {
  return {
    energy: [solution.energyJ / MEV, 'MeV'],
    'nuclear-charge': [solution.params.nuclearCharge, '无量纲'],
    'impact-parameter': [solution.params.impactFm, 'fm'],
    'scattering-angle': [degrees(solution.angleRad), '°'],
    distance: [point.radiusM / FM, 'fm'],
    'closest-approach': [solution.closestM / FM, 'fm'],
    force: [magnitude(point.forceN), 'N'],
    velocity: [magnitude(point.velocityMS), 'm/s'],
    'angular-momentum': [solution.angularMomentumJS, 'J·s'],
    'solid-angle': [result.solidAngleSr, 'sr'],
    'differential-cross-section': [
      inspectDeg > 0
        ? differentialCrossSectionBarnPerSr((inspectDeg * Math.PI) / 180, solution.params)
        : null,
      'barn/sr',
    ],
    'bin-cross-section': [result.crossSectionBarn, 'barn'],
    'target-areal-density': [measurement.arealDensityM2, '核/m²'],
    probability: [result.probability, '无量纲'],
    'detector-count': [result.expectedCount, 'count'],
  };
}
export function QuantityInspector({
  selected,
  onSelect,
  values,
}: {
  selected: QuantityId;
  onSelect: (id: QuantityId) => void;
  values: ReturnType<typeof quantityValues>;
}) {
  const [pinned, setPinned] = useState<{ name: string; value: string }>();
  const [symbol, name, definition, computation] = quantityNames[selected];
  const [value, unit] = values[selected];
  return (
    <section className="rf-inspector" aria-label="物理量检查器">
      <div className="rf-section-label">PHYSICAL QUANTITY INSPECTOR</div>
      <h3>物理量检查器</h3>
      <label className="rf-field">
        选择物理量
        <select
          aria-label="选择物理量"
          value={selected}
          onChange={(e) => onSelect(e.target.value as QuantityId)}
        >
          {Object.entries(quantityNames).map(([id, [s, n]]) => (
            <option value={id} key={id}>
              {s} · {n}
            </option>
          ))}
        </select>
      </label>
      <div className="rf-quantity-card" data-quantity={selected}>
        <span className="rf-selected-label">✓ 当前选中 · {name}</span>
        <div className="rf-quantity-value">
          <b>{symbol}</b>
          <strong>{format(value)}</strong>
          <span>{unit}</span>
        </div>
        <p>{definition}</p>
        <details>
          <summary>如何测量或计算？</summary>
          <p>{computation}</p>
        </details>
        <button
          className="rf-link-button"
          onClick={() =>
            setPinned({ name: `${symbol} · ${name}`, value: `${format(value)} ${unit}` })
          }
        >
          固定当前数值
        </button>
      </div>
      {pinned && (
        <div className="rf-pinned">
          <span>已固定快照 · {pinned.name}</span>
          <strong>{pinned.value}</strong>
          <button onClick={() => setPinned(undefined)} aria-label="移除固定数值">
            移除
          </button>
        </div>
      )}
      <dl className="readouts rf-live-readouts">
        {(['scattering-angle', 'closest-approach', 'angular-momentum'] as QuantityId[]).map(
          (id) => (
            <div key={id}>
              <dt>
                <button onClick={() => onSelect(id)}>
                  {quantityNames[id][0]} · {quantityNames[id][1]}
                </button>
              </dt>
              <dd>
                {format(values[id][0])} {values[id][1]}
              </dd>
            </div>
          ),
        )}
      </dl>
    </section>
  );
}
