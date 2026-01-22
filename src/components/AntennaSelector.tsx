import { useI18n } from '../i18n';
import type { AntennaType } from '../data/antennaPatterns';

interface Props {
  value: AntennaType;
  onChange: (type: AntennaType) => void;
  compact?: boolean;
}

const ANTENNA_ICONS: Record<AntennaType, string> = {
  dipole: '―',
  vertical: '│',
  vertical58: '┃',
  collinear: '┊',
  invertedV: '∧',
  efhw: '⌐',
  randomWire: '~',
  deltaLoop: '△',
  g5rv: '═',
  yagi2el: '→',
  yagi3el: '⇒',
  yagi4el: '⇛',
  yagi5el: '⇶',
  yagi6el: '⇻',
  magloop: '○',
  windom: '⊢',
  zepp: '⊣',
  edz: '⊨',
  quadLoop: '◇',
  quad2el: '◆',
  quad3el: '❖',
  sloper: '╲',
  longwire: '━',
  cobweb: '✱',
  hexbeam: '⬡',
  zs6bkw: '≡',
  hb9cv: '⇀',
  fanDipole: '⋔',
  spiderbeam: '✶',
  moxon: '▭',
  logPeriodic: '⋙',
  jPole: '⌋',
  slimJim: '⎾',
  superJ: '⟒',
  discone: '◊',
  helix: '⌀',
  patch: '▢',
  vivaldi: '◁',
};

const ANTENNA_ORDER: AntennaType[] = [
  // Drahtantennen (Wire Antennas)
  'dipole',
  'invertedV',
  'fanDipole',
  'efhw',
  'windom',
  'zepp',
  'edz',
  'g5rv',
  'zs6bkw',
  'deltaLoop',
  'quadLoop',
  'sloper',
  'longwire',
  'randomWire',
  // Vertikalantennen (Verticals)
  'vertical',
  'vertical58',
  'collinear',
  'jPole',
  'slimJim',
  'superJ',
  'discone',
  // Kompakt/Multiband
  'magloop',
  'cobweb',
  // Richtantennen (Directional)
  'moxon',
  'hexbeam',
  'spiderbeam',
  'hb9cv',
  'yagi2el',
  'yagi3el',
  'yagi4el',
  'yagi5el',
  'yagi6el',
  'quad2el',
  'quad3el',
  'logPeriodic',
  // Mikrowellen/Spezial
  'helix',
  'patch',
  'vivaldi',
];

export function AntennaSelector({ value, onChange, compact }: Props) {
  const { t } = useI18n();

  if (compact) {
    return (
      <div className="antenna-selector compact">
        <select
          className="antenna-select"
          value={value}
          onChange={(e) => onChange(e.target.value as AntennaType)}
        >
          {ANTENNA_ORDER.map((type) => (
            <option key={type} value={type}>
              {ANTENNA_ICONS[type]} {t.antenna[type]}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="antenna-selector">
      <h3>{t.antenna.title}</h3>
      <div className="antenna-options">
        {ANTENNA_ORDER.map((type) => (
          <button
            key={type}
            className={`antenna-option ${value === type ? 'selected' : ''}`}
            onClick={() => onChange(type)}
          >
            <span className="antenna-icon">{ANTENNA_ICONS[type]}</span>
            <span className="antenna-label">{t.antenna[type]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
