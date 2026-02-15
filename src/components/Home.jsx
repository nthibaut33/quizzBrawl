import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const [rulesContent, setRulesContent] = useState('')
  const [rulesOpen, setRulesOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('./rules.md')
      .then(r => r.ok ? r.text() : '')
      .then(setRulesContent)
      .catch(() => setRulesContent(''))
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(rulesContent).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="home">
      <div className="home__hero">
        <h1 className="home__logo">QuizzBrawl</h1>
        <p className="home__tagline">
          Crée ton quiz en Markdown et défie tes amis !
        </p>
        <button className="btn btn--primary home__cta" onClick={() => navigate('/editor')}>
          Créer un Quiz
        </button>
      </div>

      <div className="home__section">
        <h2 className="home__section-title">Comment ça marche ?</h2>
        <div className="step-list">
          <div className="step-card">
            <span className="step-card__num">1</span>
            <div>
              <strong className="step-card__title">Écris ton quiz</strong>
              <p className="step-card__desc">Utilise le format Markdown dans l'éditeur pour créer tes questions.</p>
            </div>
          </div>
          <div className="step-card">
            <span className="step-card__num">2</span>
            <div>
              <strong className="step-card__title">Joue !</strong>
              <p className="step-card__desc">Réponds aux questions : choix unique, multiples ou réponse libre.</p>
            </div>
          </div>
          <div className="step-card">
            <span className="step-card__num">3</span>
            <div>
              <strong className="step-card__title">Obtiens ton rang</strong>
              <p className="step-card__desc">Cumule des points et des streaks pour atteindre le rang Légendaire !</p>
            </div>
          </div>
        </div>
      </div>

      <div className="home__section">
        <h2 className="home__section-title">Format Markdown</h2>
        <pre className="code-block">{`# Mon Quiz
## Question 1 : Capitale de la France ?
- [ ] Londres
- [x] Paris
- [ ] Berlin

## Question 2 : Langages interprétés ?
- [x] Python
- [ ] C
- [x] JavaScript

## Question 3 : Combien font 12 x 7 ?
= 84`}</pre>
      </div>

      <div className="home__section">
        <h2 className="home__section-title">Génère tes quiz avec une IA</h2>
        <p className="home__ai-tuto-intro">
          Pas envie d'écrire le Markdown à la main ? Utilise une IA pour transformer n'importe quelle leçon en quiz jouable !
        </p>

        <div className="step-list" style={{ marginBottom: '1.2rem' }}>
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

        <div className="home__rules-block">
          <div className="home__rules-header" onClick={() => setRulesOpen(!rulesOpen)}>
            <h3 className="home__rules-header-title">
              <span className={`home__rules-arrow ${rulesOpen ? 'home__rules-arrow--open' : ''}`}>&#9654;</span>
              Règles de génération (rules.md)
            </h3>
            {rulesContent && (
              <button
                className="btn btn--primary btn--small"
                onClick={(e) => { e.stopPropagation(); handleCopy() }}
              >
                {copied ? 'Copié !' : 'Copier'}
              </button>
            )}
          </div>
          {rulesOpen && rulesContent && (
            <pre className="home__rules-content">{rulesContent}</pre>
          )}
        </div>

        <div className="home__ai-example">
          <h3 className="home__ai-example-title">Exemple de prompt</h3>
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

        <div className="home__ai-tip">
          <span className="home__ai-tip-icon">💡</span>
          <div>
            <strong className="home__ai-tip-title">Astuce — Utilise les Gems sur Gemini</strong>
            <p className="home__ai-tip-desc">
              Sur <strong>Google Gemini</strong>, tu peux créer un <strong>Gem</strong> (un assistant personnalisé) en collant le contenu des règles ci-dessus dans ses instructions système.
              Ensuite, il te suffit d'envoyer ta leçon au Gem et il générera directement un quiz au bon format — sans avoir à recopier les règles à chaque fois !
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
