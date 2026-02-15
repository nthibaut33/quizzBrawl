import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRank } from '../lib/scoring'
import RankBadge from './ui/RankBadge'

const CONFETTI_COLORS = ['#e6b800', '#e94560', '#2ecc71', '#b9f2ff', '#ff6b35', '#ffd700']

function Confetti({ count = 40 }) {
  const pieces = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: `${Math.random() * 1.5}s`,
      duration: `${2 + Math.random() * 2}s`,
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }))
  }, [count])

  return (
    <div className="confetti">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti__piece"
          style={{
            left: p.left,
            background: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}

function Results({ quiz, results, score, onReplay }) {
  const navigate = useNavigate()

  const total = quiz.questions.length
  const correctCount = results.filter(r => r.correct).length
  const wrongCount = total - correctCount
  const rank = getRank(score)
  const percentage = Math.round((correctCount / total) * 100)

  const maxStreak = useMemo(() => {
    let max = 0
    let current = 0
    for (const r of results) {
      if (r.correct) {
        current++
        if (current > max) max = current
      } else {
        current = 0
      }
    }
    return max
  }, [results])

  const totalPoints = useMemo(() => {
    return results.reduce((sum, r) => sum + r.points + r.bonus, 0)
  }, [results])

  const showConfetti = percentage >= 50

  return (
    <div className="results">
      {showConfetti && <Confetti />}

      {/* Header */}
      <h1 className="results__title">Quiz terminé !</h1>
      <p className="results__subtitle">{quiz.title}</p>

      {/* Score principal */}
      <div className="results__score">
        <span className="results__score-value">{totalPoints}</span>
        <span className="results__score-label">points</span>
      </div>

      {/* Rank badge avec animation */}
      <RankBadge rank={rank} animated />

      {/* Stats */}
      <div className="results__stats">
        <div className="results__stat results__stat--correct">
          <span className="results__stat-value">{correctCount}</span>
          <span className="results__stat-label">Correctes</span>
        </div>
        <div className="results__stat results__stat--wrong">
          <span className="results__stat-value">{wrongCount}</span>
          <span className="results__stat-label">Fausses</span>
        </div>
        <div className="results__stat results__stat--percent">
          <span className="results__stat-value">{percentage}%</span>
          <span className="results__stat-label">Réussite</span>
        </div>
        {maxStreak >= 3 && (
          <div className="results__stat results__stat--streak">
            <span className="results__stat-value">x{maxStreak}</span>
            <span className="results__stat-label">Meilleur streak</span>
          </div>
        )}
      </div>

      {/* Détail par question */}
      <div className="results__breakdown">
        <h2 className="results__breakdown-title">Détail des réponses</h2>
        {quiz.questions.map((q, i) => {
          const r = results[i]
          return (
            <div key={i} className={`results__question ${r.correct ? 'results__question--correct' : 'results__question--wrong'}`}>
              <span className="results__question-num">Q{i + 1}</span>
              <span className="results__question-text">{q.text}</span>
              <span className="results__question-points">
                {r.correct ? `+${r.points}${r.bonus > 0 ? ` +${r.bonus}` : ''}` : '0'}
              </span>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="results__actions">
        <button className="btn btn--primary" onClick={onReplay}>
          Rejouer
        </button>
        <button className="btn btn--secondary" onClick={() => navigate('/')}>
          Accueil
        </button>
      </div>
    </div>
  )
}

export default Results
