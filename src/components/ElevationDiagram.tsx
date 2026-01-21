import { useMemo } from 'react';
import { useI18n } from '../i18n';
import type { PatternPoint } from '../data/antennaPatterns';

interface Props {
  pattern: PatternPoint[];
  mainLobeAngle: number;
  title: string;
}

export function ElevationDiagram({ pattern, mainLobeAngle, title }: Props) {
  const { t } = useI18n();

  const width = 300;
  const height = 180;
  const centerX = 20;
  const centerY = height - 20;
  const maxRadius = Math.min(width - 40, height - 40);

  const pathData = useMemo(() => {
    if (pattern.length === 0) return '';

    // Draw from 0° (horizon) to 90° (zenith)
    const points = pattern.map((p, i) => {
      const angleRad = (p.angle * Math.PI) / 180;
      const r = p.magnitude * maxRadius;
      const x = centerX + r * Math.cos(angleRad);
      const y = centerY - r * Math.sin(angleRad);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    });

    // Close the path back to center
    return points.join(' ') + ` L ${centerX} ${centerY} Z`;
  }, [pattern, centerX, centerY, maxRadius]);

  const gridArcs = [0.25, 0.5, 0.75, 1];
  const angleMarks = [0, 15, 30, 45, 60, 75, 90];

  return (
    <div className="elevation-diagram">
      <h4>{title}</h4>
      <svg viewBox={`0 0 ${width} ${height}`} className="elevation-svg">
        {/* Ground line */}
        <line
          x1={0}
          y1={centerY}
          x2={width}
          y2={centerY}
          className="ground-line"
        />

        {/* Grid arcs */}
        {gridArcs.map((r) => (
          <path
            key={r}
            d={`M ${centerX} ${centerY} A ${r * maxRadius} ${r * maxRadius} 0 0 0 ${centerX + r * maxRadius} ${centerY}`}
            className="grid-arc"
            fill="none"
          />
        ))}

        {/* Angle lines */}
        {angleMarks.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={angle}
              x1={centerX}
              y1={centerY}
              x2={centerX + maxRadius * Math.cos(rad)}
              y2={centerY - maxRadius * Math.sin(rad)}
              className="angle-line"
            />
          );
        })}

        {/* Radiation pattern */}
        <path d={pathData} className="radiation-pattern" />

        {/* Main lobe indicator */}
        <g>
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + maxRadius * 1.1 * Math.cos((mainLobeAngle * Math.PI) / 180)}
            y2={centerY - maxRadius * 1.1 * Math.sin((mainLobeAngle * Math.PI) / 180)}
            className="main-lobe-indicator"
            strokeDasharray="4 2"
          />
          <text
            x={centerX + (maxRadius + 20) * Math.cos((mainLobeAngle * Math.PI) / 180)}
            y={centerY - (maxRadius + 20) * Math.sin((mainLobeAngle * Math.PI) / 180)}
            className="main-lobe-label"
            textAnchor="start"
            dominantBaseline="middle"
          >
            {mainLobeAngle}°
          </text>
        </g>

        {/* Angle labels */}
        {[0, 30, 60, 90].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const labelR = maxRadius + 12;
          return (
            <text
              key={angle}
              x={centerX + labelR * Math.cos(rad)}
              y={centerY - labelR * Math.sin(rad)}
              className="angle-label"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {angle}°
            </text>
          );
        })}

        {/* Labels */}
        <text x={width - 10} y={centerY + 12} className="horizon-label" textAnchor="end">
          {t.explanation.dx}
        </text>
        <text x={centerX + 8} y={20} className="zenith-label" textAnchor="start">
          {t.explanation.nvis}
        </text>
      </svg>
    </div>
  );
}
