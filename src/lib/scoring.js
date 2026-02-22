/**
 * Système de points style Brawl Stars.
 * Fonctions pures — aucune dépendance React.
 */

/**
 * Seuils des rangs exprimés en pourcentage du total du quiz.
 * Ordre croissant (Bois → Légendaire).
 */
export const RANK_THRESHOLDS = [
  { name: 'Bois',       nameEn: 'Wood',      color: '#8b6914', pct: 0.0 },
  { name: 'Bronze',     nameEn: 'Bronze',     color: '#cd7f32', pct: 0.1 },
  { name: 'Argent',     nameEn: 'Silver',     color: '#c0c0c0', pct: 0.2 },
  { name: 'Or',         nameEn: 'Gold',       color: '#ffd700', pct: 0.4 },
  { name: 'Diamant',    nameEn: 'Diamond',    color: '#b9f2ff', pct: 0.7 },
  { name: 'Légendaire', nameEn: 'Legendary',  color: '#ff6f00', pct: 1.0 },
]

/**
 * Calcule les points gagnés pour une réponse.
 * @param {boolean} correct - La réponse est-elle correcte ?
 * @param {number} basePoints - Points de base de la question (défaut 10)
 * @returns {number}
 */
export function calculatePoints(correct, basePoints = 10) {
  if (!correct) return 0
  return basePoints
}

/**
 * Retourne le multiplicateur de streak selon la série en cours.
 * @param {number} streak - Nombre de bonnes réponses consécutives (après cette réponse)
 * @returns {number} Multiplicateur (0, 0.2 ou 0.5)
 */
export function getStreakMultiplier(streak) {
  if (streak >= 5) return 0.5
  if (streak >= 3) return 0.2
  return 0
}

/**
 * Retourne le label d'affichage de streak.
 * @param {number} streak
 * @returns {string|null}
 */
export function getStreakLabel(streak) {
  if (streak >= 5) return 'x5 ON FIRE!'
  if (streak >= 3) return 'x3 Combo!'
  return null
}

/**
 * Détermine le rang en fonction du score et du total du quiz.
 * @param {number} score
 * @param {number} total - Total de points du quiz (défaut 500)
 * @returns {{ name: string, nameEn: string, color: string, pct: number, minPoints: number }}
 */
export function getRank(score, total = 500) {
  // Itération décroissante : on retourne le rang le plus haut atteint
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    const rank = RANK_THRESHOLDS[i]
    const minPoints = Math.round(total * rank.pct)
    if (score >= minPoints) {
      return { ...rank, minPoints }
    }
  }
  const bois = RANK_THRESHOLDS[0]
  return { ...bois, minPoints: 0 }
}

/**
 * Retourne la progression du joueur dans l'échelle des rangs.
 * @param {number} score
 * @param {number} total - Total de points du quiz (défaut 500)
 * @returns {{ current: object, next: object|null, percentage: number, ptsToNext: number }}
 */
export function getRankProgress(score, total = 500) {
  const ranks = RANK_THRESHOLDS.map(r => ({ ...r, minPoints: Math.round(total * r.pct) }))

  let currentIdx = 0
  for (let i = 0; i < ranks.length; i++) {
    if (score >= ranks[i].minPoints) currentIdx = i
  }

  const current = ranks[currentIdx]
  const next = ranks[currentIdx + 1] || null

  if (!next) return { current, next: null, percentage: 100, ptsToNext: 0 }

  const range = next.minPoints - current.minPoints
  const progress = score - current.minPoints
  const percentage = range > 0 ? Math.min(100, Math.round((progress / range) * 100)) : 100

  return { current, next, percentage, ptsToNext: next.minPoints - score }
}

/**
 * Calcule le résultat complet d'une réponse et met à jour le state de scoring.
 * @param {boolean} correct
 * @param {number} basePoints - Points de base de la question
 * @param {number} currentStreak - Streak avant cette réponse
 * @param {number} currentScore - Score actuel avant cette réponse
 * @returns {{ points: number, bonus: number, newStreak: number, newScore: number, streakLabel: string|null }}
 */
export function processAnswer(correct, basePoints, currentStreak, currentScore) {
  const points = calculatePoints(correct, basePoints)
  const newStreak = correct ? currentStreak + 1 : 0
  const multiplier = correct ? getStreakMultiplier(newStreak) : 0
  const bonus = Math.round(points * multiplier)
  const newScore = currentScore + points + bonus
  const streakLabel = correct ? getStreakLabel(newStreak) : null

  return { points, bonus, newStreak, newScore, streakLabel }
}
