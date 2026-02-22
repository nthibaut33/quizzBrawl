import { useState, useEffect } from 'react'
import { getRankProgress, RANK_THRESHOLDS } from '../../lib/scoring'

const RANK_ICONS = {
  Bois: '🪵',
  Bronze: '🥉',
  Argent: '🥈',
  Or: '🥇',
  Diamant: '💎',
  Légendaire: '🔥',
}

function RankProgress({ score, total = 500 }) {
  const { current, next, percentage, ptsToNext } = getRankProgress(score, total)
  const [fillWidth, setFillWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setFillWidth(percentage), 120)
    return () => clearTimeout(timer)
  }, [percentage])

  // Rangs avec seuils calculés dynamiquement pour l'affichage
  const ranks = RANK_THRESHOLDS.map(r => ({
    ...r,
    icon: RANK_ICONS[r.name],
    minPoints: Math.round(total * r.pct),
  }))

  const message = !next
    ? 'Rang maximum atteint ! 🔥'
    : `encore ${ptsToNext} pt${ptsToNext > 1 ? 's' : ''} pour ${next.name}`

  return (
    <div className="rank-progress">
      <div className="rank-progress__steps">
        {ranks.map(rank => {
          const reached = score >= rank.minPoints
          const isCurrent = rank.name === current.name
          return (
            <div
              key={rank.name}
              className={[
                'rank-progress__step',
                isCurrent ? 'rank-progress__step--current' : '',
                reached ? 'rank-progress__step--reached' : 'rank-progress__step--locked',
              ].join(' ')}
              style={reached ? { color: rank.color } : {}}
            >
              <span className="rank-progress__step-icon">{rank.icon}</span>
              <span className="rank-progress__step-pts">{rank.minPoints}</span>
            </div>
          )
        })}
      </div>

      <div className="rank-progress__bar-track">
        <div
          className="rank-progress__bar-fill"
          style={{ width: `${fillWidth}%`, background: current.color }}
        />
      </div>

      <p
        className="rank-progress__message"
        style={{ color: next ? next.color : current.color }}
      >
        {message}
      </p>
    </div>
  )
}

export default RankProgress
