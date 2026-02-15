import { useState, useEffect } from 'react'

const RANK_ICONS = {
  Bois: '🪵',
  Bronze: '🥉',
  Argent: '🥈',
  Or: '🥇',
  Diamant: '💎',
  Légendaire: '🔥',
}

function RankBadge({ rank, animated = true }) {
  const [revealed, setRevealed] = useState(!animated)

  useEffect(() => {
    if (!animated) return
    const timer = setTimeout(() => setRevealed(true), 600)
    return () => clearTimeout(timer)
  }, [animated])

  const icon = RANK_ICONS[rank.name] || '🏆'

  return (
    <div className={`rank-badge ${revealed ? 'rank-badge--revealed' : ''}`}>
      <div className="rank-badge__icon">{icon}</div>
      <div className="rank-badge__name" style={{ color: rank.color }}>
        {rank.name}
      </div>
      <div className="rank-badge__glow" style={{ background: rank.color }} />
    </div>
  )
}

export default RankBadge
