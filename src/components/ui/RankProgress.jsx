import { useState, useEffect } from 'react'
import { getRankProgress } from '../../lib/scoring'

const RANK_ICONS = {
  Bois: '🪵',
  Bronze: '🥉',
  Argent: '🥈',
  Or: '🥇',
  Diamant: '💎',
  Légendaire: '🔥',
}

const RANKS_ASC = [
  { name: 'Bois',       color: '#8b6914', minPoints: 0 },
  { name: 'Bronze',     color: '#cd7f32', minPoints: 50 },
  { name: 'Argent',     color: '#c0c0c0', minPoints: 100 },
  { name: 'Or',         color: '#ffd700', minPoints: 200 },
  { name: 'Diamant',    color: '#b9f2ff', minPoints: 350 },
  { name: 'Légendaire', color: '#ff6f00', minPoints: 500 },
]

function RankProgress({ score }) {
  const { current, next, percentage, ptsToNext } = getRankProgress(score)
  const [fillWidth, setFillWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setFillWidth(percentage), 120)
    return () => clearTimeout(timer)
  }, [percentage])

  const message = !next
    ? 'Rang maximum atteint ! 🔥'
    : `encore ${ptsToNext} pt${ptsToNext > 1 ? 's' : ''} pour ${next.name}`

  return (
    <div className="rank-progress">
      <div className="rank-progress__steps">
        {RANKS_ASC.map(rank => {
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
              <span className="rank-progress__step-icon">
                {RANK_ICONS[rank.name]}
              </span>
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
