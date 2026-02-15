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
 * @param {number} currentScore - Score actuel avant cette réponse
 * @returns {{ points: number, newScore: number }}
 */
export function processAnswer(correct, basePoints, currentScore) {
  const points = calculatePoints(correct, basePoints)
  const newScore = currentScore + points

  return { points, newScore }
}
