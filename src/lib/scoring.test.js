import { describe, it, expect } from 'vitest'
import { calculatePoints, getRank, processAnswer } from './scoring'

describe('calculatePoints', () => {
  it('retourne les points de base si correct', () => {
    expect(calculatePoints(true, 10)).toBe(10)
    expect(calculatePoints(true, 25)).toBe(25)
  })

  it('retourne 0 si incorrect', () => {
    expect(calculatePoints(false, 10)).toBe(0)
    expect(calculatePoints(false, 100)).toBe(0)
  })

  it('utilise 10 par défaut', () => {
    expect(calculatePoints(true)).toBe(10)
  })
})

describe('getRank', () => {
  it('retourne Bois pour 0-49', () => {
    expect(getRank(0).name).toBe('Bois')
    expect(getRank(49).name).toBe('Bois')
  })

  it('retourne Bronze pour 50-99', () => {
    expect(getRank(50).name).toBe('Bronze')
    expect(getRank(99).name).toBe('Bronze')
  })

  it('retourne Argent pour 100-199', () => {
    expect(getRank(100).name).toBe('Argent')
    expect(getRank(199).name).toBe('Argent')
  })

  it('retourne Or pour 200-349', () => {
    expect(getRank(200).name).toBe('Or')
    expect(getRank(349).name).toBe('Or')
  })

  it('retourne Diamant pour 350-499', () => {
    expect(getRank(350).name).toBe('Diamant')
    expect(getRank(499).name).toBe('Diamant')
  })

  it('retourne Légendaire pour 500+', () => {
    expect(getRank(500).name).toBe('Légendaire')
    expect(getRank(9999).name).toBe('Légendaire')
  })

  it('retourne les bonnes couleurs', () => {
    expect(getRank(0).color).toBe('#8b6914')
    expect(getRank(500).color).toBe('#ff6f00')
  })

  it('retourne les noms anglais', () => {
    expect(getRank(0).nameEn).toBe('Wood')
    expect(getRank(500).nameEn).toBe('Legendary')
  })
})

describe('processAnswer', () => {
  it('bonne réponse : points de base', () => {
    const result = processAnswer(true, 10, 0)
    expect(result.points).toBe(10)
    expect(result.newScore).toBe(10)
  })

  it('mauvaise réponse : 0 point', () => {
    const result = processAnswer(false, 10, 50)
    expect(result.points).toBe(0)
    expect(result.newScore).toBe(50)
  })

  it('respecte les points de base personnalisés', () => {
    const result = processAnswer(true, 25, 0)
    expect(result.points).toBe(25)
    expect(result.newScore).toBe(25)
  })

  it('simule une séquence complète de jeu', () => {
    let score = 0

    // Q1: correct (10pts)
    let r = processAnswer(true, 10, score)
    score = r.newScore
    expect(score).toBe(10)

    // Q2: correct (10pts)
    r = processAnswer(true, 10, score)
    score = r.newScore
    expect(score).toBe(20)

    // Q3: correct (10pts)
    r = processAnswer(true, 10, score)
    score = r.newScore
    expect(score).toBe(30)

    // Q4: faux (0pts)
    r = processAnswer(false, 10, score)
    score = r.newScore
    expect(score).toBe(30)

    // Q5: correct (10pts)
    r = processAnswer(true, 10, score)
    score = r.newScore
    expect(score).toBe(40)
  })
})
