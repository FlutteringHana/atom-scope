import { useId, useMemo, useRef, type PointerEvent } from 'react';
import { C } from '../../physics/constants';
import { FM, degrees, magnitude, pointAtParameter } from '../../physics/rutherford/coulomb';
import type {
  OrbitPoint,
  QuantityId,
  RutherfordSolution,
  Vector,
} from '../../physics/rutherford/types';

export interface Overlays {
  impact: boolean;
  angle: boolean;
  position: boolean;
  closest: boolean;
  force: boolean;
  velocity: boolean;
  components: boolean;
}
export const defaultOverlays: Overlays = {
  impact: true,
  angle: true,
  position: true,
  closest: true,
  force: true,
  velocity: true,
  components: false,
};
export function GeometryView({
  solution: s,
  point,
  selected,
  onSelect,
  onImpact,
  overlays,
  compact = false,
}: {
  solution: RutherfordSolution;
  point: OrbitPoint;
  selected: QuantityId;
  onSelect: (q: QuantityId) => void;
  onImpact?: (b: number) => void;
  overlays: Overlays;
  compact?: boolean;
}) {
  const id = useId(),
    svgRef = useRef<SVGSVGElement>(null);
  const transform = useMemo(() => {
    const xs = s.trajectory.map((p) => p.positionM.x / FM),
      ys = s.trajectory.map((p) => p.positionM.y / FM);
    const minX = Math.min(0, ...xs),
      maxX = Math.max(0, ...xs),
      minY = Math.min(0, ...ys),
      maxY = Math.max(s.params.impactFm, ...ys);
    const spanX = Math.max(100, maxX - minX),
      spanY = Math.max(100, maxY - minY);
    const scale = Math.min(620 / (spanX * 1.15), 260 / (spanY * 1.25));
    const centerX = (minX + maxX) / 2,
      centerY = (minY + maxY) / 2;
    return {
      scale,
      px: (x: number) => 390 + (x / FM - centerX) * scale,
      py: (y: number) => 225 - (y / FM - centerY) * scale,
      worldY: (y: number) => (225 - y) / scale + centerY,
      worldX: (x: number) => (x - 390) / scale + centerX,
    };
  }, [s]);
  const { px, py } = transform,
    nx = px(0),
    ny = py(0),
    cx = px(point.positionM.x),
    cy = py(point.positionM.y);
  const turn = pointAtParameter(s.params, 0),
    tx = px(turn.positionM.x),
    ty = py(turn.positionM.y);
  const highlight = (q: QuantityId) => (selected === q ? 'rf-geometry-selected' : '');
  const pick = (q: QuantityId) => ({
    role: 'button',
    tabIndex: 0,
    'aria-label': `检查 ${q}`,
    'aria-pressed': selected === q,
    onClick: () => onSelect(q),
    onKeyDown: (e: React.KeyboardEvent<SVGGElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(q);
      }
    },
  });
  const vector = (v: Vector, length: number) => {
    const norm = magnitude(v);
    return norm ? { x: (length * v.x) / norm, y: (-length * v.y) / norm } : { x: 0, y: 0 };
  };
  const velocity = vector(point.velocityMS, 48),
    force = vector(point.forceN, 43);
  const drag = (event: PointerEvent<SVGGElement>) => {
    if (!onImpact || event.buttons !== 1) return;
    const svg = svgRef.current,
      matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return;
    const location = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    onImpact(Math.round(Math.max(0, Math.min(200, transform.worldY(location.y)))));
  };
  const angleRadius = 40,
    arcEndX = angleRadius * Math.cos(s.angleRad),
    arcEndY = -angleRadius * Math.sin(s.angleRad);
  const extentM = Math.max(...s.trajectory.map((p) => p.radiusM)) * 3;
  const outgoingBase = {
    x: -s.params.impactFm * FM * Math.sin(s.angleRad),
    y: s.params.impactFm * FM * Math.cos(s.angleRad),
  };
  const asymptoteDistance = extentM * 0.2;
  const outX = px(outgoingBase.x + asymptoteDistance * Math.cos(s.angleRad));
  const outY = py(outgoingBase.y + asymptoteDistance * Math.sin(s.angleRad));
  const radialSpeed =
    (point.positionM.x * point.velocityMS.x + point.positionM.y * point.velocityMS.y) /
    point.radiusM;
  const radialV = {
    x: (radialSpeed * point.positionM.x) / point.radiusM,
    y: (radialSpeed * point.positionM.y) / point.radiusM,
  };
  const componentScale = 48 / s.speedInfinityMS;
  return (
    <div className={`rf-geometry ${compact ? 'rf-compact' : ''}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 760 420"
        role="img"
        aria-label="精确库仑轨迹与物理量；空间坐标同尺度，单位 fm；向量箭头不按长度比例"
      >
        <defs>
          <clipPath id={`${id}-clip`}>
            <rect x="65" y="65" width="640" height="290" />
          </clipPath>
          {['velocity', 'force'].map((name, index) => (
            <marker
              key={name}
              id={`${id}-${name}`}
              markerWidth="7"
              markerHeight="7"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0 0 L6 3 L0 6Z" fill={index ? '#ad633d' : '#526c48'} />
            </marker>
          ))}
        </defs>
        <g className="rf-spatial-grid">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <line x1={75 + i * 155} x2={75 + i * 155} y1="65" y2="355" />
              <text x={75 + i * 155} y="376" textAnchor="middle">
                {Math.round(transform.worldX(75 + i * 155))}
              </text>
              <line x1="65" x2="705" y1={75 + i * 65} y2={75 + i * 65} />
              <text x="56" y={79 + i * 65} textAnchor="end">
                {Math.round(transform.worldY(75 + i * 65))}
              </text>
            </g>
          ))}
        </g>
        <text x="66" y="46" className="rf-svg-label">
          y / fm
        </text>
        <text x="705" y="404" textAnchor="end" className="rf-svg-label">
          x / fm · 动态视窗，横纵同尺度
        </text>
        <g clipPath={`url(#${id}-clip)`}>
          {overlays.velocity && (
            <g className={highlight('scattering-angle')}>
              <line
                x1="155"
                x2="201"
                y1={py(s.params.impactFm * FM)}
                y2={py(s.params.impactFm * FM)}
                className="rf-overlay rf-velocity"
                markerEnd={`url(#${id}-velocity)`}
              />
              <text x="156" y={py(s.params.impactFm * FM) - 12} className="rf-svg-label">
                v∞ 入射
              </text>
              <line
                x1={outX}
                y1={outY}
                x2={outX + 44 * Math.cos(s.angleRad)}
                y2={outY - 44 * Math.sin(s.angleRad)}
                className="rf-overlay rf-velocity"
                markerEnd={`url(#${id}-velocity)`}
              />
              <text x={outX - 12} y={outY + 22} className="rf-svg-label">
                v∞ 出射方向
              </text>
            </g>
          )}
          <line
            x1={px(outgoingBase.x - extentM * Math.cos(s.angleRad))}
            y1={py(outgoingBase.y - extentM * Math.sin(s.angleRad))}
            x2={px(outgoingBase.x + extentM * Math.cos(s.angleRad))}
            y2={py(outgoingBase.y + extentM * Math.sin(s.angleRad))}
            className="rf-asymptote"
          />
          <path
            d={s.trajectory
              .map((t, i) => `${i ? 'L' : 'M'}${px(t.positionM.x)},${py(t.positionM.y)}`)
              .join(' ')}
            className="rf-trajectory"
          />
          {overlays.impact && (
            <g className={highlight('impact-parameter')} {...pick('impact-parameter')}>
              <line
                x1="65"
                x2="705"
                y1={py(s.params.impactFm * FM)}
                y2={py(s.params.impactFm * FM)}
                className="rf-asymptote rf-impact-line"
              />
              <path
                d={`M${nx - 85} ${ny} V${py(s.params.impactFm * FM)} m-5 0h10 M${nx - 90} ${ny}h10`}
                className="rf-overlay rf-impact-segment"
              />
              <text
                x={nx - 101}
                y={(ny + py(s.params.impactFm * FM)) / 2 - 5}
                className="rf-svg-label"
              >
                b
              </text>
            </g>
          )}
          {onImpact && (
            <g
              role="slider"
              tabIndex={0}
              aria-label="拖动入射线调整 b"
              aria-valuemin={0}
              aria-valuemax={200}
              aria-valuenow={s.params.impactFm}
              className="rf-drag-line"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                drag(e);
              }}
              onPointerMove={drag}
              onKeyDown={(e) => {
                if (
                  ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'Home', 'End'].includes(e.key)
                ) {
                  e.preventDefault();
                  onImpact(
                    e.key === 'Home'
                      ? 0
                      : e.key === 'End'
                        ? 200
                        : Math.max(
                            0,
                            Math.min(
                              200,
                              s.params.impactFm +
                                (e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 1 : -1),
                            ),
                          ),
                  );
                }
              }}
            >
              <line
                x1="70"
                x2={Math.max(90, nx - 100)}
                y1={py(s.params.impactFm * FM)}
                y2={py(s.params.impactFm * FM)}
                stroke="transparent"
                strokeWidth="22"
              />
              <circle cx="92" cy={py(s.params.impactFm * FM)} r="7" />
              <text x="108" y={py(s.params.impactFm * FM) - 10}>
                拖动 b
              </text>
            </g>
          )}
          {overlays.position && (
            <g className={highlight('distance')} {...pick('distance')}>
              <line x1={nx} y1={ny} x2={cx} y2={cy} className="rf-overlay rf-radius" />
              <text x={(nx + cx) / 2 + 8} y={(ny + cy) / 2 - 8} className="rf-svg-label">
                r
              </text>
            </g>
          )}
          {overlays.closest && (
            <g className={highlight('closest-approach')} {...pick('closest-approach')}>
              <line x1={nx} y1={ny} x2={tx} y2={ty} className="rf-overlay rf-turning" />
              <circle cx={tx} cy={ty} r="5" fill="none" className="rf-overlay rf-turning" />
              <text x={tx - 37} y={ty + 28} className="rf-svg-label">
                rmin
              </text>
            </g>
          )}
          <g {...pick('nuclear-charge')} className={highlight('nuclear-charge')}>
            <circle cx={nx} cy={ny} r="6" fill="#a98b49" />
            <text x={nx + 10} y={ny + 21} className="rf-svg-label">
              +{s.params.nuclearCharge}e · 核标记放大
            </text>
          </g>
          {overlays.force && (
            <g className={highlight('force')} {...pick('force')}>
              <line
                x1={cx}
                y1={cy}
                x2={cx + force.x}
                y2={cy + force.y}
                className="rf-overlay rf-force"
                markerEnd={`url(#${id}-force)`}
              />
              <text x={cx + force.x + 7} y={cy + force.y - 7} className="rf-svg-label">
                F
              </text>
            </g>
          )}
          {overlays.velocity && (
            <g className={highlight('velocity')} {...pick('velocity')}>
              <line
                x1={cx}
                y1={cy}
                x2={cx + velocity.x}
                y2={cy + velocity.y}
                className="rf-overlay rf-velocity"
                markerEnd={`url(#${id}-velocity)`}
              />
              <text x={cx + velocity.x + 7} y={cy + velocity.y + 7} className="rf-svg-label">
                v
              </text>
            </g>
          )}
          {overlays.components && (
            <g className="rf-components">
              <line
                x1={cx}
                y1={cy}
                x2={cx + radialV.x * componentScale}
                y2={cy - radialV.y * componentScale}
              />
              <line
                x1={cx + radialV.x * componentScale}
                y1={cy - radialV.y * componentScale}
                x2={cx + point.velocityMS.x * componentScale}
                y2={cy - point.velocityMS.y * componentScale}
              />
              <text x={cx + 12} y={cy + 26}>
                vr + vφ · 同一速度标尺
              </text>
            </g>
          )}
          <circle cx={cx} cy={cy} r="5" className="rf-alpha-point" />
        </g>
        {overlays.angle && (
          <g
            className={highlight('scattering-angle')}
            {...pick('scattering-angle')}
            transform="translate(620 120)"
          >
            <rect x="-73" y="-63" width="144" height="112" rx="5" className="rf-angle-back" />
            <path
              d={`M0 0H53 M0 0L${53 * Math.cos(s.angleRad)} ${-53 * Math.sin(s.angleRad)}`}
              className="rf-overlay rf-directions"
            />
            <path
              d={`M${angleRadius} 0A${angleRadius} ${angleRadius} 0 ${s.angleRad > Math.PI ? 1 : 0} 0 ${arcEndX} ${arcEndY}`}
              className="rf-overlay rf-angle"
            />
            <text x="-61" y="35" className="rf-svg-label">
              θ={degrees(s.angleRad).toFixed(1)}°
            </text>
            <text x="-63" y="-49" className="rf-svg-label">
              渐近方向 · 示意
            </text>
          </g>
        )}
      </svg>
      <div className="rf-scene-caption">
        <span>精确解析轨迹 · 核固定在 (0,0)</span>
        <span>F、v 箭头为方向示意，大小见检查器</span>
      </div>
      <div className="rf-invariants">
        <button
          className={selected === 'energy' ? 'rf-invariant-selected' : ''}
          onClick={() => onSelect('energy')}
        >
          E局部总计 ={' '}
          {(
            (0.5 * C.alphaMass * magnitude(point.velocityMS) ** 2 + s.kappaJM / point.radiusM) /
            s.energyJ
          ).toFixed(6)}{' '}
          E
        </button>
        <button
          className={selected === 'angular-momentum' ? 'rf-invariant-selected' : ''}
          onClick={() => onSelect('angular-momentum')}
        >
          Lz = −{s.angularMomentumJS.toExponential(2)} J·s
        </button>
        <span>φ = {degrees(point.polarRad).toFixed(2)}°（位置角）</span>
        <span>t = {point.timeS.toExponential(2)} s（最近处为零）</span>
      </div>
    </div>
  );
}
