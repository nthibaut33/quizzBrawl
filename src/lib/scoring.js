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
 * Calcule le bonus de streak.
 * @param {number} streak - Nombre de bonnes réponses consécutives (après mise à jour)
 * @returns {number} Bonus à ajouter
 */
export function getStreakBonus(streak) {
  if (streak >= 5) return 15
  if (streak >= 3) return 5
  return 0
}

/**
 * Retourne le label de streak à afficher (ou null si pas de streak notable).
 * @param {number} streak
 * @returns {{ label: string, level: number } | null}
 */
export function getStreakLabel(streak) {
  if (streak >= 5) return { label: `x${streak} ON FIRE!`, level: 2 }
  if (streak >= 3) return { label: `x${streak} Combo!`, level: 1 }
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
 * Calcule le résultat complet d'une réponse et met à jour le state de scoring.
 * @param {boolean} correct
 * @param {number} basePoints - Points de base de la question
 * @param {number} currentStreak - Streak actuelle avant cette réponse
 * @param {number} currentScore - Score actuel avant cette réponse
 * @returns {{ points: number, bonus: number, newStreak: number, newScore: number, streakLabel: { label: string, level: number } | null }}
 */
export function processAnswer(correct, basePoints, currentStreak, currentScore) {
  const newStreak = correct ? currentStreak + 1 : 0
  const points = calculatePoints(correct, basePoints)
  const bonus = correct ? getStreakBonus(newStreak) : 0
  const total = points + bonus
  const newScore = currentScore + total
  const streakLabel = correct ? getStreakLabel(newStreak) : null

  return { points, bonus, newStreak, newScore, streakLabel }
}
