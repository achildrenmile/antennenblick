import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../i18n';

interface SolarData {
  sfi: number;
  aIndex: number;
  kIndex: number;
  sunspots: number;
  updated: string;
  conditions: Record<string, { day: string; night: string }>;
}

interface Props {
  onClose: () => void;
}

// Parse HamQSL solar XML data
function parseSolarXML(xmlText: string): SolarData | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');

    const getValue = (tag: string) => {
      const el = doc.querySelector(tag);
      return el?.textContent || '';
    };

    const conditions: Record<string, { day: string; night: string }> = {};
    const bandNodes = doc.querySelectorAll('calculatedconditions band');
    bandNodes.forEach((node) => {
      const name = node.getAttribute('name') || '';
      const time = node.getAttribute('time') || '';
      const condition = node.textContent || '';
      if (!conditions[name]) {
        conditions[name] = { day: '', night: '' };
      }
      if (time === 'day') {
        conditions[name].day = condition;
      } else {
        conditions[name].night = condition;
      }
    });

    return {
      sfi: parseInt(getValue('solarflux'), 10) || 0,
      aIndex: parseInt(getValue('aindex'), 10) || 0,
      kIndex: parseInt(getValue('kindex'), 10) || 0,
      sunspots: parseInt(getValue('sunspots'), 10) || 0,
      updated: getValue('updated') || new Date().toISOString(),
      conditions,
    };
  } catch {
    return null;
  }
}

// Get condition color based on propagation status
function getConditionColor(condition: string): string {
  const lc = condition.toLowerCase();
  if (lc.includes('good')) return '#26de81';
  if (lc.includes('fair')) return '#ffc107';
  if (lc.includes('poor')) return '#ff6b6b';
  return '#9aa0a6';
}

// Get K-Index interpretation
function getKIndexLevel(k: number): { label: string; color: string } {
  if (k <= 1) return { label: 'Quiet', color: '#26de81' };
  if (k <= 3) return { label: 'Unsettled', color: '#ffc107' };
  if (k <= 5) return { label: 'Active', color: '#ff9f43' };
  return { label: 'Storm', color: '#ff6b6b' };
}

// Get SFI interpretation
function getSFILevel(sfi: number): { label: string; color: string } {
  if (sfi >= 150) return { label: 'Excellent', color: '#26de81' };
  if (sfi >= 100) return { label: 'Good', color: '#7bed9f' };
  if (sfi >= 80) return { label: 'Fair', color: '#ffc107' };
  if (sfi >= 70) return { label: 'Poor', color: '#ff9f43' };
  return { label: 'Very Poor', color: '#ff6b6b' };
}

export function SolarWidget({ onClose }: Props) {
  const { t } = useI18n();
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolarData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use a CORS proxy or direct fetch depending on environment
      // HamQSL solar data XML endpoint
      const response = await fetch('https://www.hamqsl.com/solarxml.php');
      if (!response.ok) {
        throw new Error('Failed to fetch solar data');
      }
      const xmlText = await response.text();
      const data = parseSolarXML(xmlText);
      if (data) {
        setSolarData(data);
      } else {
        throw new Error('Failed to parse solar data');
      }
    } catch (err) {
      // If fetch fails (CORS, network, etc.), show mock data with notice
      console.error('Solar data fetch error:', err);
      setError(t.solar?.fetchError || 'Konnte keine Live-Daten abrufen. Zeige Beispieldaten.');

      // Provide sample data for demonstration
      setSolarData({
        sfi: 142,
        aIndex: 8,
        kIndex: 2,
        sunspots: 95,
        updated: new Date().toISOString(),
        conditions: {
          '80m-40m': { day: 'Fair', night: 'Good' },
          '30m-20m': { day: 'Good', night: 'Good' },
          '17m-15m': { day: 'Good', night: 'Fair' },
          '12m-10m': { day: 'Fair', night: 'Poor' },
        },
      });
    } finally {
      setLoading(false);
    }
  }, [t.solar?.fetchError]);

  useEffect(() => {
    fetchSolarData();
  }, [fetchSolarData]);

  const kLevel = solarData ? getKIndexLevel(solarData.kIndex) : null;
  const sfiLevel = solarData ? getSFILevel(solarData.sfi) : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="solar-widget-modal" onClick={(e) => e.stopPropagation()}>
        <div className="solar-widget-header">
          <h2>{t.solar?.title || 'Solar-Daten'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {loading ? (
          <div className="solar-loading">
            {t.solar?.loading || 'Lade Solar-Daten...'}
          </div>
        ) : (
          <>
            {error && (
              <div className="solar-error">
                {error}
              </div>
            )}

            {solarData && (
              <div className="solar-content">
                <div className="solar-indices">
                  <div className="solar-index-card">
                    <div className="solar-index-label">{t.solar?.sfi || 'Solar Flux Index'}</div>
                    <div className="solar-index-value" style={{ color: sfiLevel?.color }}>
                      {solarData.sfi}
                    </div>
                    <div className="solar-index-level" style={{ color: sfiLevel?.color }}>
                      {sfiLevel?.label}
                    </div>
                  </div>

                  <div className="solar-index-card">
                    <div className="solar-index-label">{t.solar?.kIndex || 'K-Index'}</div>
                    <div className="solar-index-value" style={{ color: kLevel?.color }}>
                      {solarData.kIndex}
                    </div>
                    <div className="solar-index-level" style={{ color: kLevel?.color }}>
                      {kLevel?.label}
                    </div>
                  </div>

                  <div className="solar-index-card">
                    <div className="solar-index-label">{t.solar?.aIndex || 'A-Index'}</div>
                    <div className="solar-index-value">
                      {solarData.aIndex}
                    </div>
                  </div>

                  <div className="solar-index-card">
                    <div className="solar-index-label">{t.solar?.sunspots || 'Sonnenflecken'}</div>
                    <div className="solar-index-value">
                      {solarData.sunspots}
                    </div>
                  </div>
                </div>

                <div className="solar-conditions">
                  <h3>{t.solar?.bandConditions || 'Band-Bedingungen'}</h3>
                  <div className="conditions-grid">
                    <div className="conditions-header">
                      <span>{t.solar?.band || 'Band'}</span>
                      <span>{t.solar?.day || 'Tag'}</span>
                      <span>{t.solar?.night || 'Nacht'}</span>
                    </div>
                    {Object.entries(solarData.conditions).map(([band, cond]) => (
                      <div key={band} className="conditions-row">
                        <span className="condition-band">{band}</span>
                        <span className="condition-value" style={{ color: getConditionColor(cond.day) }}>
                          {cond.day || '-'}
                        </span>
                        <span className="condition-value" style={{ color: getConditionColor(cond.night) }}>
                          {cond.night || '-'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="solar-explanation">
                  <h4>{t.solar?.whatMeans || 'Was bedeutet das?'}</h4>
                  <div className="solar-explainer">
                    <p><strong>SFI (Solar Flux Index):</strong> {t.solar?.sfiExplain || 'Misst die Sonnenaktivität. Höher = besser für höhere Bänder (10m-20m). Unter 70 ist schlecht, über 150 ist exzellent.'}</p>
                    <p><strong>K-Index:</strong> {t.solar?.kIndexExplain || 'Geomagnetische Aktivität. Niedriger ist besser (0-2 = ruhig). Ab 5 sind Störungen und Ausfälle wahrscheinlich.'}</p>
                    <p><strong>A-Index:</strong> {t.solar?.aIndexExplain || '24-Stunden-Durchschnitt der geomagnetischen Aktivität. Unter 10 ist gut, über 30 ist störend.'}</p>
                  </div>
                </div>

                <div className="solar-footer">
                  <button onClick={fetchSolarData} className="refresh-button">
                    {t.solar?.refresh || 'Aktualisieren'}
                  </button>
                  <span className="solar-updated">
                    {t.solar?.lastUpdate || 'Letztes Update'}: {new Date(solarData.updated).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        <div className="solar-credits">
          {t.solar?.dataSource || 'Daten von'}: <a href="https://www.hamqsl.com/solar.html" target="_blank" rel="noopener noreferrer">HamQSL.com</a>
        </div>
      </div>
    </div>
  );
}
