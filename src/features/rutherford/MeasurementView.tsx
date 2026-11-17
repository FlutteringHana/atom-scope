import { useId, useMemo, useRef, useState } from 'react';
import { degrees, FM, impactAtAngleM, radians } from '../../physics/rutherford/coulomb';
import {
  differentialCrossSectionBarnPerSr,
  ringBinCrossSectionBarn,
} from '../../physics/rutherford/crossSection';
import {
  conditionalEvents,
  samplePoisson,
  seededRandom,
} from '../../physics/rutherford/experiment';
import type {
  MeasurementParams,
  MeasurementResult,
  QuantityId,
  RutherfordSolution,
} from '../../physics/rutherford/types';
import { MathFormula } from './MathFormula';
import { format } from './QuantityInspector';

export function MeasurementControls({
  m,
  onChange,
}: {
  m: MeasurementParams;
  onChange: (value: MeasurementParams) => void;
}) {
  const field = (
    key: keyof MeasurementParams,
    label: string,
    min: number,
    max: number,
    step: number | string = 1,
  ) => (
    <label className="rf-field" key={key}>
      {label}
      <input
        type="number"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(m[key]) ? m[key] : ''}
        onChange={(e) =>
          onChange({ ...m, [key]: e.target.value === '' ? NaN : Number(e.target.value) })
        }
      />
    </label>
  );
  return (
    <div className="rf-measurement-controls">
      <label className="rf-field">
        探测器几何
        <select
          aria-label="探测器几何"
          value={m.mode}
          onChange={(e) => onChange({ ...m, mode: e.target.value as MeasurementParams['mode'] })}
        >
          <option value="ring">全方位环带 · 精确积分</option>
          <option value="patch">小面元 · 中心值近似</option>
        </select>
      </label>
      <div className="rf-field-grid">
        {m.mode === 'ring' ? (
          <>
            {field('lowerDeg', '环带下界 θ₁ / °', 0, 180)}
            {field('upperDeg', '环带上界 θ₂ / °', 0, 180)}
          </>
        ) : (
          <>
            {field('centerDeg', '面元中心 θc / °', 0, 180)}
            {field('patchSr', '面元立体角 ΔΩ / sr', 0.0001, 1, 0.001)}
          </>
        )}
        {field('cutoffDeg', '显式角度截止 θmin / °', 0, 170)}
        {field('efficiency', '探测效率 η', 0, 1, 0.05)}
      </div>
      {field('arealDensityM2', '靶面密度 nₜ / 核·m⁻²', 0, 1e30, 'any')}
      {field('incidentCount', '入射粒子数 N₀', 0, 1e12, 1)}
      <p className="rf-small">
        薄靶检验针对 θ≥θmin 的散射；未模拟更小角度的屏蔽或多次散射。N₀ 支持 0–10¹²。
      </p>
    </div>
  );
}
function CrossSectionChart({
  s,
  m,
  onChange,
  inspectDeg,
  onInspect,
}: {
  s: RutherfordSolution;
  m: MeasurementParams;
  onChange: (m: MeasurementParams) => void;
  inspectDeg: number;
  onInspect: (theta: number) => void;
}) {
  const [logarithmic, setLogarithmic] = useState(true);
  const ref = useRef<SVGSVGElement>(null),
    id = useId();
  const min = m.cutoffDeg;
  if (!Number.isFinite(min) || min <= 0 || min >= 180)
    return <p className="rf-warning">请先设置有限的正角度截止，再绘制角分布。</p>;
  const samples = Array.from({ length: 301 }, (_, i) => ({
    theta: min + ((180 - min) * i) / 300,
    sigma: differentialCrossSectionBarnPerSr(radians(min + ((180 - min) * i) / 300), s.params),
  }));
  const first = samples[0].sigma,
    last = samples.at(-1)!.sigma;
  const low = logarithmic ? Math.floor(Math.log10(last)) : 0,
    high = logarithmic ? Math.max(low + 1, Math.ceil(Math.log10(first))) : first * 1.05;
  const px = (theta: number) => 80 + ((theta - min) / (180 - min)) * 585;
  const tickCount = logarithmic ? Math.min(6, high - low + 1) : 5;
  const yTicks = Array.from({ length: tickCount }, (_, i) =>
    logarithmic ? low + Math.round(((high - low) * i) / (tickCount - 1)) : (high * i) / 4,
  );
  const py = (sigma: number) =>
    285 - (((logarithmic ? Math.log10(sigma) : sigma) - low) / (high - low)) * 225;
  const angleFromPointer = (event: React.PointerEvent<SVGElement>) => {
    const matrix = ref.current?.getScreenCTM();
    if (!matrix) return min;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return Math.max(min, Math.min(180, min + ((p.x - 80) / 585) * (180 - min)));
  };
  const validBand =
    Number.isFinite(m.lowerDeg) &&
    Number.isFinite(m.upperDeg) &&
    m.lowerDeg >= min &&
    m.upperDeg <= 180 &&
    m.lowerDeg < m.upperDeg;
  const moveHandle = (which: 'lowerDeg' | 'upperDeg', value: number) =>
    onChange({
      ...m,
      [which]: Math.round(
        which === 'lowerDeg'
          ? Math.min(m.upperDeg - 1, Math.max(min, value))
          : Math.max(m.lowerDeg + 1, Math.min(180, value)),
      ),
    });
  return (
    <section className="rf-distribution">
      <div className="rf-chart-heading">
        <span className="rf-section-label">ANGULAR DISTRIBUTION · 理论曲线</span>
        <label>
          <input
            type="checkbox"
            checked={logarithmic}
            onChange={(e) => setLogarithmic(e.target.checked)}
          />
          对数纵轴
        </label>
      </div>
      <svg
        ref={ref}
        viewBox="0 0 730 350"
        role="img"
        aria-label={`Rutherford 微分截面对散射角，单位 barn/sr；${logarithmic ? '对数' : '线性'}纵轴`}
        onPointerMove={(e) => {
          if (!e.buttons) onInspect(Number(angleFromPointer(e).toFixed(1)));
        }}
        onClick={(e) => {
          const matrix = ref.current?.getScreenCTM();
          if (matrix) {
            const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse());
            onInspect(
              Number(
                Math.max(min, Math.min(180, min + ((p.x - 80) / 585) * (180 - min))).toFixed(1),
              ),
            );
          }
        }}
      >
        <defs>
          <clipPath id={id}>
            <rect x="80" y="60" width="585" height="225" />
          </clipPath>
        </defs>
        <text x="80" y="30">
          dσ/dΩ / barn·sr⁻¹ {logarithmic ? '（log₁₀）' : '（线性）'}
        </text>
        {yTicks.map((v) => {
          const y = 285 - ((v - low) / (high - low)) * 225;
          return (
            <g key={v}>
              <line x1="80" x2="665" y1={y} y2={y} className="rf-chart-grid" />
              <text x="70" y={y + 4} textAnchor="end">
                {logarithmic ? `10^${v}` : v >= 1000 ? v.toExponential(0) : format(v, 1)}
              </text>
            </g>
          );
        })}
        {[0, 1, 2, 3, 4].map((i) => (
          <text key={i} x={80 + i * 146.25} y="310" textAnchor="middle">
            {Math.round(min + ((180 - min) * i) / 4)}
          </text>
        ))}
        <path d="M80 60V285H665" className="rf-chart-axis" />
        <g clipPath={`url(#${id})`}>
          {m.mode === 'ring' && validBand && (
            <rect
              className="rf-acceptance-band"
              x={px(m.lowerDeg)}
              y="60"
              width={px(m.upperDeg) - px(m.lowerDeg)}
              height="225"
            />
          )}
          <path
            className="rf-trajectory"
            d={samples.map((v, i) => `${i ? 'L' : 'M'}${px(v.theta)},${py(v.sigma)}`).join(' ')}
          />
          {inspectDeg >= min && inspectDeg <= 180 && (
            <>
              <line
                x1={px(inspectDeg)}
                x2={px(inspectDeg)}
                y1="60"
                y2="285"
                className="rf-inspect-line"
              />
              <circle
                cx={px(inspectDeg)}
                cy={py(differentialCrossSectionBarnPerSr(radians(inspectDeg), s.params))}
                r="4"
                fill="#47623b"
              />
            </>
          )}
          {m.mode === 'patch' && m.centerDeg >= min && m.centerDeg <= 180 && (
            <circle
              cx={px(m.centerDeg)}
              cy={py(differentialCrossSectionBarnPerSr(radians(m.centerDeg), s.params))}
              r="7"
              fill="none"
              stroke="#42694e"
              strokeWidth="2"
            />
          )}
        </g>
        {m.mode === 'ring' &&
          validBand &&
          (['lowerDeg', 'upperDeg'] as const).map((key, i) => (
            <g
              key={key}
              role="slider"
              tabIndex={0}
              aria-label={i ? '拖动环带上界' : '拖动环带下界'}
              aria-valuemin={i ? m.lowerDeg + 1 : min}
              aria-valuemax={i ? 180 : m.upperDeg - 1}
              aria-valuenow={m[key]}
              className="rf-band-handle"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => {
                e.stopPropagation();
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (e.buttons === 1) {
                  e.stopPropagation();
                  moveHandle(key, angleFromPointer(e));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                  e.preventDefault();
                  moveHandle(key, m[key] + (e.key === 'ArrowRight' ? 1 : -1));
                }
              }}
            >
              <line x1={px(m[key])} x2={px(m[key])} y1="60" y2="285" />
              <circle cx={px(m[key])} cy={i ? 270 : 80} r="7" />
              <text x={px(m[key]) + (i ? 9 : -9)} y={i ? 268 : 80} textAnchor={i ? 'start' : 'end'}>
                {i ? 'θ₂' : 'θ₁'}
              </text>
            </g>
          ))}
        <text x="665" y="341" textAnchor="end">
          散射角 θ / °
        </text>
      </svg>
      <div className="rf-chart-inspection">
        <label>
          检查角 θ / °
          <input
            type="number"
            aria-label="检查角 θ / °"
            min={min}
            max={180}
            step={1}
            value={inspectDeg}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (next >= min && next <= 180) onInspect(next);
            }}
          />
        </label>
        <span>b(θ) = {format(impactAtAngleM(radians(inspectDeg), s.params) / FM)} fm</span>
        <span>
          dσ/dΩ = {format(differentialCrossSectionBarnPerSr(radians(inspectDeg), s.params))} barn/sr
        </span>
      </div>
      <p className="rf-small">
        点击或移动到曲线上检查数值，也可用数值输入；环带边界可拖动或用方向键移动。θmin
        是明确的数学截止，不等同于屏蔽模型。
      </p>
    </section>
  );
}
function AcceptanceDiagram({
  s,
  m,
  result,
  selected,
  onSelect,
}: {
  s: RutherfordSolution;
  m: MeasurementParams;
  result: MeasurementResult;
  selected: QuantityId;
  onSelect: (id: QuantityId) => void;
}) {
  const clip = useId();
  const ring = m.mode === 'ring';
  const valid = ring
    ? m.lowerDeg > 0 && m.upperDeg > m.lowerDeg && m.upperDeg <= 180
    : m.centerDeg > 0 && m.centerDeg < 180 && m.patchSr > 0 && m.patchSr < 4 * Math.PI;
  if (!valid) return <p className="rf-warning">接受区几何无效，修正输入后再显示映射。</p>;
  const b1 = impactAtAngleM(radians(ring ? m.lowerDeg : m.centerDeg), s.params) / FM;
  const b2 = ring ? impactAtAngleM(radians(m.upperDeg), s.params) / FM : 0;
  const inner = b1 > 0 ? (b2 / b1) * 57 : 0;
  return (
    <div className="rf-acceptance-mapping">
      <div className="rf-chart-heading">
        <span className="rf-section-label">AREA ↔ SOLID ANGLE / 接受区映射</span>
        <strong>{ring ? '◎ 全方位环带 · 精确' : '● 局部面元 · 近似'}</strong>
      </div>
      <svg
        viewBox="0 0 730 230"
        role="img"
        aria-label={
          ring
            ? '入射平面环形面积与出射方向球面带的对应；面积和立体角有不同单位'
            : '局部探测器面元示意，不是全方位环带'
        }
      >
        <defs>
          <clipPath id={clip}>
            <circle cx="555" cy="95" r="64" />
          </clipPath>
        </defs>
        <circle cx="170" cy="95" r="57" className="rf-area-circle" />
        {ring ? (
          <>
            <path
              d={`M170 38A57 57 0 1 1 170 152A57 57 0 1 1 170 38M170 ${95 - inner}A${inner} ${inner} 0 1 0 170 ${95 + inner}A${inner} ${inner} 0 1 0 170 ${95 - inner}`}
              fillRule="evenodd"
              className="rf-annulus"
            />
            <circle cx="170" cy="95" r={inner} fill="none" stroke="#6e8558" />
            <text x="170" y="179" textAnchor="middle">
              b₁={format(b1)} fm · b₂={format(b2)} fm
            </text>
          </>
        ) : (
          <>
            <ellipse cx="203" cy="70" rx="12" ry="8" className="rf-annulus" />
            <text x="170" y="179" textAnchor="middle">
              局部映射 · b(θc)={format(b1)} fm
            </text>
          </>
        )}
        <circle cx="170" cy="95" r="3" fill="#576a45" />
        <text x="170" y="22" textAnchor="middle">
          入射平面 · 面积
        </text>
        <path d="M310 96H403m-8-5 8 5-8 5" className="rf-mapping-arrow" />
        <circle cx="555" cy="95" r="64" className="rf-direction-sphere" />
        {ring ? (
          <>
            <g clipPath={`url(#${clip})`}>
              <rect
                x={555 + 64 * Math.cos(radians(m.upperDeg))}
                y="30"
                width={64 * (Math.cos(radians(m.lowerDeg)) - Math.cos(radians(m.upperDeg)))}
                height="130"
                className="rf-acceptance-band"
              />
            </g>
            {[m.lowerDeg, m.upperDeg].map((theta) => (
              <line
                key={theta}
                x1={555 + 64 * Math.cos(radians(theta))}
                x2={555 + 64 * Math.cos(radians(theta))}
                y1={95 - 64 * Math.sin(radians(theta))}
                y2={95 + 64 * Math.sin(radians(theta))}
                className="rf-band-boundary"
              />
            ))}
            <text x="555" y="179" textAnchor="middle">
              球面带的子午投影 · 不是平面扇形面积
            </text>
          </>
        ) : (
          <>
            <ellipse
              cx={555 + 52 * Math.cos(radians(m.centerDeg))}
              cy={95 - 52 * Math.sin(radians(m.centerDeg))}
              rx="10"
              ry="7"
              className="rf-local-patch"
            />
            <text x="555" y="179" textAnchor="middle">
              局部圆面元 · 未绕轴铺满一圈
            </text>
          </>
        )}
        <path d="M555 95H639" className="rf-chart-axis" />
        <text x="643" y="100">
          +x
        </text>
        <text x="555" y="22" textAnchor="middle">
          出射方向 · 立体角
        </text>
        <text x="170" y="208" textAnchor="middle">
          σaccept={format(result.crossSectionBarn)} barn
        </text>
        <text x="555" y="208" textAnchor="middle">
          ΔΩ={format(result.solidAngleSr)} sr
        </text>
      </svg>
      <div className="rf-mapping-buttons">
        <button
          aria-pressed={selected === 'bin-cross-section'}
          onClick={() => onSelect('bin-cross-section')}
        >
          检查 σaccept（面积）
        </button>
        <button aria-pressed={selected === 'solid-angle'} onClick={() => onSelect('solid-angle')}>
          检查 ΔΩ（空间角）
        </button>
      </div>
    </div>
  );
}
function ConditionalHistogram({
  s,
  cutoffDeg,
  seed,
}: {
  s: RutherfordSolution;
  cutoffDeg: number;
  seed: number;
}) {
  const bins = useMemo(() => {
    if (!Number.isFinite(cutoffDeg) || cutoffDeg <= 0 || cutoffDeg >= 180) return [];
    const events = conditionalEvents(s.params, radians(cutoffDeg), 300, seed),
      total = ringBinCrossSectionBarn(radians(cutoffDeg), Math.PI, s.params);
    return Array.from({ length: 8 }, (_, i) => {
      const lo = cutoffDeg + ((180 - cutoffDeg) * i) / 8,
        hi = cutoffDeg + ((180 - cutoffDeg) * (i + 1)) / 8;
      return {
        lo,
        hi,
        observed: events.filter(
          (e) =>
            degrees(e.angleRad) >= lo &&
            (i === 7 ? degrees(e.angleRad) <= hi : degrees(e.angleRad) < hi),
        ).length,
        expected: (300 * ringBinCrossSectionBarn(radians(lo), radians(hi), s.params)) / total,
      };
    });
  }, [s.params, cutoffDeg, seed]);
  if (!bins.length) return null;
  const top = Math.max(...bins.map((b) => Math.max(b.observed, b.expected))) * 1.15;
  const py = (v: number) => 230 - (v / top) * 170;
  return (
    <section className="rf-conditional-sample">
      <span className="rf-section-label">CONDITIONAL SAMPLE / 300 个代表事件</span>
      <p>
        条件：θ≥{cutoffDeg}°；b=bmax√U，按面积抽样。柱高不是 N₀ 的真实探测计数，也不是 barn/sr。
      </p>
      <svg
        viewBox="0 0 730 295"
        role="img"
        aria-label="300 个截止条件下的代表事件直方图：柱为抽样数、折线为归一化理论预期；纵轴事件数"
      >
        <path d="M65 45V230H675" className="rf-chart-axis" />
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line x1="65" x2="675" y1={py(top * f)} y2={py(top * f)} className="rf-chart-grid" />
            <text x="54" y={py(top * f) + 4} textAnchor="end">
              {Math.round(top * f)}
            </text>
          </g>
        ))}
        <text x="65" y="27">
          代表事件数 / count
        </text>
        {bins.map((b, i) => (
          <g key={i}>
            <rect
              x={77 + i * 74}
              y={py(b.observed)}
              width="40"
              height={230 - py(b.observed)}
              className="rf-histogram-bar"
            />
            <text x={97 + i * 74} y="252" textAnchor="middle">
              {Math.round(b.lo)}–{Math.round(b.hi)}
            </text>
          </g>
        ))}
        <path
          d={bins.map((b, i) => `${i ? 'L' : 'M'}${97 + i * 74},${py(b.expected)}`).join(' ')}
          className="rf-theory-counts"
        />
        <text x="675" y="282" textAnchor="end">
          角度区间 θ / °
        </text>
      </svg>
      <div className="rf-chart-legend">
        <span>▰ 柱：面积加权随机样本</span>
        <span>— 线：归一化理论预期</span>
        <span>总事件 = {bins.reduce((n, b) => n + b.observed, 0)}</span>
      </div>
    </section>
  );
}
export function MeasurementView({
  s,
  m,
  result,
  onChange,
  selected,
  onSelect,
  inspectDeg,
  onInspect,
  seed,
  onResample,
}: {
  s: RutherfordSolution;
  m: MeasurementParams;
  result: MeasurementResult;
  onChange: (m: MeasurementParams) => void;
  selected: QuantityId;
  onSelect: (q: QuantityId) => void;
  inspectDeg: number;
  onInspect: (angle: number) => void;
  seed: number;
  onResample: () => void;
}) {
  const observed = useMemo(
    () =>
      result.valid && result.expectedCount !== null
        ? samplePoisson(result.expectedCount, seededRandom(seed ^ 0x7363))
        : null,
    [result.valid, result.expectedCount, seed],
  );
  return (
    <div className="rf-measurement">
      <p className="rf-measurement-note">
        b 控制单粒子示例；固定探测器接受区的截面与计数取决于 E、Z 及探测设置，不随示例 b 改变。
      </p>
      <AcceptanceDiagram s={s} m={m} result={result} selected={selected} onSelect={onSelect} />
      <MathFormula
        tex={String.raw`[[differential-cross-section:\frac{d\sigma}{d\Omega}]]=\frac{b}{\sin\theta}\left|\frac{db}{d\theta}\right|=\frac{a^2}{4\sin^4(\theta/2)}`}
        selected={selected}
        onSelect={onSelect}
      />
      <CrossSectionChart
        s={s}
        m={m}
        onChange={onChange}
        inspectDeg={inspectDeg}
        onInspect={onInspect}
      />
      <details className="rf-jacobian">
        <summary>展开截面变换：为什么出现 sin⁻⁴(θ/2)？</summary>
        <p>先比较同一束粒子对应的环面积与完整方位角球面带，再代入 b(θ) 的导数。</p>
        <MathFormula
          tex={String.raw`d\sigma=2\pi b|db|,\quad d\Omega=2\pi\sin\theta|d\theta|\ \Rightarrow\ [[differential-cross-section:\frac{d\sigma}{d\Omega}]]=\frac b{\sin\theta}\left|\frac{db}{d\theta}\right|`}
          selected={selected}
          onSelect={onSelect}
        />
        <MathFormula
          tex={String.raw`[[impact-parameter:b]]=a\cot\frac\theta2,\quad \frac{db}{d\theta}=-\frac a{2\sin^2(\theta/2)},\quad \sin\theta=2\sin\frac\theta2\cos\frac\theta2`}
          selected={selected}
          onSelect={onSelect}
        />
        <MathFormula
          tex={String.raw`\frac{a\cot(\theta/2)}{2\sin(\theta/2)\cos(\theta/2)}\frac a{2\sin^2(\theta/2)}=\frac{a^2}{4\sin^4(\theta/2)}`}
        />
        <p>
          2π 因子对应全环，不能直接套用到局部面元。σ 有面积单位，Ω
          是立体角；比值不是单粒子轨迹上的长度。雅可比变换写在
          0°&lt;θ&lt;180°，正后向端点按连续极限取值。
        </p>
      </details>
      <section className="rf-measurement-result">
        <div className="rf-chart-heading">
          <span className="rf-section-label">FROM CROSS SECTION TO COUNTS</span>
          <strong>{m.mode === 'ring' ? '精确环带积分' : '小接受度近似'}</strong>
        </div>
        <MathFormula
          tex={
            m.mode === 'ring'
              ? String.raw`[[bin-cross-section:\sigma_{\rm bin}]]=\pi[b(\theta_1)^2-b(\theta_2)^2]`
              : String.raw`[[bin-cross-section:\sigma_{\rm accept}]]\simeq\left.\frac{d\sigma}{d\Omega}\right|_{\theta_c}[[solid-angle:\Delta\Omega]]`
          }
          selected={selected}
          onSelect={onSelect}
        />
        <MathFormula
          tex={String.raw`[[probability:P]]\simeq[[target-areal-density:n_t]][[bin-cross-section:\sigma_{\rm accept}]],\qquad [[detector-count:\mathbb E[N_{\rm det}]]]=N_0P\eta`}
          selected={selected}
          onSelect={onSelect}
        />
        {result.warnings.length > 0 && (
          <div className="rf-warning" role="alert">
            {result.warnings.map((w) => (
              <p key={w}>{w}</p>
            ))}
          </div>
        )}
        <dl className="rf-count-readouts">
          <div>
            <dt>接受截面 σaccept</dt>
            <dd data-testid="cross-section-value">{format(result.crossSectionBarn)} barn</dd>
          </div>
          <div>
            <dt>单粒子概率 P≈nₜσ</dt>
            <dd data-testid="probability-value">{format(result.probability)}</dd>
          </div>
          <div>
            <dt>预期探测计数 𝔼[Ndet]</dt>
            <dd data-testid="expected-count">{format(result.expectedCount)} count</dd>
          </div>
          <div>
            <dt>一次合成观测 Nsample</dt>
            <dd data-testid="observed-count">
              {observed === null ? '暂停抽样' : observed.toLocaleString('en-US')} count
            </dd>
          </div>
        </dl>
        <div className="rf-sample-actions">
          <button disabled={!result.valid} onClick={onResample}>
            重新抽样
          </button>
          <span>seed = {seed} · 只改变合成观测，不改变理论预期</span>
        </div>
        <p className="rf-small">
          统计模型：稀有独立事件的 Poisson 近似。τ=nₜσ(θ≥θmin)={format(result.opticalDepth)}
          ，本界面要求 τ≤0.05；超过后暂停 P、预期计数与抽样。
        </p>
      </section>
      {result.valid && <ConditionalHistogram s={s} cutoffDeg={m.cutoffDeg} seed={seed} />}
    </div>
  );
}
