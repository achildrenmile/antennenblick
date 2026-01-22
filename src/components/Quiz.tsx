import { useState, useMemo, useCallback } from 'react';
import { useI18n } from '../i18n';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Props {
  onClose: () => void;
}

export function Quiz({ onClose }: Props) {
  const { t } = useI18n();

  const questions = useMemo((): Question[] => [
    {
      id: 'q1',
      question: t.quiz?.q1Question || 'Welche Antennenhöhe (in Wellenlängen) ist am besten für NVIS-Betrieb?',
      options: [
        t.quiz?.q1Opt1 || 'λ/4 (0.25 Wellenlänge)',
        t.quiz?.q1Opt2 || 'λ/2 (0.5 Wellenlänge)',
        t.quiz?.q1Opt3 || '1 λ (eine Wellenlänge)',
        t.quiz?.q1Opt4 || '2 λ (zwei Wellenlängen)',
      ],
      correctIndex: 0,
      explanation: t.quiz?.q1Explanation || 'Für NVIS (steile Abstrahlung) sollte der Dipol niedrig sein - etwa λ/4. Das erzeugt Steilstrahlung, die von der Ionosphäre fast senkrecht zurückkommt.',
    },
    {
      id: 'q2',
      question: t.quiz?.q2Question || 'Was passiert mit dem Abstrahlwinkel, wenn du deinen Dipol höher aufhängst?',
      options: [
        t.quiz?.q2Opt1 || 'Der Winkel wird steiler (mehr NVIS)',
        t.quiz?.q2Opt2 || 'Der Winkel wird flacher (mehr DX)',
        t.quiz?.q2Opt3 || 'Der Winkel bleibt gleich',
        t.quiz?.q2Opt4 || 'Die Antenne strahlt nicht mehr',
      ],
      correctIndex: 1,
      explanation: t.quiz?.q2Explanation || 'Höher = flacher Abstrahlwinkel = besseres DX. Der Boden wirkt als Reflektor, und der Reflexionswinkel ändert sich mit der Höhe.',
    },
    {
      id: 'q3',
      question: t.quiz?.q3Question || 'Welches Band ist am besten für DX bei niedrigem Sonnenfleckenzyklus?',
      options: [
        t.quiz?.q3Opt1 || '10 Meter',
        t.quiz?.q3Opt2 || '20 Meter',
        t.quiz?.q3Opt3 || '40 Meter',
        t.quiz?.q3Opt4 || '80 Meter',
      ],
      correctIndex: 2,
      explanation: t.quiz?.q3Explanation || '40 Meter funktioniert auch bei niedriger Sonnenaktivität gut für DX. 10 und 20 Meter brauchen mehr Sonnenflecken, um die höheren Frequenzen zu reflektieren.',
    },
    {
      id: 'q4',
      question: t.quiz?.q4Question || 'Was ist die "Tote Zone" (Skip Zone)?',
      options: [
        t.quiz?.q4Opt1 || 'Ein Bereich ohne Antennenempfang',
        t.quiz?.q4Opt2 || 'Der Bereich zwischen Bodenwelle und erstem Ionosphärensprung',
        t.quiz?.q4Opt3 || 'Die Nullstellen im Antennendiagramm',
        t.quiz?.q4Opt4 || 'Bereiche mit schlechtem Boden',
      ],
      correctIndex: 1,
      explanation: t.quiz?.q4Explanation || 'Die Tote Zone ist der Bereich, wo die Bodenwelle nicht mehr hinkommt und die Raumwelle noch nicht landet. Mit Steilstrahlung kann man sie verringern.',
    },
    {
      id: 'q5',
      question: t.quiz?.q5Question || 'Warum braucht eine Vertikalantenne gute Radiale?',
      options: [
        t.quiz?.q5Opt1 || 'Für bessere Abstimmung',
        t.quiz?.q5Opt2 || 'Um als künstlicher Boden zu dienen und Verluste zu reduzieren',
        t.quiz?.q5Opt3 || 'Für mehr Gewinn',
        t.quiz?.q5Opt4 || 'Für schmalere Bandbreite',
      ],
      correctIndex: 1,
      explanation: t.quiz?.q5Explanation || 'Radiale bilden einen künstlichen leitfähigen Boden. Ohne sie fließt der Strom durch den schlechten Erdboden und wird in Wärme umgewandelt statt abgestrahlt.',
    },
    {
      id: 'q6',
      question: t.quiz?.q6Question || 'Was ist typisch für eine Yagi-Antenne?',
      options: [
        t.quiz?.q6Opt1 || 'Omnidirektionale Abstrahlung',
        t.quiz?.q6Opt2 || 'Bündelung in eine Richtung mit Gewinn',
        t.quiz?.q6Opt3 || 'Steile Abstrahlung für NVIS',
        t.quiz?.q6Opt4 || 'Funktioniert ohne Höhe',
      ],
      correctIndex: 1,
      explanation: t.quiz?.q6Explanation || 'Eine Yagi bündelt das Signal in eine Richtung durch ihre Direktoren und Reflektoren. Das erhöht den effektiven Gewinn in diese Richtung.',
    },
    {
      id: 'q7',
      question: t.quiz?.q7Question || 'Welcher K-Index ist gut für DX?',
      options: [
        t.quiz?.q7Opt1 || 'K = 0-2 (ruhig)',
        t.quiz?.q7Opt2 || 'K = 3-4 (unsettled)',
        t.quiz?.q7Opt3 || 'K = 5-6 (storm)',
        t.quiz?.q7Opt4 || 'K = 7+ (severe storm)',
      ],
      correctIndex: 0,
      explanation: t.quiz?.q7Explanation || 'Niedrige K-Werte (0-2) bedeuten ruhige geomagnetische Bedingungen = stabile Ionosphäre = gute Reflexion. Hohe K-Werte stören die Ausbreitung.',
    },
    {
      id: 'q8',
      question: t.quiz?.q8Question || 'Was bedeutet ein hoher SFI (Solar Flux Index)?',
      options: [
        t.quiz?.q8Opt1 || 'Schlechte Bedingungen auf allen Bändern',
        t.quiz?.q8Opt2 || 'Bessere Bedingungen auf höheren Bändern (10m-20m)',
        t.quiz?.q8Opt3 || 'Nur Bodenwelle möglich',
        t.quiz?.q8Opt4 || 'Starkes QRM',
      ],
      correctIndex: 1,
      explanation: t.quiz?.q8Explanation || 'Hoher SFI (>100) bedeutet mehr Sonnenaktivität = dichtere Ionosphäre = höhere MUF = bessere Reflexion auf höheren Frequenzen.',
    },
    {
      id: 'q9',
      question: t.quiz?.q9Question || 'Welcher Abstrahlwinkel ist für DX-Verbindungen über 3000 km optimal?',
      options: [
        t.quiz?.q9Opt1 || '5-15 Grad',
        t.quiz?.q9Opt2 || '30-45 Grad',
        t.quiz?.q9Opt3 || '60-75 Grad',
        t.quiz?.q9Opt4 || '80-90 Grad',
      ],
      correctIndex: 0,
      explanation: t.quiz?.q9Explanation || 'Flache Winkel (5-15°) erlauben weite Sprünge. Das Signal streift die Ionosphäre und wird weit entfernt reflektiert. Je flacher, desto weiter.',
    },
    {
      id: 'q10',
      question: t.quiz?.q10Question || 'Was ist der Vorteil einer Magnetic Loop Antenne?',
      options: [
        t.quiz?.q10Opt1 || 'Hoher Gewinn',
        t.quiz?.q10Opt2 || 'Breitbandiger Betrieb',
        t.quiz?.q10Opt3 || 'Kompakte Größe und rauscharmer Empfang',
        t.quiz?.q10Opt4 || 'Einfache Abstimmung',
      ],
      correctIndex: 2,
      explanation: t.quiz?.q10Explanation || 'Magnetic Loops sind klein (gut für beschränkten Platz) und empfangen weniger lokales Rauschen. Der Nachteil: sehr schmalbandig und kritische Abstimmung.',
    },
  ], [t.quiz]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = useCallback((index: number) => {
    if (selectedAnswer !== null) return; // Already answered
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === questions[currentQuestion].correctIndex) {
      setScore((s) => s + 1);
    }
  }, [selectedAnswer, questions, currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((c) => c + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  }, [currentQuestion, questions.length]);

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
  }, []);

  const question = questions[currentQuestion];
  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
        <div className="quiz-header">
          <h2>{t.quiz?.title || 'Quiz - Teste dein Wissen'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {finished ? (
          <div className="quiz-results">
            <div className="quiz-score">
              <span className="score-number">{score}/{questions.length}</span>
              <span className="score-label">{t.quiz?.correct || 'richtig'}</span>
            </div>
            <div className="quiz-message">
              {score === questions.length
                ? t.quiz?.perfect || 'Perfekt! Du bist ein Antennen-Experte!'
                : score >= questions.length * 0.7
                  ? t.quiz?.good || 'Sehr gut! Du kennst dich gut aus.'
                  : score >= questions.length * 0.5
                    ? t.quiz?.ok || 'Nicht schlecht! Weiter üben.'
                    : t.quiz?.tryAgain || 'Versuch es nochmal!'}
            </div>
            <div className="quiz-result-actions">
              <button onClick={handleRestart} className="restart-button">
                {t.quiz?.restart || 'Nochmal spielen'}
              </button>
              <button onClick={onClose} className="close-quiz-button">
                {t.quiz?.close || 'Schließen'}
              </button>
            </div>
          </div>
        ) : (
          <div className="quiz-content">
            <div className="quiz-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="progress-text">
                {t.quiz?.question || 'Frage'} {currentQuestion + 1} / {questions.length}
              </span>
            </div>

            <div className="quiz-question">
              <p>{question.question}</p>
            </div>

            <div className="quiz-options">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  className={`quiz-option ${
                    selectedAnswer === index
                      ? index === question.correctIndex
                        ? 'correct'
                        : 'incorrect'
                      : ''
                  } ${
                    showExplanation && index === question.correctIndex ? 'correct-answer' : ''
                  }`}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className="quiz-explanation">
                <p>{question.explanation}</p>
              </div>
            )}

            <div className="quiz-actions">
              {selectedAnswer !== null && (
                <button onClick={handleNext} className="next-button">
                  {currentQuestion < questions.length - 1
                    ? t.quiz?.next || 'Nächste Frage'
                    : t.quiz?.showResult || 'Ergebnis anzeigen'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
