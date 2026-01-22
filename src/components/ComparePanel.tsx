import { useI18n } from '../i18n';
import { AntennaSelector } from './AntennaSelector';
import { Controls } from './Controls';
import type { AntennaType, Band, GroundQuality, TerrainType } from '../data/antennaPatterns';

interface Props {
  antennaType: AntennaType;
  onAntennaTypeChange: (type: AntennaType) => void;
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
  label: string;
  color: string;
}

export function ComparePanel({
  antennaType,
  onAntennaTypeChange,
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
  label,
  color,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="compare-panel" style={{ borderColor: color }}>
      <div className="compare-panel-header" style={{ backgroundColor: color }}>
        <span className="compare-label">{label}</span>
        <span className="compare-antenna-name">
          {t.antenna[antennaType as keyof typeof t.antenna] || antennaType}
        </span>
      </div>
      <div className="compare-panel-content">
        <AntennaSelector value={antennaType} onChange={onAntennaTypeChange} compact />
        <Controls
          height={height}
          onHeightChange={onHeightChange}
          band={band}
          onBandChange={onBandChange}
          orientation={orientation}
          onOrientationChange={onOrientationChange}
          groundQuality={groundQuality}
          onGroundQualityChange={onGroundQualityChange}
          terrain={terrain}
          onTerrainChange={onTerrainChange}
          antennaType={antennaType}
          compact
        />
      </div>
    </div>
  );
}
