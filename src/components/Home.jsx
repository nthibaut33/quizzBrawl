import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home">
      <div className="home__hero">
        <h1 className="home__logo">QuizzBrawl</h1>
        <p className="home__tagline">
          Crée ton quiz en Markdown et défie tes parents !
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
              <p className="step-card__desc">Cumule des points pour atteindre le rang Légendaire !</p>
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

      <div className="home__cta-section">
        <button className="btn btn--secondary" onClick={() => navigate('/tutorial')}>
          📚 Générer avec une IA
        </button>
      </div>
    </div>
  )
}

export default Home
