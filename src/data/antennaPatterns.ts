export type AntennaType =
  | 'dipole'
  | 'vertical'
  | 'vertical58'     // 5/8λ vertical - higher gain
  | 'collinear'      // Collinear vertical array
  | 'invertedV'
  | 'efhw'           // End-Fed Half-Wave
  | 'randomWire'     // Random wire / long wire
  | 'deltaLoop'      // Horizontal delta loop
  | 'g5rv'           // G5RV
  | 'yagi2el'        // 2-element Yagi
  | 'yagi3el'        // 3-element Yagi
  | 'yagi4el'        // 4-element Yagi
  | 'yagi5el'        // 5-element Yagi
  | 'yagi6el'        // 6-element Yagi
  | 'magloop'        // Magnetic loop
  | 'windom'         // Windom / Off-Center-Fed Dipole
  | 'zepp'           // Zepp / End-Fed Zepp
  | 'edz'            // Extended Double Zepp
  | 'quadLoop'       // Quad Loop
  | 'quad2el'        // 2-element Quad
  | 'quad3el'        // 3-element Quad
  | 'sloper'         // Half-wave sloper
  | 'longwire'       // True long wire (>1λ)
  | 'cobweb'         // Cobweb/Spider antenna
  | 'hexbeam'        // Hexbeam
  | 'zs6bkw'         // ZS6BKW (G5RV variant)
  | 'hb9cv'          // HB9CV 2-element beam
  | 'fanDipole'      // Fan dipole (multi-band)
  | 'spiderbeam'     // Spiderbeam 5-band beam
  | 'moxon'          // Moxon rectangle 2-element
  | 'logPeriodic'    // Log-periodic dipole array
  | 'jPole'          // J-Pole (VHF/UHF)
  | 'slimJim'        // Slim Jim (J-Pole variant)
  | 'superJ'         // Super-J / Collinear J
  | 'discone'        // Discone wideband
  | 'helix'          // Helix antenna (sat)
  | 'patch'          // Patch/microstrip antenna
  | 'vivaldi';       // Vivaldi/tapered slot antenna

export type Band = '2200m' | '630m' | '160m' | '80m' | '60m' | '40m' | '30m' | '20m' | '17m' | '15m' | '12m' | '10m' | '6m' | '4m' | '2m' | '70cm' | '23cm' | '13cm' | '9cm' | '6cm' | '3cm';
export type HeightCategory = 'low' | 'medium' | 'high';

// HF bands (160m - 10m)
const HF_BANDS: Band[] = ['160m', '80m', '60m', '40m', '30m', '20m', '17m', '15m', '12m', '10m'];
// VHF/UHF bands
const VHF_UHF_BANDS: Band[] = ['6m', '4m', '2m', '70cm'];
// Microwave bands
const MICROWAVE_BANDS: Band[] = ['23cm', '13cm', '9cm', '6cm', '3cm'];
// All bands
const ALL_BANDS_ARRAY: Band[] = ['2200m', '630m', ...HF_BANDS, ...VHF_UHF_BANDS, ...MICROWAVE_BANDS];

// Supported bands per antenna type (null = all bands supported)
export const ANTENNA_SUPPORTED_BANDS: Partial<Record<AntennaType, Band[]>> = {
  // Fixed multiband antennas
  cobweb: ['20m', '17m', '15m', '12m', '10m'],
  hexbeam: ['20m', '17m', '15m', '12m', '10m', '6m'],
  spiderbeam: ['20m', '17m', '15m', '12m', '10m'],
  g5rv: ['80m', '40m', '30m', '20m', '17m', '15m', '12m', '10m'],
  zs6bkw: ['80m', '40m', '30m', '20m', '17m', '15m', '12m', '10m'],
  // VHF/UHF antennas
  jPole: VHF_UHF_BANDS,
  slimJim: VHF_UHF_BANDS,
  superJ: VHF_UHF_BANDS,
  collinear: VHF_UHF_BANDS,
  discone: [...VHF_UHF_BANDS, ...MICROWAVE_BANDS],
  // Microwave antennas
  helix: [...VHF_UHF_BANDS, ...MICROWAVE_BANDS],
  patch: MICROWAVE_BANDS,
  vivaldi: MICROWAVE_BANDS,
};

// Get supported bands for an antenna (returns all bands if not restricted)
export function getSupportedBands(type: AntennaType): Band[] {
  return ANTENNA_SUPPORTED_BANDS[type] || ALL_BANDS_ARRAY;
}
export type GroundQuality = 'poor' | 'average' | 'good' | 'saltwater';
export type TerrainType = 'flat' | 'hilly' | 'mountain' | 'urban';
export type PropagationGoal = 'nvis' | 'regional' | 'dx' | 'worldwide';

export interface PatternPoint {
  angle: number; // degrees
  magnitude: number; // 0-1 normalized
}

export interface AntennaConfig {
  type: AntennaType;
  height: number; // meters
  band: Band;
  orientation: number; // degrees azimuth
  realistic: boolean;
  groundQuality: GroundQuality;
  terrain: TerrainType;
  // Antenna-specific parameters
  apexAngle?: number;        // Inverted-V: angle between legs (90-150°)
  radialCount?: number;      // Verticals: number of radials (4-64)
  slopeAngle?: number;       // Sloper: tilt angle (20-60°)
  loopShape?: 'triangle' | 'square' | 'circle';  // Delta/Quad loops
  helixTurns?: number;       // Helix: number of turns (4-20)
  feedpointRatio?: number;   // Windom/OCF: feedpoint position (0.33-0.5)
}

// Antenna specifications for display
export interface AntennaSpecs {
  length?: string;           // Total length formula or description
  height?: string;           // Recommended height
  radials?: string;          // Radial info for verticals
  gain?: string;             // Typical gain
  impedance?: string;        // Feed impedance
  bandwidth?: string;        // Typical bandwidth
  notes?: string;            // Special notes
}

export interface CoverageEstimate {
  minDistance: number; // km
  maxDistance: number; // km
  skipZoneStart: number; // km
  skipZoneEnd: number; // km
  bestFor: PropagationGoal;
  description: string;
}

export interface BandInfo {
  name: Band;
  frequency: string;
  wavelength: number;
  character: 'day' | 'night' | 'grayline' | 'allday';
  bestTimeKey: string;
  typicalRangeKey: string;
  nvitsSuitable: boolean;
}

// Wavelengths in meters
export const WAVELENGTHS: Record<Band, number> = {
  '2200m': 2200,
  '630m': 630,
  '160m': 160,
  '80m': 80,
  '60m': 60,
  '40m': 40,
  '30m': 30,
  '20m': 20,
  '17m': 17,
  '15m': 15,
  '12m': 12,
  '10m': 10,
  '6m': 6,
  '4m': 4,
  '2m': 2,
  '70cm': 0.7,
  '23cm': 0.23,
  '13cm': 0.13,
  '9cm': 0.09,
  '6cm': 0.06,
  '3cm': 0.03,
};

// Band information for propagation guidance
export const BAND_INFO: Record<Band, BandInfo> = {
  '2200m': {
    name: '2200m',
    frequency: '137 kHz',
    wavelength: 2200,
    character: 'night',
    bestTimeKey: 'bands.2200m.bestTime',
    typicalRangeKey: 'bands.2200m.range',
    nvitsSuitable: true,
  },
  '630m': {
    name: '630m',
    frequency: '475 kHz',
    wavelength: 630,
    character: 'night',
    bestTimeKey: 'bands.630m.bestTime',
    typicalRangeKey: 'bands.630m.range',
    nvitsSuitable: true,
  },
  '160m': {
    name: '160m',
    frequency: '1.8 MHz',
    wavelength: 160,
    character: 'night',
    bestTimeKey: 'bands.160m.bestTime',
    typicalRangeKey: 'bands.160m.range',
    nvitsSuitable: true,
  },
  '80m': {
    name: '80m',
    frequency: '3.5 MHz',
    wavelength: 80,
    character: 'night',
    bestTimeKey: 'bands.80m.bestTime',
    typicalRangeKey: 'bands.80m.range',
    nvitsSuitable: true,
  },
  '60m': {
    name: '60m',
    frequency: '5.3 MHz',
    wavelength: 60,
    character: 'grayline',
    bestTimeKey: 'bands.60m.bestTime',
    typicalRangeKey: 'bands.60m.range',
    nvitsSuitable: true,
  },
  '40m': {
    name: '40m',
    frequency: '7 MHz',
    wavelength: 40,
    character: 'grayline',
    bestTimeKey: 'bands.40m.bestTime',
    typicalRangeKey: 'bands.40m.range',
    nvitsSuitable: true,
  },
  '30m': {
    name: '30m',
    frequency: '10 MHz',
    wavelength: 30,
    character: 'allday',
    bestTimeKey: 'bands.30m.bestTime',
    typicalRangeKey: 'bands.30m.range',
    nvitsSuitable: false,
  },
  '20m': {
    name: '20m',
    frequency: '14 MHz',
    wavelength: 20,
    character: 'day',
    bestTimeKey: 'bands.20m.bestTime',
    typicalRangeKey: 'bands.20m.range',
    nvitsSuitable: false,
  },
  '17m': {
    name: '17m',
    frequency: '18 MHz',
    wavelength: 17,
    character: 'day',
    bestTimeKey: 'bands.17m.bestTime',
    typicalRangeKey: 'bands.17m.range',
    nvitsSuitable: false,
  },
  '15m': {
    name: '15m',
    frequency: '21 MHz',
    wavelength: 15,
    character: 'day',
    bestTimeKey: 'bands.15m.bestTime',
    typicalRangeKey: 'bands.15m.range',
    nvitsSuitable: false,
  },
  '12m': {
    name: '12m',
    frequency: '24 MHz',
    wavelength: 12,
    character: 'day',
    bestTimeKey: 'bands.12m.bestTime',
    typicalRangeKey: 'bands.12m.range',
    nvitsSuitable: false,
  },
  '10m': {
    name: '10m',
    frequency: '28 MHz',
    wavelength: 10,
    character: 'day',
    bestTimeKey: 'bands.10m.bestTime',
    typicalRangeKey: 'bands.10m.range',
    nvitsSuitable: false,
  },
  '6m': {
    name: '6m',
    frequency: '50 MHz',
    wavelength: 6,
    character: 'day',
    bestTimeKey: 'bands.6m.bestTime',
    typicalRangeKey: 'bands.6m.range',
    nvitsSuitable: false,
  },
  '4m': {
    name: '4m',
    frequency: '70 MHz',
    wavelength: 4,
    character: 'day',
    bestTimeKey: 'bands.4m.bestTime',
    typicalRangeKey: 'bands.4m.range',
    nvitsSuitable: false,
  },
  '2m': {
    name: '2m',
    frequency: '144 MHz',
    wavelength: 2,
    character: 'allday',
    bestTimeKey: 'bands.2m.bestTime',
    typicalRangeKey: 'bands.2m.range',
    nvitsSuitable: false,
  },
  '70cm': {
    name: '70cm',
    frequency: '432 MHz',
    wavelength: 0.7,
    character: 'allday',
    bestTimeKey: 'bands.70cm.bestTime',
    typicalRangeKey: 'bands.70cm.range',
    nvitsSuitable: false,
  },
  '23cm': {
    name: '23cm',
    frequency: '1296 MHz',
    wavelength: 0.23,
    character: 'allday',
    bestTimeKey: 'bands.23cm.bestTime',
    typicalRangeKey: 'bands.23cm.range',
    nvitsSuitable: false,
  },
  '13cm': {
    name: '13cm',
    frequency: '2.4 GHz',
    wavelength: 0.13,
    character: 'allday',
    bestTimeKey: 'bands.13cm.bestTime',
    typicalRangeKey: 'bands.13cm.range',
    nvitsSuitable: false,
  },
  '9cm': {
    name: '9cm',
    frequency: '3.4 GHz',
    wavelength: 0.09,
    character: 'allday',
    bestTimeKey: 'bands.9cm.bestTime',
    typicalRangeKey: 'bands.9cm.range',
    nvitsSuitable: false,
  },
  '6cm': {
    name: '6cm',
    frequency: '5.7 GHz',
    wavelength: 0.06,
    character: 'allday',
    bestTimeKey: 'bands.6cm.bestTime',
    typicalRangeKey: 'bands.6cm.range',
    nvitsSuitable: false,
  },
  '3cm': {
    name: '3cm',
    frequency: '10 GHz',
    wavelength: 0.03,
    character: 'allday',
    bestTimeKey: 'bands.3cm.bestTime',
    typicalRangeKey: 'bands.3cm.range',
    nvitsSuitable: false,
  },
};

// Ground quality factors for vertical antennas
const GROUND_FACTORS: Record<GroundQuality, number> = {
  poor: 0.6,      // dry, rocky soil
  average: 0.8,   // typical suburban
  good: 1.0,      // moist soil, many radials
  saltwater: 1.3, // coastal/maritime
};

// Terrain influence factors
const TERRAIN_FACTORS: Record<TerrainType, { distortion: number; angleShift: number; reflection: number }> = {
  flat: { distortion: 0.5, angleShift: 0, reflection: 1.0 },      // ideal conditions
  hilly: { distortion: 1.2, angleShift: 5, reflection: 0.9 },     // moderate reflections
  mountain: { distortion: 1.5, angleShift: 10, reflection: 0.85 }, // strong terrain effects
  urban: { distortion: 2.0, angleShift: 0, reflection: 0.75 },    // buildings cause strong distortion
};

// Height categories based on wavelength fractions
function getHeightCategory(height: number, band: Band): HeightCategory {
  const wavelength = WAVELENGTHS[band];
  const ratio = height / wavelength;
  if (ratio < 0.25) return 'low';
  if (ratio < 0.5) return 'medium';
  return 'high';
}

// Generate azimuth pattern (top view) - 360 points
export function generateAzimuthPattern(config: AntennaConfig): PatternPoint[] {
  const { type, height, band, orientation, realistic, groundQuality, terrain } = config;
  const heightCat = getHeightCategory(height, band);
  const groundFactor = type === 'vertical' ? GROUND_FACTORS[groundQuality] : 1;
  const terrainFactor = TERRAIN_FACTORS[terrain || 'flat'];
  const points: PatternPoint[] = [];

  for (let angle = 0; angle < 360; angle++) {
    const adjustedAngle = (angle - orientation + 360) % 360;
    let magnitude = calculateAzimuthMagnitude(type, adjustedAngle, heightCat) * groundFactor;

    // Apply terrain reflection factor
    magnitude *= terrainFactor.reflection;

    if (realistic) {
      magnitude = applyRealisticDistortion(magnitude, angle, groundQuality, terrain || 'flat');
    }

    points.push({ angle, magnitude });
  }

  return normalizePattern(points);
}

// Generate elevation pattern (side view) - 91 points (0-90 degrees)
export function generateElevationPattern(config: AntennaConfig): PatternPoint[] {
  const { type, height, band, realistic, groundQuality, terrain } = config;
  const heightCat = getHeightCategory(height, band);
  const wavelength = WAVELENGTHS[band];
  const heightInWavelengths = height / wavelength;
  const groundFactor = type === 'vertical' ? GROUND_FACTORS[groundQuality] : 1;
  const terrainFactor = TERRAIN_FACTORS[terrain || 'flat'];
  const points: PatternPoint[] = [];

  for (let angle = 0; angle <= 90; angle++) {
    // Apply terrain angle shift
    const shiftedAngle = Math.max(0, Math.min(90, angle + terrainFactor.angleShift));
    let magnitude = calculateElevationMagnitude(type, shiftedAngle, heightCat, heightInWavelengths, groundQuality) * groundFactor;

    // Apply terrain reflection factor
    magnitude *= terrainFactor.reflection;

    if (realistic) {
      magnitude = applyRealisticDistortion(magnitude, angle * 2, groundQuality, terrain || 'flat');
    }

    points.push({ angle, magnitude });
  }

  return normalizePattern(points);
}

function calculateAzimuthMagnitude(type: AntennaType, angle: number, heightCat: HeightCategory): number {
  const rad = (angle * Math.PI) / 180;

  switch (type) {
    case 'dipole': {
      const pattern = Math.pow(Math.cos(rad), 2);
      const circularityFactor = heightCat === 'low' ? 0.4 : heightCat === 'medium' ? 0.2 : 0.1;
      return pattern * (1 - circularityFactor) + circularityFactor;
    }

    case 'vertical': {
      return 0.95 + 0.05 * Math.cos(4 * rad);
    }

    case 'invertedV': {
      const dipolePattern = Math.pow(Math.cos(rad), 2);
      const omniComponent = 0.6;
      return dipolePattern * (1 - omniComponent) + omniComponent;
    }

    case 'efhw': {
      // EFHW: similar to dipole but with more asymmetry due to feedpoint
      const pattern = Math.pow(Math.cos(rad), 2);
      const asymmetry = 0.15 * Math.sin(rad); // slight asymmetry
      const circularityFactor = heightCat === 'low' ? 0.35 : heightCat === 'medium' ? 0.2 : 0.1;
      return (pattern + asymmetry) * (1 - circularityFactor) + circularityFactor;
    }

    case 'randomWire': {
      // Random wire: unpredictable, multi-lobed pattern
      const lobes = Math.abs(Math.cos(rad * 2)) * 0.4 + Math.abs(Math.sin(rad * 3)) * 0.3;
      return 0.5 + lobes * 0.5;
    }

    case 'deltaLoop': {
      // Horizontal delta loop: mostly omnidirectional with slight variations
      return 0.85 + 0.15 * Math.cos(3 * rad);
    }

    case 'g5rv': {
      // G5RV: dipole-like but broader pattern
      const pattern = Math.pow(Math.cos(rad), 2);
      const circularityFactor = 0.3;
      return pattern * (1 - circularityFactor) + circularityFactor;
    }

    case 'yagi2el': {
      // 2-element Yagi: directional with front-to-back ratio ~10dB
      const forward = Math.pow(Math.cos(rad), 4); // narrower main lobe
      const back = 0.3 * Math.pow(Math.cos(rad - Math.PI), 2);
      return Math.max(forward, back);
    }

    case 'yagi3el': {
      // 3-element Yagi: more directional, better F/B ratio
      const forward = Math.pow(Math.cos(rad), 6); // even narrower
      const back = 0.15 * Math.pow(Math.cos(rad - Math.PI), 2);
      const sidelobes = 0.1 * Math.pow(Math.sin(rad * 2), 2);
      return Math.max(forward, back, sidelobes);
    }

    case 'magloop': {
      // Magnetic loop: figure-8 pattern like dipole
      const pattern = Math.pow(Math.cos(rad), 2);
      return pattern * 0.9 + 0.1;
    }

    case 'windom': {
      // Windom/OCF: similar to dipole but with some asymmetry
      const pattern = Math.pow(Math.cos(rad), 2);
      const asymmetry = 0.12 * Math.sin(rad);
      const circularityFactor = heightCat === 'low' ? 0.35 : 0.15;
      return (pattern + asymmetry) * (1 - circularityFactor) + circularityFactor;
    }

    case 'zepp': {
      // Zepp: end-fed, similar to dipole but with more harmonics
      const pattern = Math.pow(Math.cos(rad), 2);
      const harmonics = 0.1 * Math.cos(2 * rad);
      const circularityFactor = 0.2;
      return (pattern + harmonics) * (1 - circularityFactor) + circularityFactor;
    }

    case 'quadLoop': {
      // Quad loop: slightly more directional than delta loop
      const forward = 0.9 * Math.pow(Math.cos(rad), 2);
      const back = 0.25 * Math.pow(Math.cos(rad - Math.PI), 2);
      return Math.max(forward, back) + 0.15;
    }

    case 'sloper': {
      // Sloper: directional, tilted pattern
      const forward = 0.85 * Math.pow(Math.cos(rad - 0.3), 2);
      const back = 0.35 * Math.pow(Math.cos(rad - Math.PI), 2);
      return Math.max(forward, back) + 0.1;
    }

    case 'longwire': {
      // Long wire: multiple lobes along the wire axis
      const mainLobe = Math.pow(Math.cos(rad), 2);
      const sideLobes = 0.4 * Math.pow(Math.cos(rad * 2), 2);
      return Math.max(mainLobe, sideLobes) * 0.8 + 0.2;
    }

    case 'cobweb': {
      // Cobweb: mostly omnidirectional
      return 0.9 + 0.1 * Math.cos(4 * rad);
    }

    case 'hexbeam': {
      // Hexbeam: directional like a 2-el Yagi but broader pattern
      const forward = Math.pow(Math.cos(rad), 3);
      const back = 0.25 * Math.pow(Math.cos(rad - Math.PI), 2);
      const sidelobes = 0.15 * Math.pow(Math.sin(rad), 2);
      return Math.max(forward, back, sidelobes) + 0.1;
    }

    case 'zs6bkw': {
      // ZS6BKW: similar to G5RV, dipole-like pattern
      const pattern = Math.pow(Math.cos(rad), 2);
      const circularityFactor = heightCat === 'low' ? 0.35 : 0.2;
      return pattern * (1 - circularityFactor) + circularityFactor;
    }

    case 'hb9cv': {
      // HB9CV: compact 2-element beam, good directivity
      const forward = Math.pow(Math.cos(rad), 4);
      const back = 0.2 * Math.pow(Math.cos(rad - Math.PI), 2);
      return Math.max(forward, back) + 0.08;
    }

    case 'fanDipole': {
      // Fan dipole: similar to dipole, slightly broader due to multiple elements
      const pattern = Math.pow(Math.cos(rad), 2);
      const circularityFactor = heightCat === 'low' ? 0.45 : heightCat === 'medium' ? 0.25 : 0.15;
      return pattern * (1 - circularityFactor) + circularityFactor;
    }

    case 'spiderbeam': {
      // Spiderbeam: 5-band directional beam, similar to Yagi
      const forward = Math.pow(Math.cos(rad), 4);
      const back = 0.25 * Math.pow(Math.cos(rad - Math.PI), 2);
      const sidelobes = 0.12 * Math.pow(Math.sin(rad * 2), 2);
      return Math.max(forward, back, sidelobes) + 0.1;
    }

    case 'moxon': {
      // Moxon rectangle: compact 2-element, good F/B ratio
      const forward = Math.pow(Math.cos(rad), 3.5);
      const back = 0.15 * Math.pow(Math.cos(rad - Math.PI), 2);
      return Math.max(forward, back) + 0.1;
    }

    case 'logPeriodic': {
      // Log-periodic: wideband directional, moderate gain
      const forward = Math.pow(Math.cos(rad), 3);
      const back = 0.2 * Math.pow(Math.cos(rad - Math.PI), 2);
      const sidelobes = 0.1 * Math.pow(Math.sin(rad), 2);
      return Math.max(forward, back, sidelobes) + 0.12;
    }

    case 'vertical58': {
      // 5/8λ vertical: omnidirectional with slightly more gain than 1/4λ
      return 0.93 + 0.07 * Math.cos(4 * rad);
    }

    case 'collinear': {
      // Collinear: omnidirectional with very low angle
      return 0.95 + 0.05 * Math.cos(6 * rad);
    }

    case 'yagi4el': {
      // 4-element Yagi: more directional than 3-el
      const forward = Math.pow(Math.cos(rad), 7);
      const back = 0.1 * Math.pow(Math.cos(rad - Math.PI), 2);
      const sidelobes = 0.08 * Math.pow(Math.sin(rad * 2), 2);
      return Math.max(forward, back, sidelobes);
    }

    case 'yagi5el': {
      // 5-element Yagi: even more directional
      const forward = Math.pow(Math.cos(rad), 8);
      const back = 0.08 * Math.pow(Math.cos(rad - Math.PI), 2);
      const sidelobes = 0.06 * Math.pow(Math.sin(rad * 2), 2);
      return Math.max(forward, back, sidelobes);
    }

    case 'yagi6el': {
      // 6-element Yagi: highly directional
      const forward = Math.pow(Math.cos(rad), 9);
      const back = 0.06 * Math.pow(Math.cos(rad - Math.PI), 2);
      const sidelobes = 0.05 * Math.pow(Math.sin(rad * 2), 2);
      return Math.max(forward, back, sidelobes);
    }

    case 'edz': {
      // Extended Double Zepp: bi-directional with sharp lobes
      const mainLobe = Math.pow(Math.cos(rad), 3);
      const backLobe = Math.pow(Math.cos(rad - Math.PI), 3) * 0.95;
      const sidelobes = 0.25 * Math.pow(Math.sin(rad * 2), 2);
      return Math.max(mainLobe, backLobe, sidelobes);
    }

    case 'quad2el': {
      // 2-element Quad: directional with good F/B ratio
      const forward = Math.pow(Math.cos(rad), 4);
      const back = 0.18 * Math.pow(Math.cos(rad - Math.PI), 2);
      return Math.max(forward, back) + 0.08;
    }

    case 'quad3el': {
      // 3-element Quad: more directional than 2-el
      const forward = Math.pow(Math.cos(rad), 5);
      const back = 0.12 * Math.pow(Math.cos(rad - Math.PI), 2);
      const sidelobes = 0.08 * Math.pow(Math.sin(rad * 2), 2);
      return Math.max(forward, back, sidelobes) + 0.05;
    }

    case 'slimJim': {
      // Slim Jim: omnidirectional like J-Pole but with lower angle
      return 0.93 + 0.07 * Math.cos(4 * rad);
    }

    case 'superJ': {
      // Super-J / Collinear J: omnidirectional with more gain
      return 0.94 + 0.06 * Math.cos(4 * rad);
    }

    case 'jPole': {
      // J-Pole: omnidirectional vertical for VHF/UHF
      return 0.92 + 0.08 * Math.cos(4 * rad);
    }

    case 'discone': {
      // Discone: wideband omnidirectional
      return 0.9 + 0.1 * Math.cos(6 * rad);
    }

    case 'helix': {
      // Helix: highly directional, circular polarization
      const forward = Math.pow(Math.cos(rad), 6);
      const back = 0.05 * Math.pow(Math.cos(rad - Math.PI), 2);
      return Math.max(forward, back) + 0.05;
    }

    case 'patch': {
      // Patch antenna: directional, broad pattern
      const forward = Math.pow(Math.cos(rad), 2.5);
      const back = 0.1 * Math.pow(Math.cos(rad - Math.PI), 2);
      return Math.max(forward, back) + 0.15;
    }

    case 'vivaldi': {
      // Vivaldi: wideband endfire, very directional
      const forward = Math.pow(Math.cos(rad), 5);
      const back = 0.08 * Math.pow(Math.cos(rad - Math.PI), 2);
      const sidelobes = 0.06 * Math.pow(Math.sin(rad * 2), 2);
      return Math.max(forward, back, sidelobes) + 0.05;
    }

    default:
      return 1;
  }
}

function calculateElevationMagnitude(
  type: AntennaType,
  angle: number,
  heightCat: HeightCategory,
  heightInWavelengths: number,
  groundQuality: GroundQuality
): number {
  const rad = (angle * Math.PI) / 180;
  const groundBoost = groundQuality === 'saltwater' ? 1.2 : groundQuality === 'good' ? 1.1 : 1.0;

  switch (type) {
    case 'dipole': {
      const mainLobeAngle = heightCat === 'low' ? 70 : heightCat === 'medium' ? 45 : 25;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const groundFactor = Math.sin(2 * Math.PI * heightInWavelengths * Math.sin(rad));
      const elementFactor = Math.cos(rad);
      let magnitude = Math.abs(groundFactor * elementFactor);
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2);
      magnitude = magnitude * 0.6 + lobeEnhancement * 0.4;
      return magnitude;
    }

    case 'vertical': {
      const lowAnglePeak = Math.sin(rad) * Math.cos(rad) * groundBoost;
      const groundReflection = Math.abs(Math.sin(2 * Math.PI * heightInWavelengths * Math.sin(rad)));
      const lowAngleEnhancement = 1 - (angle / 90) * 0.3;
      return lowAnglePeak * groundReflection * lowAngleEnhancement + 0.1;
    }

    case 'invertedV': {
      const mainLobeAngle = heightCat === 'low' ? 75 : heightCat === 'medium' ? 55 : 35;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const groundFactor = Math.sin(2 * Math.PI * heightInWavelengths * 0.8 * Math.sin(rad));
      const elementFactor = 0.7 * Math.cos(rad) + 0.3;
      let magnitude = Math.abs(groundFactor * elementFactor);
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 1.5);
      magnitude = magnitude * 0.5 + lobeEnhancement * 0.5;
      return magnitude;
    }

    case 'efhw': {
      // EFHW behaves similar to dipole with slightly higher angles
      const mainLobeAngle = heightCat === 'low' ? 72 : heightCat === 'medium' ? 48 : 28;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const groundFactor = Math.sin(2 * Math.PI * heightInWavelengths * Math.sin(rad));
      const elementFactor = Math.cos(rad);
      let magnitude = Math.abs(groundFactor * elementFactor);
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 1.8);
      magnitude = magnitude * 0.55 + lobeEnhancement * 0.45;
      return magnitude;
    }

    case 'randomWire': {
      // Random wire: unpredictable multi-lobe pattern
      const lobe1 = Math.exp(-Math.pow(angle - 30, 2) / 400);
      const lobe2 = Math.exp(-Math.pow(angle - 60, 2) / 600) * 0.7;
      const lobe3 = Math.exp(-Math.pow(angle - 75, 2) / 300) * 0.5;
      return Math.max(lobe1, lobe2, lobe3) * 0.8 + 0.2;
    }

    case 'deltaLoop': {
      // Delta loop: good low-angle radiation, gain over dipole
      const mainLobeAngle = heightCat === 'low' ? 50 : heightCat === 'medium' ? 30 : 15;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const groundFactor = Math.sin(2 * Math.PI * heightInWavelengths * 1.1 * Math.sin(rad));
      let magnitude = Math.abs(groundFactor * Math.cos(rad));
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2.5);
      magnitude = magnitude * 0.5 + lobeEnhancement * 0.5;
      return magnitude;
    }

    case 'g5rv': {
      // G5RV: similar to dipole, multiband compromise
      const mainLobeAngle = heightCat === 'low' ? 68 : heightCat === 'medium' ? 42 : 22;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const groundFactor = Math.sin(2 * Math.PI * heightInWavelengths * Math.sin(rad));
      const elementFactor = Math.cos(rad);
      let magnitude = Math.abs(groundFactor * elementFactor);
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 1.8);
      magnitude = magnitude * 0.6 + lobeEnhancement * 0.4;
      return magnitude;
    }

    case 'yagi2el':
    case 'yagi3el': {
      // Yagis: low angle, directional
      const mainLobeAngle = heightCat === 'low' ? 35 : heightCat === 'medium' ? 20 : 10;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const narrowness = type === 'yagi3el' ? 3 : 2.5;
      const lobeEnhancement = Math.exp(-angleFromMainLobe * narrowness);
      return lobeEnhancement * 0.9 + 0.1;
    }

    case 'magloop': {
      // Magnetic loop: high angle, good for NVIS
      const mainLobeAngle = 70; // always high angle
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 1.5);
      return lobeEnhancement * 0.8 + 0.2;
    }

    case 'windom': {
      // Windom: similar to dipole, works on multiple bands
      const mainLobeAngle = heightCat === 'low' ? 68 : heightCat === 'medium' ? 44 : 24;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const groundFactor = Math.sin(2 * Math.PI * heightInWavelengths * Math.sin(rad));
      const elementFactor = Math.cos(rad);
      let magnitude = Math.abs(groundFactor * elementFactor);
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 1.9);
      magnitude = magnitude * 0.55 + lobeEnhancement * 0.45;
      return magnitude;
    }

    case 'zepp': {
      // Zepp: low angle radiation, good for DX
      const mainLobeAngle = heightCat === 'low' ? 55 : heightCat === 'medium' ? 35 : 18;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const groundFactor = Math.sin(2 * Math.PI * heightInWavelengths * Math.sin(rad));
      let magnitude = Math.abs(groundFactor * Math.cos(rad));
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2.2);
      magnitude = magnitude * 0.5 + lobeEnhancement * 0.5;
      return magnitude;
    }

    case 'quadLoop': {
      // Quad loop: low angle, about 1-2 dB gain over dipole
      const mainLobeAngle = heightCat === 'low' ? 45 : heightCat === 'medium' ? 25 : 12;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const groundFactor = Math.sin(2 * Math.PI * heightInWavelengths * 1.15 * Math.sin(rad));
      let magnitude = Math.abs(groundFactor * Math.cos(rad));
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2.8);
      magnitude = magnitude * 0.45 + lobeEnhancement * 0.55;
      return magnitude;
    }

    case 'sloper': {
      // Sloper: medium-low angle, directional
      const mainLobeAngle = heightCat === 'low' ? 50 : heightCat === 'medium' ? 35 : 20;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2);
      return lobeEnhancement * 0.85 + 0.15;
    }

    case 'longwire': {
      // Long wire: multiple lobes at different angles
      const lobe1 = Math.exp(-Math.pow(angle - 20, 2) / 300);
      const lobe2 = Math.exp(-Math.pow(angle - 45, 2) / 400) * 0.6;
      const lobe3 = Math.exp(-Math.pow(angle - 70, 2) / 350) * 0.4;
      return Math.max(lobe1, lobe2, lobe3) * 0.85 + 0.15;
    }

    case 'cobweb': {
      // Cobweb: medium-low angle, compromise antenna
      const mainLobeAngle = heightCat === 'low' ? 45 : heightCat === 'medium' ? 30 : 18;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2);
      return lobeEnhancement * 0.8 + 0.2;
    }

    case 'hexbeam': {
      // Hexbeam: low angle like Yagi
      const mainLobeAngle = heightCat === 'low' ? 38 : heightCat === 'medium' ? 22 : 12;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2.5);
      return lobeEnhancement * 0.88 + 0.12;
    }

    case 'zs6bkw': {
      // ZS6BKW: similar to G5RV, multiband dipole
      const mainLobeAngle = heightCat === 'low' ? 66 : heightCat === 'medium' ? 40 : 20;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const groundFactor = Math.sin(2 * Math.PI * heightInWavelengths * Math.sin(rad));
      const elementFactor = Math.cos(rad);
      let magnitude = Math.abs(groundFactor * elementFactor);
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 1.9);
      magnitude = magnitude * 0.55 + lobeEnhancement * 0.45;
      return magnitude;
    }

    case 'hb9cv': {
      // HB9CV: compact 2-element beam
      const mainLobeAngle = heightCat === 'low' ? 36 : heightCat === 'medium' ? 21 : 11;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2.4);
      return lobeEnhancement * 0.88 + 0.12;
    }

    case 'fanDipole': {
      // Fan dipole: behaves like dipole on each band
      const mainLobeAngle = heightCat === 'low' ? 70 : heightCat === 'medium' ? 45 : 25;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const groundFactor = Math.sin(2 * Math.PI * heightInWavelengths * Math.sin(rad));
      const elementFactor = Math.cos(rad);
      let magnitude = Math.abs(groundFactor * elementFactor);
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2);
      magnitude = magnitude * 0.6 + lobeEnhancement * 0.4;
      return magnitude;
    }

    case 'spiderbeam': {
      // Spiderbeam: low angle like Yagi
      const mainLobeAngle = heightCat === 'low' ? 36 : heightCat === 'medium' ? 20 : 10;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2.5);
      return lobeEnhancement * 0.88 + 0.12;
    }

    case 'moxon': {
      // Moxon: similar to 2-element Yagi
      const mainLobeAngle = heightCat === 'low' ? 38 : heightCat === 'medium' ? 22 : 12;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2.3);
      return lobeEnhancement * 0.85 + 0.15;
    }

    case 'logPeriodic': {
      // Log-periodic: moderate gain, wideband
      const mainLobeAngle = heightCat === 'low' ? 40 : heightCat === 'medium' ? 25 : 15;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2);
      return lobeEnhancement * 0.8 + 0.2;
    }

    case 'vertical58': {
      // 5/8λ vertical: lower angle than 1/4λ, more gain
      const lowAnglePeak = Math.sin(rad) * Math.cos(rad) * groundBoost * 1.15;
      const groundReflection = Math.abs(Math.sin(2 * Math.PI * heightInWavelengths * 0.625 * Math.sin(rad)));
      const lowAngleEnhancement = 1 - (angle / 90) * 0.35;
      return lowAnglePeak * groundReflection * lowAngleEnhancement + 0.12;
    }

    case 'collinear': {
      // Collinear: very low angle radiation
      const mainLobeAngle = 8;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 3);
      return lobeEnhancement * 0.9 + 0.1;
    }

    case 'yagi4el': {
      // 4-element Yagi: lower angle than 3-el
      const mainLobeAngle = heightCat === 'low' ? 30 : heightCat === 'medium' ? 16 : 7;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 3.2);
      return lobeEnhancement * 0.92 + 0.08;
    }

    case 'yagi5el': {
      // 5-element Yagi: even lower angle
      const mainLobeAngle = heightCat === 'low' ? 28 : heightCat === 'medium' ? 14 : 6;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 3.5);
      return lobeEnhancement * 0.93 + 0.07;
    }

    case 'yagi6el': {
      // 6-element Yagi: very low angle
      const mainLobeAngle = heightCat === 'low' ? 26 : heightCat === 'medium' ? 12 : 5;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 3.8);
      return lobeEnhancement * 0.94 + 0.06;
    }

    case 'edz': {
      // Extended Double Zepp: low angle, high gain bi-directional
      const mainLobeAngle = heightCat === 'low' ? 40 : heightCat === 'medium' ? 25 : 12;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const groundFactor = Math.sin(2 * Math.PI * heightInWavelengths * 1.28 * Math.sin(rad));
      let magnitude = Math.abs(groundFactor * Math.cos(rad));
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2.5);
      magnitude = magnitude * 0.45 + lobeEnhancement * 0.55;
      return magnitude;
    }

    case 'quad2el': {
      // 2-element Quad: low angle, ~1dB gain over 2-el Yagi
      const mainLobeAngle = heightCat === 'low' ? 34 : heightCat === 'medium' ? 19 : 9;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2.6);
      return lobeEnhancement * 0.88 + 0.12;
    }

    case 'quad3el': {
      // 3-element Quad: very low angle, high gain
      const mainLobeAngle = heightCat === 'low' ? 30 : heightCat === 'medium' ? 16 : 7;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 3);
      return lobeEnhancement * 0.9 + 0.1;
    }

    case 'slimJim': {
      // Slim Jim: lower angle than J-Pole due to end-fire effect
      const lowAnglePeak = Math.sin(rad) * Math.cos(rad) * groundBoost * 1.1;
      const lowAngleEnhancement = 1 - (angle / 90) * 0.38;
      return lowAnglePeak * lowAngleEnhancement + 0.14;
    }

    case 'superJ': {
      // Super-J: very low angle, collinear gain
      const mainLobeAngle = 12;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2.5);
      return lobeEnhancement * 0.88 + 0.12;
    }

    case 'jPole': {
      // J-Pole: low angle, good for VHF/UHF
      const lowAnglePeak = Math.sin(rad) * Math.cos(rad) * groundBoost;
      const lowAngleEnhancement = 1 - (angle / 90) * 0.4;
      return lowAnglePeak * lowAngleEnhancement + 0.15;
    }

    case 'discone': {
      // Discone: low angle, wideband
      const lowAnglePeak = Math.sin(rad) * Math.cos(rad) * 1.1;
      return lowAnglePeak * 0.9 + 0.1;
    }

    case 'helix': {
      // Helix: very low angle, directional
      const mainLobeAngle = 8;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 4);
      return lobeEnhancement * 0.95 + 0.05;
    }

    case 'patch': {
      // Patch: broadside radiation
      const mainLobeAngle = 15;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2);
      return lobeEnhancement * 0.8 + 0.2;
    }

    case 'vivaldi': {
      // Vivaldi: endfire, very low angle
      const mainLobeAngle = 5;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 5);
      return lobeEnhancement * 0.95 + 0.05;
    }

    default:
      return 1;
  }
}

function applyRealisticDistortion(magnitude: number, angle: number, groundQuality: GroundQuality, terrain: TerrainType = 'flat'): number {
  const seed = angle * 0.1;
  const terrainFactor = TERRAIN_FACTORS[terrain];

  // More distortion with poor ground and rough terrain
  const groundDistortion = groundQuality === 'poor' ? 1.5 : groundQuality === 'average' ? 1.0 : 0.7;
  const distortionFactor = groundDistortion * terrainFactor.distortion;

  const noise1 = Math.sin(seed * 7.3) * 0.08 * distortionFactor;
  const noise2 = Math.sin(seed * 13.7) * 0.05 * distortionFactor;
  const noise3 = Math.sin(seed * 23.1) * 0.03 * distortionFactor;
  const asymmetry = Math.sin((angle * Math.PI) / 180) * 0.1 * distortionFactor;

  // Urban terrain adds more "spiky" distortions due to building reflections
  const urbanSpikes = terrain === 'urban' ? Math.sin(seed * 31.4) * 0.12 : 0;

  return Math.max(0, Math.min(1, magnitude + noise1 + noise2 + noise3 + asymmetry + urbanSpikes));
}

function normalizePattern(points: PatternPoint[]): PatternPoint[] {
  const maxMagnitude = Math.max(...points.map(p => p.magnitude));
  if (maxMagnitude === 0) return points;

  return points.map(p => ({
    angle: p.angle,
    magnitude: p.magnitude / maxMagnitude,
  }));
}

// Get educational tip based on configuration
export function getTipKey(config: AntennaConfig): string {
  const heightCat = getHeightCategory(config.height, config.band);
  return `tips.${config.type}.${heightCat}`;
}

export function getHeightCategoryForConfig(config: AntennaConfig): HeightCategory {
  return getHeightCategory(config.height, config.band);
}

// Calculate main lobe angle for display
export function getMainLobeAngle(config: AntennaConfig): number {
  const heightCat = getHeightCategory(config.height, config.band);
  const groundBonus = config.groundQuality === 'saltwater' ? -5 : config.groundQuality === 'good' ? -2 : 0;

  switch (config.type) {
    case 'dipole':
      return heightCat === 'low' ? 70 : heightCat === 'medium' ? 45 : 25;
    case 'vertical':
      return 15 + groundBonus;
    case 'invertedV':
      return heightCat === 'low' ? 75 : heightCat === 'medium' ? 55 : 35;
    case 'efhw':
      return heightCat === 'low' ? 72 : heightCat === 'medium' ? 48 : 28;
    case 'randomWire':
      return 45; // unpredictable, assume medium
    case 'deltaLoop':
      return heightCat === 'low' ? 50 : heightCat === 'medium' ? 30 : 15;
    case 'g5rv':
      return heightCat === 'low' ? 68 : heightCat === 'medium' ? 42 : 22;
    case 'yagi2el':
      return heightCat === 'low' ? 35 : heightCat === 'medium' ? 20 : 10;
    case 'yagi3el':
      return heightCat === 'low' ? 32 : heightCat === 'medium' ? 18 : 8;
    case 'magloop':
      return 70; // always high angle
    case 'windom':
      return heightCat === 'low' ? 68 : heightCat === 'medium' ? 44 : 24;
    case 'zepp':
      return heightCat === 'low' ? 55 : heightCat === 'medium' ? 35 : 18;
    case 'quadLoop':
      return heightCat === 'low' ? 45 : heightCat === 'medium' ? 25 : 12;
    case 'sloper':
      return heightCat === 'low' ? 50 : heightCat === 'medium' ? 35 : 20;
    case 'longwire':
      return 30; // multiple lobes, estimate
    case 'cobweb':
      return heightCat === 'low' ? 45 : heightCat === 'medium' ? 30 : 18;
    case 'hexbeam':
      return heightCat === 'low' ? 38 : heightCat === 'medium' ? 22 : 12;
    case 'zs6bkw':
      return heightCat === 'low' ? 66 : heightCat === 'medium' ? 40 : 20;
    case 'hb9cv':
      return heightCat === 'low' ? 36 : heightCat === 'medium' ? 21 : 11;
    case 'fanDipole':
      return heightCat === 'low' ? 70 : heightCat === 'medium' ? 45 : 25;
    case 'spiderbeam':
      return heightCat === 'low' ? 36 : heightCat === 'medium' ? 20 : 10;
    case 'moxon':
      return heightCat === 'low' ? 38 : heightCat === 'medium' ? 22 : 12;
    case 'logPeriodic':
      return heightCat === 'low' ? 40 : heightCat === 'medium' ? 25 : 15;
    case 'vertical58':
      return 12 + groundBonus;
    case 'collinear':
      return 8 + groundBonus;
    case 'yagi4el':
      return heightCat === 'low' ? 30 : heightCat === 'medium' ? 16 : 7;
    case 'yagi5el':
      return heightCat === 'low' ? 28 : heightCat === 'medium' ? 14 : 6;
    case 'yagi6el':
      return heightCat === 'low' ? 26 : heightCat === 'medium' ? 12 : 5;
    case 'edz':
      return heightCat === 'low' ? 40 : heightCat === 'medium' ? 25 : 12;
    case 'quad2el':
      return heightCat === 'low' ? 34 : heightCat === 'medium' ? 19 : 9;
    case 'quad3el':
      return heightCat === 'low' ? 30 : heightCat === 'medium' ? 16 : 7;
    case 'slimJim':
      return 15 + groundBonus;
    case 'superJ':
      return 12 + groundBonus;
    case 'jPole':
      return 18 + groundBonus;
    case 'discone':
      return 15;
    case 'helix':
      return 8;
    case 'patch':
      return 15;
    case 'vivaldi':
      return 5;
    default:
      return 45;
  }
}

// Determine if configuration favors NVIS or DX
export function getRadiationCharacter(config: AntennaConfig): 'nvis' | 'dx' | 'balanced' {
  const mainLobe = getMainLobeAngle(config);
  if (mainLobe > 60) return 'nvis';
  if (mainLobe < 30) return 'dx';
  return 'balanced';
}

// Estimate coverage based on takeoff angle and band
export function estimateCoverage(config: AntennaConfig): CoverageEstimate {
  const mainLobe = getMainLobeAngle(config);
  const bandInfo = BAND_INFO[config.band];

  // Simplified ionospheric geometry
  // Higher angles = shorter skip, lower angles = longer skip
  // F2 layer height ~300km, E layer ~100km

  let minDistance: number;
  let maxDistance: number;
  let skipZoneStart: number;
  let skipZoneEnd: number;
  let bestFor: PropagationGoal;
  let description: string;

  if (mainLobe > 70) {
    // NVIS - nearly vertical
    minDistance = 0;
    maxDistance = 500;
    skipZoneStart = 0;
    skipZoneEnd = 0;
    bestFor = 'nvis';
    description = 'coverage.nvis';
  } else if (mainLobe > 45) {
    // Regional
    minDistance = 300;
    maxDistance = 1500;
    skipZoneStart = 50;
    skipZoneEnd = 300;
    bestFor = 'regional';
    description = 'coverage.regional';
  } else if (mainLobe > 20) {
    // DX - medium distance
    minDistance = 1000;
    maxDistance = 4000;
    skipZoneStart = 100;
    skipZoneEnd = 1000;
    bestFor = 'dx';
    description = 'coverage.dx';
  } else {
    // Low angle - worldwide DX
    minDistance = 2000;
    maxDistance = 20000;
    skipZoneStart = 200;
    skipZoneEnd = 2000;
    bestFor = 'worldwide';
    description = 'coverage.worldwide';
  }

  // Adjust for band characteristics
  if (!bandInfo.nvitsSuitable && bestFor === 'nvis') {
    // Higher bands don't support NVIS well
    minDistance = 500;
    maxDistance = 2000;
    bestFor = 'regional';
    description = 'coverage.noNvis';
  }

  return { minDistance, maxDistance, skipZoneStart, skipZoneEnd, bestFor, description };
}

// Get recommended antenna for a goal
export function getRecommendation(goal: PropagationGoal, band: Band): {
  antennaType: AntennaType;
  minHeight: number;
  maxHeight: number;
  groundImportance: 'low' | 'medium' | 'high';
  descriptionKey: string;
} {
  const wavelength = WAVELENGTHS[band];

  switch (goal) {
    case 'nvis':
      return {
        antennaType: 'dipole',
        minHeight: wavelength * 0.1,
        maxHeight: wavelength * 0.25,
        groundImportance: 'low',
        descriptionKey: 'recommend.nvis',
      };
    case 'regional':
      return {
        antennaType: 'invertedV',
        minHeight: wavelength * 0.25,
        maxHeight: wavelength * 0.5,
        groundImportance: 'medium',
        descriptionKey: 'recommend.regional',
      };
    case 'dx':
      return {
        antennaType: 'dipole',
        minHeight: wavelength * 0.5,
        maxHeight: wavelength * 0.75,
        groundImportance: 'medium',
        descriptionKey: 'recommend.dx',
      };
    case 'worldwide':
      return {
        antennaType: 'vertical',
        minHeight: 3,
        maxHeight: 10,
        groundImportance: 'high',
        descriptionKey: 'recommend.worldwide',
      };
  }
}

// Calculate antenna specifications based on type and band
export function getAntennaSpecs(type: AntennaType, band: Band, config?: Partial<AntennaConfig>): AntennaSpecs {
  const wavelength = WAVELENGTHS[band];
  const formatLength = (meters: number): string => {
    if (meters >= 1) return `${meters.toFixed(2)} m`;
    return `${(meters * 100).toFixed(1)} cm`;
  };

  switch (type) {
    case 'dipole':
      return {
        length: formatLength(wavelength * 0.5 * 0.95), // velocity factor ~0.95
        height: `≥ ${formatLength(wavelength * 0.25)} (λ/4)`,
        gain: '2.15 dBi',
        impedance: '~73 Ω',
        bandwidth: '~3-5%',
        notes: 'specNotes.dipole',
      };

    case 'vertical':
      return {
        length: formatLength(wavelength * 0.25),
        height: 'Boden / Ground',
        radials: config?.radialCount ? `${config.radialCount}× λ/4` : '4-32× λ/4',
        gain: '0-2 dBi',
        impedance: '~36 Ω (λ/4)',
        bandwidth: '~2-4%',
        notes: 'specNotes.vertical',
      };

    case 'vertical58':
      return {
        length: formatLength(wavelength * 0.625),
        height: 'Boden / Ground',
        radials: config?.radialCount ? `${config.radialCount}× λ/4` : '4-32× λ/4',
        gain: '3-4 dBi',
        impedance: '~50 Ω (mit Anpassung)',
        bandwidth: '~2-3%',
        notes: 'specNotes.vertical58',
      };

    case 'collinear':
      return {
        length: formatLength(wavelength * 1.25), // two 5/8λ sections
        height: 'Boden / Ground',
        gain: '5-6 dBi',
        impedance: '~50 Ω',
        bandwidth: '~2-3%',
        notes: 'specNotes.collinear',
      };

    case 'invertedV':
      return {
        length: formatLength(wavelength * 0.5 * 0.95),
        height: `≥ ${formatLength(wavelength * 0.25)} (Apex)`,
        gain: '1.5-2 dBi',
        impedance: '~50 Ω @ 120° apex',
        bandwidth: '~5-7%',
        notes: config?.apexAngle ? `specNotes.invertedV.apex.${config.apexAngle}` : 'specNotes.invertedV',
      };

    case 'efhw':
      return {
        length: formatLength(wavelength * 0.5 * 0.97),
        height: `≥ ${formatLength(wavelength * 0.25)}`,
        gain: '2 dBi',
        impedance: '~2-5 kΩ (UnUn 49:1)',
        bandwidth: '~2-3%',
        notes: 'specNotes.efhw',
      };

    case 'randomWire':
      return {
        length: '> 10m (beliebig)',
        height: 'Variable',
        gain: '-2 bis +2 dBi',
        impedance: 'Variable (Tuner)',
        bandwidth: 'Breitband mit Tuner',
        notes: 'specNotes.randomWire',
      };

    case 'deltaLoop':
      return {
        length: formatLength(wavelength * 1.05), // circumference
        height: `≥ ${formatLength(wavelength * 0.33)}`,
        gain: '3-4 dBi',
        impedance: '~100 Ω (horizontal)',
        bandwidth: '~8-10%',
        notes: 'specNotes.deltaLoop',
      };

    case 'g5rv':
      return {
        length: '31.1 m (102 ft)',
        height: `≥ ${formatLength(10)}`,
        gain: '0-2 dBi',
        impedance: 'Variable (Tuner)',
        bandwidth: 'Multiband 80-10m',
        notes: 'specNotes.g5rv',
      };

    case 'yagi2el':
      return {
        length: formatLength(wavelength * 0.5), // driven element
        height: `≥ ${formatLength(wavelength * 0.5)}`,
        gain: '5-6 dBi',
        impedance: '~25 Ω',
        bandwidth: '~3-5%',
        notes: 'specNotes.yagi2el',
      };

    case 'yagi3el':
      return {
        length: formatLength(wavelength * 0.5),
        height: `≥ ${formatLength(wavelength * 0.5)}`,
        gain: '7-8 dBi',
        impedance: '~25 Ω',
        bandwidth: '~2-4%',
        notes: 'specNotes.yagi3el',
      };

    case 'yagi4el':
      return {
        length: formatLength(wavelength * 0.5),
        height: `≥ ${formatLength(wavelength * 0.5)}`,
        gain: '8-9 dBi',
        impedance: '~20 Ω',
        bandwidth: '~2-3%',
        notes: 'specNotes.yagi4el',
      };

    case 'yagi5el':
      return {
        length: formatLength(wavelength * 0.5),
        height: `≥ ${formatLength(wavelength * 0.5)}`,
        gain: '9-10 dBi',
        impedance: '~18 Ω',
        bandwidth: '~2-3%',
        notes: 'specNotes.yagi5el',
      };

    case 'yagi6el':
      return {
        length: formatLength(wavelength * 0.5),
        height: `≥ ${formatLength(wavelength * 0.75)}`,
        gain: '10-11 dBi',
        impedance: '~15 Ω',
        bandwidth: '~1.5-2.5%',
        notes: 'specNotes.yagi6el',
      };

    case 'magloop':
      return {
        length: formatLength(wavelength * 0.15), // circumference ~λ/6
        height: 'Variable',
        gain: '-2 bis 0 dBi',
        impedance: 'Sehr niedrig',
        bandwidth: '~0.1-0.5%',
        notes: 'specNotes.magloop',
      };

    case 'windom':
      return {
        length: formatLength(wavelength * 0.5 * 0.95),
        height: `≥ ${formatLength(wavelength * 0.25)}`,
        gain: '2 dBi',
        impedance: '~300 Ω @ 33%',
        bandwidth: 'Multiband',
        notes: config?.feedpointRatio ? `specNotes.windom.feed.${config.feedpointRatio}` : 'specNotes.windom',
      };

    case 'zepp':
      return {
        length: formatLength(wavelength * 0.5 * 0.95),
        height: `≥ ${formatLength(wavelength * 0.25)}`,
        gain: '2 dBi',
        impedance: '~5 kΩ (Leiter)',
        bandwidth: '~3%',
        notes: 'specNotes.zepp',
      };

    case 'edz':
      return {
        length: formatLength(wavelength * 1.28), // extended length
        height: `≥ ${formatLength(wavelength * 0.5)}`,
        gain: '4-5 dBi',
        impedance: '~200 Ω',
        bandwidth: '~2-3%',
        notes: 'specNotes.edz',
      };

    case 'quadLoop':
      return {
        length: formatLength(wavelength * 1.05), // circumference
        height: `≥ ${formatLength(wavelength * 0.25)}`,
        gain: '3-4 dBi',
        impedance: '~125 Ω',
        bandwidth: '~8-10%',
        notes: 'specNotes.quadLoop',
      };

    case 'quad2el':
      return {
        length: formatLength(wavelength * 1.05),
        height: `≥ ${formatLength(wavelength * 0.5)}`,
        gain: '6-7 dBi',
        impedance: '~75 Ω',
        bandwidth: '~5-7%',
        notes: 'specNotes.quad2el',
      };

    case 'quad3el':
      return {
        length: formatLength(wavelength * 1.05),
        height: `≥ ${formatLength(wavelength * 0.5)}`,
        gain: '8-9 dBi',
        impedance: '~50 Ω',
        bandwidth: '~4-6%',
        notes: 'specNotes.quad3el',
      };

    case 'sloper':
      return {
        length: formatLength(wavelength * 0.5 * 0.95),
        height: `${formatLength(wavelength * 0.25)} - ${formatLength(wavelength * 0.5)}`,
        gain: '2-3 dBi',
        impedance: '~50-75 Ω',
        bandwidth: '~3-5%',
        notes: config?.slopeAngle ? `specNotes.sloper.angle.${config.slopeAngle}` : 'specNotes.sloper',
      };

    case 'longwire':
      return {
        length: `> ${formatLength(wavelength)}`,
        height: 'Variable',
        gain: '2-6 dBi',
        impedance: 'Variable (Tuner)',
        bandwidth: 'Breitband mit Tuner',
        notes: 'specNotes.longwire',
      };

    case 'cobweb':
      return {
        length: `~${formatLength(wavelength * 0.5)} (je Element)`,
        height: `≥ ${formatLength(wavelength * 0.25)}`,
        gain: '0-2 dBi',
        impedance: '~50 Ω',
        bandwidth: 'Multiband 20-10m',
        notes: 'specNotes.cobweb',
      };

    case 'hexbeam':
      return {
        length: `~${formatLength(wavelength * 0.4)}`,
        height: `≥ ${formatLength(wavelength * 0.5)}`,
        gain: '4-5 dBi',
        impedance: '~50 Ω',
        bandwidth: 'Multiband 20-6m',
        notes: 'specNotes.hexbeam',
      };

    case 'zs6bkw':
      return {
        length: '27.6 m (90.5 ft)',
        height: `≥ ${formatLength(10)}`,
        gain: '0-2 dBi',
        impedance: '~300 Ω (Leitung)',
        bandwidth: 'Multiband 80-10m',
        notes: 'specNotes.zs6bkw',
      };

    case 'hb9cv':
      return {
        length: formatLength(wavelength * 0.5),
        height: `≥ ${formatLength(wavelength * 0.5)}`,
        gain: '5-6 dBi',
        impedance: '~50 Ω',
        bandwidth: '~5-7%',
        notes: 'specNotes.hb9cv',
      };

    case 'fanDipole':
      return {
        length: 'Variable (mehrere Elemente)',
        height: `≥ ${formatLength(wavelength * 0.25)}`,
        gain: '2 dBi',
        impedance: '~50 Ω',
        bandwidth: 'Multiband',
        notes: 'specNotes.fanDipole',
      };

    case 'spiderbeam':
      return {
        length: `~${formatLength(10)}`,
        height: `≥ ${formatLength(10)}`,
        gain: '6-8 dBi',
        impedance: '~50 Ω',
        bandwidth: 'Multiband 20-10m',
        notes: 'specNotes.spiderbeam',
      };

    case 'moxon':
      return {
        length: formatLength(wavelength * 0.42), // shorter than Yagi
        height: `≥ ${formatLength(wavelength * 0.5)}`,
        gain: '5-6 dBi',
        impedance: '~50 Ω',
        bandwidth: '~4-6%',
        notes: 'specNotes.moxon',
      };

    case 'logPeriodic':
      return {
        length: 'Variable (viele Elemente)',
        height: `≥ ${formatLength(wavelength * 0.5)}`,
        gain: '5-7 dBi',
        impedance: '~50 Ω',
        bandwidth: 'Breitband',
        notes: 'specNotes.logPeriodic',
      };

    case 'jPole':
      return {
        length: formatLength(wavelength * 0.75), // 3/4λ total
        height: 'Boden / Ground',
        gain: '2-3 dBi',
        impedance: '~50 Ω',
        bandwidth: '~5-8%',
        notes: 'specNotes.jPole',
      };

    case 'slimJim':
      return {
        length: formatLength(wavelength * 0.75),
        height: 'Boden / Ground',
        gain: '3-4 dBi',
        impedance: '~50 Ω',
        bandwidth: '~5-8%',
        notes: 'specNotes.slimJim',
      };

    case 'superJ':
      return {
        length: formatLength(wavelength * 1.5), // two 3/4λ sections
        height: 'Boden / Ground',
        gain: '5-6 dBi',
        impedance: '~50 Ω',
        bandwidth: '~3-5%',
        notes: 'specNotes.superJ',
      };

    case 'discone':
      return {
        length: formatLength(wavelength * 0.25), // cone element
        height: 'Erhöht / Elevated',
        gain: '0-2 dBi',
        impedance: '~50 Ω',
        bandwidth: '10:1 (Breitband)',
        notes: 'specNotes.discone',
      };

    case 'helix':
      return {
        length: formatLength(wavelength * (config?.helixTurns || 10) * 0.25),
        height: 'Auf Reflektor',
        gain: `${8 + (config?.helixTurns || 10) * 0.5} dBi`,
        impedance: '~140 Ω',
        bandwidth: '~20%',
        notes: 'specNotes.helix',
      };

    case 'patch':
      return {
        length: formatLength(wavelength * 0.49),
        height: 'Auf Substrat',
        gain: '6-8 dBi',
        impedance: '~50 Ω',
        bandwidth: '~2-5%',
        notes: 'specNotes.patch',
      };

    case 'vivaldi':
      return {
        length: formatLength(wavelength * 2), // typically 2λ long
        height: 'Auf Substrat',
        gain: '8-12 dBi',
        impedance: '~50 Ω',
        bandwidth: '3:1+ (Breitband)',
        notes: 'specNotes.vivaldi',
      };

    default:
      return {
        notes: 'specNotes.unknown',
      };
  }
}

// All available bands for UI
export const ALL_BANDS: Band[] = ['2200m', '630m', '160m', '80m', '60m', '40m', '30m', '20m', '17m', '15m', '12m', '10m', '6m', '4m', '2m', '70cm', '23cm', '13cm', '9cm', '6cm', '3cm'];

// Band categories for organized display
export type BandCategory = 'lf' | 'mf' | 'hf' | 'vhf' | 'uhf' | 'shf';

export interface BandCategoryInfo {
  id: BandCategory;
  labelKey: string;
  bands: Band[];
}

export const BAND_CATEGORIES: BandCategoryInfo[] = [
  {
    id: 'lf',
    labelKey: 'bandCategories.lf', // Langwelle / LF
    bands: ['2200m'],
  },
  {
    id: 'mf',
    labelKey: 'bandCategories.mf', // Mittelwelle / MF
    bands: ['630m', '160m'],
  },
  {
    id: 'hf',
    labelKey: 'bandCategories.hf', // Kurzwelle / HF
    bands: ['80m', '60m', '40m', '30m', '20m', '17m', '15m', '12m', '10m'],
  },
  {
    id: 'vhf',
    labelKey: 'bandCategories.vhf', // VHF
    bands: ['6m', '4m', '2m'],
  },
  {
    id: 'uhf',
    labelKey: 'bandCategories.uhf', // UHF
    bands: ['70cm', '23cm'],
  },
  {
    id: 'shf',
    labelKey: 'bandCategories.shf', // Mikrowelle / SHF
    bands: ['13cm', '9cm', '6cm', '3cm'],
  },
];
