import { describe, it, expect } from 'vitest'
import { parseQuiz } from './parser'

describe('parseQuiz', () => {
  // --- Structure de base ---

  it('parse un quiz complet avec titre et description', () => {
    const md = `# Mon Quiz
> Une description

## Question 1 : Capitale de la France ?
- [ ] Londres
- [x] Paris
- [ ] Berlin`

    const result = parseQuiz(md)
    expect(result.errors).toBeUndefined()
    expect(result.title).toBe('Mon Quiz')
    expect(result.description).toBe('Une description')
    expect(result.questions).toHaveLength(1)
  })

  it('parse un quiz sans description', () => {
    const md = `# Quiz Simple

## Quelle couleur ?
- [x] Rouge
- [ ] Bleu`

    const result = parseQuiz(md)
    expect(result.title).toBe('Quiz Simple')
    expect(result.description).toBe('')
    expect(result.questions).toHaveLength(1)
  })

  // --- Types de questions ---

  it('détecte une question à choix unique (single)', () => {
    const md = `# Q
## Question ?
- [ ] A
- [x] B
- [ ] C`

    const q = parseQuiz(md).questions[0]
    expect(q.type).toBe('single')
    expect(q.answers).toHaveLength(3)
    expect(q.answers[1].correct).toBe(true)
    expect(q.answers[0].correct).toBe(false)
  })

  it('détecte une question à choix multiples (multiple)', () => {
    const md = `# Q
## Question ?
- [x] A
- [ ] B
- [x] C`

    const q = parseQuiz(md).questions[0]
    expect(q.type).toBe('multiple')
    expect(q.answers.filter(a => a.correct)).toHaveLength(2)
  })

  it('détecte une question à réponse libre (open)', () => {
    const md = `# Q
## Combien font 2+2 ?
= 4`

    const q = parseQuiz(md).questions[0]
    expect(q.type).toBe('open')
    expect(q.expected).toBe('4')
    expect(q.answers).toHaveLength(0)
  })

  // --- Métadonnées ---

  it('parse les points personnalisés', () => {
    const md = `# Q
## Question ?
- [x] Oui
- [ ] Non
> Points: 25`

    const q = parseQuiz(md).questions[0]
    expect(q.points).toBe(25)
  })

  it('parse le temps personnalisé', () => {
    const md = `# Q
## Question ?
- [x] Oui
- [ ] Non
> Temps: 15`

    const q = parseQuiz(md).questions[0]
    expect(q.time).toBe(15)
  })

  it('parse une explication', () => {
    const md = `# Q
## Question ?
- [x] Oui
- [ ] Non
> Explication: Parce que c'est comme ça`

    const q = parseQuiz(md).questions[0]
    expect(q.explanation).toBe("Parce que c'est comme ça")
  })

  it('utilise les valeurs par défaut (10 pts, 30s) si non spécifié', () => {
    const md = `# Q
## Question ?
- [x] A
- [ ] B`

    const q = parseQuiz(md).questions[0]
    expect(q.points).toBe(10)
    expect(q.time).toBe(30)
    expect(q.explanation).toBeNull()
  })

  // --- Plusieurs questions ---

  it('parse plusieurs questions de types différents', () => {
    const md = `# Quiz Mixte

## Q1 : Choix unique ?
- [ ] A
- [x] B

## Q2 : Choix multiples ?
- [x] A
- [x] B
- [ ] C

## Q3 : Réponse libre ?
= 42`

    const result = parseQuiz(md)
    expect(result.questions).toHaveLength(3)
    expect(result.questions[0].type).toBe('single')
    expect(result.questions[1].type).toBe('multiple')
    expect(result.questions[2].type).toBe('open')
  })

  // --- Nettoyage du texte ---

  it('retire le préfixe "Question N :" du texte', () => {
    const md = `# Q
## Question 1 : Capitale ?
- [x] Paris
- [ ] Rome`

    const q = parseQuiz(md).questions[0]
    expect(q.text).toBe('Capitale ?')
  })

  it('garde le texte brut si pas de préfixe "Question N :"', () => {
    const md = `# Q
## Quelle est la réponse ?
- [x] 42
- [ ] 0`

    const q = parseQuiz(md).questions[0]
    expect(q.text).toBe('Quelle est la réponse ?')
  })

  // --- Gestion des erreurs ---

  it('retourne une erreur si pas de titre', () => {
    const md = `## Question ?
- [x] A
- [ ] B`

    const result = parseQuiz(md)
    expect(result.errors).toBeDefined()
    expect(result.errors.some(e => e.includes('Titre manquant'))).toBe(true)
  })

  it('retourne une erreur si aucune question', () => {
    const md = `# Mon Quiz
> Description`

    const result = parseQuiz(md)
    expect(result.errors).toBeDefined()
    expect(result.errors.some(e => e.includes('Aucune question'))).toBe(true)
  })

  it('retourne une erreur si aucune bonne réponse', () => {
    const md = `# Q
## Question ?
- [ ] A
- [ ] B`

    const result = parseQuiz(md)
    expect(result.errors).toBeDefined()
    expect(result.errors.some(e => e.includes('aucune bonne réponse'))).toBe(true)
  })

  it('retourne une erreur si question ouverte sans réponse attendue', () => {
    const md = `# Q
## Question ouverte ?`

    const result = parseQuiz(md)
    expect(result.errors).toBeDefined()
  })

  // --- Cas limites ---

  it('gère un markdown vide', () => {
    const result = parseQuiz('')
    expect(result.errors).toBeDefined()
  })

  it('ignore les lignes vides et le contenu non structuré', () => {
    const md = `# Quiz

Du texte random ignoré

## Question ?
- [x] Oui
- [ ] Non

Encore du texte ignoré`

    const result = parseQuiz(md)
    expect(result.questions).toHaveLength(1)
  })
})
