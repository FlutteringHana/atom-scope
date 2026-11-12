import { useId } from 'react';

export interface Series {
  label: string;
  color: string;
  values: { x: number; y: number }[];
  dashed?: boolean;
}
export function Chart({
  series,
  xMax,
  yMax,
  xLabel,
  yLabel,
  xMin = 0,
}: {
  series: Series[];
  xMin?: number;
  xMax: number;
  yMax: number;
  xLabel: string;
  yLabel: string;
}) {
  const clip = useId();
  const px = (x: number) => 85 + ((x - xMin) / (xMax - xMin)) * 590;
  const py = (y: number) => 370 - (y / yMax) * 290;
  return (
    <div className="chart-wrap">
      <svg viewBox="0 0 730 440" role="img" aria-label={`${yLabel} 对 ${xLabel} 的理论关系图`}>
        <defs>
          <clipPath id={clip}>
            <rect x="85" y="80" width="590" height="290" />
          </clipPath>
        </defs>
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i} className="chart-grid">
            <line x1="85" y1={py((yMax * i) / 5)} x2="675" y2={py((yMax * i) / 5)} />
            <text x="73" y={py((yMax * i) / 5) + 4} textAnchor="end">
              {Number(((yMax * i) / 5).toPrecision(3))}
            </text>
            <text x={px(xMin + ((xMax - xMin) * i) / 5)} y="392" textAnchor="middle">
              {Number((xMin + ((xMax - xMin) * i) / 5).toPrecision(3))}
            </text>
          </g>
        ))}
        <path d="M85 80 V370 H675" className="chart-axis" />
        <text x="85" y="48" className="chart-label">
          {yLabel}
        </text>
        <text x="675" y="428" textAnchor="end" className="chart-label">
          {xLabel}
        </text>
        <g clipPath={`url(#${clip})`}>
          {series.map((s) => (
            <path
              key={s.label}
              fill="none"
              stroke={s.color}
              strokeWidth="2.8"
              strokeDasharray={s.dashed ? '8 6' : undefined}
              d={s.values
                .map((v, i) => `${i ? 'L' : 'M'}${px(v.x)},${Math.max(-10000, py(v.y))}`)
                .join(' ')}
            />
          ))}
        </g>
      </svg>
      <div className="chart-legend">
        {series.map((s) => (
          <span key={s.label}>
            <i style={{ background: s.color }} />
            {s.label}
            {s.dashed ? '（虚线）' : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
