import { useState, useMemo } from 'react';
import { I18nProvider, useI18n } from './i18n';
import { LanguageToggle } from './components/LanguageToggle';
import { AntennaSelector } from './components/AntennaSelector';
import { Controls } from './components/Controls';
import { RealityToggle } from './components/RealityToggle';
import { PolarDiagram } from './components/PolarDiagram';
import { ElevationDiagram } from './components/ElevationDiagram';
import { ExplanationPanel } from './components/ExplanationPanel';
import {
  generateAzimuthPattern,
  generateElevationPattern,
  getMainLobeAngle,
  type AntennaType,
  type Band,
  type AntennaConfig,
} from './data/antennaPatterns';
import './App.css';

function AppContent() {
  const { t } = useI18n();

  const [antennaType, setAntennaType] = useState<AntennaType>('dipole');
  const [height, setHeight] = useState(10);
  const [band, setBand] = useState<Band>('20m');
  const [orientation, setOrientation] = useState(0);
  const [realistic, setRealistic] = useState(false);

  const config: AntennaConfig = useMemo(
    () => ({ type: antennaType, height, band, orientation, realistic }),
    [antennaType, height, band, orientation, realistic]
  );

  const azimuthPattern = useMemo(
    () => generateAzimuthPattern(config),
    [config]
  );

  const elevationPattern = useMemo(
    () => generateElevationPattern(config),
    [config]
  );

  const mainLobeAngle = useMemo(
    () => getMainLobeAngle(config),
    [config]
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>{t.app.title}</h1>
          <p className="subtitle">{t.app.subtitle}</p>
        </div>
        <LanguageToggle />
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <AntennaSelector value={antennaType} onChange={setAntennaType} />
          <Controls
            height={height}
            onHeightChange={setHeight}
            band={band}
            onBandChange={setBand}
            orientation={orientation}
            onOrientationChange={setOrientation}
          />
          <RealityToggle realistic={realistic} onChange={setRealistic} />
        </aside>

        <section className="visualization">
          <div className="diagrams">
            <PolarDiagram
              pattern={azimuthPattern}
              orientation={orientation}
              title={t.view.azimuth}
            />
            <ElevationDiagram
              pattern={elevationPattern}
              mainLobeAngle={mainLobeAngle}
              title={t.view.elevation}
            />
          </div>
          <ExplanationPanel config={config} />
        </section>
      </main>

      <footer className="app-footer">
        <span>73!</span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
