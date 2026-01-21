import { useI18n } from '../i18n';
import type { Band } from '../data/antennaPatterns';

interface Props {
  height: number;
  onHeightChange: (height: number) => void;
  band: Band;
  onBandChange: (band: Band) => void;
  orientation: number;
  onOrientationChange: (orientation: number) => void;
}

export function Controls({
  height,
  onHeightChange,
  band,
  onBandChange,
  orientation,
  onOrientationChange,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="controls">
      <div className="control-group">
        <label htmlFor="height">
          {t.controls.height}: <strong>{height} {t.controls.heightUnit}</strong>
        </label>
        <input
          id="height"
          type="range"
          min="3"
          max="20"
          step="1"
          value={height}
          onChange={(e) => onHeightChange(Number(e.target.value))}
        />
        <div className="range-labels">
          <span>3m</span>
          <span>20m</span>
        </div>
      </div>

      <div className="control-group">
        <label>{t.controls.band}</label>
        <div className="band-buttons">
          <button
            className={band === '40m' ? 'selected' : ''}
            onClick={() => onBandChange('40m')}
          >
            40m
          </button>
          <button
            className={band === '20m' ? 'selected' : ''}
            onClick={() => onBandChange('20m')}
          >
            20m
          </button>
        </div>
      </div>

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
    </div>
  );
}
