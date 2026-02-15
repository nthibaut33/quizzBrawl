import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRank } from '../lib/scoring'
import RankBadge from './ui/RankBadge'

const CONFETTI_COLORS = ['#e6b800', '#e94560', '#2ecc71', '#b9f2ff', '#ff6b35', '#ffd700']

function Confetti({ count = 40 }) {
  const pieces = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`, // eslint-disable-line react-hooks/purity
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: `${Math.random() * 1.5}s`, // eslint-disable-line react-hooks/purity
      duration: `${2 + Math.random() * 2}s`, // eslint-disable-line react-hooks/purity
      size: 6 + Math.random() * 8, // eslint-disable-line react-hooks/purity
      rotation: Math.random() * 360, // eslint-disable-line react-hooks/purity
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

      {/* Échelle des rangs */}
      <div className="rank-ladder">
        <h3 className="rank-ladder__title">Échelle des rangs</h3>
        <div className="rank-ladder__tiers">
          {[
            { name: 'Légendaire', icon: '👑', minPoints: 500, color: '#ff6f00' },
            { name: 'Diamant', icon: '💎', minPoints: 350, color: '#b9f2ff' },
            { name: 'Or', icon: '🥇', minPoints: 200, color: '#ffd700' },
            { name: 'Argent', icon: '🥈', minPoints: 100, color: '#c0c0c0' },
            { name: 'Bronze', icon: '🥉', minPoints: 50, color: '#cd7f32' },
            { name: 'Bois', icon: '🪵', minPoints: 0, color: '#8b6914' },
          ].map((tier, i, arr) => {
            const isCurrentRank = rank.name === tier.name
            const maxPoints = i > 0 ? arr[i - 1].minPoints - 1 : '∞'
            return (
              <div
                key={tier.name}
                className={`rank-tier ${isCurrentRank ? 'rank-tier--current' : ''}`}
                style={{ '--tier-color': tier.color }}
              >
                <span className="rank-tier__icon">{tier.icon}</span>
                <span className="rank-tier__name">{tier.name}</span>
                <span className="rank-tier__range">
                  {tier.minPoints} - {maxPoints} pts
                </span>
                {isCurrentRank && <span className="rank-tier__badge">Vous êtes ici</span>}
              </div>
            )
          })}
        </div>
      </div>

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
