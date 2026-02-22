/**
 * Système de points style Brawl Stars.
 * Fonctions pures — aucune dépendance React.
 */

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
 * Détermine le rang en fonction du score total.
 * @param {number} score
 * @returns {{ name: string, nameEn: string, color: string, minPoints: number }}
 */
export function getRank(score) {
  const ranks = [
    { name: 'Légendaire', nameEn: 'Legendary', color: '#ff6f00', minPoints: 500 },
    { name: 'Diamant',    nameEn: 'Diamond',   color: '#b9f2ff', minPoints: 350 },
    { name: 'Or',         nameEn: 'Gold',       color: '#ffd700', minPoints: 200 },
    { name: 'Argent',     nameEn: 'Silver',     color: '#c0c0c0', minPoints: 100 },
    { name: 'Bronze',     nameEn: 'Bronze',     color: '#cd7f32', minPoints: 50 },
    { name: 'Bois',       nameEn: 'Wood',       color: '#8b6914', minPoints: 0 },
  ]

  for (const rank of ranks) {
    if (score >= rank.minPoints) return rank
  }
  return ranks[ranks.length - 1]
}

/**
 * Retourne la progression du joueur dans l'échelle des rangs.
 * @param {number} score
 * @returns {{ current: object, next: object|null, percentage: number, ptsToNext: number }}
 */
export function getRankProgress(score) {
  const ranks = [
    { name: 'Bois',       nameEn: 'Wood',      color: '#8b6914', minPoints: 0 },
    { name: 'Bronze',     nameEn: 'Bronze',     color: '#cd7f32', minPoints: 50 },
    { name: 'Argent',     nameEn: 'Silver',     color: '#c0c0c0', minPoints: 100 },
    { name: 'Or',         nameEn: 'Gold',       color: '#ffd700', minPoints: 200 },
    { name: 'Diamant',    nameEn: 'Diamond',    color: '#b9f2ff', minPoints: 350 },
    { name: 'Légendaire', nameEn: 'Legendary',  color: '#ff6f00', minPoints: 500 },
  ]

  let currentIdx = 0
  for (let i = 0; i < ranks.length; i++) {
    if (score >= ranks[i].minPoints) currentIdx = i
  }

  const current = ranks[currentIdx]
  const next = ranks[currentIdx + 1] || null

  if (!next) return { current, next: null, percentage: 100, ptsToNext: 0 }

  const range = next.minPoints - current.minPoints
  const progress = score - current.minPoints
  const percentage = Math.min(100, Math.round((progress / range) * 100))

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
