import { describe, it, expect } from 'vitest'
import { calculatePoints, getStreakMultiplier, getStreakLabel, getRank, processAnswer } from './scoring'

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

describe('getStreakMultiplier', () => {
  it('retourne 0 pour streak < 3', () => {
    expect(getStreakMultiplier(0)).toBe(0)
    expect(getStreakMultiplier(1)).toBe(0)
    expect(getStreakMultiplier(2)).toBe(0)
  })

  it('retourne 0.2 pour streak 3-4', () => {
    expect(getStreakMultiplier(3)).toBe(0.2)
    expect(getStreakMultiplier(4)).toBe(0.2)
  })

  it('retourne 0.5 pour streak >= 5', () => {
    expect(getStreakMultiplier(5)).toBe(0.5)
    expect(getStreakMultiplier(10)).toBe(0.5)
  })
})

describe('getStreakLabel', () => {
  it('retourne null pour streak < 3', () => {
    expect(getStreakLabel(0)).toBeNull()
    expect(getStreakLabel(1)).toBeNull()
    expect(getStreakLabel(2)).toBeNull()
  })

  it('retourne "x3 Combo!" pour streak 3-4', () => {
    expect(getStreakLabel(3)).toBe('x3 Combo!')
    expect(getStreakLabel(4)).toBe('x3 Combo!')
  })

  it('retourne "x5 ON FIRE!" pour streak >= 5', () => {
    expect(getStreakLabel(5)).toBe('x5 ON FIRE!')
    expect(getStreakLabel(10)).toBe('x5 ON FIRE!')
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
  it('bonne réponse sans streak : points de base, streak à 1', () => {
    const result = processAnswer(true, 10, 0, 0)
    expect(result.points).toBe(10)
    expect(result.bonus).toBe(0)
    expect(result.newStreak).toBe(1)
    expect(result.newScore).toBe(10)
    expect(result.streakLabel).toBeNull()
  })

  it('mauvaise réponse : 0 point, streak reset', () => {
    const result = processAnswer(false, 10, 4, 50)
    expect(result.points).toBe(0)
    expect(result.bonus).toBe(0)
    expect(result.newStreak).toBe(0)
    expect(result.newScore).toBe(50)
    expect(result.streakLabel).toBeNull()
  })

  it('streak de 3 : bonus +20%, label Combo', () => {
    const result = processAnswer(true, 10, 2, 20)
    expect(result.newStreak).toBe(3)
    expect(result.bonus).toBe(2) // 10 * 0.2
    expect(result.newScore).toBe(32) // 20 + 10 + 2
    expect(result.streakLabel).toBe('x3 Combo!')
  })

  it('streak de 5 : bonus +50%, label ON FIRE', () => {
    const result = processAnswer(true, 10, 4, 50)
    expect(result.newStreak).toBe(5)
    expect(result.bonus).toBe(5) // 10 * 0.5
    expect(result.newScore).toBe(65) // 50 + 10 + 5
    expect(result.streakLabel).toBe('x5 ON FIRE!')
  })

  it('bonus arrondi correctement avec points impairs', () => {
    const result = processAnswer(true, 15, 2, 0)
    expect(result.bonus).toBe(3) // 15 * 0.2 = 3
    expect(result.newScore).toBe(18)
  })

  it('simule une séquence complète de jeu', () => {
    let score = 0
    let streak = 0

    // Q1: correct → streak 1
    let r = processAnswer(true, 10, streak, score)
    score = r.newScore; streak = r.newStreak
    expect(score).toBe(10)
    expect(streak).toBe(1)

    // Q2: correct → streak 2
    r = processAnswer(true, 10, streak, score)
    score = r.newScore; streak = r.newStreak
    expect(score).toBe(20)
    expect(streak).toBe(2)

    // Q3: correct → streak 3, bonus +20% = +2
    r = processAnswer(true, 10, streak, score)
    score = r.newScore; streak = r.newStreak
    expect(score).toBe(32) // 20 + 10 + 2
    expect(streak).toBe(3)
    expect(r.streakLabel).toBe('x3 Combo!')

    // Q4: faux → streak reset
    r = processAnswer(false, 10, streak, score)
    score = r.newScore; streak = r.newStreak
    expect(score).toBe(32)
    expect(streak).toBe(0)

    // Q5: correct → streak 1
    r = processAnswer(true, 10, streak, score)
    score = r.newScore; streak = r.newStreak
    expect(score).toBe(42)
    expect(streak).toBe(1)
  })
})
