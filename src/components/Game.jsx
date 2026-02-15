import { useState, useMemo, memo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { parseQuiz } from '../lib/parser'
import { useGameEngine } from '../hooks/useGameEngine'
import AnswerCard from './ui/AnswerCard'
import OpenAnswer from './ui/OpenAnswer'
import Results from './Results'

// Memoized StreakBadge component to prevent unnecessary re-renders
const StreakBadge = memo(({ streak }) => {
  if (streak < 3) return null
  
  const isFire = streak >= 5
  return (
    <span 
      className={`game__streak ${isFire ? 'game__streak--fire' : 'game__streak--combo'}`}
    >
      {isFire ? `x${streak} ON FIRE!` : `x${streak} Combo!`}
    </span>
  )
})

function Game() {
  const location = useLocation()
  const navigate = useNavigate()
  const markdown = location.state?.markdown

  const parsed = useMemo(() => markdown ? parseQuiz(markdown) : null, [markdown])
  const quiz = useMemo(() => parsed?.errors ? null : parsed, [parsed])

  const engine = useGameEngine(quiz)
  const { state, question, questionIndex, total, results, score, streak, lastPoints, start, answer, next } = engine

  // Pour les questions à choix multiples, on stocke la sélection locale
  const [multiSelection, setMultiSelection] = useState(new Set())

  // En jeu : playing / answered
  const revealed = state === 'answered'
  const lastResult = revealed ? results[results.length - 1] : null
  const progress = ((questionIndex + 1) / total) * 100

  function handleSingleSelect(index) {
    if (revealed) return
    answer(index)
  }

  function handleMultiToggle(index) {
    if (revealed) return
    setMultiSelection(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function handleMultiValidate() {
    if (revealed || multiSelection.size === 0) return
    answer(multiSelection)
  }

  function handleNext() {
    setMultiSelection(new Set())
    next()
  }

  // Pas de markdown → retour éditeur
  if (!markdown || !quiz) {
    return (
      <div className="page-placeholder">
        <div className="page-placeholder__icon">&#9889;</div>
        <h1 className="page-placeholder__title">Aucun quiz chargé</h1>
        <p className="page-placeholder__subtitle">
          Lance un quiz depuis l'éditeur pour commencer !
        </p>
        <button className="btn btn--primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/editor')}>
          Aller à l'éditeur
        </button>
      </div>
    )
  }

  // Écran prêt
  if (state === 'ready') {
    return (
      <div className="game-ready">
        <h1 className="game-ready__title">{quiz.title}</h1>
        {quiz.description && <p className="game-ready__desc">{quiz.description}</p>}
        <p className="game-ready__info">{total} question{total > 1 ? 's' : ''}</p>
        <button className="btn btn--primary" onClick={start}>
          C'est parti !
        </button>
      </div>
    )
  }

  // Terminé → écran de résultats
  if (state === 'finished') {
    return (
      <Results
        quiz={quiz}
        results={results}
        score={score}
        onReplay={start}
      />
    )
  }

  return (
    <div className="game">
      {/* Progress bar */}
      <div className="game__progress">
        <div className="game__progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="game__header">
        <span className="game__counter">Question {questionIndex + 1} / {total}</span>
        <StreakBadge streak={streak} />
        <span className="game__score">
          <span className="game__score-icon">&#9733;</span>
          {score}
        </span>
      </div>

      {/* Question */}
      <div className="game__question">
        <span className="game__question-text">{question.text}</span>
      </div>

      {/* Réponses */}
      <div className="game__answers">
        {question.type === 'open' ? (
          <OpenAnswer
            revealed={revealed}
            expected={question.expected}
            onSubmit={(val) => answer(val)}
          />
        ) : question.type === 'single' ? (
          question.answers.map((a, i) => (
            <AnswerCard
              key={i}
              text={a.text}
              index={i}
              type="single"
              selected={lastResult?.answer === i}
              correct={a.correct}
              revealed={revealed}
              onSelect={handleSingleSelect}
            />
          ))
        ) : (
          <>
            {question.answers.map((a, i) => (
              <AnswerCard
                key={i}
                text={a.text}
                index={i}
                type="multiple"
                selected={revealed ? lastResult.answer.has(i) : multiSelection.has(i)}
                correct={a.correct}
                revealed={revealed}
                onSelect={handleMultiToggle}
              />
            ))}
            {!revealed && (
              <button
                className="btn btn--primary game__validate"
                onClick={handleMultiValidate}
                disabled={multiSelection.size === 0}
              >
                Valider
              </button>
            )}
          </>
        )}
      </div>

      {/* Feedback + points gagnés */}
      {revealed && (
        <div className={`game__feedback ${lastResult.correct ? 'game__feedback--correct' : 'game__feedback--wrong'}`}>
          <span className="game__feedback-label">
            {lastResult.correct ? 'Bonne réponse !' : 'Mauvaise réponse'}
          </span>
          {lastPoints && (lastPoints.points > 0 || lastPoints.bonus > 0) && (
            <span className="game__points-popup">
              +{lastPoints.points}
              {lastPoints.bonus > 0 && <span className="game__points-bonus"> +{lastPoints.bonus} streak</span>}
            </span>
          )}
          {question.explanation && (
            <p className="game__feedback-explanation">{question.explanation}</p>
          )}
        </div>
      )}

      {/* Bouton Suivant */}
      {revealed && (
        <button className="btn btn--primary game__next" onClick={handleNext}>
          {questionIndex + 1 < total ? 'Suivant' : 'Voir les résultats'}
        </button>
      )}
    </div>
  )
}

export default Game
