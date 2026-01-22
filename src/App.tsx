import { useState, useMemo, useEffect, useCallback } from 'react';
import { I18nProvider, useI18n } from './i18n';
import { LanguageToggle } from './components/LanguageToggle';
import { ThemeToggle } from './components/ThemeToggle';
import { AntennaSelector } from './components/AntennaSelector';
import { Controls } from './components/Controls';
import { RealityToggle } from './components/RealityToggle';
import { PolarDiagram } from './components/PolarDiagram';
import { ElevationDiagram } from './components/ElevationDiagram';
import { ExplanationPanel } from './components/ExplanationPanel';
import { Tutorial } from './components/Tutorial';
import { LegalModal } from './components/LegalModal';
import { Glossary } from './components/Glossary';
import { ComparePanel } from './components/ComparePanel';
import { Calculator } from './components/Calculator';
import { RangeMap } from './components/RangeMap';
import { SolarWidget } from './components/SolarWidget';
import { Favorites } from './components/Favorites';
import { Quiz } from './components/Quiz';
import {
  DownloadIcon,
  CalculatorIcon,
  MapIcon,
  SunIcon,
  StarIcon,
  QuizIcon,
  BookIcon,
  HelpIcon,
  ShareIcon,
} from './components/Icons';
import {
  generateAzimuthPattern,
  generateElevationPattern,
  getMainLobeAngle,
  type AntennaType,
  type Band,
  type GroundQuality,
  type TerrainType,
  type AntennaConfig,
} from './data/antennaPatterns';
import { exportAllDiagrams } from './utils/exportDiagram';
import './App.css';

function AppContent() {
  const { t } = useI18n();

  // Primary antenna state
  const [antennaType, setAntennaType] = useState<AntennaType>('dipole');
  const [height, setHeight] = useState(10);
  const [band, setBand] = useState<Band>('20m');
  const [orientation, setOrientation] = useState(0);
  const [realistic, setRealistic] = useState(false);
  const [groundQuality, setGroundQuality] = useState<GroundQuality>('average');
  const [terrain, setTerrain] = useState<TerrainType>('flat');
  // Antenna-specific parameters
  const [apexAngle, setApexAngle] = useState(120); // Inverted-V: 90-150°
  const [radialCount, setRadialCount] = useState(16); // Verticals: 4-64

  // Compare mode state
  const [compareMode, setCompareMode] = useState(false);
  const [compareAntennaType, setCompareAntennaType] = useState<AntennaType>('vertical');
  const [compareHeight, setCompareHeight] = useState(10);
  const [compareBand, setCompareBand] = useState<Band>('20m');
  const [compareOrientation, setCompareOrientation] = useState(0);
  const [compareGroundQuality, setCompareGroundQuality] = useState<GroundQuality>('average');
  const [compareTerrain, setCompareTerrain] = useState<TerrainType>('flat');

  // UI state
  const [showTutorial, setShowTutorial] = useState(false);
  const [legalModal, setLegalModal] = useState<'imprint' | 'privacy' | null>(null);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showRangeMap, setShowRangeMap] = useState(false);
  const [showSolar, setShowSolar] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Load config from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Primary antenna config
    const urlType = params.get('type') as AntennaType | null;
    const urlHeight = params.get('h');
    const urlBand = params.get('band') as Band | null;
    const urlOrientation = params.get('o');
    const urlGround = params.get('g') as GroundQuality | null;
    const urlRealistic = params.get('r');

    if (urlType) setAntennaType(urlType);
    if (urlHeight) setHeight(Number(urlHeight));
    if (urlBand) setBand(urlBand);
    if (urlOrientation) setOrientation(Number(urlOrientation));
    if (urlGround) setGroundQuality(urlGround);
    if (urlRealistic === '1') setRealistic(true);

    // Compare mode config
    const urlCompare = params.get('cmp');
    if (urlCompare === '1') {
      setCompareMode(true);
      const urlCType = params.get('c_type') as AntennaType | null;
      const urlCHeight = params.get('c_h');
      const urlCBand = params.get('c_band') as Band | null;
      const urlCOrientation = params.get('c_o');
      const urlCGround = params.get('c_g') as GroundQuality | null;

      if (urlCType) setCompareAntennaType(urlCType);
      if (urlCHeight) setCompareHeight(Number(urlCHeight));
      if (urlCBand) setCompareBand(urlCBand);
      if (urlCOrientation) setCompareOrientation(Number(urlCOrientation));
      if (urlCGround) setCompareGroundQuality(urlCGround);
    }
  }, []);

  // Show tutorial on first visit
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('antennenblick-tutorial-seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('antennenblick-tutorial-seen', 'true');
  };

  // Generate shareable URL
  const generateShareUrl = useCallback(() => {
    const params = new URLSearchParams();

    // Primary config
    params.set('type', antennaType);
    params.set('h', height.toString());
    params.set('band', band);
    if (orientation !== 0) params.set('o', orientation.toString());
    if (groundQuality !== 'average') params.set('g', groundQuality);
    if (realistic) params.set('r', '1');

    // Compare config (if active)
    if (compareMode) {
      params.set('cmp', '1');
      params.set('c_type', compareAntennaType);
      params.set('c_h', compareHeight.toString());
      params.set('c_band', compareBand);
      if (compareOrientation !== 0) params.set('c_o', compareOrientation.toString());
      if (compareGroundQuality !== 'average') params.set('c_g', compareGroundQuality);
    }

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [antennaType, height, band, orientation, groundQuality, realistic, compareMode, compareAntennaType, compareHeight, compareBand, compareOrientation, compareGroundQuality]);

  const [showShareToast, setShowShareToast] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);

  const handleExport = useCallback(() => {
    const antennaName = t.antenna[antennaType as keyof typeof t.antenna] || antennaType;
    const filename = `antennenblick_${antennaName}_${band}_${height}m`;
    exportAllDiagrams(filename.replace(/[^a-zA-Z0-9_-]/g, '_'));
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 2000);
  }, [antennaType, band, height, t.antenna]);

  const handleShare = useCallback(async () => {
    const url = generateShareUrl();

    try {
      await navigator.clipboard.writeText(url);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    } catch {
      // Fallback: show URL in prompt
      prompt(t.share?.copyUrl || 'Share URL:', url);
    }
  }, [generateShareUrl, t.share?.copyUrl]);

  const handleLoadFavorite = useCallback((loadedConfig: AntennaConfig) => {
    setAntennaType(loadedConfig.type);
    setHeight(loadedConfig.height);
    setBand(loadedConfig.band);
    setOrientation(loadedConfig.orientation);
    setRealistic(loadedConfig.realistic);
    setGroundQuality(loadedConfig.groundQuality);
    if (loadedConfig.terrain) setTerrain(loadedConfig.terrain);
  }, []);

  const config: AntennaConfig = useMemo(
    () => ({
      type: antennaType,
      height,
      band,
      orientation,
      realistic,
      groundQuality,
      terrain,
      apexAngle: antennaType === 'invertedV' ? apexAngle : undefined,
      radialCount: ['vertical', 'vertical58', 'collinear'].includes(antennaType) ? radialCount : undefined,
    }),
    [antennaType, height, band, orientation, realistic, groundQuality, terrain, apexAngle, radialCount]
  );

  const compareConfig: AntennaConfig = useMemo(
    () => ({ type: compareAntennaType, height: compareHeight, band: compareBand, orientation: compareOrientation, realistic, groundQuality: compareGroundQuality, terrain: compareTerrain }),
    [compareAntennaType, compareHeight, compareBand, compareOrientation, realistic, compareGroundQuality, compareTerrain]
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

  // Compare patterns (only compute when compare mode is active)
  const compareAzimuthPattern = useMemo(
    () => compareMode ? generateAzimuthPattern(compareConfig) : [],
    [compareMode, compareConfig]
  );

  const compareElevationPattern = useMemo(
    () => compareMode ? generateElevationPattern(compareConfig) : [],
    [compareMode, compareConfig]
  );

  const compareMainLobeAngle = useMemo(
    () => compareMode ? getMainLobeAngle(compareConfig) : 0,
    [compareMode, compareConfig]
  );

  return (
    <div className="app">
      {showTutorial && <Tutorial onClose={handleCloseTutorial} />}
      {legalModal && <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />}
      {showGlossary && <Glossary onClose={() => setShowGlossary(false)} />}
      {showCalculator && <Calculator onClose={() => setShowCalculator(false)} />}
      {showRangeMap && <RangeMap config={config} onClose={() => setShowRangeMap(false)} />}
      {showSolar && <SolarWidget onClose={() => setShowSolar(false)} />}
      {showFavorites && (
        <Favorites
          currentConfig={config}
          onLoadConfig={handleLoadFavorite}
          onClose={() => setShowFavorites(false)}
        />
      )}
      {showQuiz && <Quiz onClose={() => setShowQuiz(false)} />}
      {showShareToast && (
        <div className="share-toast">
          {t.share?.copied || 'Link kopiert!'}
        </div>
      )}
      {showExportToast && (
        <div className="share-toast export-toast">
          {t.export?.downloading || 'Bild wird heruntergeladen...'}
        </div>
      )}

      <header className="app-header">
        <div className="header-content">
          <h1>{t.app.title}</h1>
          <p className="subtitle">{t.app.subtitle}</p>
        </div>
        <div className="header-actions">
          <button
            className="export-button"
            onClick={handleExport}
            title={t.export?.title || 'Export as Image'}
          >
            <DownloadIcon size={14} /> <span>{t.export?.button || 'Export'}</span>
          </button>
          <button
            className="calculator-button"
            onClick={() => setShowCalculator(true)}
            title={t.calculator?.title || 'Calculator'}
          >
            <CalculatorIcon size={14} /> <span>{t.calculator?.button || 'Rechner'}</span>
          </button>
          <button
            className="range-map-button"
            onClick={() => setShowRangeMap(true)}
            title={t.rangeMap?.title || 'Range Map'}
          >
            <MapIcon size={14} /> <span>{t.rangeMap?.button || 'Karte'}</span>
          </button>
          <button
            className="solar-button"
            onClick={() => setShowSolar(true)}
            title={t.solar?.title || 'Solar Data'}
          >
            <SunIcon size={14} /> <span>{t.solar?.button || 'Solar'}</span>
          </button>
          <button
            className="favorites-button"
            onClick={() => setShowFavorites(true)}
            title={t.favorites?.title || 'Favorites'}
          >
            <StarIcon size={14} /> <span>{t.favorites?.button || 'Favoriten'}</span>
          </button>
          <button
            className="share-button"
            onClick={handleShare}
            title={t.share?.title || 'Share Configuration'}
          >
            <ShareIcon size={14} /> <span>{t.share?.button || 'Teilen'}</span>
          </button>
          <button
            className={`compare-toggle ${compareMode ? 'active' : ''}`}
            onClick={() => setCompareMode(!compareMode)}
            title={t.compare?.toggle || 'Compare Mode'}
          >
            <span className="toggle-switch"></span>
            <span>{t.compare?.toggle || 'Vergleich'}</span>
          </button>
          <button
            className="quiz-button"
            onClick={() => setShowQuiz(true)}
            title={t.quiz?.title || 'Quiz'}
          >
            <QuizIcon size={14} /> <span>{t.quiz?.button || 'Quiz'}</span>
          </button>
          <button className="glossary-button" onClick={() => setShowGlossary(true)} title={t.glossary?.title || 'Glossar'}>
            <BookIcon size={14} /> <span>{t.glossary?.title?.split(' ')[0] || 'Glossar'}</span>
          </button>
          <button className="help-button" onClick={() => setShowTutorial(true)} title={t.tutorial?.showTutorial || 'Help'}>
            <HelpIcon size={16} />
          </button>
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </header>

      <main className={`app-main ${compareMode ? 'compare-mode' : ''}`}>
        {compareMode ? (
          <>
            <div className="compare-sidebar">
              <ComparePanel
                antennaType={antennaType}
                onAntennaTypeChange={setAntennaType}
                height={height}
                onHeightChange={setHeight}
                band={band}
                onBandChange={setBand}
                orientation={orientation}
                onOrientationChange={setOrientation}
                groundQuality={groundQuality}
                onGroundQualityChange={setGroundQuality}
                terrain={terrain}
                onTerrainChange={setTerrain}
                label={t.compare?.antenna1 || 'Antenne A'}
                color="#4a90d9"
              />
              <ComparePanel
                antennaType={compareAntennaType}
                onAntennaTypeChange={setCompareAntennaType}
                height={compareHeight}
                onHeightChange={setCompareHeight}
                band={compareBand}
                onBandChange={setCompareBand}
                orientation={compareOrientation}
                onOrientationChange={setCompareOrientation}
                groundQuality={compareGroundQuality}
                onGroundQualityChange={setCompareGroundQuality}
                terrain={compareTerrain}
                onTerrainChange={setCompareTerrain}
                label={t.compare?.antenna2 || 'Antenne B'}
                color="#e67e22"
              />
              <RealityToggle realistic={realistic} onChange={setRealistic} />
            </div>

            <section className="visualization compare-visualization">
              <div className="compare-legend">
                <span className="legend-item primary">
                  <span className="legend-color" style={{ backgroundColor: '#4a90d9' }}></span>
                  {t.antenna[antennaType as keyof typeof t.antenna] || antennaType}
                </span>
                <span className="legend-item compare">
                  <span className="legend-color" style={{ backgroundColor: '#e67e22' }}></span>
                  {t.antenna[compareAntennaType as keyof typeof t.antenna] || compareAntennaType}
                </span>
              </div>
              <div className="diagrams">
                <PolarDiagram
                  pattern={azimuthPattern}
                  orientation={orientation}
                  title={t.view.azimuth}
                  comparePattern={compareAzimuthPattern}
                  compareOrientation={compareOrientation}
                />
                <ElevationDiagram
                  pattern={elevationPattern}
                  mainLobeAngle={mainLobeAngle}
                  title={t.view.elevation}
                  comparePattern={compareElevationPattern}
                  compareMainLobeAngle={compareMainLobeAngle}
                />
              </div>
              <div className="compare-explanations">
                <div className="compare-explanation primary">
                  <h4 style={{ color: '#4a90d9' }}>{t.compare?.antenna1 || 'Antenne A'}</h4>
                  <ExplanationPanel config={config} />
                </div>
                <div className="compare-explanation secondary">
                  <h4 style={{ color: '#e67e22' }}>{t.compare?.antenna2 || 'Antenne B'}</h4>
                  <ExplanationPanel config={compareConfig} />
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            <aside className="sidebar">
              <AntennaSelector value={antennaType} onChange={setAntennaType} />
              <Controls
                height={height}
                onHeightChange={setHeight}
                band={band}
                onBandChange={setBand}
                orientation={orientation}
                onOrientationChange={setOrientation}
                groundQuality={groundQuality}
                onGroundQualityChange={setGroundQuality}
                terrain={terrain}
                onTerrainChange={setTerrain}
                antennaType={antennaType}
                apexAngle={apexAngle}
                onApexAngleChange={setApexAngle}
                radialCount={radialCount}
                onRadialCountChange={setRadialCount}
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
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-links">
          <button onClick={() => setLegalModal('imprint')}>{t.footer?.imprint || 'Impressum'}</button>
          <span className="footer-separator">|</span>
          <button onClick={() => setLegalModal('privacy')}>{t.footer?.privacy || 'Datenschutz'}</button>
          <span className="footer-separator">|</span>
          <a href="https://github.com/achildrenmile/antennenblick" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span className="footer-separator">|</span>
          <a href="https://github.com/achildrenmile/antennenblick/issues" target="_blank" rel="noopener noreferrer">Issues</a>
          <span className="footer-separator">|</span>
          <a href="mailto:oe8yml@rednil.at">{t.footer?.feedback || 'Feedback'}</a>
        </div>
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
