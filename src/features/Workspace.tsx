import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Expand,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  SlidersHorizontal,
  BookOpen,
} from 'lucide-react';
import { parts, topics, type Topic } from '../content/knowledge';
import { C, fromEV, toEV, toNM } from '../physics/constants';
import {
  bohrState,
  matterWave,
  photoelectric,
  scattering,
  spectralRegion,
  transition,
} from '../physics/models';
import {
  BohrView,
  ScatteringView,
  OtherView,
  initialParameters,
  views,
  type Parameters,
} from '../visualizations/Views';

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="slider-control">
      <span>
        {label}
        <strong>
          {value} <small>{unit}</small>
        </strong>
      </span>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
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
}
function Readouts({ topic, p }: { topic: Topic; p: Parameters }) {
  let rows: [string, string][] = [];
  if (topic.engine === 'bohr') {
    const t = transition(p.n, p.final, p.z);
    rows = [
      ['初态能量', `${toEV(bohrState(p.n, p.z).energyJ).toFixed(3)} eV`],
      ['初态轨道半径', `${toNM(bohrState(p.n, p.z).radiusM).toFixed(4)} nm`],
      ['跃迁光子能量', `${toEV(t.photonJ).toFixed(3)} eV`],
      ['真空波长', `${toNM(t.wavelengthM).toFixed(2)} nm`],
    ];
  }
  if (topic.engine === 'scattering') {
    const r = scattering(fromEV(p.energy * 1e6), p.impact * 1e-15);
    rows = [
      ['偏转角 θ', `${((r.angleRad * 180) / Math.PI).toFixed(2)}°`],
      ['最近核距离', `${(r.closestM * 1e15).toFixed(2)} fm`],
    ];
  }
  if (topic.engine === 'blackbody')
    rows = [
      ['峰值波长', `${toNM(C.wien / p.temperature).toFixed(1)} nm`],
      ['黑体温度', `${p.temperature} K`],
    ];
  if (topic.engine === 'photoelectric') {
    const r = photoelectric(p.wavelength * 1e-9, fromEV(p.work));
    rows = [
      ['最大动能', `${toEV(r.kineticJ).toFixed(3)} eV`],
      ['遏止电压（能量阈值）', `${r.stoppingV.toFixed(3)} V`],
      ['阈值波长', `${toNM(r.thresholdM).toFixed(1)} nm`],
      ['光源 / 发射状态', p.intensity === 0 ? '光源关闭' : r.emits ? '有光电子' : '无正动能光电子'],
    ];
  }
  if (topic.engine === 'matter')
    rows = [
      ['德布罗意波长', `${toNM(matterWave(p.electronEnergy)).toFixed(4)} nm`],
      ['电子动能', `${p.electronEnergy} eV`],
    ];
  if (topic.engine === 'orbital')
    rows = [
      ['当前量子态', p.orbital],
      ['径向节点数', p.orbital === '2s' ? '1（r = 2a₀）' : '0'],
      ['氢原子能量', `${toEV(bohrState(p.orbital === '1s' ? 1 : 2).energyJ).toFixed(3)} eV`],
    ];
  return (
    <dl className="readouts">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
export function Workspace({ topic }: { topic: Topic }) {
  const defaults = { ...initialParameters, z: topic.id === 'hydrogen-like' ? 2 : 1 };
  const [p, setP] = useState<Parameters>(defaults);
  const [view, setView] = useState(
    topic.id === 'spectroscopy' ? 2 : topic.id === 'transitions' ? 1 : 0,
  );
  const [immersive, setImmersive] = useState(false);
  const [panel, setPanel] = useState('controls');
  const [running, setRunning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) setRunning(false);
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setImmersive(false);
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, []);
  const change = <K extends keyof Parameters>(key: K, value: Parameters[K]) =>
    setP((old) => ({ ...old, [key]: value }));
  const selectN = (n: number) =>
    setP((old) => ({ ...old, n, final: old.final === n ? (n === 1 ? 2 : n - 1) : old.final }));
  const part = parts[topic.part - 1];
  const animated = (topic.engine === 'bohr' && view === 0) || topic.engine === 'photoelectric';
  const details = (
    <section className="knowledge-details" id="knowledge-details">
      <div className="section-heading">
        <div>
          <span className="eyebrow">BEYOND THE VISUALIZATION</span>
          <h2>理解背后的物理</h2>
        </div>
        <a
          className="text-link"
          href="#workspace-top"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('workspace-top')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          返回探索 ↑
        </a>
      </div>
      <div className="detail-grid">
        <article>
          <span className="eyebrow">01 / PRINCIPLE</span>
          <h3>物理原理</h3>
          <p>{topic.principle}</p>
          <div className="equation">{topic.equation}</div>
        </article>
        <article>
          <span className="eyebrow">02 / EVIDENCE</span>
          <h3>实验与解释</h3>
          <p>{topic.evidence}</p>
          <h3 className="small-heading">适用范围与局限</h3>
          <p>{topic.limitation}</p>
        </article>
      </div>
      <details className="history">
        <summary>历史背景与补充阅读</summary>
        <p>{topic.history}</p>
        <p>
          物理常数依据{' '}
          <a href="https://physics.nist.gov/cuu/pdf/all.pdf" target="_blank" rel="noreferrer">
            NIST 2022 CODATA
          </a>
          。模型公式、近似与验证约定见项目文档中的 Implemented Models。
        </p>
      </details>
      <div className="related">
        <span className="eyebrow">CONNECTED IDEAS / 相关知识</span>
        {topic.related.map((id) => {
          const t = topics.find((t) => t.id === id)!;
          return (
            <a key={id} href={`#/topic/${id}`}>
              {t.title}
              <ArrowRight size={14} />
            </a>
          );
        })}
      </div>
    </section>
  );
  return (
    <div className={`module-page ${immersive ? 'immersive' : ''}`} id="workspace-top">
      <div className="breadcrumbs">
        <a href="#/">知识地图</a>
        <span>/</span>
        <a href={`#/part/${part.id}`}>Part {part.numeral}</a>
        <span>/</span>
        <span>{topic.title}</span>
      </div>
      <div className="module-heading">
        <div>
          <span className="eyebrow">
            PART {part.numeral} / {topic.english.toUpperCase()}
          </span>
          <h1>{topic.title}</h1>
          <p>{topic.description}</p>
        </div>
        {topic.engine && (
          <button
            className="outline-button immersive-toggle"
            onClick={() => setImmersive(!immersive)}
          >
            {immersive ? <Minimize2 size={15} /> : <Expand size={15} />}
            {immersive ? '返回工作台' : '沉浸模式'}
          </button>
        )}
      </div>
      {topic.engine ? (
        <>
          <div className={`workspace ${topic.engine === 'bohr' ? 'dark-viz' : ''}`}>
            <section className="visual-panel" aria-label="交互可视化">
              <div className="visual-toolbar">
                <div className="view-tabs" role="tablist" aria-label="可视化视图">
                  {views[topic.engine].map((v, i) => (
                    <button
                      role="tab"
                      id={`view-${topic.id}-${i}`}
                      aria-selected={view === i}
                      aria-controls={`visual-${topic.id}`}
                      tabIndex={view === i ? 0 : -1}
                      key={v}
                      onClick={() => setView(i)}
                      onKeyDown={(event) => {
                        const count = views[topic.engine!].length;
                        const next =
                          event.key === 'ArrowRight'
                            ? (i + 1) % count
                            : event.key === 'ArrowLeft'
                              ? (i - 1 + count) % count
                              : event.key === 'Home'
                                ? 0
                                : event.key === 'End'
                                  ? count - 1
                                  : undefined;
                        if (next !== undefined) {
                          event.preventDefault();
                          setView(next);
                          document.getElementById(`view-${topic.id}-${next}`)?.focus();
                        }
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <span className="provenance">
                  <i />
                  理论预测
                </span>
              </div>
              <div
                className="visual-content"
                id={`visual-${topic.id}`}
                role="tabpanel"
                aria-labelledby={`view-${topic.id}-${view}`}
              >
                {topic.engine === 'bohr' ? (
                  <BohrView
                    p={p}
                    view={view}
                    running={running && !reducedMotion}
                    setPair={(n, final) => setP((old) => ({ ...old, n, final }))}
                  />
                ) : topic.engine === 'scattering' ? (
                  <ScatteringView p={p} view={view} />
                ) : (
                  <OtherView engine={topic.engine} p={p} running={running && !reducedMotion} />
                )}
              </div>
              <div className="visual-footer">
                <div>
                  {animated && (
                    <button
                      className="icon-button"
                      aria-label={running ? '暂停动画' : '播放动画'}
                      disabled={reducedMotion}
                      onClick={() => setRunning(!running)}
                    >
                      {running ? <Pause size={15} /> : <Play size={15} />}
                    </button>
                  )}
                  <button
                    className="icon-button"
                    aria-label="重置参数"
                    onClick={() => {
                      setP(defaults);
                      setRunning(false);
                    }}
                  >
                    <RotateCcw size={15} />
                  </button>
                  <span>
                    {topic.engine === 'bohr'
                      ? `${p.n} → ${p.final} · ${transition(p.n, p.final, p.z).kind === 'emission' ? '发射' : '吸收'} · ${spectralRegion(toNM(transition(p.n, p.final, p.z).wavelengthM))}`
                      : '调整参数，观察理论关系'}
                    {reducedMotion && animated ? ' · 已遵循减少动态效果偏好' : ''}
                  </span>
                </div>
                <a
                  href="#knowledge-details"
                  onClick={(e) => {
                    e.preventDefault();
                    if (immersive) setImmersive(false);
                    setTimeout(
                      () =>
                        document
                          .getElementById('knowledge-details')
                          ?.scrollIntoView({ behavior: 'smooth' }),
                      0,
                    );
                  }}
                >
                  知识详解 <ArrowDown size={14} />
                </a>
              </div>
            </section>
            {!immersive && (
              <aside className="control-panel" aria-label="可视化控制与解释">
                <div className="panel-tabs">
                  <button
                    className={panel === 'controls' ? 'active' : ''}
                    onClick={() => setPanel('controls')}
                  >
                    <SlidersHorizontal size={14} />
                    参数控制
                  </button>
                  <button
                    className={panel === 'context' ? 'active' : ''}
                    onClick={() => setPanel('context')}
                  >
                    <BookOpen size={14} />
                    物理解释
                  </button>
                </div>
                {panel === 'controls' ? (
                  <div className="panel-content">
                    <span className="eyebrow">EXPLORE THE PARAMETERS</span>
                    {topic.engine === 'bohr' && (
                      <>
                        <label className="select-control">
                          单电子体系
                          <select
                            aria-label="单电子体系"
                            value={p.z}
                            onChange={(e) => change('z', Number(e.target.value))}
                          >
                            <option value="1">H · 氢原子</option>
                            <option value="2">He⁺ · 氦离子</option>
                            <option value="3">Li²⁺ · 锂离子</option>
                          </select>
                        </label>
                        <div className="state-label">初态主量子数 n</div>
                        <div className="quantum-buttons">
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <button
                              key={n}
                              aria-label={`初态 n = ${n}`}
                              aria-pressed={p.n === n}
                              className={p.n === n ? 'active' : ''}
                              onClick={() => selectN(n)}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                        <label className="select-control">
                          末态主量子数
                          <select
                            aria-label="末态主量子数"
                            value={p.final}
                            onChange={(e) => change('final', Number(e.target.value))}
                          >
                            {[1, 2, 3, 4, 5, 6]
                              .filter((n) => n !== p.n)
                              .map((n) => (
                                <option value={n} key={n}>
                                  n = {n}
                                </option>
                              ))}
                          </select>
                        </label>
                      </>
                    )}
                    {topic.engine === 'scattering' && (
                      <>
                        <Slider
                          label="碰撞参数 b"
                          value={p.impact}
                          min={0}
                          max={200}
                          unit="fm"
                          onChange={(v) => change('impact', v)}
                        />
                        <Slider
                          label="α 粒子动能"
                          value={p.energy}
                          min={1}
                          max={10}
                          step={0.5}
                          unit="MeV"
                          onChange={(v) => change('energy', v)}
                        />
                      </>
                    )}
                    {topic.engine === 'blackbody' && (
                      <Slider
                        label="黑体温度"
                        value={p.temperature}
                        min={2500}
                        max={9000}
                        step={100}
                        unit="K"
                        onChange={(v) => change('temperature', v)}
                      />
                    )}
                    {topic.engine === 'photoelectric' && (
                      <>
                        <Slider
                          label="入射光波长"
                          value={p.wavelength}
                          min={200}
                          max={800}
                          step={5}
                          unit="nm"
                          onChange={(v) => change('wavelength', v)}
                        />
                        <Slider
                          label="金属逸出功"
                          value={p.work}
                          min={1.5}
                          max={5.5}
                          step={0.1}
                          unit="eV"
                          onChange={(v) => change('work', v)}
                        />
                        <Slider
                          label="相对光强"
                          value={p.intensity}
                          min={0}
                          max={100}
                          step={10}
                          unit="%"
                          onChange={(v) => change('intensity', v)}
                        />
                      </>
                    )}
                    {topic.engine === 'matter' && (
                      <Slider
                        label="电子动能"
                        value={p.electronEnergy}
                        min={10}
                        max={200}
                        step={5}
                        unit="eV"
                        onChange={(v) => change('electronEnergy', v)}
                      />
                    )}
                    {topic.engine === 'orbital' && (
                      <label className="select-control">
                        氢原子量子态
                        <select
                          aria-label="氢原子量子态"
                          value={p.orbital}
                          onChange={(e) =>
                            change('orbital', e.target.value as Parameters['orbital'])
                          }
                        >
                          <option>1s</option>
                          <option>2s</option>
                          <option>2p</option>
                        </select>
                      </label>
                    )}
                    <div className="panel-divider" />
                    <span className="eyebrow">LIVE READOUT / 理论计算</span>
                    <Readouts topic={topic} p={p} />
                    <div className="observation">
                      <span>观察提示</span>
                      <p>
                        {topic.engine === 'bohr'
                          ? '改变初态或核电荷，比较能量差与波长。更大的能量差，对应更短的波长。'
                          : topic.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="panel-content context-content">
                    <h3>当前视图 · {views[topic.engine][view]}</h3>
                    <p>{topic.principle}</p>
                    <div className="equation">{topic.equation}</div>
                    <h3>模型边界</h3>
                    <p>{topic.limitation}</p>
                    <a href="#/reference" className="text-link">
                      查看常数与单位 <ArrowRight size={14} />
                    </a>
                  </div>
                )}
              </aside>
            )}
          </div>
          <div className="model-note">
            <span>模型说明</span>
            <p>{topic.limitation}</p>
          </div>
        </>
      ) : (
        <section className="reading-intro">
          <BookOpen size={30} strokeWidth={1} />
          <span className="eyebrow">CONCEPT NOTE / 概念模块</span>
          <h2>{topic.equation}</h2>
          <p>{topic.principle}</p>
          <span className="status-pill">知识内容已开放 · 专题交互可视化待开发</span>
          <a
            className="text-link"
            href="#knowledge-details"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('knowledge-details')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            继续阅读 <ArrowDown size={15} />
          </a>
        </section>
      )}
      {!immersive && details}
      <div className="module-back">
        <a href={`#/part/${topic.part}`}>
          <ArrowLeft size={15} />
          返回 Part {part.numeral} 知识地图
        </a>
      </div>
    </div>
  );
}
