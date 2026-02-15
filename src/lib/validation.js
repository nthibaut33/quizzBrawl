/**
 * Normalise une chaîne pour la comparaison :
 * - Conversion en String
 * - Suppression des espaces au début/fin
 * - Conversion en minuscules
 * - Remplacement de tous les caractères de ponctuation par des espaces
 * - Suppression des caractères spéciaux restants
 * - Normalisation des espaces multiples
 */
export function normalizeAnswer(answer) {
  return String(answer)
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')                 // Remplace tous les caractères spéciaux par des espaces (tirets, @, ., etc.)
    .replace(/\s+/g, ' ')                     // Normalise les espaces multiples en un seul
    .trim()                                    // Re-trim après les remplacements
}

/**
 * Valide une réponse ouverte (texte libre)
 * @param {string} userAnswer - Réponse de l'utilisateur
 * @param {string} expectedAnswer - Réponse attendue
 * @returns {boolean} - true si la réponse est correcte
 */
export function validateOpenAnswer(userAnswer, expectedAnswer) {
  return normalizeAnswer(userAnswer) === normalizeAnswer(expectedAnswer)
}

/**
 * Valide une réponse à choix unique
 * @param {number} userAnswer - Index de la réponse sélectionnée
 * @param {Array} answers - Tableau des réponses possibles
 * @returns {boolean} - true si la réponse est correcte
 */
export function validateSingleAnswer(userAnswer, answers) {
  return answers[userAnswer]?.correct === true
}

/**
 * Valide une réponse à choix multiples
 * @param {Set<number>} userSelection - Set des index sélectionnés
 * @param {Array} answers - Tableau des réponses possibles
 * @returns {boolean} - true si la sélection est correcte
 */
export function validateMultipleAnswer(userSelection, answers) {
  const correctSet = new Set(
    answers
      .map((a, i) => (a.correct ? i : -1))
      .filter(i => i !== -1)
  )

  return (
    userSelection.size === correctSet.size &&
    [...userSelection].every(i => correctSet.has(i))
  )
}

/**
 * Valide une réponse selon le type de question
 * @param {Object} question - Objet question
 * @param {*} userAnswer - Réponse de l'utilisateur
 * @returns {boolean} - true si la réponse est correcte
 */
export function validateAnswer(question, userAnswer) {
  switch (question.type) {
    case 'open':
      return validateOpenAnswer(userAnswer, question.expected)
    case 'single':
      return validateSingleAnswer(userAnswer, question.answers)
    case 'multiple':
      return validateMultipleAnswer(userAnswer, question.answers)
    default:
      return false
  }
}
