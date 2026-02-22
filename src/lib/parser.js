/**
 * Parse un quiz au format Markdown et retourne un objet structuré.
 * @param {string} markdown
 * @returns {{ title: string, description: string, questions: Array } | { errors: string[] }}
 */
export function parseQuiz(markdown) {
  const errors = []
  const lines = markdown.split('\n')

  let title = ''
  let description = ''
  const questions = []
  let current = null // question en cours de parsing

  function finalizeQuestion() {
    if (!current) return

    if (current.type === 'open') {
      if (!current.expected) {
        errors.push(`Question "${current.text}" : réponse attendue manquante (= réponse)`)
      }
    } else {
      if (current.answers.length === 0) {
        errors.push(`Question "${current.text}" : aucune réponse définie`)
      }
      const correctCount = current.answers.filter(a => a.correct).length
      if (correctCount === 0) {
        errors.push(`Question "${current.text}" : aucune bonne réponse ([x]) définie`)
      }
      current.type = correctCount > 1 ? 'multiple' : 'single'
    }

    questions.push(current)
    current = null
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Titre du quiz : # Titre
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
      if (!title) {
        title = trimmed.slice(2).trim()
      }
      continue
    }

    // Nouvelle question : ## Question N : texte
    if (trimmed.startsWith('## ')) {
      finalizeQuestion()
      const text = trimmed.slice(3).trim()
        // Retirer le préfixe "Question N :" optionnel
        .replace(/^Question\s+\d+\s*:\s*/i, '')
      current = {
        text,
        type: null,
        answers: [],
        expected: null,
        points: 10,
        time: 30,
        explanation: null,
      }
      continue
    }

    // Réponse libre : = réponse
    if (trimmed.startsWith('= ') && current) {
      current.type = 'open'
      current.expected = trimmed.slice(2).trim()
      continue
    }

    // Réponse à choix : - [x] ou - [ ]
    const choiceMatch = trimmed.match(/^-\s*\[(x| )\]\s*(.+)/)
    if (choiceMatch && current) {
      current.answers.push({
        text: choiceMatch[2].trim(),
        correct: choiceMatch[1] === 'x',
      })
      continue
    }

    // Métadonnées en blockquote : > Clé: Valeur
    if (trimmed.startsWith('> ') && current) {
      const meta = trimmed.slice(2).trim()

      const pointsMatch = meta.match(/^Points:\s*(\d+)/i)
      if (pointsMatch) {
        current.points = parseInt(pointsMatch[1], 10)
        continue
      }

      const timeMatch = meta.match(/^Temps:\s*(\d+)/i)
      if (timeMatch) {
        current.time = parseInt(timeMatch[1], 10)
        continue
      }

      const explMatch = meta.match(/^Explication:\s*(.+)/i)
      if (explMatch) {
        current.explanation = explMatch[1].trim()
        continue
      }
    }

    // Blockquote hors question = description du quiz
    if (trimmed.startsWith('> ') && !current && title && !description) {
      const content = trimmed.slice(2).trim()
      // Ignorer les lignes de métadonnées (Difficulté, etc.)
      if (!content.match(/^(Difficulté|Points|Temps|Explication):/i)) {
        description = content
      }
      continue
    }
  }

  // Finaliser la dernière question
  finalizeQuestion()

  if (!title) {
    errors.push('Titre manquant : ajoutez "# Titre du Quiz" en début de fichier')
  }

  if (questions.length === 0) {
    errors.push('Aucune question trouvée : ajoutez des questions avec "## Question : texte"')
  }

  if (errors.length > 0) {
    return { errors }
  }

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)
  return { title, description, questions, totalPoints }
}
