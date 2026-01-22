import { useState } from 'react';
import { useI18n } from '../i18n';

interface Props {
  type: 'azimuth' | 'elevation';
}

export function DiagramHelp({ type }: Props) {
  const { t } = useI18n();
  const [showHelp, setShowHelp] = useState(false);

  const helpText = type === 'azimuth'
    ? t.education?.azimuthExplain
    : t.education?.elevationExplain;

  return (
    <div className="diagram-help">
      <button
        className="diagram-help-button"
        onClick={() => setShowHelp(!showHelp)}
        title={showHelp ? 'Hilfe schließen' : 'Hilfe anzeigen'}
      >
        ?
      </button>
      {showHelp && (
        <div className="diagram-help-tooltip">
          <p>{helpText}</p>
        </div>
      )}
    </div>
  );
}
