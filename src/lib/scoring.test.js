import { describe, it, expect } from 'vitest'
import { calculatePoints, getStreakBonus, getStreakLabel, getRank, processAnswer } from './scoring'

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

describe('getStreakBonus', () => {
  it('retourne 0 pour streak < 3', () => {
    expect(getStreakBonus(0)).toBe(0)
    expect(getStreakBonus(1)).toBe(0)
    expect(getStreakBonus(2)).toBe(0)
  })

  it('retourne 5 pour streak 3-4', () => {
    expect(getStreakBonus(3)).toBe(5)
    expect(getStreakBonus(4)).toBe(5)
  })

  it('retourne 15 pour streak >= 5', () => {
    expect(getStreakBonus(5)).toBe(15)
    expect(getStreakBonus(10)).toBe(15)
  })
})

describe('getStreakLabel', () => {
  it('retourne null pour streak < 3', () => {
    expect(getStreakLabel(0)).toBeNull()
    expect(getStreakLabel(2)).toBeNull()
  })

  it('retourne Combo level 1 pour streak 3-4', () => {
    const label = getStreakLabel(3)
    expect(label.label).toBe('x3 Combo!')
    expect(label.level).toBe(1)
  })

  it('retourne ON FIRE level 2 pour streak >= 5', () => {
    const label = getStreakLabel(5)
    expect(label.label).toBe('x5 ON FIRE!')
    expect(label.level).toBe(2)
  })

  it('inclut le nombre exact de streak dans le label', () => {
    expect(getStreakLabel(7).label).toBe('x7 ON FIRE!')
    expect(getStreakLabel(4).label).toBe('x4 Combo!')
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
  it('bonne réponse sans streak : points de base seulement', () => {
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

  it('3e bonne réponse consécutive : bonus streak +5', () => {
    const result = processAnswer(true, 10, 2, 20)
    expect(result.newStreak).toBe(3)
    expect(result.bonus).toBe(5)
    expect(result.newScore).toBe(35) // 20 + 10 + 5
    expect(result.streakLabel.level).toBe(1)
  })

  it('5e bonne réponse consécutive : bonus streak +15', () => {
    const result = processAnswer(true, 10, 4, 60)
    expect(result.newStreak).toBe(5)
    expect(result.bonus).toBe(15)
    expect(result.newScore).toBe(85) // 60 + 10 + 15
    expect(result.streakLabel.level).toBe(2)
  })

  it('respecte les points de base personnalisés', () => {
    const result = processAnswer(true, 25, 0, 0)
    expect(result.points).toBe(25)
    expect(result.newScore).toBe(25)
  })

  it('simule une séquence complète de jeu', () => {
    let score = 0
    let streak = 0

    // Q1: correct (10pts)
    let r = processAnswer(true, 10, streak, score)
    score = r.newScore; streak = r.newStreak
    expect(score).toBe(10)

    // Q2: correct (10pts)
    r = processAnswer(true, 10, streak, score)
    score = r.newScore; streak = r.newStreak
    expect(score).toBe(20)

    // Q3: correct (10pts + 5 bonus streak x3)
    r = processAnswer(true, 10, streak, score)
    score = r.newScore; streak = r.newStreak
    expect(score).toBe(35)
    expect(r.bonus).toBe(5)

    // Q4: faux (0pts, streak reset)
    r = processAnswer(false, 10, streak, score)
    score = r.newScore; streak = r.newStreak
    expect(score).toBe(35)
    expect(streak).toBe(0)

    // Q5: correct (10pts, streak restart)
    r = processAnswer(true, 10, streak, score)
    score = r.newScore; streak = r.newStreak
    expect(score).toBe(45)
    expect(streak).toBe(1)
  })
})
