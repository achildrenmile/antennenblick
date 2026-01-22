import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useI18n } from '../i18n';
import type { AntennaConfig, Band } from '../data/antennaPatterns';
import { getMainLobeAngle } from '../data/antennaPatterns';
import 'leaflet/dist/leaflet.css';

// Custom SVG marker icon to avoid CDN dependency
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path fill="#4a9eff" stroke="#2d7ac7" stroke-width="1.5" d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z"/>
      <circle fill="white" cx="12" cy="12" r="5"/>
    </svg>
  `),
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
});

interface Props {
  config: AntennaConfig;
  onClose: () => void;
}

// Simplified propagation model based on band and takeoff angle
function calculateRanges(band: Band, takeoffAngle: number): { skipZone: number; singleHop: number; multiHop: number } {
  // Ionospheric layer heights (simplified)
  const F2_LAYER_HEIGHT = 300; // km
  const E_LAYER_HEIGHT = 110; // km

  // Band-specific parameters
  const bandParams: Record<Band, { maxRange: number; nvCapable: boolean; layerHeight: number }> = {
    '2200m': { maxRange: 1000, nvCapable: true, layerHeight: E_LAYER_HEIGHT },
    '630m': { maxRange: 2000, nvCapable: true, layerHeight: E_LAYER_HEIGHT },
    '160m': { maxRange: 2500, nvCapable: true, layerHeight: E_LAYER_HEIGHT },
    '80m': { maxRange: 3500, nvCapable: true, layerHeight: F2_LAYER_HEIGHT },
    '60m': { maxRange: 4000, nvCapable: true, layerHeight: F2_LAYER_HEIGHT },
    '40m': { maxRange: 5000, nvCapable: true, layerHeight: F2_LAYER_HEIGHT },
    '30m': { maxRange: 5500, nvCapable: false, layerHeight: F2_LAYER_HEIGHT },
    '20m': { maxRange: 6000, nvCapable: false, layerHeight: F2_LAYER_HEIGHT },
    '17m': { maxRange: 5500, nvCapable: false, layerHeight: F2_LAYER_HEIGHT },
    '15m': { maxRange: 5000, nvCapable: false, layerHeight: F2_LAYER_HEIGHT },
    '12m': { maxRange: 4500, nvCapable: false, layerHeight: F2_LAYER_HEIGHT },
    '10m': { maxRange: 4000, nvCapable: false, layerHeight: F2_LAYER_HEIGHT },
    '6m': { maxRange: 2500, nvCapable: false, layerHeight: E_LAYER_HEIGHT },
    '4m': { maxRange: 2000, nvCapable: false, layerHeight: E_LAYER_HEIGHT },
    '2m': { maxRange: 500, nvCapable: false, layerHeight: E_LAYER_HEIGHT },
    '70cm': { maxRange: 300, nvCapable: false, layerHeight: E_LAYER_HEIGHT },
    '23cm': { maxRange: 200, nvCapable: false, layerHeight: E_LAYER_HEIGHT },
    '13cm': { maxRange: 150, nvCapable: false, layerHeight: E_LAYER_HEIGHT },
    '9cm': { maxRange: 100, nvCapable: false, layerHeight: E_LAYER_HEIGHT },
    '6cm': { maxRange: 80, nvCapable: false, layerHeight: E_LAYER_HEIGHT },
    '3cm': { maxRange: 50, nvCapable: false, layerHeight: E_LAYER_HEIGHT },
  };

  const params = bandParams[band] || bandParams['20m'];

  // Calculate skip distance based on takeoff angle and layer height
  // Simple geometry: skip = 2 * h * tan(90 - angle)
  const angleRad = (90 - takeoffAngle) * Math.PI / 180;
  const skipDistance = Math.max(0, 2 * params.layerHeight * Math.tan(angleRad));

  // For NVIS capable bands with high angles, skip zone is minimal
  if (params.nvCapable && takeoffAngle > 60) {
    return {
      skipZone: 0,
      singleHop: Math.min(500, params.maxRange * 0.3),
      multiHop: params.maxRange * 0.5,
    };
  }

  // For VHF/UHF, it's mostly line of sight
  if (['2m', '70cm', '23cm', '13cm', '9cm', '6cm', '3cm'].includes(band)) {
    return {
      skipZone: 0,
      singleHop: params.maxRange,
      multiHop: params.maxRange * 1.5,
    };
  }

  // Calculate single hop range (one ionospheric reflection)
  const singleHopRange = Math.min(skipDistance + 500 + params.maxRange * (0.3 + (90 - takeoffAngle) / 300), params.maxRange);

  // Multi-hop can extend significantly further
  const multiHopRange = Math.min(singleHopRange * 3, 20000);

  return {
    skipZone: Math.min(skipDistance, params.maxRange * 0.5),
    singleHop: singleHopRange,
    multiHop: multiHopRange,
  };
}

function LocationPicker({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function RangeMap({ config, onClose }: Props) {
  const { t } = useI18n();
  const [position, setPosition] = useState<[number, number]>([47.07, 15.44]); // Default: Austria (Graz)
  const [showHelp, setShowHelp] = useState(true);

  const mainLobeAngle = useMemo(() => getMainLobeAngle(config), [config]);

  const ranges = useMemo(() => {
    return calculateRanges(config.band, mainLobeAngle);
  }, [config.band, mainLobeAngle]);

  const handleLocationChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setShowHelp(false);
  };

  // Try to get user's location
  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setShowHelp(false);
        },
        () => {
          // Keep default position on error
        }
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="range-map-modal" onClick={(e) => e.stopPropagation()}>
        <div className="range-map-header">
          <h2>{t.rangeMap?.title || 'Reichweiten-Karte'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="range-map-info">
          <div className="range-info-item">
            <span className="range-dot skip"></span>
            <span>{t.rangeMap?.skipZone || 'Tote Zone'}: {Math.round(ranges.skipZone)} km</span>
          </div>
          <div className="range-info-item">
            <span className="range-dot single"></span>
            <span>{t.rangeMap?.singleHop || 'Einfach-Hop'}: {Math.round(ranges.singleHop)} km</span>
          </div>
          <div className="range-info-item">
            <span className="range-dot multi"></span>
            <span>{t.rangeMap?.multiHop || 'Multi-Hop'}: {Math.round(ranges.multiHop)} km</span>
          </div>
          <div className="range-info-item">
            <span>{t.rangeMap?.takeoffAngle || 'Abstrahlwinkel'}: {mainLobeAngle}°</span>
          </div>
        </div>

        {showHelp && (
          <div className="range-map-help">
            <p>{t.rangeMap?.clickHelp || 'Klicke auf die Karte, um deinen Standort zu setzen'}</p>
            <button onClick={requestLocation} className="locate-button">
              {t.rangeMap?.useMyLocation || 'Meinen Standort verwenden'}
            </button>
          </div>
        )}

        <div className="range-map-container">
          <MapContainer
            center={position}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPicker onLocationChange={handleLocationChange} />

            {/* Multi-hop range (outer, most transparent) */}
            <Circle
              center={position}
              radius={ranges.multiHop * 1000}
              pathOptions={{
                color: '#ffc107',
                fillColor: '#ffc107',
                fillOpacity: 0.1,
                weight: 1,
              }}
            />

            {/* Single hop range */}
            <Circle
              center={position}
              radius={ranges.singleHop * 1000}
              pathOptions={{
                color: '#26de81',
                fillColor: '#26de81',
                fillOpacity: 0.15,
                weight: 2,
              }}
            />

            {/* Skip zone (innermost, red) */}
            {ranges.skipZone > 0 && (
              <Circle
                center={position}
                radius={ranges.skipZone * 1000}
                pathOptions={{
                  color: '#ff6b6b',
                  fillColor: '#ff6b6b',
                  fillOpacity: 0.25,
                  weight: 2,
                }}
              />
            )}

            {/* Location marker */}
            <Marker position={position} icon={customIcon}>
              <Popup>
                <strong>{t.rangeMap?.yourLocation || 'Dein Standort'}</strong>
                <br />
                {position[0].toFixed(3)}°, {position[1].toFixed(3)}°
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="range-map-footer">
          <p className="range-disclaimer">
            {t.rangeMap?.disclaimer || 'Vereinfachte Darstellung - tatsächliche Reichweite hängt von Ausbreitungsbedingungen, Tageszeit und Sonnenaktivität ab.'}
          </p>
        </div>
      </div>
    </div>
  );
}
