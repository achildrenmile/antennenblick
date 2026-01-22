import { useState, useMemo } from 'react';
import { useI18n } from '../i18n';

interface Props {
  onClose: () => void;
}

type CalculatorMode = 'dipole' | 'vertical' | 'loop' | 'yagi';

export function Calculator({ onClose }: Props) {
  const { t } = useI18n();
  const [mode, setMode] = useState<CalculatorMode>('dipole');
  const [frequency, setFrequency] = useState(14.2);
  const [velocityFactor, setVelocityFactor] = useState(0.95);

  const calc = t.calculator || {};

  // Speed of light in m/s
  const C = 299792458;

  const wavelength = useMemo(() => {
    return C / (frequency * 1000000);
  }, [frequency]);

  const results = useMemo(() => {
    const lambda = wavelength * velocityFactor;

    switch (mode) {
      case 'dipole':
        return {
          total: lambda / 2,
          perSide: lambda / 4,
          description: calc.dipoleDesc || 'Half-wave dipole total length and per side',
        };
      case 'vertical':
        return {
          quarterWave: lambda / 4,
          fiveEighths: lambda * 0.625,
          radialLength: lambda / 4,
          description: calc.verticalDesc || 'Vertical lengths: 1/4λ, 5/8λ, and radials',
        };
      case 'loop':
        return {
          fullWave: lambda,
          deltaPerSide: lambda / 3,
          quadPerSide: lambda / 4,
          description: calc.loopDesc || 'Full-wave loop circumference',
        };
      case 'yagi':
        return {
          reflector: lambda * 0.495,
          driven: lambda * 0.473,
          director1: lambda * 0.440,
          director2: lambda * 0.435,
          spacing: lambda * 0.2,
          description: calc.yagiDesc || 'Typical Yagi element lengths',
        };
      default:
        return {};
    }
  }, [wavelength, velocityFactor, mode, calc]);

  const formatLength = (meters: number): string => {
    if (meters >= 1) {
      return `${meters.toFixed(2)} m`;
    } else {
      return `${(meters * 100).toFixed(1)} cm`;
    }
  };

  return (
    <div className="calculator-overlay" onClick={onClose}>
      <div className="calculator-modal" onClick={(e) => e.stopPropagation()}>
        <button className="calculator-close" onClick={onClose}>
          &times;
        </button>

        <h2>{calc.title || 'Antenna Calculator'}</h2>

        <div className="calculator-input-section">
          <div className="calculator-field">
            <label>{calc.frequency || 'Frequency'} (MHz)</label>
            <input
              type="number"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              min="0.1"
              max="10000"
              step="0.001"
            />
          </div>

          <div className="calculator-field">
            <label>{calc.velocityFactor || 'Velocity Factor'}</label>
            <input
              type="number"
              value={velocityFactor}
              onChange={(e) => setVelocityFactor(Number(e.target.value))}
              min="0.5"
              max="1"
              step="0.01"
            />
            <span className="velocity-hint">{calc.velocityHint || '(0.95 for wire, 0.66 for coax)'}</span>
          </div>
        </div>

        <div className="calculator-wavelength">
          <span className="wavelength-label">{calc.wavelength || 'Wavelength'} (λ):</span>
          <span className="wavelength-value">{formatLength(wavelength)}</span>
        </div>

        <div className="calculator-tabs">
          <button
            className={`calc-tab ${mode === 'dipole' ? 'active' : ''}`}
            onClick={() => setMode('dipole')}
          >
            {calc.dipole || 'Dipole'}
          </button>
          <button
            className={`calc-tab ${mode === 'vertical' ? 'active' : ''}`}
            onClick={() => setMode('vertical')}
          >
            {calc.vertical || 'Vertical'}
          </button>
          <button
            className={`calc-tab ${mode === 'loop' ? 'active' : ''}`}
            onClick={() => setMode('loop')}
          >
            {calc.loop || 'Loop'}
          </button>
          <button
            className={`calc-tab ${mode === 'yagi' ? 'active' : ''}`}
            onClick={() => setMode('yagi')}
          >
            {calc.yagi || 'Yagi'}
          </button>
        </div>

        <div className="calculator-results">
          {mode === 'dipole' && (
            <>
              <div className="result-item">
                <span className="result-label">{calc.totalLength || 'Total Length'}:</span>
                <span className="result-value">{formatLength(results.total || 0)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">{calc.perSide || 'Per Side'}:</span>
                <span className="result-value">{formatLength(results.perSide || 0)}</span>
              </div>
            </>
          )}

          {mode === 'vertical' && (
            <>
              <div className="result-item">
                <span className="result-label">{calc.quarterWave || '1/4 λ Vertical'}:</span>
                <span className="result-value">{formatLength(results.quarterWave || 0)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">{calc.fiveEighths || '5/8 λ Vertical'}:</span>
                <span className="result-value">{formatLength(results.fiveEighths || 0)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">{calc.radials || 'Radial Length'}:</span>
                <span className="result-value">{formatLength(results.radialLength || 0)}</span>
              </div>
            </>
          )}

          {mode === 'loop' && (
            <>
              <div className="result-item">
                <span className="result-label">{calc.fullWaveLoop || 'Full-Wave Loop'}:</span>
                <span className="result-value">{formatLength(results.fullWave || 0)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">{calc.deltaSide || 'Delta Loop Side'}:</span>
                <span className="result-value">{formatLength(results.deltaPerSide || 0)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">{calc.quadSide || 'Quad Loop Side'}:</span>
                <span className="result-value">{formatLength(results.quadPerSide || 0)}</span>
              </div>
            </>
          )}

          {mode === 'yagi' && (
            <>
              <div className="result-item">
                <span className="result-label">{calc.reflector || 'Reflector'}:</span>
                <span className="result-value">{formatLength(results.reflector || 0)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">{calc.driven || 'Driven Element'}:</span>
                <span className="result-value">{formatLength(results.driven || 0)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">{calc.director || 'Director 1'}:</span>
                <span className="result-value">{formatLength(results.director1 || 0)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">{calc.director || 'Director 2'}:</span>
                <span className="result-value">{formatLength(results.director2 || 0)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">{calc.spacing || 'Element Spacing'}:</span>
                <span className="result-value">{formatLength(results.spacing || 0)}</span>
              </div>
            </>
          )}

          <p className="result-description">{results.description}</p>
        </div>

        <div className="calculator-formula">
          <p className="formula-title">{calc.formula || 'Formula'}:</p>
          <code>λ = c / f = {C.toLocaleString()} m/s / {frequency} MHz</code>
        </div>
      </div>
    </div>
  );
}
