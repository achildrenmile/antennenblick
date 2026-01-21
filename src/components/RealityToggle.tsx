import { useI18n } from '../i18n';

interface Props {
  realistic: boolean;
  onChange: (realistic: boolean) => void;
}

export function RealityToggle({ realistic, onChange }: Props) {
  const { t } = useI18n();

  return (
    <div className="reality-toggle">
      <h3>{t.reality.title}</h3>
      <div className="toggle-buttons">
        <button
          className={!realistic ? 'selected' : ''}
          onClick={() => onChange(false)}
          title={t.reality.idealDescription}
        >
          {t.reality.ideal}
        </button>
        <button
          className={realistic ? 'selected' : ''}
          onClick={() => onChange(true)}
          title={t.reality.realisticDescription}
        >
          {t.reality.realistic}
        </button>
      </div>
    </div>
  );
}
