import { useState, useEffect, useRef } from 'react'

function Tutorial() {
  const [rulesContent, setRulesContent] = useState('')
  const [copied, setCopied] = useState(false)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    fetch(`${import.meta.env.BASE_URL}rules.md`)
      .then(r => r.ok ? r.text() : '')
      .then(text => setRulesContent(text))
      .catch(() => setRulesContent(''))
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(rulesContent).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="tutorial">
      <div className="tutorial__header">
        <h1 className="tutorial__title">Générer des quiz avec une IA</h1>
        <p className="tutorial__intro">
          Pas envie d'écrire le Markdown à la main ? Utilise une IA pour transformer n'importe quelle leçon en quiz jouable !
        </p>
      </div>

      <div className="tutorial__section">
        <h2 className="tutorial__section-title">Comment ça marche ?</h2>
        <div className="step-list">
          <div className="step-card">
            <span className="step-card__num step-card__num--blue">1</span>
            <div>
              <strong className="step-card__title">Copie les règles</strong>
              <p className="step-card__desc">
                Copie le contenu des règles ci-dessous et colle-le au début de ta conversation avec l'IA. Ces règles indiquent le format exact pour générer un quiz compatible.
              </p>
            </div>
          </div>
          <div className="step-card">
            <span className="step-card__num step-card__num--blue">2</span>
            <div>
              <strong className="step-card__title">Colle ta leçon</strong>
              <p className="step-card__desc">
                Dans la même conversation, ajoute le contenu de ta leçon (notes de cours, résumé, chapitre…) et demande un quiz.
              </p>
            </div>
          </div>
          <div className="step-card">
            <span className="step-card__num step-card__num--blue">3</span>
            <div>
              <strong className="step-card__title">Copie → Colle → Joue</strong>
              <p className="step-card__desc">
                Copie le Markdown généré par l'IA, colle-le dans l'éditeur QuizzBrawl et lance la partie !
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="tutorial__section">
        <div className="tutorial__rules-header">
          <h2 className="tutorial__section-title">Règles de génération (rules.md)</h2>
          {rulesContent && (
            <button
              className="btn btn--primary btn--small"
              onClick={handleCopy}
            >
              {copied ? 'Copié !' : 'Copier'}
            </button>
          )}
        </div>
        {rulesContent && (
          <pre className="tutorial__rules-content">{rulesContent}</pre>
        )}
      </div>

      <div className="tutorial__section">
        <h2 className="tutorial__section-title">Exemple de prompt</h2>
        <pre className="code-block">{`[Colle ici le contenu de rules.md]

Voici ma leçon :
"""
La Révolution française commence en 1789 avec
la prise de la Bastille. Les causes principales
sont la crise financière, les inégalités sociales
et l'influence des Lumières.
"""

Génère un quiz de 8 questions, difficulté ★★★,
en variant les types de questions.`}</pre>
      </div>

      <div className="tutorial__tip">
        <span className="tutorial__tip-icon">💡</span>
        <div>
          <strong className="tutorial__tip-title">Astuce — Utilise les Gems sur Gemini</strong>
          <p className="tutorial__tip-desc">
            Sur <strong>Google Gemini</strong>, tu peux créer un <strong>Gem</strong> (un assistant personnalisé) en collant le contenu des règles ci-dessus dans ses instructions système.
            Ensuite, il te suffit d'envoyer ta leçon au Gem et il générera directement un quiz au bon format — sans avoir à recopier les règles à chaque fois !
          </p>
        </div>
      </div>
    </div>
  )
}

export default Tutorial
