import { useI18n } from '../i18n';
import type { AntennaConfig } from '../data/antennaPatterns';
import {
  getHeightCategoryForConfig,
  getMainLobeAngle,
  getRadiationCharacter,
  estimateCoverage,
  getAntennaSpecs,
  BAND_INFO,
} from '../data/antennaPatterns';

interface Props {
  config: AntennaConfig;
}

export function ExplanationPanel({ config }: Props) {
  const { t } = useI18n();

  const heightCat = getHeightCategoryForConfig(config);
  const mainLobe = getMainLobeAngle(config);
  const character = getRadiationCharacter(config);
  const coverage = estimateCoverage(config);
  const bandInfo = BAND_INFO[config.band];
  const specs = getAntennaSpecs(config.type, config.band, config);

  // Get the appropriate tip from translations - handle missing keys gracefully
  const antennaTranslations = t.tips[config.type as keyof typeof t.tips];
  const tip = antennaTranslations && typeof antennaTranslations === 'object'
    ? (antennaTranslations as Record<string, string>)[heightCat] || ''
    : '';

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

  // Get coverage description from translations
  const coverageText = t.coverage?.[coverage.bestFor as keyof typeof t.coverage] || '';

  // Get band info from translations
  const bandTranslations = t.bands?.[config.band as keyof typeof t.bands];
  const bandInfoText = bandTranslations && typeof bandTranslations === 'object'
    ? (bandTranslations as { info?: string }).info || ''
    : '';

  // Get search query for build instructions
  const antennaSearchTerms = t.antennaSearch as Record<string, string> | undefined;
  const searchQuery = antennaSearchTerms?.[config.type] || config.type + ' antenna build';
  const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`;

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

      <div className="specs-section">
        <div className="specs-header">{t.specs?.title || 'Antenna Specifications'}</div>
        <div className="specs-grid">
          {specs.length && (
            <div className="spec-item">
              <span className="spec-label">{t.specs?.length || 'Length'}:</span>
              <span className="spec-value">{specs.length}</span>
            </div>
          )}
          {specs.height && (
            <div className="spec-item">
              <span className="spec-label">{t.specs?.height || 'Height'}:</span>
              <span className="spec-value">{specs.height}</span>
            </div>
          )}
          {specs.radials && (
            <div className="spec-item">
              <span className="spec-label">{t.specs?.radials || 'Radials'}:</span>
              <span className="spec-value">{specs.radials}</span>
            </div>
          )}
          {specs.gain && (
            <div className="spec-item">
              <span className="spec-label">{t.specs?.gain || 'Gain'}:</span>
              <span className="spec-value">{specs.gain}</span>
            </div>
          )}
          {specs.impedance && (
            <div className="spec-item">
              <span className="spec-label">{t.specs?.impedance || 'Impedance'}:</span>
              <span className="spec-value">{specs.impedance}</span>
            </div>
          )}
          {specs.bandwidth && (
            <div className="spec-item">
              <span className="spec-label">{t.specs?.bandwidth || 'Bandwidth'}:</span>
              <span className="spec-value">{specs.bandwidth}</span>
            </div>
          )}
        </div>
      </div>

      <div className="coverage-section">
        <div className="coverage-header">
          <span className="coverage-label">{t.coverage?.estimated || 'Estimated Range'}:</span>
          <span className="coverage-value">
            {coverage.minDistance} {t.coverage?.to || 'to'} {coverage.maxDistance} {t.coverage?.km || 'km'}
          </span>
        </div>
        {coverage.skipZoneEnd > 0 && (
          <div className="skip-zone">
            <span className="skip-label">{t.coverage?.deadZone || 'Skip Zone'}:</span>
            <span className="skip-value">{coverage.skipZoneStart}-{coverage.skipZoneEnd} km</span>
          </div>
        )}
        <p className="coverage-text">{coverageText}</p>
      </div>

      <div className="band-info-section">
        <div className="band-info-header">
          <span className="band-name">{config.band}</span>
          <span className="band-freq">({bandInfo.frequency})</span>
        </div>
        <p className="band-info-text">{bandInfoText}</p>
      </div>

      <div className="build-info-section">
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="build-link"
        >
          🔍 {t.antenna?.moreInfo || 'Build Instructions'}: {t.antenna?.[config.type as keyof typeof t.antenna] || config.type}
        </a>
      </div>

      {config.realistic && (
        <div className="realistic-note">
          <p>{t.tips.realistic}</p>
        </div>
      )}
    </div>
  );
}
