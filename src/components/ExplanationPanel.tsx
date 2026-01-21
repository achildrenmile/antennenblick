import { useI18n } from '../i18n';
import type { AntennaConfig } from '../data/antennaPatterns';
import {
  getHeightCategoryForConfig,
  getMainLobeAngle,
  getRadiationCharacter,
} from '../data/antennaPatterns';

interface Props {
  config: AntennaConfig;
}

export function ExplanationPanel({ config }: Props) {
  const { t } = useI18n();

  const heightCat = getHeightCategoryForConfig(config);
  const mainLobe = getMainLobeAngle(config);
  const character = getRadiationCharacter(config);

  // Get the appropriate tip from translations
  const tipKey = heightCat as 'low' | 'medium' | 'high';
  const tip = t.tips[config.type][tipKey];

  const characterLabel = character === 'nvis'
    ? t.explanation.highAngle
    : character === 'dx'
    ? t.explanation.lowAngle
    : `${t.explanation.highAngle} / ${t.explanation.lowAngle}`;

  const characterDescription = character === 'nvis'
    ? t.explanation.nvis
    : character === 'dx'
    ? t.explanation.dx
    : `${t.explanation.nvis} & ${t.explanation.dx}`;

  return (
    <div className="explanation-panel">
      <div className="explanation-main">
        <p className="tip-text">{tip}</p>
      </div>

      <div className="explanation-details">
        <div className="detail-item">
          <span className="detail-label">{t.explanation.mainLobe}:</span>
          <span className="detail-value">{mainLobe}°</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">{characterLabel}:</span>
          <span className={`detail-value character-${character}`}>
            {characterDescription}
          </span>
        </div>
      </div>

      {config.realistic && (
        <div className="realistic-note">
          <p>{t.tips.realistic}</p>
        </div>
      )}
    </div>
  );
}
