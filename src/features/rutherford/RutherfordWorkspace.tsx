import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { scatteringFormula } from '../../content/rutherfordDerivations';
import {
  degrees,
  FM,
  invariants,
  pointAtParameter,
  solveRutherford,
} from '../../physics/rutherford/coulomb';
import { measurementDefaults, predictMeasurement } from '../../physics/rutherford/experiment';
import type {
  MeasurementParams,
  QuantityId,
  RutherfordParams,
} from '../../physics/rutherford/types';
import { MathFormula } from './MathFormula';
import { GeometryView, defaultOverlays, type Overlays } from './GeometryView';
import { QuantityInspector, quantityValues } from './QuantityInspector';
import { DerivationExplorer, type DerivationRoute } from './DerivationExplorer';
import { MeasurementControls, MeasurementView } from './MeasurementView';
import './rutherford.css';

const defaults: RutherfordParams = { energyMeV: 5, nuclearCharge: 79, impactFm: 40 };
const titles = ['散射几何', '推导探索', '截面与测量'];
const statisticalQuantities: QuantityId[] = [
  'solid-angle',
  'differential-cross-section',
  'bin-cross-section',
  'target-areal-density',
  'probability',
  'detector-count',
];
export function RutherfordWorkspace({ immersive }: { immersive: boolean }) {
  const [p, setP] = useState(defaults),
    [m, setM] = useState<MeasurementParams>(measurementDefaults);
  const [view, setView] = useState(0),
    [selected, setSelected] = useState<QuantityId>('impact-parameter');
  const [progress, setProgress] = useState(0.5),
    [playing, setPlaying] = useState(false),
    [reducedMotion, setReducedMotion] = useState(false);
  const [overlays, setOverlays] = useState(defaultOverlays),
    [route, setRoute] = useState<DerivationRoute>('vector'),
    [step, setStep] = useState(0);
  const [inspectAngle, setInspectAngle] = useState(65),
    [seed, setSeed] = useState(42);
  const [narrow, setNarrow] = useState(false),
    [panelOpen, setPanelOpen] = useState(false);
  useEffect(() => {
    const media = matchMedia('(max-width: 760px)');
    const update = () => setNarrow(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const s = useMemo(() => solveRutherford(p), [p]);
  const point = useMemo(
    () => pointAtParameter(p, s.maxOrbitParameter * (2 * progress - 1)),
    [p, progress, s.maxOrbitParameter],
  );
  const result = useMemo(() => predictMeasurement(p, m), [p, m]);
  const inspectDeg = Math.max(
    Number.isFinite(m.cutoffDeg) && m.cutoffDeg > 0 && m.cutoffDeg < 180 ? m.cutoffDeg : 1,
    Math.min(180, inspectAngle),
  );
  const values = quantityValues(s, point, m, result, inspectDeg);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) setPlaying(false);
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!playing || reducedMotion || view === 2) return;
    const timer = setInterval(() => setProgress((value) => Math.min(1, value + 0.006)), 40);
    return () => clearInterval(timer);
  }, [playing, reducedMotion, view]);
  useEffect(() => {
    if (progress >= 1 || view === 2) setPlaying(false);
  }, [progress, view]);
  const selectQuantity = (quantity: QuantityId) => {
    setSelected(quantity);
    if (narrow) setPanelOpen(true);
    if (statisticalQuantities.includes(quantity)) setView(2);
    else if (view === 2) setView(0);
    const mapping: Partial<Record<QuantityId, keyof Overlays>> = {
      'impact-parameter': 'impact',
      'scattering-angle': 'angle',
      distance: 'position',
      'closest-approach': 'closest',
      force: 'force',
      velocity: 'velocity',
    };
    const overlay = mapping[quantity];
    if (overlay) setOverlays((old) => ({ ...old, [overlay]: true }));
  };
  const reset = () => {
    setP(defaults);
    setM(measurementDefaults);
    setProgress(0.5);
    setPlaying(false);
    setSeed(42);
    setInspectAngle(65);
    setOverlays(defaultOverlays);
    setSelected('impact-parameter');
  };
  const parameter = (
    key: keyof RutherfordParams,
    label: string,
    min: number,
    max: number,
    unit: string,
    stepValue = 1,
  ) => (
    <label className="slider-control" key={key}>
      <span>
        {label}
        <strong>
          {Number(p[key].toFixed(3))} <small>{unit}</small>
        </strong>
      </span>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={key === 'impactFm' ? 'any' : stepValue}
        value={p[key]}
        onChange={(e) => setP((old) => ({ ...old, [key]: Number(e.target.value) }))}
      />
      <span className="range-limits">
        <small>
          {min} {unit}
        </small>
        <small>
          {max} {unit}
        </small>
      </span>
    </label>
  );
  return (
    <section
      className={`rf-module ${immersive ? 'rf-immersive' : ''}`}
      aria-label="Rutherford 数学探索工作台"
    >
      <div className="rf-intro">
        <span className="rf-section-label">GEOMETRY → CROSS SECTION → MEASUREMENT</span>
        <p>从一次偏转，走向可以计数的预测。</p>
        <button
          onClick={() =>
            document
              .getElementById('rf-assumptions')
              ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
          }
        >
          查看模型假设 ↓
        </button>
      </div>
      <div className="rf-view-tabs" role="tablist" aria-label="Rutherford 视图">
        {titles.map((title, i) => (
          <button
            key={title}
            role="tab"
            id={`rf-tab-${i}`}
            aria-controls="rf-current-view"
            aria-selected={view === i}
            tabIndex={view === i ? 0 : -1}
            onClick={() => setView(i)}
            onKeyDown={(e) => {
              const next =
                e.key === 'ArrowRight'
                  ? (i + 1) % 3
                  : e.key === 'ArrowLeft'
                    ? (i + 2) % 3
                    : e.key === 'Home'
                      ? 0
                      : e.key === 'End'
                        ? 2
                        : undefined;
              if (next !== undefined) {
                e.preventDefault();
                setView(next);
                document.getElementById(`rf-tab-${next}`)?.focus();
              }
            }}
          >
            <span>0{i + 1}</span>
            {title}
          </button>
        ))}
      </div>
      {!immersive && (
        <button
          className="rf-mobile-tools"
          aria-controls="rf-quantity-sidebar"
          aria-expanded={panelOpen}
          onClick={() => setPanelOpen((value) => !value)}
        >
          {panelOpen ? '收起参数与物理量' : '调整参数与物理量'} <span>{panelOpen ? '−' : '+'}</span>
        </button>
      )}
      <div className="rf-layout">
        <div className="rf-main visual-panel">
          <div className="rf-state-banner">
            <span>α · z = 2 · 固定点核</span>
            <span data-testid="rutherford-state">
              E={p.energyMeV} MeV · Z={p.nuclearCharge} · b={p.impactFm} fm
            </span>
            <b data-testid="rutherford-angle">θ={degrees(s.angleRad).toFixed(3)}°</b>
          </div>
          <div
            className="visual-content"
            role="tabpanel"
            id="rf-current-view"
            aria-labelledby={`rf-tab-${view}`}
          >
            {view === 0 ? (
              <>
                <GeometryView
                  solution={s}
                  point={point}
                  selected={selected}
                  onSelect={selectQuantity}
                  onImpact={(b) => {
                    setP((old) => ({ ...old, impactFm: b }));
                    setSelected('impact-parameter');
                  }}
                  overlays={overlays}
                />
                <div className="rf-overlay-toggles" aria-label="几何叠加层">
                  {(
                    [
                      ['impact', 'b'],
                      ['angle', 'θ'],
                      ['position', 'r'],
                      ['closest', 'rmin'],
                      ['force', 'F'],
                      ['velocity', 'v'],
                      ['components', '径向/切向速度'],
                    ] as [keyof Overlays, string][]
                  ).map(([key, label]) => (
                    <label key={key}>
                      <input
                        type="checkbox"
                        checked={overlays[key]}
                        onChange={(e) =>
                          setOverlays((old) => ({ ...old, [key]: e.target.checked }))
                        }
                      />
                      显示 {label}
                    </label>
                  ))}
                </div>
                <div className="rf-geometry-prompts">
                  <button
                    onClick={() => {
                      setRoute('vector');
                      setStep(2);
                      setView(1);
                      setSelected('force');
                    }}
                  >
                    推导 θ：为什么可以消去 r²？ →
                  </button>
                  <button onClick={() => selectQuantity('differential-cross-section')}>
                    从 θ 走向 dσ/dΩ →
                  </button>
                </div>
              </>
            ) : view === 1 ? (
              <DerivationExplorer
                s={s}
                point={point}
                route={route}
                step={step}
                setRoute={setRoute}
                setStep={setStep}
                selected={selected}
                onSelect={selectQuantity}
              />
            ) : (
              <MeasurementView
                s={s}
                m={m}
                result={result}
                onChange={setM}
                selected={selected}
                onSelect={selectQuantity}
                inspectDeg={inspectDeg}
                onInspect={setInspectAngle}
                seed={seed}
                onResample={() => setSeed((value) => value + 1)}
              />
            )}
          </div>
          <section className="rf-formula-panel" aria-label="联动散射公式">
            <div className="rf-section-label">LINKED EQUATION / 点击符号，连接图形与物理量</div>
            <MathFormula
              tex={
                p.impactFm > 0
                  ? scatteringFormula
                  : String.raw`[[scattering-angle:\theta]]=\pi,\qquad [[closest-approach:r_{\min}]]=\frac\kappa{[[energy:E]]}=2a`
              }
              selected={selected}
              onSelect={selectQuantity}
            />
            <div className="rf-coupling">
              <span>κ = 2Z e²/(4πε₀) = {s.kappaMeVFm.toFixed(4)} MeV·fm</span>
              <span>a = κ/(2E) = {(s.aM / FM).toFixed(4)} fm</span>
            </div>
          </section>
          {view !== 2 && (
            <div className="rf-transport">
              <button
                aria-label={playing ? '暂停 Rutherford 动画' : '播放 Rutherford 动画'}
                disabled={reducedMotion}
                onClick={() => {
                  if (progress === 1) setProgress(0);
                  setPlaying(!playing);
                }}
              >
                {playing ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <button
                aria-label="从入射端重新开始"
                onClick={() => {
                  setProgress(0);
                  setPlaying(false);
                }}
              >
                <RotateCcw size={15} />
              </button>
              <label>
                轨道参数（非均匀物理时间）
                <input
                  aria-label="当前轨道位置"
                  type="range"
                  min={0}
                  max={1}
                  step={0.005}
                  value={progress}
                  onChange={(e) => {
                    setProgress(Number(e.target.value));
                    setPlaying(false);
                  }}
                />
              </label>
              <output>{Math.round(progress * 100)}%</output>
              {reducedMotion && <span>已减少动态效果，仍可手动拖动</span>}
            </div>
          )}
        </div>
        <aside
          className="rf-sidebar control-panel"
          id="rf-quantity-sidebar"
          hidden={immersive || (narrow && !panelOpen)}
          aria-label="Rutherford 参数与物理量"
        >
          <details className="rf-parameter-drawer" open>
            <summary>实验参数与几何控制</summary>
            <div className="rf-parameter-body">
              <div className="rf-section-label">SHARED INPUTS / 三个视图共用</div>
              {parameter('energyMeV', '入射能量 E', 2, 10, 'MeV', 0.25)}
              {parameter('nuclearCharge', '核电荷数 Z', 20, 90, '')}
              {parameter('impactFm', '碰撞参数 b', 0, 200, 'fm')}
              <div className="rf-presets">
                <button onClick={() => setP(defaults)}>金核基准</button>
                <button
                  onClick={() => setP((old) => ({ ...old, impactFm: invariants(old).aM / FM }))}
                >
                  θ=90°
                </button>
                <button onClick={() => setP((old) => ({ ...old, impactFm: 0 }))}>正碰 b=0</button>
              </div>
              <button className="rf-reset-button" onClick={reset}>
                <RotateCcw size={13} />
                重置参数
              </button>
              <p className="rf-small">E 是无穷远动能；试用范围不等同于模型适用范围。</p>
            </div>
          </details>
          {view === 2 && <MeasurementControls m={m} onChange={setM} />}
          <QuantityInspector selected={selected} onSelect={selectQuantity} values={values} />
        </aside>
      </div>
      <details className="rf-assumptions" id="rf-assumptions">
        <summary>模型假设、数据来源与近似边界</summary>
        <div>
          <p>
            非相对论 α
            粒子在固定、无限重的点核库仑势中运动；不计电子屏蔽、靶核反冲、辐射损失、核力、有限核尺寸和多次散射。极小
            b 的结果是点库仑模型的外推。
          </p>
          <p>
            所有轨迹和曲线是理论预测，随机计数与 300 个代表事件是种子可复现的合成数据。θ→0
            的理想截面发散不意味着真实实验有无限计数。薄靶门限针对显式截止范围，不能排除未建模的小角度累积偏转。
          </p>
          <p>
            参考：
            <a
              href="https://phyweb.physics.nus.edu.sg/pc3232/restricted/docs/particle-matter-interactions/radiation-matter_01_cross-sections.html"
              target="_blank"
              rel="noreferrer"
            >
              NUS：截面与散射
            </a>{' '}
            ·{' '}
            <a
              href="https://mhjensen.github.io/Physics321/doc/LectureNotes/_build/html/chapter6.html"
              target="_blank"
              rel="noreferrer"
            >
              MSU PHY321：中心力与散射
            </a>{' '}
            ·{' '}
            <a href="https://physics.nist.gov/cuu/pdf/all.pdf" target="_blank" rel="noreferrer">
              NIST 2022 CODATA
            </a>
          </p>
          <p>两条核心推导共用解析模型。分析力学第三路线仍为资料待补的预览。</p>
        </div>
      </details>
    </section>
  );
}
