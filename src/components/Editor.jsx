import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseQuiz } from '../lib/parser'
import MathText from './ui/MathText'

function Editor() {
  const [markdown, setMarkdown] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [exampleTemplate, setExampleTemplate] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('./example.md')
      .then(r => r.text())
      .then(text => setExampleTemplate(text))
      .catch(() => {})
  }, [])

  const parsed = useMemo(() => parseQuiz(markdown), [markdown])
  const hasErrors = !!parsed.errors
  const questions = parsed.questions || []
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)
  const canPlay = questions.length > 0

  function handlePlay() {
    if (!canPlay) return
    navigate('/game', { state: { markdown } })
  }

  return (
    <div className="editor">
      <div className="editor__header">
        <h1 className="editor__title">Éditeur de Quiz</h1>
        <div className="editor__actions">
          <button
            className="btn btn--outline"
            onClick={() => exampleTemplate && setMarkdown(exampleTemplate)}
            disabled={!exampleTemplate}
          >
            Quiz exemple
          </button>
          <button
            className="btn btn--secondary"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Masquer' : 'Aperçu'}
          </button>
          <button
            className="btn btn--primary"
            onClick={handlePlay}
            disabled={!canPlay}
          >
            Jouer !
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="editor__preview">
          {hasErrors ? (
            <div className="preview-card preview-card--error">
              <h2 className="preview-card__title preview-card__title--error">
                Erreurs dans le quiz
              </h2>
              <ul className="preview-card__errors">
                {parsed.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="preview-card">
              <h2 className="preview-card__title">
                {parsed.title || 'Sans titre'}
              </h2>
              {parsed.description && (
                <p className="preview-card__desc">{parsed.description}</p>
              )}
              <div className="preview-card__stats">
                <span className="preview-card__stat">
                  {questions.length} question{questions.length > 1 ? 's' : ''}
                </span>
                <span className="preview-card__stat">
                  {totalPoints} pts au total
                </span>
              </div>
              <div className="preview-card__questions">
                {questions.map((q, i) => (
                  <div key={i} className="preview-question">
                    <span className="preview-question__num">Q{i + 1}</span>
                    <span className="preview-question__text"><MathText text={q.text} /></span>
                    <span className={`preview-question__type preview-question__type--${q.type}`}>
                      {q.type === 'single' ? 'Choix unique' : q.type === 'multiple' ? 'Choix multiples' : 'Réponse libre'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <textarea
        className="editor__textarea"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Écris ton quiz en Markdown ici..."
        spellCheck={false}
      />
    </div>
  )
}

export default Editor
