import type { AntennaType } from '../data/antennaPatterns';

interface Props {
  type: AntennaType;
  size?: number;
}

export function AntennaSchematic({ type, size = 120 }: Props) {
  const strokeColor = 'var(--color-primary)';
  const strokeWidth = 2;
  const groundColor = 'var(--color-text-dim)';
  const feedColor = '#e74c3c';

  const renderSchematic = () => {
    switch (type) {
      case 'dipole':
        return (
          <svg viewBox="0 0 100 60" width={size} height={size * 0.6}>
            {/* Dipole wire */}
            <line x1="10" y1="30" x2="90" y2="30" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Feed point */}
            <circle cx="50" cy="30" r="4" fill={feedColor} />
            {/* Coax */}
            <line x1="50" y1="34" x2="50" y2="55" stroke={feedColor} strokeWidth={strokeWidth} />
            {/* Insulators */}
            <circle cx="10" cy="30" r="3" fill="none" stroke={strokeColor} strokeWidth={1} />
            <circle cx="90" cy="30" r="3" fill="none" stroke={strokeColor} strokeWidth={1} />
            {/* Support ropes */}
            <line x1="10" y1="30" x2="5" y2="15" stroke={groundColor} strokeWidth={1} strokeDasharray="2,2" />
            <line x1="90" y1="30" x2="95" y2="15" stroke={groundColor} strokeWidth={1} strokeDasharray="2,2" />
          </svg>
        );

      case 'invertedV':
        return (
          <svg viewBox="0 0 100 70" width={size} height={size * 0.7}>
            {/* Mast */}
            <line x1="50" y1="10" x2="50" y2="65" stroke={groundColor} strokeWidth={2} />
            {/* Left leg */}
            <line x1="50" y1="15" x2="15" y2="50" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Right leg */}
            <line x1="50" y1="15" x2="85" y2="50" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Feed point */}
            <circle cx="50" cy="15" r="4" fill={feedColor} />
            {/* Coax down mast */}
            <line x1="52" y1="19" x2="52" y2="65" stroke={feedColor} strokeWidth={1.5} />
            {/* End insulators */}
            <circle cx="15" cy="50" r="3" fill="none" stroke={strokeColor} strokeWidth={1} />
            <circle cx="85" cy="50" r="3" fill="none" stroke={strokeColor} strokeWidth={1} />
          </svg>
        );

      case 'vertical':
      case 'vertical58':
        return (
          <svg viewBox="0 0 100 80" width={size} height={size * 0.8}>
            {/* Ground plane */}
            <line x1="10" y1="60" x2="90" y2="60" stroke={groundColor} strokeWidth={1} />
            {/* Vertical element */}
            <line x1="50" y1="60" x2="50" y2="10" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Radials */}
            <line x1="50" y1="60" x2="15" y2="70" stroke={strokeColor} strokeWidth={1.5} />
            <line x1="50" y1="60" x2="35" y2="72" stroke={strokeColor} strokeWidth={1.5} />
            <line x1="50" y1="60" x2="65" y2="72" stroke={strokeColor} strokeWidth={1.5} />
            <line x1="50" y1="60" x2="85" y2="70" stroke={strokeColor} strokeWidth={1.5} />
            {/* Feed point */}
            <circle cx="50" cy="60" r="4" fill={feedColor} />
            {/* Top cap for 5/8 */}
            {type === 'vertical58' && (
              <line x1="45" y1="10" x2="55" y2="10" stroke={strokeColor} strokeWidth={strokeWidth} />
            )}
          </svg>
        );

      case 'collinear':
        return (
          <svg viewBox="0 0 100 90" width={size} height={size * 0.9}>
            {/* Ground */}
            <line x1="10" y1="85" x2="90" y2="85" stroke={groundColor} strokeWidth={1} />
            {/* Lower section */}
            <line x1="50" y1="85" x2="50" y2="55" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Phasing coil */}
            <path d="M50,55 Q55,52 50,49 Q45,46 50,43 Q55,40 50,37" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Upper section */}
            <line x1="50" y1="37" x2="50" y2="10" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Radials */}
            <line x1="50" y1="85" x2="20" y2="90" stroke={strokeColor} strokeWidth={1.5} />
            <line x1="50" y1="85" x2="80" y2="90" stroke={strokeColor} strokeWidth={1.5} />
            {/* Feed point */}
            <circle cx="50" cy="85" r="4" fill={feedColor} />
          </svg>
        );

      case 'efhw':
        return (
          <svg viewBox="0 0 100 60" width={size} height={size * 0.6}>
            {/* Wire */}
            <line x1="10" y1="25" x2="90" y2="25" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* UnUn box */}
            <rect x="5" y="30" width="15" height="12" fill="none" stroke={strokeColor} strokeWidth={1.5} rx="2" />
            <text x="12.5" y="39" textAnchor="middle" fontSize="6" fill={strokeColor}>49:1</text>
            {/* Coax from UnUn */}
            <line x1="12" y1="42" x2="12" y2="55" stroke={feedColor} strokeWidth={strokeWidth} />
            {/* Counterpoise */}
            <line x1="5" y1="42" x2="5" y2="50" stroke={strokeColor} strokeWidth={1.5} strokeDasharray="3,2" />
            {/* End insulator */}
            <circle cx="90" cy="25" r="3" fill="none" stroke={strokeColor} strokeWidth={1} />
          </svg>
        );

      case 'deltaLoop':
        return (
          <svg viewBox="0 0 100 80" width={size} height={size * 0.8}>
            {/* Triangle loop */}
            <polygon points="50,10 15,70 85,70" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Feed point at bottom */}
            <circle cx="50" cy="70" r="4" fill={feedColor} />
            {/* Coax */}
            <line x1="50" y1="74" x2="50" y2="78" stroke={feedColor} strokeWidth={strokeWidth} />
            {/* Support at top */}
            <line x1="50" y1="10" x2="50" y2="5" stroke={groundColor} strokeWidth={1} strokeDasharray="2,2" />
          </svg>
        );

      case 'quadLoop':
        return (
          <svg viewBox="0 0 100 80" width={size} height={size * 0.8}>
            {/* Square loop */}
            <rect x="20" y="10" width="60" height="60" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Feed point at bottom center */}
            <circle cx="50" cy="70" r="4" fill={feedColor} />
            {/* Coax */}
            <line x1="50" y1="74" x2="50" y2="78" stroke={feedColor} strokeWidth={strokeWidth} />
          </svg>
        );

      case 'yagi2el':
      case 'yagi3el':
      case 'yagi4el':
      case 'yagi5el':
      case 'yagi6el':
        const elements = type === 'yagi2el' ? 2 : type === 'yagi3el' ? 3 : type === 'yagi4el' ? 4 : type === 'yagi5el' ? 5 : 6;
        const spacing = 80 / (elements + 1);
        return (
          <svg viewBox="0 0 100 60" width={size} height={size * 0.6}>
            {/* Boom */}
            <line x1="10" y1="30" x2="90" y2="30" stroke={groundColor} strokeWidth={2} />
            {/* Elements */}
            {Array.from({ length: elements }).map((_, i) => {
              const x = 10 + spacing * (i + 1);
              const isReflector = i === 0;
              const isDriven = i === 1;
              const len = isReflector ? 22 : isDriven ? 20 : 18 - i * 0.5;
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1={30 - len}
                    x2={x}
                    y2={30 + len}
                    stroke={isDriven ? feedColor : strokeColor}
                    strokeWidth={isDriven ? strokeWidth + 0.5 : strokeWidth}
                  />
                  {isDriven && <circle cx={x} cy={30} r="3" fill={feedColor} />}
                </g>
              );
            })}
            {/* Direction arrow */}
            <polygon points="92,30 85,26 85,34" fill={strokeColor} />
          </svg>
        );

      case 'magloop':
        return (
          <svg viewBox="0 0 100 80" width={size} height={size * 0.8}>
            {/* Main loop */}
            <circle cx="50" cy="40" r="30" fill="none" stroke={strokeColor} strokeWidth={3} />
            {/* Tuning capacitor at top */}
            <line x1="42" y1="10" x2="42" y2="15" stroke={strokeColor} strokeWidth={2} />
            <line x1="58" y1="10" x2="58" y2="15" stroke={strokeColor} strokeWidth={2} />
            <line x1="38" y1="8" x2="46" y2="8" stroke={strokeColor} strokeWidth={2} />
            <line x1="54" y1="12" x2="62" y2="12" stroke={strokeColor} strokeWidth={2} />
            {/* Coupling loop */}
            <circle cx="50" cy="40" r="10" fill="none" stroke={feedColor} strokeWidth={1.5} />
            {/* Feed */}
            <line x1="50" y1="50" x2="50" y2="75" stroke={feedColor} strokeWidth={strokeWidth} />
          </svg>
        );

      case 'g5rv':
      case 'zs6bkw':
        return (
          <svg viewBox="0 0 100 70" width={size} height={size * 0.7}>
            {/* Dipole wire */}
            <line x1="5" y1="15" x2="95" y2="15" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Ladder line */}
            <line x1="48" y1="15" x2="48" y2="50" stroke={strokeColor} strokeWidth={1.5} />
            <line x1="52" y1="15" x2="52" y2="50" stroke={strokeColor} strokeWidth={1.5} />
            {/* Rungs */}
            {[20, 28, 36, 44].map(y => (
              <line key={y} x1="48" y1={y} x2="52" y2={y} stroke={strokeColor} strokeWidth={1} />
            ))}
            {/* Balun */}
            <rect x="43" y="50" width="14" height="10" fill="none" stroke={strokeColor} strokeWidth={1.5} rx="2" />
            {/* Coax */}
            <line x1="50" y1="60" x2="50" y2="68" stroke={feedColor} strokeWidth={strokeWidth} />
            {/* Feed point */}
            <circle cx="50" cy="15" r="3" fill={feedColor} />
          </svg>
        );

      case 'windom':
        return (
          <svg viewBox="0 0 100 60" width={size} height={size * 0.6}>
            {/* Wire - off-center fed */}
            <line x1="5" y1="20" x2="95" y2="20" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Feed point at 1/3 position */}
            <circle cx="35" cy="20" r="4" fill={feedColor} />
            {/* Coax */}
            <line x1="35" y1="24" x2="35" y2="55" stroke={feedColor} strokeWidth={strokeWidth} />
            {/* Labels */}
            <text x="20" y="35" fontSize="8" fill={groundColor}>1/3</text>
            <text x="60" y="35" fontSize="8" fill={groundColor}>2/3</text>
          </svg>
        );

      case 'sloper':
        return (
          <svg viewBox="0 0 100 80" width={size} height={size * 0.8}>
            {/* Tower/mast */}
            <line x1="20" y1="10" x2="20" y2="75" stroke={groundColor} strokeWidth={3} />
            {/* Sloping wire */}
            <line x1="20" y1="15" x2="85" y2="65" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Feed at top */}
            <circle cx="20" cy="15" r="4" fill={feedColor} />
            {/* Ground */}
            <line x1="10" y1="75" x2="30" y2="75" stroke={groundColor} strokeWidth={2} />
            {/* End stake */}
            <line x1="85" y1="65" x2="85" y2="75" stroke={groundColor} strokeWidth={1} strokeDasharray="2,2" />
          </svg>
        );

      case 'longwire':
      case 'randomWire':
        return (
          <svg viewBox="0 0 100 60" width={size} height={size * 0.6}>
            {/* Long wire with slight sag */}
            <path d="M5,25 Q50,35 95,25" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Tuner box */}
            <rect x="2" y="35" width="15" height="12" fill="none" stroke={strokeColor} strokeWidth={1.5} rx="2" />
            <text x="9.5" y="44" textAnchor="middle" fontSize="5" fill={strokeColor}>ATU</text>
            {/* Connection to tuner */}
            <line x1="5" y1="25" x2="5" y2="35" stroke={strokeColor} strokeWidth={1.5} />
            {/* Coax from tuner */}
            <line x1="9" y1="47" x2="9" y2="55" stroke={feedColor} strokeWidth={strokeWidth} />
            {/* Ground rod */}
            <line x1="2" y1="47" x2="2" y2="55" stroke={groundColor} strokeWidth={2} />
            <line x1="0" y1="55" x2="4" y2="55" stroke={groundColor} strokeWidth={1} />
          </svg>
        );

      case 'cobweb':
        return (
          <svg viewBox="0 0 100 80" width={size} height={size * 0.8}>
            {/* Mast */}
            <line x1="50" y1="40" x2="50" y2="78" stroke={groundColor} strokeWidth={2} />
            {/* Spreader arms */}
            {[0, 72, 144, 216, 288].map(angle => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={angle}
                  x1="50"
                  y1="40"
                  x2={50 + 35 * Math.cos(rad)}
                  y2={40 + 35 * Math.sin(rad)}
                  stroke={groundColor}
                  strokeWidth={1.5}
                />
              );
            })}
            {/* Wire web - pentagon */}
            <polygon
              points="50,5 85,30 75,70 25,70 15,30"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            {/* Feed */}
            <circle cx="50" cy="70" r="3" fill={feedColor} />
          </svg>
        );

      case 'hexbeam':
        return (
          <svg viewBox="0 0 100 80" width={size} height={size * 0.8}>
            {/* Mast */}
            <line x1="50" y1="40" x2="50" y2="78" stroke={groundColor} strokeWidth={2} />
            {/* Spreader arms - 6 */}
            {[0, 60, 120, 180, 240, 300].map(angle => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={angle}
                  x1="50"
                  y1="40"
                  x2={50 + 30 * Math.cos(rad)}
                  y2={40 + 30 * Math.sin(rad)}
                  stroke={groundColor}
                  strokeWidth={1.5}
                />
              );
            })}
            {/* Wire elements - hexagon shape */}
            <polygon
              points="50,10 76,25 76,55 50,70 24,55 24,25"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            {/* Feed */}
            <circle cx="50" cy="70" r="3" fill={feedColor} />
            {/* Direction */}
            <polygon points="50,5 46,12 54,12" fill={strokeColor} />
          </svg>
        );

      case 'moxon':
        return (
          <svg viewBox="0 0 100 70" width={size} height={size * 0.7}>
            {/* Driven element - bent */}
            <path d="M20,25 L20,35 L40,35 L40,25" fill="none" stroke={feedColor} strokeWidth={strokeWidth} />
            <path d="M60,25 L60,35 L80,35 L80,25" fill="none" stroke={feedColor} strokeWidth={strokeWidth} />
            <line x1="20" y1="25" x2="80" y2="25" stroke={feedColor} strokeWidth={strokeWidth} />
            {/* Reflector - bent */}
            <path d="M15,45 L15,55 L35,55 L35,45" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            <path d="M65,45 L65,55 L85,55 L85,45" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="15" y1="45" x2="85" y2="45" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Boom */}
            <line x1="50" y1="25" x2="50" y2="65" stroke={groundColor} strokeWidth={2} />
            {/* Feed */}
            <circle cx="50" cy="25" r="3" fill={feedColor} />
            {/* Direction */}
            <polygon points="50,10 46,17 54,17" fill={strokeColor} />
          </svg>
        );

      case 'hb9cv':
        return (
          <svg viewBox="0 0 100 70" width={size} height={size * 0.7}>
            {/* Boom */}
            <line x1="25" y1="35" x2="75" y2="35" stroke={groundColor} strokeWidth={2} />
            {/* Driven element */}
            <line x1="35" y1="10" x2="35" y2="60" stroke={feedColor} strokeWidth={strokeWidth} />
            {/* Director */}
            <line x1="65" y1="12" x2="65" y2="58" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Phasing line */}
            <path d="M35,35 Q50,25 65,35" fill="none" stroke={strokeColor} strokeWidth={1.5} />
            {/* Feed */}
            <circle cx="35" cy="35" r="3" fill={feedColor} />
            {/* Direction */}
            <polygon points="80,35 73,31 73,39" fill={strokeColor} />
          </svg>
        );

      case 'jPole':
      case 'slimJim':
        return (
          <svg viewBox="0 0 100 90" width={size} height={size * 0.9}>
            {/* Main radiator */}
            <line x1="60" y1="10" x2="60" y2="80" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Short stub */}
            <line x1="40" y1="50" x2="40" y2="80" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Bottom connection */}
            <line x1="40" y1="80" x2="60" y2="80" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Feed point */}
            <circle cx="40" cy="60" r="3" fill={feedColor} />
            <circle cx="60" cy="60" r="3" fill={feedColor} />
            {/* Coax */}
            <line x1="40" y1="63" x2="40" y2="88" stroke={feedColor} strokeWidth={1.5} />
            {type === 'slimJim' && (
              <>
                {/* Gap for Slim Jim */}
                <line x1="40" y1="50" x2="40" y2="45" stroke="var(--color-bg)" strokeWidth={4} />
                <line x1="60" y1="50" x2="60" y2="45" stroke="var(--color-bg)" strokeWidth={4} />
              </>
            )}
          </svg>
        );

      case 'discone':
        return (
          <svg viewBox="0 0 100 80" width={size} height={size * 0.8}>
            {/* Disc at top */}
            <ellipse cx="50" cy="20" rx="25" ry="8" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Cone */}
            <line x1="25" y1="20" x2="35" y2="70" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="75" y1="20" x2="65" y2="70" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="35" y1="70" x2="65" y2="70" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Feed point */}
            <circle cx="50" cy="20" r="3" fill={feedColor} />
            {/* Coax */}
            <line x1="50" y1="23" x2="50" y2="75" stroke={feedColor} strokeWidth={1.5} />
          </svg>
        );

      case 'helix':
        return (
          <svg viewBox="0 0 100 80" width={size} height={size * 0.8}>
            {/* Ground plane */}
            <ellipse cx="50" cy="70" rx="35" ry="8" fill="none" stroke={groundColor} strokeWidth={1.5} />
            {/* Helix coil */}
            <path
              d="M50,65 Q65,60 50,55 Q35,50 50,45 Q65,40 50,35 Q35,30 50,25 Q65,20 50,15"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            {/* Feed */}
            <circle cx="50" cy="70" r="3" fill={feedColor} />
          </svg>
        );

      case 'patch':
        return (
          <svg viewBox="0 0 100 70" width={size} height={size * 0.7}>
            {/* Ground plane */}
            <rect x="15" y="40" width="70" height="25" fill="none" stroke={groundColor} strokeWidth={1.5} />
            {/* Patch element */}
            <rect x="25" y="15" width="50" height="20" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Feed probe */}
            <circle cx="40" cy="25" r="3" fill={feedColor} />
            <line x1="40" y1="28" x2="40" y2="65" stroke={feedColor} strokeWidth={1.5} />
            {/* Substrate indication */}
            <line x1="25" y1="35" x2="75" y2="35" stroke={groundColor} strokeWidth={1} strokeDasharray="2,2" />
          </svg>
        );

      case 'vivaldi':
        return (
          <svg viewBox="0 0 100 70" width={size} height={size * 0.7}>
            {/* Tapered slot */}
            <path
              d="M10,35 Q30,35 50,20 L90,20"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <path
              d="M10,35 Q30,35 50,50 L90,50"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            {/* Substrate */}
            <rect x="5" y="15" width="90" height="40" fill="none" stroke={groundColor} strokeWidth={1} strokeDasharray="3,2" />
            {/* Feed point */}
            <circle cx="10" cy="35" r="3" fill={feedColor} />
            {/* Direction */}
            <polygon points="95,35 88,31 88,39" fill={strokeColor} />
          </svg>
        );

      case 'fanDipole':
        return (
          <svg viewBox="0 0 100 70" width={size} height={size * 0.7}>
            {/* Multiple dipole wires fanning out */}
            <line x1="50" y1="35" x2="10" y2="20" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="50" y1="35" x2="10" y2="35" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="50" y1="35" x2="10" y2="50" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="50" y1="35" x2="90" y2="20" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="50" y1="35" x2="90" y2="35" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="50" y1="35" x2="90" y2="50" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Feed point */}
            <circle cx="50" cy="35" r="4" fill={feedColor} />
            {/* Coax */}
            <line x1="50" y1="39" x2="50" y2="65" stroke={feedColor} strokeWidth={strokeWidth} />
          </svg>
        );

      case 'logPeriodic':
        return (
          <svg viewBox="0 0 100 60" width={size} height={size * 0.6}>
            {/* Boom */}
            <line x1="10" y1="30" x2="90" y2="30" stroke={groundColor} strokeWidth={2} />
            {/* Elements - progressively shorter */}
            {[15, 28, 40, 52, 63, 73, 82].map((x, i) => {
              const len = 22 - i * 2.5;
              return (
                <line
                  key={i}
                  x1={x}
                  y1={30 - len}
                  x2={x}
                  y2={30 + len}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                />
              );
            })}
            {/* Feed at back */}
            <circle cx="15" cy="30" r="3" fill={feedColor} />
            {/* Direction */}
            <polygon points="92,30 85,26 85,34" fill={strokeColor} />
          </svg>
        );

      case 'quad2el':
      case 'quad3el':
        const quadElements = type === 'quad2el' ? 2 : 3;
        return (
          <svg viewBox="0 0 100 70" width={size} height={size * 0.7}>
            {/* Boom */}
            <line x1="15" y1="35" x2="85" y2="35" stroke={groundColor} strokeWidth={2} />
            {/* Quad loops */}
            {Array.from({ length: quadElements }).map((_, i) => {
              const x = 25 + i * 25;
              const size = 24 - i * 2;
              const isDriver = i === 0;
              return (
                <rect
                  key={i}
                  x={x - size / 2}
                  y={35 - size / 2}
                  width={size}
                  height={size}
                  fill="none"
                  stroke={isDriver ? feedColor : strokeColor}
                  strokeWidth={strokeWidth}
                  transform={`rotate(45, ${x}, 35)`}
                />
              );
            })}
            {/* Feed */}
            <circle cx="25" cy="35" r="3" fill={feedColor} />
            {/* Direction */}
            <polygon points="90,35 83,31 83,39" fill={strokeColor} />
          </svg>
        );

      case 'superJ':
        return (
          <svg viewBox="0 0 100 90" width={size} height={size * 0.9}>
            {/* Lower J section */}
            <line x1="60" y1="85" x2="60" y2="55" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="40" y1="85" x2="40" y2="70" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="40" y1="85" x2="60" y2="85" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Phasing section */}
            <path d="M60,55 Q65,50 60,45 Q55,40 60,35" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Upper section */}
            <line x1="60" y1="35" x2="60" y2="5" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Feed */}
            <circle cx="40" cy="75" r="3" fill={feedColor} />
            <line x1="40" y1="78" x2="40" y2="88" stroke={feedColor} strokeWidth={1.5} />
          </svg>
        );

      case 'spiderbeam':
        return (
          <svg viewBox="0 0 100 80" width={size} height={size * 0.8}>
            {/* Center hub */}
            <circle cx="50" cy="40" r="5" fill="none" stroke={groundColor} strokeWidth={1.5} />
            {/* Spreader arms */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={angle}
                  x1="50"
                  y1="40"
                  x2={50 + 35 * Math.cos(rad)}
                  y2={40 + 35 * Math.sin(rad)}
                  stroke={groundColor}
                  strokeWidth={1}
                />
              );
            })}
            {/* Wire elements */}
            <circle cx="50" cy="40" r="32" fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
            <circle cx="50" cy="40" r="25" fill="none" stroke={strokeColor} strokeWidth={1.5} strokeDasharray="4,2" />
            {/* Feed */}
            <circle cx="50" cy="72" r="3" fill={feedColor} />
            {/* Direction */}
            <polygon points="50,5 46,12 54,12" fill={strokeColor} />
          </svg>
        );

      case 'zepp':
      case 'edz':
        return (
          <svg viewBox="0 0 100 60" width={size} height={size * 0.6}>
            {/* Wire */}
            <line x1="5" y1="20" x2="95" y2="20" stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* End-fed point */}
            <circle cx="5" cy="20" r="4" fill={feedColor} />
            {/* Ladder line / feeder */}
            <line x1="3" y1="24" x2="3" y2="55" stroke={strokeColor} strokeWidth={1.5} />
            <line x1="7" y1="24" x2="7" y2="55" stroke={strokeColor} strokeWidth={1.5} />
            {[30, 38, 46].map(y => (
              <line key={y} x1="3" y1={y} x2="7" y2={y} stroke={strokeColor} strokeWidth={1} />
            ))}
            {/* EDZ is longer - show extended */}
            {type === 'edz' && (
              <text x="50" y="35" textAnchor="middle" fontSize="8" fill={groundColor}>1.28λ</text>
            )}
          </svg>
        );

      default:
        // Generic antenna symbol
        return (
          <svg viewBox="0 0 100 60" width={size} height={size * 0.6}>
            <line x1="50" y1="10" x2="50" y2="50" stroke={strokeColor} strokeWidth={strokeWidth} />
            <line x1="30" y1="20" x2="70" y2="20" stroke={strokeColor} strokeWidth={strokeWidth} />
            <circle cx="50" cy="50" r="4" fill={feedColor} />
          </svg>
        );
    }
  };

  return (
    <div className="antenna-schematic">
      {renderSchematic()}
    </div>
  );
}
