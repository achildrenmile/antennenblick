import { useMemo } from 'react';
import { useI18n } from '../i18n';
import type { PatternPoint } from '../data/antennaPatterns';

interface Props {
  pattern: PatternPoint[];
  orientation: number;
  title: string;
}

export function PolarDiagram({ pattern, orientation, title }: Props) {
  const { t } = useI18n();

  const size = 300;
  const center = size / 2;
  const maxRadius = (size / 2) - 30;

  const pathData = useMemo(() => {
    if (pattern.length === 0) return '';

    const points = pattern.map((p, i) => {
      const angleRad = ((p.angle - 90) * Math.PI) / 180;
      const r = p.magnitude * maxRadius;
      const x = center + r * Math.cos(angleRad);
      const y = center + r * Math.sin(angleRad);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    });

    return points.join(' ') + ' Z';
  }, [pattern, center, maxRadius]);

  const gridCircles = [0.25, 0.5, 0.75, 1];
  const directions = [
    { angle: 0, key: 'n' },
    { angle: 45, key: 'ne' },
    { angle: 90, key: 'e' },
    { angle: 135, key: 'se' },
    { angle: 180, key: 's' },
    { angle: 225, key: 'sw' },
    { angle: 270, key: 'w' },
    { angle: 315, key: 'nw' },
  ];

  return (
    <div className="polar-diagram">
      <h4>{title}</h4>
      <svg viewBox={`0 0 ${size} ${size}`} className="polar-svg">
        {/* Grid circles */}
        {gridCircles.map((r) => (
          <circle
            key={r}
            cx={center}
            cy={center}
            r={r * maxRadius}
            className="grid-circle"
          />
        ))}

        {/* Grid lines */}
        {directions.map(({ angle }) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          return (
            <line
              key={angle}
              x1={center}
              y1={center}
              x2={center + maxRadius * Math.cos(rad)}
              y2={center + maxRadius * Math.sin(rad)}
              className="grid-line"
            />
          );
        })}

        {/* Radiation pattern */}
        <path d={pathData} className="radiation-pattern" />

        {/* Direction labels */}
        {directions.map(({ angle, key }) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          const labelRadius = maxRadius + 15;
          const x = center + labelRadius * Math.cos(rad);
          const y = center + labelRadius * Math.sin(rad);
          return (
            <text
              key={angle}
              x={x}
              y={y}
              className="direction-label"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {t.directions[key as keyof typeof t.directions]}
            </text>
          );
        })}

        {/* Orientation indicator */}
        {orientation !== 0 && (
          <g transform={`rotate(${orientation}, ${center}, ${center})`}>
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={center - maxRadius * 0.9}
              className="orientation-indicator"
            />
            <polygon
              points={`${center},${center - maxRadius * 0.95} ${center - 5},${center - maxRadius * 0.85} ${center + 5},${center - maxRadius * 0.85}`}
              className="orientation-arrow"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
