export type AntennaType = 'dipole' | 'vertical' | 'invertedV';
export type Band = '40m' | '20m';
export type HeightCategory = 'low' | 'medium' | 'high';

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
}

// Wavelengths in meters
const WAVELENGTHS: Record<Band, number> = {
  '40m': 40,
  '20m': 20,
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
  const { type, height, band, orientation, realistic } = config;
  const heightCat = getHeightCategory(height, band);
  const points: PatternPoint[] = [];

  for (let angle = 0; angle < 360; angle++) {
    const adjustedAngle = (angle - orientation + 360) % 360;
    let magnitude = calculateAzimuthMagnitude(type, adjustedAngle, heightCat);

    if (realistic) {
      magnitude = applyRealisticDistortion(magnitude, angle);
    }

    points.push({ angle, magnitude });
  }

  return normalizePattern(points);
}

// Generate elevation pattern (side view) - 180 points (0-180 degrees)
export function generateElevationPattern(config: AntennaConfig): PatternPoint[] {
  const { type, height, band, realistic } = config;
  const heightCat = getHeightCategory(height, band);
  const wavelength = WAVELENGTHS[band];
  const heightInWavelengths = height / wavelength;
  const points: PatternPoint[] = [];

  for (let angle = 0; angle <= 90; angle++) {
    let magnitude = calculateElevationMagnitude(type, angle, heightCat, heightInWavelengths);

    if (realistic) {
      magnitude = applyRealisticDistortion(magnitude, angle * 2);
    }

    points.push({ angle, magnitude });
  }

  return normalizePattern(points);
}

function calculateAzimuthMagnitude(type: AntennaType, angle: number, heightCat: HeightCategory): number {
  const rad = (angle * Math.PI) / 180;

  switch (type) {
    case 'dipole': {
      // Horizontal dipole: figure-8 pattern perpendicular to wire
      // Pattern is cos^2 of angle from broadside
      const pattern = Math.pow(Math.cos(rad), 2);
      // At low height, pattern becomes more circular due to ground reflection
      const circularityFactor = heightCat === 'low' ? 0.4 : heightCat === 'medium' ? 0.2 : 0.1;
      return pattern * (1 - circularityFactor) + circularityFactor;
    }

    case 'vertical': {
      // Vertical: nearly omnidirectional in azimuth
      // Slight variation to show it's not perfectly circular
      return 0.95 + 0.05 * Math.cos(4 * rad);
    }

    case 'invertedV': {
      // Inverted-V: more omnidirectional than horizontal dipole
      // but still shows some directionality
      const dipolePattern = Math.pow(Math.cos(rad), 2);
      const omniComponent = 0.6;
      return dipolePattern * (1 - omniComponent) + omniComponent;
    }

    default:
      return 1;
  }
}

function calculateElevationMagnitude(
  type: AntennaType,
  angle: number,
  heightCat: HeightCategory,
  heightInWavelengths: number
): number {
  const rad = (angle * Math.PI) / 180;

  switch (type) {
    case 'dipole': {
      // Horizontal dipole elevation pattern
      // Main lobe angle depends on height
      // Lower height = higher angle (NVIS), higher height = lower angle (DX)
      const mainLobeAngle = heightCat === 'low' ? 70 : heightCat === 'medium' ? 45 : 25;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;

      // Ground reflection creates lobes
      const groundFactor = Math.sin(2 * Math.PI * heightInWavelengths * Math.sin(rad));
      const elementFactor = Math.cos(rad); // dipole element factor

      // Combine factors
      let magnitude = Math.abs(groundFactor * elementFactor);

      // Enhance the main lobe
      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 2);
      magnitude = magnitude * 0.6 + lobeEnhancement * 0.4;

      return magnitude;
    }

    case 'vertical': {
      // Vertical antenna: low angle radiation
      // Pattern peaks at low angles
      const lowAnglePeak = Math.sin(rad) * Math.cos(rad);
      const groundReflection = Math.abs(Math.sin(2 * Math.PI * heightInWavelengths * Math.sin(rad)));

      // Verticals favor low angles
      const lowAngleEnhancement = 1 - (angle / 90) * 0.3;

      return lowAnglePeak * groundReflection * lowAngleEnhancement + 0.1;
    }

    case 'invertedV': {
      // Inverted-V: compromise between dipole and vertical
      // Slightly higher angle than dipole at same height
      const mainLobeAngle = heightCat === 'low' ? 75 : heightCat === 'medium' ? 55 : 35;
      const mainLobeRad = (mainLobeAngle * Math.PI) / 180;

      const groundFactor = Math.sin(2 * Math.PI * heightInWavelengths * 0.8 * Math.sin(rad));
      const elementFactor = 0.7 * Math.cos(rad) + 0.3; // More vertical component

      let magnitude = Math.abs(groundFactor * elementFactor);

      const angleFromMainLobe = Math.abs(rad - mainLobeRad);
      const lobeEnhancement = Math.exp(-angleFromMainLobe * 1.5);
      magnitude = magnitude * 0.5 + lobeEnhancement * 0.5;

      return magnitude;
    }

    default:
      return 1;
  }
}

function applyRealisticDistortion(magnitude: number, angle: number): number {
  // Add pseudo-random but deterministic distortion
  const seed = angle * 0.1;
  const noise1 = Math.sin(seed * 7.3) * 0.08;
  const noise2 = Math.sin(seed * 13.7) * 0.05;
  const noise3 = Math.sin(seed * 23.1) * 0.03;

  // Asymmetry - one side slightly weaker
  const asymmetry = Math.sin((angle * Math.PI) / 180) * 0.1;

  return Math.max(0, Math.min(1, magnitude + noise1 + noise2 + noise3 + asymmetry));
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

  switch (config.type) {
    case 'dipole':
      return heightCat === 'low' ? 70 : heightCat === 'medium' ? 45 : 25;
    case 'vertical':
      return 15; // Verticals always favor low angles
    case 'invertedV':
      return heightCat === 'low' ? 75 : heightCat === 'medium' ? 55 : 35;
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
