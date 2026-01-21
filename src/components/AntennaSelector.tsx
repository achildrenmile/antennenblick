import { useI18n } from '../i18n';
import type { AntennaType } from '../data/antennaPatterns';

interface Props {
  value: AntennaType;
  onChange: (type: AntennaType) => void;
}

export function AntennaSelector({ value, onChange }: Props) {
  const { t } = useI18n();

  const antennas: { type: AntennaType; label: string; icon: string }[] = [
    { type: 'dipole', label: t.antenna.dipole, icon: '―' },
    { type: 'vertical', label: t.antenna.vertical, icon: '│' },
    { type: 'invertedV', label: t.antenna.invertedV, icon: '∧' },
  ];

  return (
    <div className="antenna-selector">
      <h3>{t.antenna.title}</h3>
      <div className="antenna-options">
        {antennas.map(({ type, label, icon }) => (
          <button
            key={type}
            className={`antenna-option ${value === type ? 'selected' : ''}`}
            onClick={() => onChange(type)}
          >
            <span className="antenna-icon">{icon}</span>
            <span className="antenna-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
