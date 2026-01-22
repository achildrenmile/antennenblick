import { useState } from 'react';
import { useI18n } from '../i18n';

interface Props {
  onClose: () => void;
}

export function Tutorial({ onClose }: Props) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: t.tutorial?.welcome || 'Willkommen bei Antennenblick!',
      text: t.tutorial?.welcomeText || 'Dieses Tool hilft dir zu verstehen, wie deine Antenne abstrahlt. Keine Formeln, keine komplexen Simulationen - nur visuelles, intuitives Lernen.',
    },
    {
      title: t.tutorial?.step1Title || '1. Wähle deine Antenne',
      text: t.tutorial?.step1Text || 'Wähle den Antennentyp, den du hast oder bauen möchtest. Jeder Typ hat andere Eigenschaften.',
    },
    {
      title: t.tutorial?.step2Title || '2. Stelle die Höhe ein',
      text: t.tutorial?.step2Text || 'Die Höhe wird in Metern UND Wellenlängen gemessen. Dieselbe physische Höhe verhält sich auf verschiedenen Bändern unterschiedlich!',
    },
    {
      title: t.tutorial?.step3Title || '3. Wähle das Band',
      text: t.tutorial?.step3Text || 'Verschiedene Bänder haben unterschiedliche Ausbreitungseigenschaften. Niedrigere Bänder (160m-40m) funktionieren besser für NVIS, höhere (20m-6m) für DX.',
    },
    {
      title: t.tutorial?.step4Title || '4. Lies die Diagramme',
      text: t.tutorial?.step4Text || 'Das linke Diagramm zeigt die Draufsicht (wohin das Signal horizontal geht). Das rechte zeigt die Seitenansicht (wie steil das Signal nach oben geht).',
    },
    {
      title: t.tutorial?.step5Title || '5. Verstehe die Ergebnisse',
      text: t.tutorial?.step5Text || 'Das Erklärungsfeld sagt dir, wofür dein Setup am besten geeignet ist - NVIS, regional oder DX-Verbindungen.',
    },
    {
      title: t.tutorial?.step5bTitle || '5b. Spezifikationen & Parameter',
      text: t.tutorial?.step5bText || 'Die Spezifikationen zeigen Länge, Gewinn und Impedanz für deine Antenne. Bei manchen Antennen (z.B. Inverted-V, Vertikale) kannst du zusätzliche Parameter wie Schenkelwinkel oder Radialanzahl einstellen.',
    },
    {
      title: t.tutorial?.step6Title || '6. Export & Teilen',
      text: t.tutorial?.step6Text || 'Mit "Export" kannst du die Diagramme als Bild speichern. "Teilen" erstellt einen Link zu deiner aktuellen Konfiguration.',
    },
    {
      title: t.tutorial?.step7Title || '7. Antennen vergleichen',
      text: t.tutorial?.step7Text || 'Klicke auf "Vergleichen" um zwei Antennen nebeneinander zu sehen. Perfekt um verschiedene Optionen zu evaluieren.',
    },
    {
      title: t.tutorial?.step8Title || '8. Rechner & Karte',
      text: t.tutorial?.step8Text || 'Der "Rechner" berechnet Antennenlängen für verschiedene Frequenzen. Die "Karte" zeigt deine geschätzte Reichweite auf einer Weltkarte.',
    },
    {
      title: t.tutorial?.step9Title || '9. Solar-Daten',
      text: t.tutorial?.step9Text || 'Unter "Solar" findest du aktuelle Sonnenaktivitätsdaten (SFI, K-Index) und Band-Bedingungen - wichtig für DX!',
    },
    {
      title: t.tutorial?.step10Title || '10. Favoriten & Quiz',
      text: t.tutorial?.step10Text || 'Speichere deine Lieblingskonfigurationen als "Favoriten". Mit dem "Quiz" kannst du dein Wissen über Antennen testen.',
    },
  ];

  const isLast = step === steps.length - 1;

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-modal">
        <h2>{t.tutorial?.title || 'Schnellstart-Anleitung'}</h2>
        <div className="tutorial-content">
          <h3>{steps[step].title}</h3>
          <p>{steps[step].text}</p>
        </div>
        <div className="tutorial-progress">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`progress-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
            />
          ))}
        </div>
        <div className="tutorial-actions">
          {step > 0 && (
            <button className="tutorial-back" onClick={() => setStep(s => s - 1)}>
              &larr;
            </button>
          )}
          {isLast ? (
            <button className="tutorial-close" onClick={onClose}>
              {t.tutorial?.gotIt || 'Verstanden!'}
            </button>
          ) : (
            <button className="tutorial-next" onClick={() => setStep(s => s + 1)}>
              &rarr;
            </button>
          )}
        </div>
        <button className="tutorial-skip" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
}
