import { vectorRoute, radialRoute, mechanicsPreview } from '../../content/rutherfordDerivations';
import { degrees, effectivePotentialJ, FM, magnitude } from '../../physics/rutherford/coulomb';
import type { OrbitPoint, QuantityId, RutherfordSolution } from '../../physics/rutherford/types';
import { MathFormula } from './MathFormula';
import { GeometryView, defaultOverlays } from './GeometryView';

function Hodograph({ s, point }: { s: RutherfordSolution; point: OrbitPoint }) {
  const x = (vx: number) => 210 + (vx / s.speedInfinityMS) * 85,
    y = (vy: number) => 153 - (vy / s.speedInfinityMS) * 85;
  const vx = x(point.velocityMS.x),
    vy = y(point.velocityMS.y),
    normF = magnitude(point.forceN);
  return (
    <div className="rf-hodograph">
      <span className="rf-section-label">VELOCITY SPACE / 速度空间</span>
      <svg
        viewBox="0 0 420 290"
        role="img"
        aria-label="速度空间：速度除以入射速率 v∞；∆v 从入射速度端点到当前端点，力箭头方向示意"
      >
        <path d="M50 153H365M210 44V248" className="rf-chart-axis" />
        {[-1, 0, 1].map((n) => (
          <g key={n}>
            <text x={210 + n * 85} y="267" textAnchor="middle">
              {n}
            </text>
            <text x="42" y={157 - n * 85}>
              {n}
            </text>
          </g>
        ))}
        <text x="350" y="282">
          vx/v∞
        </text>
        <text x="215" y="32">
          vy/v∞
        </text>
        <path
          d={s.trajectory
            .map((p, i) => `${i ? 'L' : 'M'}${x(p.velocityMS.x)},${y(p.velocityMS.y)}`)
            .join(' ')}
          className="rf-trajectory"
        />
        <path d={`M210 153L${vx} ${vy}`} className="rf-overlay rf-velocity" />
        <path d={`M295 153L${vx} ${vy}`} className="rf-delta-velocity" />
        <line
          x1={vx}
          y1={vy}
          x2={vx + (point.forceN.x / normF) * 34}
          y2={vy - (point.forceN.y / normF) * 34}
          className="rf-overlay rf-force"
        />
        <circle cx="295" cy="153" r="4" fill="#526c48" />
        <text x="301" y="172">
          vi
        </text>
        <circle cx={vx} cy={vy} r="5" className="rf-alpha-point" />
        <text x={vx + 8} y={vy - 8}>
          v 当前
        </text>
        <text x={(295 + vx) / 2 + 8} y={(153 + vy) / 2 + 14}>
          ∆v
        </text>
      </svg>
      <p>棕线为累积速度变化，细红线为当前 d𝐯 的方向示意。位置空间与速度空间共用同一轨道点。</p>
    </div>
  );
}
function EffectivePotential({ s, point }: { s: RutherfordSolution; point: OrbitPoint }) {
  const xmin = 0.55 * s.closestM,
    xmax = 5 * s.closestM;
  const px = (r: number) => 65 + ((r - xmin) / (xmax - xmin)) * 590,
    py = (v: number) => 275 - v * 95;
  const samples = Array.from({ length: 241 }, (_, i) => xmin + ((xmax - xmin) * i) / 240);
  return (
    <div className="rf-potential">
      <span className="rf-section-label">EFFECTIVE POTENTIAL / 有效势</span>
      <svg
        viewBox="0 0 730 345"
        role="img"
        aria-label="有效势 Veff/E 对核距离 r 的关系，能量线与最近距离转折点共用当前参数"
      >
        <defs>
          <clipPath id="rf-potential-clip">
            <rect x="65" y="45" width="590" height="230" />
          </clipPath>
        </defs>
        {[0, 1, 2].map((v) => (
          <g key={v}>
            <line x1="65" x2="655" y1={py(v)} y2={py(v)} className="rf-chart-grid" />
            <text x="48" y={py(v) + 4}>
              {v}
            </text>
          </g>
        ))}
        <text x="65" y="26">
          Veff / E（无量纲）
        </text>
        <path d="M65 45V275H655" className="rf-chart-axis" />
        <g clipPath="url(#rf-potential-clip)">
          <path
            d={samples
              .map(
                (r, i) =>
                  `${i ? 'L' : 'M'}${px(r)},${py(effectivePotentialJ(r, s.params) / s.energyJ)}`,
              )
              .join(' ')}
            className="rf-trajectory"
          />
          <path
            d={samples
              .map((r, i) => `${i ? 'L' : 'M'}${px(r)},${py(s.kappaJM / r / s.energyJ)}`)
              .join(' ')}
            className="rf-coulomb-potential"
          />
          <line x1="65" x2="655" y1={py(1)} y2={py(1)} className="rf-energy-line" />
          <line
            x1={px(s.closestM)}
            x2={px(s.closestM)}
            y1="275"
            y2={py(1)}
            className="rf-turning rf-overlay"
          />
          <circle cx={px(s.closestM)} cy={py(1)} r="5" fill="#a16d3d" />
          {point.radiusM <= xmax && (
            <circle
              cx={px(point.radiusM)}
              cy={py(effectivePotentialJ(point.radiusM, s.params) / s.energyJ)}
              r="4"
              fill="#4f7250"
            />
          )}
        </g>
        {[1, 2, 3, 4, 5].map((n) => (
          <text key={n} x={px(n * s.closestM)} y="301" textAnchor="middle">
            {Math.round((n * s.closestM) / FM)}
          </text>
        ))}
        <text x="655" y="330" textAnchor="end">
          核距离 r / fm
        </text>
        <text x={px(s.closestM) + 10} y={py(1) - 10}>
          rmin · E=Veff
        </text>
      </svg>
      <p>
        实线 Veff=κ/r+L²/(2mr²)；虚线为库仑势，水平线 E。rmin 处 ṙ=0；L≠0 时切向动能仍为
        L²/(2mrmin²)。
        {point.radiusM > xmax
          ? ' 当前轨道点超出此图横轴范围。'
          : ` 当前径向动能 ${(Math.max(0, s.energyJ - effectivePotentialJ(point.radiusM, s.params)) / s.energyJ).toFixed(3)} E。`}
      </p>
    </div>
  );
}
export type DerivationRoute = 'vector' | 'radial' | 'advanced' | 'compare';
export function DerivationExplorer({
  s,
  point,
  route,
  step,
  setRoute,
  setStep,
  selected,
  onSelect,
}: {
  s: RutherfordSolution;
  point: OrbitPoint;
  route: DerivationRoute;
  step: number;
  setRoute: (route: DerivationRoute) => void;
  setStep: (step: number) => void;
  selected: QuantityId;
  onSelect: (q: QuantityId) => void;
}) {
  const steps = route === 'radial' ? radialRoute : vectorRoute,
    current = steps[Math.min(step, steps.length - 1)];
  const navigate = (next: number) => {
    setStep(next);
    onSelect(steps[next].highlight);
  };
  return (
    <div className="rf-derivation">
      <div className="rf-methods" aria-label="推导路线">
        {(
          [
            ['vector', 'A · 矢量冲量'],
            ['radial', 'B · 径向积分'],
            ['compare', '对照两种方法'],
            ['advanced', 'C · 分析力学（待补）'],
          ] as [DerivationRoute, string][]
        ).map(([id, title]) => (
          <button
            key={id}
            aria-pressed={route === id}
            onClick={() => {
              setRoute(id);
              if (id === 'vector' || id === 'radial')
                onSelect((id === 'vector' ? vectorRoute : radialRoute)[step].highlight);
            }}
          >
            {title}
          </button>
        ))}
      </div>
      {route === 'advanced' ? (
        <section className="rf-step-card">
          <span className="rf-status">进阶预览 · 未完成路线</span>
          <h3>等待指定的分析力学推导资料</h3>
          <p>
            下面仅展示候选出发点，不声称复现原稿引用但尚未提供的方法。核心学习可使用 A、B 两条路线。
          </p>
          <MathFormula tex={mechanicsPreview} />
          <details>
            <summary>为什么 φ 的共轭动量守恒？</summary>
            <p>
              广义坐标描述构型；欧拉–拉格朗日方程给出运动方程。此拉格朗日量不显含 φ，因此 φ
              是循环坐标，pφ=mr²φ̇ 守恒，对应带符号的角动量。完整进阶路线仍需参考资料审阅。
            </p>
          </details>
        </section>
      ) : route === 'compare' ? (
        <section className="rf-compare">
          <h3>不同变换，同一物理结论</h3>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>环节</th>
                  <th>A · 矢量冲量</th>
                  <th>B · 径向积分</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['出发点', 'm d𝐯/dt = F', 'E = ½mṙ² + Veff'],
                  ['守恒量', 'L = mv∞b；用它消去 dt', 'E、L；用它们消去 ṙ、φ̇'],
                  ['积分变量', '位置极角 φ：π → θ', '出射半径 r：rmin → ∞'],
                  ['中间量', '两个速度分量的变化', '半边极角扫过 Φ'],
                  ['还原几何', '匹配渐近 ∆𝐯', '2Φ = π−θ'],
                  ['结果', 'tan(θ/2) = a/b', 'tan(θ/2) = a/b'],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((value) => (
                      <td key={value}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            两条路线共用 E={s.params.energyMeV} MeV、Z={s.params.nuclearCharge}、b=
            {s.params.impactFm} fm，得到 θ={degrees(s.angleRad).toFixed(3)}°。切换方法不会更改轨迹。
          </p>
        </section>
      ) : (
        <>
          <div className="rf-step-progress">
            <span>
              STEP {step + 1} / {steps.length}
            </span>
            <div>
              {steps.map((_, i) => (
                <button
                  key={i}
                  aria-label={`推导第 ${i + 1} 步`}
                  aria-current={step === i ? 'step' : undefined}
                  onClick={() => navigate(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
          <section className="rf-step-card">
            <h3>{current.title}</h3>
            <MathFormula tex={current.tex} selected={selected} onSelect={onSelect} />
            <p>{current.operation}</p>
            <details key={`${route}-${step}`}>
              <summary>展开中间步骤 · 为什么这一步成立？</summary>
              <MathFormula tex={current.algebra} selected={selected} onSelect={onSelect} />
            </details>
          </section>
          {s.params.impactFm === 0 && (
            <p className="rf-warning" role="status">
              正碰极限 b=L=0：不能在推导中除以 L 或 b。当前轨迹为径向反弹，直接用
              θ=π、rmin=κ/E；带除法的步骤仅用于 b&gt;0。
            </p>
          )}
          <div className="rf-derivation-scenes">
            <GeometryView
              solution={s}
              point={point}
              selected={selected}
              onSelect={onSelect}
              overlays={defaultOverlays}
              compact
            />
            {route === 'vector' ? (
              <Hodograph s={s} point={point} />
            ) : (
              <EffectivePotential s={s} point={point} />
            )}
          </div>
          <div className="rf-step-navigation">
            <button onClick={() => navigate(Math.max(0, step - 1))} disabled={step === 0}>
              ← 上一步
            </button>
            <span>θ = {degrees(s.angleRad).toFixed(3)}° · 同一组输入</span>
            <button
              onClick={() => navigate(Math.min(steps.length - 1, step + 1))}
              disabled={step === steps.length - 1}
            >
              下一步 →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
