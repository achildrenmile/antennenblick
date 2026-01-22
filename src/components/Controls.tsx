import { useEffect, useMemo } from 'react';
import { useI18n } from '../i18n';
import type { Band, GroundQuality, TerrainType, AntennaType } from '../data/antennaPatterns';
import { WAVELENGTHS, BAND_CATEGORIES, getSupportedBands } from '../data/antennaPatterns';

interface Props {
  height: number;
  onHeightChange: (height: number) => void;
  band: Band;
  onBandChange: (band: Band) => void;
  orientation: number;
  onOrientationChange: (orientation: number) => void;
  groundQuality: GroundQuality;
  onGroundQualityChange: (quality: GroundQuality) => void;
  terrain: TerrainType;
  onTerrainChange: (terrain: TerrainType) => void;
  antennaType: AntennaType;
  compact?: boolean;
  apexAngle?: number;
  onApexAngleChange?: (angle: number) => void;
  radialCount?: number;
  onRadialCountChange?: (count: number) => void;
}

const GROUND_OPTIONS: GroundQuality[] = ['poor', 'average', 'good', 'saltwater'];
const TERRAIN_OPTIONS: TerrainType[] = ['flat', 'hilly', 'mountain', 'urban'];

export function Controls({
  height,
  onHeightChange,
  band,
  onBandChange,
  orientation,
  onOrientationChange,
  groundQuality,
  onGroundQualityChange,
  terrain,
  onTerrainChange,
  antennaType,
  compact,
  apexAngle,
  onApexAngleChange,
  radialCount,
  onRadialCountChange,
}: Props) {
  const { t } = useI18n();

  // Get supported bands for current antenna
  const supportedBands = useMemo(() => getSupportedBands(antennaType), [antennaType]);

  // Filter band categories to only show supported bands
  const filteredBandCategories = useMemo(() => {
    return BAND_CATEGORIES.map(category => ({
      ...category,
      bands: category.bands.filter(b => supportedBands.includes(b))
    })).filter(category => category.bands.length > 0);
  }, [supportedBands]);

  // Auto-switch to a supported band if current band becomes unavailable
  useEffect(() => {
    if (!supportedBands.includes(band)) {
      // Find a reasonable default band from the first available category
      const firstAvailableBand = filteredBandCategories[0]?.bands[0];
      if (firstAvailableBand) {
        onBandChange(firstAvailableBand);
      }
    }
  }, [antennaType, band, supportedBands, filteredBandCategories, onBandChange]);

  const wavelength = WAVELENGTHS[band];
  const heightInWavelengths = (height / wavelength).toFixed(2);
  const showGroundQuality = ['vertical', 'vertical58', 'collinear'].includes(antennaType);
  const showApexAngle = antennaType === 'invertedV' && onApexAngleChange;
  const showRadialCount = ['vertical', 'vertical58', 'collinear'].includes(antennaType) && onRadialCountChange;

  const groundLabels: Record<GroundQuality, string> = {
    poor: t.controls.groundPoor || 'Poor',
    average: t.controls.groundAverage || 'Average',
    good: t.controls.groundGood || 'Good',
    saltwater: t.controls.groundSaltwater || 'Saltwater',
  };

  const terrainLabels: Record<TerrainType, string> = {
    flat: t.controls?.terrainFlat || 'Flat',
    hilly: t.controls?.terrainHilly || 'Hilly',
    mountain: t.controls?.terrainMountain || 'Mountain',
    urban: t.controls?.terrainUrban || 'Urban',
  };

  if (compact) {
    return (
      <div className="controls compact">
        <div className="control-row">
          <label>{t.controls.height}:</label>
          <input
            type="range"
            min="1"
            max="60"
            step="0.5"
            value={height}
            onChange={(e) => onHeightChange(Number(e.target.value))}
          />
          <span className="control-value">{height}m ({heightInWavelengths}λ)</span>
        </div>

        <div className="control-row">
          <label>{t.controls.band}:</label>
          <select
            className="band-select"
            value={band}
            onChange={(e) => onBandChange(e.target.value as Band)}
          >
            {filteredBandCategories.map((category) => {
              const categoryLabel = (t.bandCategories as Record<string, string>)?.[category.id] || category.id.toUpperCase();
              return (
                <optgroup key={category.id} label={categoryLabel}>
                  {category.bands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </div>

        {showGroundQuality && (
          <div className="control-row">
            <label>{t.controls.ground}:</label>
            <select
              className="ground-select"
              value={groundQuality}
              onChange={(e) => onGroundQualityChange(e.target.value as GroundQuality)}
            >
              {GROUND_OPTIONS.map((g) => (
                <option key={g} value={g}>{groundLabels[g]}</option>
              ))}
            </select>
          </div>
        )}

        {showApexAngle && apexAngle !== undefined && (
          <div className="control-row">
            <label>{t.controls?.apexAngle || 'Apex'}:</label>
            <input
              type="range"
              min="90"
              max="150"
              step="5"
              value={apexAngle}
              onChange={(e) => onApexAngleChange?.(Number(e.target.value))}
            />
            <span className="control-value">{apexAngle}°</span>
          </div>
        )}

        {showRadialCount && radialCount !== undefined && (
          <div className="control-row">
            <label>{t.controls?.radials || 'Radiale'}:</label>
            <input
              type="range"
              min="4"
              max="64"
              step="4"
              value={radialCount}
              onChange={(e) => onRadialCountChange?.(Number(e.target.value))}
            />
            <span className="control-value">{radialCount}×</span>
          </div>
        )}

        <div className="control-row">
          <label>{t.controls.orientation}:</label>
          <input
            type="range"
            min="0"
            max="359"
            step="5"
            value={orientation}
            onChange={(e) => onOrientationChange(Number(e.target.value))}
          />
          <span className="control-value">{orientation}°</span>
        </div>

        <div className="control-row">
          <label>{t.controls?.terrain || 'Terrain'}:</label>
          <select
            className="terrain-select"
            value={terrain}
            onChange={(e) => onTerrainChange(e.target.value as TerrainType)}
          >
            {TERRAIN_OPTIONS.map((tr) => (
              <option key={tr} value={tr}>{terrainLabels[tr]}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="controls">
      <div className="control-group">
        <label htmlFor="height">
          {t.controls.height}: <strong>{height} {t.controls.heightUnit}</strong>
          <span className="height-wavelength">({heightInWavelengths} λ)</span>
        </label>
        <input
          id="height"
          type="range"
          min="1"
          max="60"
          step="0.5"
          value={height}
          onChange={(e) => onHeightChange(Number(e.target.value))}
        />
        <div className="range-labels">
          <span>1m</span>
          <span>60m</span>
        </div>
      </div>

      <div className="control-group">
        <label>{t.controls.band}</label>
        <div className="band-categories">
          {filteredBandCategories.map((category) => {
            const categoryLabel = (t.bandCategories as Record<string, string>)?.[category.id] || category.id.toUpperCase();
            return (
              <div key={category.id} className="band-category">
                <span className="band-category-label">{categoryLabel}</span>
                <div className="band-category-buttons">
                  {category.bands.map((b) => (
                    <button
                      key={b}
                      className={`band-button ${band === b ? 'selected' : ''}`}
                      onClick={() => onBandChange(b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showGroundQuality && (
        <div className="control-group">
          <label>{t.controls.ground || 'Ground Quality'}</label>
          <div className="ground-options">
            {GROUND_OPTIONS.map((g) => (
              <button
                key={g}
                className={`ground-button ${groundQuality === g ? 'selected' : ''}`}
                onClick={() => onGroundQualityChange(g)}
                title={groundLabels[g]}
              >
                {groundLabels[g]}
              </button>
            ))}
          </div>
        </div>
      )}

      {showApexAngle && apexAngle !== undefined && (
        <div className="control-group">
          <label htmlFor="apexAngle">
            {t.controls?.apexAngle || 'Apex Angle'}: <strong>{apexAngle}°</strong>
          </label>
          <input
            id="apexAngle"
            type="range"
            min="90"
            max="150"
            step="5"
            value={apexAngle}
            onChange={(e) => onApexAngleChange?.(Number(e.target.value))}
          />
          <div className="range-labels">
            <span>90°</span>
            <span>120°</span>
            <span>150°</span>
          </div>
        </div>
      )}

      {showRadialCount && radialCount !== undefined && (
        <div className="control-group">
          <label htmlFor="radialCount">
            {t.controls?.radials || 'Radials'}: <strong>{radialCount}×</strong>
          </label>
          <input
            id="radialCount"
            type="range"
            min="4"
            max="64"
            step="4"
            value={radialCount}
            onChange={(e) => onRadialCountChange?.(Number(e.target.value))}
          />
          <div className="range-labels">
            <span>4</span>
            <span>32</span>
            <span>64</span>
          </div>
        </div>
      )}

      <div className="control-group">
        <label htmlFor="orientation">
          {t.controls.orientation}: <strong>{orientation}{t.controls.orientationUnit}</strong>
        </label>
        <input
          id="orientation"
          type="range"
          min="0"
          max="359"
          step="5"
          value={orientation}
          onChange={(e) => onOrientationChange(Number(e.target.value))}
        />
        <div className="range-labels">
          <span>0°</span>
          <span>180°</span>
          <span>359°</span>
        </div>
      </div>

      <div className="control-group">
        <label>{t.controls?.terrain || 'Terrain'}</label>
        <div className="terrain-options">
          {TERRAIN_OPTIONS.map((tr) => (
            <button
              key={tr}
              className={`terrain-button ${terrain === tr ? 'selected' : ''}`}
              onClick={() => onTerrainChange(tr)}
              title={terrainLabels[tr]}
            >
              {terrainLabels[tr]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
