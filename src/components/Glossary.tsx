import { useI18n } from '../i18n';

interface Props {
  onClose: () => void;
}

export function Glossary({ onClose }: Props) {
  const { t } = useI18n();

  const glossary = t.glossary;

  return (
    <div className="glossary-overlay" onClick={onClose}>
      <div className="glossary-modal" onClick={(e) => e.stopPropagation()}>
        <button className="glossary-close" onClick={onClose}>
          &times;
        </button>

        <h2>{glossary?.title || 'Glossar'}</h2>

        <div className="glossary-section">
          <h3>{glossary?.basicsTitle || 'Grundbegriffe'}</h3>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termShortwave || 'Kurzwelle (KW)'}</div>
            <div className="glossary-definition">{glossary?.defShortwave}</div>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termWavelength || 'Wellenlänge (λ)'}</div>
            <div className="glossary-definition">{glossary?.defWavelength}</div>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termIonosphere || 'Ionosphäre'}</div>
            <div className="glossary-definition">{glossary?.defIonosphere}</div>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termPropagation || 'Ausbreitung'}</div>
            <div className="glossary-definition">{glossary?.defPropagation}</div>
          </div>
        </div>

        <div className="glossary-section">
          <h3>{glossary?.patternsTitle || 'Abstrahldiagramme'}</h3>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termAzimuth || 'Horizontaldiagramm (Azimut)'}</div>
            <div className="glossary-definition">{glossary?.defAzimuth}</div>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termElevation || 'Vertikaldiagramm (Elevation)'}</div>
            <div className="glossary-definition">{glossary?.defElevation}</div>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termMainLobe || 'Hauptkeule'}</div>
            <div className="glossary-definition">{glossary?.defMainLobe}</div>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termTakeoffAngle || 'Abstrahlwinkel'}</div>
            <div className="glossary-definition">{glossary?.defTakeoffAngle}</div>
          </div>
        </div>

        <div className="glossary-section">
          <h3>{glossary?.modesTitle || 'Betriebsarten'}</h3>

          <div className="glossary-item">
            <div className="glossary-term">NVIS</div>
            <div className="glossary-definition">{glossary?.defNVIS}</div>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">DX</div>
            <div className="glossary-definition">{glossary?.defDX}</div>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termSkipZone || 'Tote Zone (Skip Zone)'}</div>
            <div className="glossary-definition">{glossary?.defSkipZone}</div>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termGroundwave || 'Bodenwelle'}</div>
            <div className="glossary-definition">{glossary?.defGroundwave}</div>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termSkywave || 'Raumwelle'}</div>
            <div className="glossary-definition">{glossary?.defSkywave}</div>
          </div>
        </div>

        <div className="glossary-section">
          <h3>{glossary?.antennaTitle || 'Antennenbegriffe'}</h3>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termGain || 'Gewinn (dBd/dBi)'}</div>
            <div className="glossary-definition">{glossary?.defGain}</div>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termRadials || 'Radiale'}</div>
            <div className="glossary-definition">{glossary?.defRadials}</div>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termBalun || 'Balun'}</div>
            <div className="glossary-definition">{glossary?.defBalun}</div>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termSWR || 'SWR (Stehwellenverhältnis)'}</div>
            <div className="glossary-definition">{glossary?.defSWR}</div>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">{glossary?.termFB || 'Vor/Rück-Verhältnis (F/B)'}</div>
            <div className="glossary-definition">{glossary?.defFB}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
