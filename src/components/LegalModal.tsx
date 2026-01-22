import { useI18n } from '../i18n';

interface Props {
  type: 'imprint' | 'privacy';
  onClose: () => void;
}

export function LegalModal({ type, onClose }: Props) {
  const { t } = useI18n();

  const imprint = t.imprint;
  const privacy = t.privacy;

  return (
    <div className="legal-overlay" onClick={onClose}>
      <div className="legal-modal" onClick={(e) => e.stopPropagation()}>
        <button className="legal-close" onClick={onClose}>
          &times;
        </button>

        {type === 'imprint' ? (
          <>
            <h2>{imprint?.title || 'Imprint'}</h2>
            <p className="legal-info">{imprint?.info}</p>

            <div className="legal-section">
              <h3>{imprint?.operator}</h3>
              <p>
                {imprint?.operatorName}<br />
                {imprint?.operatorCallsign}<br />
                {imprint?.operatorAddress}<br />
                {imprint?.operatorCountry}
              </p>
            </div>

            <div className="legal-section">
              <h3>{imprint?.contact}</h3>
              <p>
                <a href={`mailto:${imprint?.contactEmail}`}>{imprint?.contactEmail}</a>
              </p>
            </div>

            <div className="legal-section">
              <h3>{imprint?.liabilityTitle}</h3>
              <p>{imprint?.liabilityText}</p>
            </div>

            <div className="legal-section">
              <h3>{imprint?.externalLinksTitle}</h3>
              <p>{imprint?.externalLinksText}</p>
            </div>

            <div className="legal-section">
              <h3>{imprint?.copyrightTitle}</h3>
              <p>{imprint?.copyrightText}</p>
            </div>

            <div className="legal-section">
              <h3>{imprint?.disclaimerTitle}</h3>
              <p>{imprint?.disclaimerText}</p>
            </div>
          </>
        ) : (
          <>
            <h2>{privacy?.title || 'Privacy Policy'}</h2>
            <p>{privacy?.intro}</p>

            <div className="legal-section">
              <h3>{privacy?.noDataTitle}</h3>
              <p>{privacy?.noDataText}</p>
              <p className="legal-list">{privacy?.noDataList}</p>
            </div>

            <div className="legal-section">
              <h3>{privacy?.localStorageTitle}</h3>
              <p>{privacy?.localStorageText}</p>
            </div>

            <div className="legal-section">
              <h3>{privacy?.cloudflareTitle}</h3>
              <p>{privacy?.cloudflareText}</p>
            </div>

            <div className="legal-section">
              <h3>{privacy?.contactTitle}</h3>
              <p>{privacy?.contactText}</p>
              <p>
                <a href={`mailto:${imprint?.contactEmail}`}>{imprint?.contactEmail}</a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
