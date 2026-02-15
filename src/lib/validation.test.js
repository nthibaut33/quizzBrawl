import { describe, it, expect } from 'vitest'
import {
  normalizeAnswer,
  validateOpenAnswer,
  validateSingleAnswer,
  validateMultipleAnswer,
  validateAnswer,
} from './validation'

describe('normalizeAnswer', () => {
  it('convertit en minuscules', () => {
    expect(normalizeAnswer('PARIS')).toBe('paris')
    expect(normalizeAnswer('Paris')).toBe('paris')
  })

  it('supprime les espaces au début et à la fin', () => {
    expect(normalizeAnswer('  Paris  ')).toBe('paris')
    expect(normalizeAnswer('\tParis\n')).toBe('paris')
  })

  it('conserve les espaces internes', () => {
    expect(normalizeAnswer('New York')).toBe('new york')
  })

  it('convertit les nombres en string', () => {
    expect(normalizeAnswer(84)).toBe('84')
    expect(normalizeAnswer(0)).toBe('0')
  })

  it('gère les chaînes vides', () => {
    expect(normalizeAnswer('')).toBe('')
    expect(normalizeAnswer('   ')).toBe('')
  })
})

describe('validateOpenAnswer', () => {
  it('accepte une réponse exacte', () => {
    expect(validateOpenAnswer('Paris', 'Paris')).toBe(true)
  })

  it('est insensible à la casse', () => {
    expect(validateOpenAnswer('paris', 'PARIS')).toBe(true)
    expect(validateOpenAnswer('Paris', 'paris')).toBe(true)
  })

  it('ignore les espaces au début/fin', () => {
    expect(validateOpenAnswer('  Paris  ', 'Paris')).toBe(true)
    expect(validateOpenAnswer('Paris', '  Paris  ')).toBe(true)
  })

  it('accepte les réponses numériques', () => {
    expect(validateOpenAnswer('84', '84')).toBe(true)
    expect(validateOpenAnswer(84, '84')).toBe(true)
    expect(validateOpenAnswer('84', 84)).toBe(true)
  })

  it('rejette les réponses incorrectes', () => {
    expect(validateOpenAnswer('Londres', 'Paris')).toBe(false)
    expect(validateOpenAnswer('83', '84')).toBe(false)
  })

  it('est sensible aux espaces internes', () => {
    expect(validateOpenAnswer('New York', 'NewYork')).toBe(false)
  })

  it('est insensible aux tirets et caractères spéciaux', () => {
    expect(validateOpenAnswer('MArie Antoinette', 'marie-antoinette')).toBe(true)
  })

    it('est insensible aux tirets et caractères spéciaux', () => {
    expect(validateOpenAnswer('MArie@Antoinette.', 'marie-antoinette')).toBe(true)
  })
})

describe('validateSingleAnswer', () => {
  const answers = [
    { text: 'Londres', correct: false },
    { text: 'Paris', correct: true },
    { text: 'Berlin', correct: false },
  ]

  it('accepte la bonne réponse', () => {
    expect(validateSingleAnswer(1, answers)).toBe(true)
  })

  it('rejette les mauvaises réponses', () => {
    expect(validateSingleAnswer(0, answers)).toBe(false)
    expect(validateSingleAnswer(2, answers)).toBe(false)
  })

  it('gère les index invalides', () => {
    expect(validateSingleAnswer(-1, answers)).toBe(false)
    expect(validateSingleAnswer(10, answers)).toBe(false)
  })

  it('gère undefined', () => {
    expect(validateSingleAnswer(undefined, answers)).toBe(false)
  })
})

describe('validateMultipleAnswer', () => {
  const answers = [
    { text: 'Python', correct: true },
    { text: 'C', correct: false },
    { text: 'JavaScript', correct: true },
    { text: 'Rust', correct: false },
  ]

  it('accepte toutes les bonnes réponses', () => {
    expect(validateMultipleAnswer(new Set([0, 2]), answers)).toBe(true)
  })

  it('rejette si une bonne réponse manque', () => {
    expect(validateMultipleAnswer(new Set([0]), answers)).toBe(false)
    expect(validateMultipleAnswer(new Set([2]), answers)).toBe(false)
  })

  it('rejette si une mauvaise réponse est incluse', () => {
    expect(validateMultipleAnswer(new Set([0, 1, 2]), answers)).toBe(false)
    expect(validateMultipleAnswer(new Set([0, 2, 3]), answers)).toBe(false)
  })

  it('rejette si aucune réponse', () => {
    expect(validateMultipleAnswer(new Set(), answers)).toBe(false)
  })

  it('rejette si toutes les réponses sont sélectionnées', () => {
    expect(validateMultipleAnswer(new Set([0, 1, 2, 3]), answers)).toBe(false)
  })

  it('accepte une seule bonne réponse si c\'est la seule correcte', () => {
    const singleCorrect = [
      { text: 'A', correct: true },
      { text: 'B', correct: false },
    ]
    expect(validateMultipleAnswer(new Set([0]), singleCorrect)).toBe(true)
  })
})

describe('validateAnswer', () => {
  it('valide une question ouverte', () => {
    const question = {
      type: 'open',
      expected: 'Paris',
    }
    expect(validateAnswer(question, 'Paris')).toBe(true)
    expect(validateAnswer(question, 'paris')).toBe(true)
    expect(validateAnswer(question, 'Londres')).toBe(false)
  })

  it('valide une question à choix unique', () => {
    const question = {
      type: 'single',
      answers: [
        { text: 'Londres', correct: false },
        { text: 'Paris', correct: true },
      ],
    }
    expect(validateAnswer(question, 1)).toBe(true)
    expect(validateAnswer(question, 0)).toBe(false)
  })

  it('valide une question à choix multiples', () => {
    const question = {
      type: 'multiple',
      answers: [
        { text: 'Python', correct: true },
        { text: 'C', correct: false },
        { text: 'JavaScript', correct: true },
      ],
    }
    expect(validateAnswer(question, new Set([0, 2]))).toBe(true)
    expect(validateAnswer(question, new Set([0]))).toBe(false)
  })

  it('retourne false pour un type inconnu', () => {
    const question = { type: 'unknown' }
    expect(validateAnswer(question, 'anything')).toBe(false)
  })
})
