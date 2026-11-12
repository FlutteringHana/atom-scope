import { useId } from 'react';
import { Chart } from '../components/Chart';
import { C, fromEV, toEV, toNM } from '../physics/constants';
import {
  bohrState,
  matterWave,
  photoelectric,
  planck,
  radialProbability,
  rayleighJeans,
  scattering,
  scatteringPath,
  spectralRegion,
  transition,
  wavelengthColor,
  type Orbital,
} from '../physics/models';
import type { Engine } from '../content/knowledge';

export interface Parameters {
  n: number;
  final: number;
  z: number;
  impact: number;
  energy: number;
  temperature: number;
  wavelength: number;
  work: number;
  intensity: number;
  electronEnergy: number;
  orbital: Orbital;
}
export const initialParameters: Parameters = {
  n: 3,
  final: 2,
  z: 1,
  impact: 60,
  energy: 5,
  temperature: 5500,
  wavelength: 350,
  work: 2.3,
  intensity: 60,
  electronEnergy: 100,
  orbital: '1s',
};
export const views: Record<Engine, string[]> = {
  bohr: ['原子模型', '能级图', '光谱'],
  scattering: ['散射轨迹', '实验装置', '偏转曲线'],
  blackbody: ['辐射谱'],
  photoelectric: ['光电实验'],
  matter: ['物质波'],
  orbital: ['径向概率'],
};
const levels = [1, 2, 3, 4, 5, 6];

export function BohrView({
  p,
  view,
  running,
  setPair,
}: {
  p: Parameters;
  view: number;
  running: boolean;
  setPair: (initial: number, final: number) => void;
}) {
  const t = transition(p.n, p.final, p.z);
  if (view === 2) {
    const emission = t.kind === 'emission';
    const fixed = emission ? p.final : p.n;
    const lines = levels
      .filter((n) => n > fixed)
      .map((n) => ({
        n,
        initial: emission ? n : fixed,
        final: emission ? fixed : n,
        nm: toNM(transition(n, fixed, p.z).wavelengthM),
      }));
    const max = Math.max(800, ...lines.map((l) => l.nm)) * 1.05;
    return (
      <div className="spectrum-view">
        <div className="viz-heading">
          <span>THEORETICAL {emission ? 'EMISSION' : 'ABSORPTION'} SPECTRUM</span>
          <h3>每一道光，都是一次能量交换。</h3>
          <p>
            {emission ? '发射系列末态' : '吸收系列初态'} n = {fixed} · 理论真空波长 · 线高为示意
          </p>
        </div>
        {lines.length ? (
          <>
            <svg
              viewBox="0 0 730 240"
              role="img"
              aria-label={`理论${emission ? '发射' : '吸收'}谱线位置，横轴为真空波长 nm`}
            >
              <line x1="55" y1="190" x2="685" y2="190" stroke="#586474" />
              {Array.from({ length: 6 }, (_, i) => (
                <text
                  key={i}
                  x={55 + i * 126}
                  y="215"
                  fill="#aeb9c8"
                  textAnchor="middle"
                  fontSize="12"
                >
                  {Math.round((i * max) / 5)}
                </text>
              ))}
              {lines.map((l) => (
                <g key={l.n}>
                  <line
                    x1={55 + (l.nm / max) * 630}
                    x2={55 + (l.nm / max) * 630}
                    y1="75"
                    y2="185"
                    stroke={wavelengthColor(l.nm)}
                    strokeWidth={l.initial === p.n && l.final === p.final ? 5 : 2}
                  />
                </g>
              ))}
              <text x="685" y="238" fill="#aeb9c8" textAnchor="end" fontSize="12">
                真空波长 λ / nm
              </text>
            </svg>
            <div className="spectrum-lines">
              {lines.map((l) => (
                <button
                  key={l.n}
                  className={l.initial === p.n && l.final === p.final ? 'selected' : ''}
                  onClick={() => setPair(l.initial, l.final)}
                >
                  <i style={{ background: wavelengthColor(l.nm) }} />
                  <strong>
                    {l.initial} → {l.final}
                  </strong>
                  <span>{l.nm.toFixed(2)} nm</span>
                  <small>{spectralRegion(l.nm)}</small>
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="empty-spectrum">
            所支持的 n ≤ 6 中，没有向 n = 6 发射的更高能级。请选择较低末态。
          </p>
        )}
      </div>
    );
  }
  return (
    <div className={`bohr-view ${view === 1 ? 'energy-focus' : ''}`}>
      {view === 0 && (
        <div className="atom-diagram">
          <svg
            viewBox="0 0 470 435"
            role="img"
            aria-label={`玻尔模型，初态 n=${p.n}，末态 n=${p.final}，轨道大小为压缩示意`}
          >
            <defs>
              <radialGradient id="nucleusGlow">
                <stop stopColor="#e1bd83" stopOpacity=".25" />
                <stop offset="1" stopColor="#e1bd83" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="235" cy="212" r="60" fill="url(#nucleusGlow)" />
            {levels.map((n) => (
              <g key={n}>
                <circle
                  cx="235"
                  cy="212"
                  r={(n * 29) / Math.sqrt(p.z)}
                  fill="none"
                  stroke={n === p.n ? '#c9d79b' : n === p.final ? '#d7ad73' : '#42505a'}
                  strokeWidth={n === p.n ? 1.8 : 1}
                  strokeDasharray={n === p.final ? '4 5' : undefined}
                />
                <text
                  x={240 + (n * 29) / Math.sqrt(p.z)}
                  y="207"
                  fill={n === p.n ? '#d6e7a9' : '#81909b'}
                  fontSize="11"
                >
                  {n}
                </text>
              </g>
            ))}
            <circle cx="235" cy="212" r="9" fill="#dcba85" />
            <text x="235" y="242" textAnchor="middle" fill="#d0b88e" fontSize="12">
              +{p.z}e
            </text>
            <g
              className={running ? 'electron-motion playing' : 'electron-motion'}
              style={{ transformOrigin: '235px 212px' }}
            >
              <circle
                cx={235 - (p.n * 29) / Math.sqrt(p.z)}
                cy="212"
                r="13"
                fill="#c9d79b"
                opacity=".12"
              />
              <circle cx={235 - (p.n * 29) / Math.sqrt(p.z)} cy="212" r="4.5" fill="#d7e5b4" />
            </g>
            <text x="235" y="422" textAnchor="middle" fill="#8f9ca8" fontSize="11">
              轨道示意 · 半径比例已压缩 · 运动速度非物理时间
            </text>
          </svg>
          <div className="atom-key">
            <span>
              <i />
              初态 n = {p.n}
            </span>
            <span>
              <i />
              末态 n = {p.final}
            </span>
          </div>
        </div>
      )}
      <div className="energy-diagram">
        <div className="mini-label">
          ENERGY LEVELS <span>能量 / eV</span>
        </div>
        <svg viewBox="0 0 260 390" role="img" aria-label="玻尔能级图，能量轴为线性刻度">
          <defs>
            <marker
              id="energy-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10Z" fill="#d7ad73" />
            </marker>
          </defs>
          <line x1="42" x2="42" y1="20" y2="350" stroke="#56606b" />
          <line x1="42" x2="220" y1="25" y2="25" stroke="#63707b" strokeDasharray="4 4" />
          <text x="26" y="29" fill="#9eaab5" fontSize="11">
            0
          </text>
          {levels.map((n) => {
            const y = 25 + 300 / n ** 2;
            return (
              <g key={n}>
                <line
                  x1="54"
                  x2="205"
                  y1={y}
                  y2={y}
                  stroke={n === p.n ? '#c9d79b' : n === p.final ? '#d7ad73' : '#52616a'}
                  strokeWidth={n === p.n || n === p.final ? 2 : 1}
                />
                <path
                  d={`M205 ${y} H211 L224 ${n >= 3 ? 130 - 17 * n : y}`}
                  fill="none"
                  stroke="#52616a"
                  strokeWidth=".8"
                />
                <text x="230" y={n >= 3 ? 134 - 17 * n : y + 4} fill="#aebac3" fontSize="11">
                  {n}
                </text>
                {n <= 3 && (
                  <text x="31" y={y + 4} textAnchor="end" fill="#99a7b2" fontSize="10">
                    {toEV(bohrState(n, p.z).energyJ).toFixed(2)}
                  </text>
                )}
              </g>
            );
          })}
          <line
            x1="140"
            x2="140"
            y1={25 + 300 / p.n ** 2}
            y2={25 + 300 / p.final ** 2}
            stroke="#d7ad73"
            strokeWidth="2"
            markerEnd="url(#energy-arrow)"
          />
          <text x="140" y="370" textAnchor="middle" fill="#d7c5a9" fontSize="12">
            {p.n} → {p.final} · {t.kind === 'emission' ? '发射' : '吸收'}
          </text>
        </svg>
      </div>
    </div>
  );
}

export function ScatteringView({ p, view }: { p: Parameters; view: number }) {
  const clip = useId();
  if (view === 1)
    return (
      <div className="apparatus">
        <span className="eyebrow">GOLD FOIL EXPERIMENT · 装置示意</span>
        <svg
          viewBox="0 0 730 370"
          role="img"
          aria-label="α 粒子源、准直器、金箔与荧光屏的实验装置示意"
        >
          <rect x="65" y="140" width="80" height="85" rx="4" fill="#d9c09b" />
          <text x="105" y="258" textAnchor="middle">
            α 粒子源
          </text>
          <path d="M175 125V173M175 192V240" stroke="#778173" strokeWidth="10" />
          <text x="181" y="285" textAnchor="middle">
            准直器
          </text>
          <line
            x1="115"
            y1="183"
            x2="395"
            y2="183"
            stroke="#a87043"
            strokeWidth="2"
            strokeDasharray="5 6"
          />
          <rect x="393" y="100" width="5" height="170" fill="#c59a45" />
          <text x="396" y="303" textAnchor="middle">
            极薄金箔
          </text>
          <path d="M475 65 A160 160 0 0 1 475 307" fill="none" stroke="#8b9a73" strokeWidth="12" />
          <text x="605" y="170">
            荧光屏
          </text>
          <path
            d="M398 183L552 183M398 183L530 102M398 183L300 80"
            stroke="#a87043"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="300" cy="80" r="4" fill="#a87043" />
        </svg>
        <p>装置帮助理解实验安排；可调轨迹位于“散射轨迹”视图，均为单核库仑模型。</p>
      </div>
    );
  if (view === 2)
    return (
      <Chart
        xMax={200}
        yMax={180}
        xLabel="碰撞参数 b / fm"
        yLabel="偏转角 θ / °"
        series={[
          {
            label: `${p.energy} MeV α 粒子 · 金核理论预测`,
            color: '#a36540',
            values: Array.from({ length: 201 }, (_, b) => ({
              x: b,
              y: (scattering(fromEV(p.energy * 1e6), b * 1e-15).angleRad * 180) / Math.PI,
            })),
          },
        ]}
      />
    );
  const path = scatteringPath(fromEV(p.energy * 1e6), p.impact * 1e-15);
  const scale = 0.4;
  return (
    <div className="scattering-scene">
      <svg
        viewBox="0 0 730 450"
        role="img"
        aria-label="α 粒子的理论库仑散射轨迹，横纵轴同尺度，单位 fm"
      >
        <defs>
          <clipPath id={clip}>
            <rect x="65" y="55" width="600" height="330" />
          </clipPath>
        </defs>
        <g className="chart-grid">
          {[-600, -300, 0, 300, 600].map((x) => (
            <g key={x}>
              <line x1={365 + x * scale} x2={365 + x * scale} y1="55" y2="385" />
              <text x={365 + x * scale} y="408" textAnchor="middle">
                {x}
              </text>
            </g>
          ))}
          {[-300, 0, 300].map((y) => (
            <g key={y}>
              <line x1="65" x2="665" y1={260 - y * scale} y2={260 - y * scale} />
              <text x="55" y={264 - y * scale} textAnchor="end">
                {y}
              </text>
            </g>
          ))}
        </g>
        <g clipPath={`url(#${clip})`}>
          <line
            x1="65"
            x2="365"
            y1={260 - p.impact * scale}
            y2={260 - p.impact * scale}
            stroke="#71816b"
            strokeDasharray="4 5"
          />
          <path
            d={path
              .map(
                (v, i) =>
                  `${i ? 'L' : 'M'}${365 + (v.xM / 1e-15) * scale},${260 - (v.yM / 1e-15) * scale}`,
              )
              .join(' ')}
            fill="none"
            stroke="#a6653d"
            strokeWidth="2.8"
          />
          <circle cx="365" cy="260" r="8" fill="#b18b45" />
          <line x1="230" x2="230" y1="260" y2={260 - p.impact * scale} stroke="#6c8060" />
          <text x="205" y={250 - (p.impact * scale) / 2} fill="#50674b" fontSize="12">
            b
          </text>
        </g>
        <text x="80" y="35" className="chart-label">
          位置 y / fm
        </text>
        <text x="665" y="436" textAnchor="end" className="chart-label">
          位置 x / fm
        </text>
        <text x="380" y="285" fill="#7f6a3b" fontSize="12">
          Au · Z = 79（核标记放大）
        </text>
      </svg>
      <div className="chart-legend">
        <span>
          <i style={{ background: '#a6653d' }} />α 粒子理论轨迹
        </span>
        <span>固定点核 · 单次散射 · 非相对论</span>
      </div>
    </div>
  );
}

export function OtherView({
  engine,
  p,
  running,
}: {
  engine: Engine;
  p: Parameters;
  running: boolean;
}) {
  if (engine === 'blackbody') {
    const samples = Array.from({ length: 481 }, (_, i) => (100 + i * 5) * 1e-9);
    const peak = planck(C.wien / p.temperature, p.temperature) * 1e-12;
    return (
      <Chart
        xMin={100}
        xMax={2500}
        yMax={Math.ceil(peak * 1.2)}
        xLabel="波长 λ / nm"
        yLabel="谱辐亮度 Bλ / MW·sr⁻¹·m⁻²·μm⁻¹"
        series={[
          {
            label: `普朗克定律 · ${p.temperature} K`,
            color: '#a36540',
            values: samples.map((w) => ({ x: toNM(w), y: planck(w, p.temperature) * 1e-12 })),
          },
          {
            label: '瑞利–金斯定律',
            color: '#7f8b75',
            dashed: true,
            values: samples.map((w) => ({
              x: toNM(w),
              y: rayleighJeans(w, p.temperature) * 1e-12,
            })),
          },
        ]}
      />
    );
  }
  if (engine === 'orbital')
    return (
      <Chart
        xMax={20}
        yMax={0.6}
        xLabel="半径 r / a₀"
        yLabel="径向概率 a₀P(r) / 无量纲"
        series={(['1s', '2s', '2p'] as const).map((state, i) => ({
          label: `${state}${state === p.orbital ? ' · 当前态' : ''}`,
          color: ['#59724b', '#b7784d', '#64849b'][i],
          dashed: state !== p.orbital,
          values: Array.from({ length: 401 }, (_, j) => ({
            x: j / 20,
            y: radialProbability(j / 20, state),
          })),
        }))}
      />
    );
  if (engine === 'matter') {
    const nm = toNM(matterWave(p.electronEnergy));
    return (
      <div className="matter-scene">
        <div className="viz-heading">
          <span>DE BROGLIE MATTER WAVES</span>
          <h3>动量越大，波长越短。</h3>
          <p>自由电子 · 实部相位示意 · λ = {nm.toFixed(4)} nm</p>
        </div>
        <svg
          viewBox="0 0 730 275"
          role="img"
          aria-label="自由电子物质波的实部相位示意，横轴 nm，纵轴相对幅度"
        >
          <line x1="55" x2="685" y1="130" y2="130" stroke="#b9c2b2" />
          <text x="55" y="25" className="chart-label">
            相对幅度（示意）
          </text>
          <path
            className={running ? 'wave-phase playing' : 'wave-phase'}
            d={Array.from(
              { length: 1001 },
              (_, i) =>
                `${i ? 'L' : 'M'}${55 + i * 0.63},${130 - 65 * Math.sin((i / 1000 / nm) * 2 * Math.PI)}`,
            ).join(' ')}
            stroke="#627a4e"
            strokeWidth="2.5"
            fill="none"
          />
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((x) => (
            <text key={x} x={55 + x * 630} y="230" textAnchor="middle" className="chart-label">
              {x}
            </text>
          ))}
          <text x="685" y="265" textAnchor="end" className="chart-label">
            位置 x / nm
          </text>
        </svg>
        <p className="scene-note">
          曲线不是电子轨迹，也不是概率密度。这是静态相位截面，不表示实际相速度。
        </p>
      </div>
    );
  }
  const result = photoelectric(p.wavelength * 1e-9, fromEV(p.work));
  const count = result.emits ? Math.round(p.intensity / 10) : 0;
  return (
    <div className="photo-scene">
      <div className="viz-heading">
        <span>PHOTOELECTRIC EFFECT · 理想单光子示意</span>
        <h3>
          {result.emits && p.intensity > 0
            ? '光子能量足够，电子逸出。'
            : p.intensity === 0
              ? '光源关闭，没有光电子。'
              : '光子能量不足，电子仍被束缚。'}
        </h3>
        <p>发射数量为相对示意，不是实验电流。</p>
      </div>
      <svg
        viewBox="0 0 730 275"
        role="img"
        aria-label={`光电效应装置示意，${count} 个相对发射标记`}
      >
        <rect x="200" y="90" width="35" height="150" fill="#89957b" />
        <text x="217" y="265" textAnchor="middle" className="chart-label">
          金属表面
        </text>
        <rect x="580" y="75" width="12" height="165" fill="#a1a69c" />
        <text x="587" y="265" textAnchor="middle" className="chart-label">
          收集极
        </text>
        {p.intensity > 0 &&
          [0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M65 ${35 + i * 26} l18 7 10 -6 18 7 10 -6 18 7 10 -6 35 15`}
              stroke={wavelengthColor(p.wavelength)}
              strokeWidth="3"
              fill="none"
            />
          ))}
        {Array.from({ length: count }, (_, i) => (
          <g
            key={i}
            className={running ? 'photo-electron playing' : 'photo-electron'}
            style={{ animationDelay: `${-i * 0.23}s` }}
          >
            <circle
              cx={260 + (i % 5) * 57}
              cy={120 + Math.floor(i / 5) * 65}
              r="4"
              fill="#a76f45"
            />
            <path
              d={`M${270 + (i % 5) * 57} ${120 + Math.floor(i / 5) * 65}h15`}
              stroke="#a76f45"
            />
          </g>
        ))}
      </svg>
      <div className="photo-balance">
        <span>
          光子 <strong>{toEV(result.photonJ).toFixed(2)} eV</strong>
        </span>
        <span>
          逸出功 <strong>{p.work.toFixed(2)} eV</strong>
        </span>
        <span>
          最大动能 <strong>{toEV(result.kineticJ).toFixed(2)} eV</strong>
        </span>
      </div>
    </div>
  );
}
