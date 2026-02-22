import { describe, it, expect } from 'vitest'
import { calculatePoints, getStreakMultiplier, getStreakLabel, getRank, getRankProgress, processAnswer, RANK_THRESHOLDS } from './scoring'

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

describe('RANK_THRESHOLDS', () => {
  it('contient 6 rangs dans l\'ordre croissant', () => {
    expect(RANK_THRESHOLDS).toHaveLength(6)
    expect(RANK_THRESHOLDS[0].name).toBe('Bois')
    expect(RANK_THRESHOLDS[5].name).toBe('Légendaire')
  })

  it('les pourcentages sont corrects', () => {
    expect(RANK_THRESHOLDS[0].pct).toBe(0.0)
    expect(RANK_THRESHOLDS[1].pct).toBe(0.1)
    expect(RANK_THRESHOLDS[2].pct).toBe(0.2)
    expect(RANK_THRESHOLDS[3].pct).toBe(0.4)
    expect(RANK_THRESHOLDS[4].pct).toBe(0.7)
    expect(RANK_THRESHOLDS[5].pct).toBe(1.0)
  })
})

describe('getRank — total variable', () => {
  it('total 300 : seuils recalculés correctement', () => {
    expect(getRank(0, 300).name).toBe('Bois')
    expect(getRank(29, 300).name).toBe('Bois')
    expect(getRank(30, 300).name).toBe('Bronze')   // 300 * 0.1
    expect(getRank(59, 300).name).toBe('Bronze')
    expect(getRank(60, 300).name).toBe('Argent')   // 300 * 0.2
    expect(getRank(119, 300).name).toBe('Argent')
    expect(getRank(120, 300).name).toBe('Or')      // 300 * 0.4
    expect(getRank(209, 300).name).toBe('Or')
    expect(getRank(210, 300).name).toBe('Diamant') // 300 * 0.7
    expect(getRank(299, 300).name).toBe('Diamant')
    expect(getRank(300, 300).name).toBe('Légendaire') // 300 * 1.0
    expect(getRank(999, 300).name).toBe('Légendaire')
  })

  it('total 1000 : Légendaire à 1000 pts', () => {
    expect(getRank(999, 1000).name).toBe('Diamant')
    expect(getRank(1000, 1000).name).toBe('Légendaire')
  })

  it('rétrocompatibilité : getRank(score) sans total fonctionne', () => {
    expect(getRank(500).name).toBe('Légendaire')
    expect(getRank(0).name).toBe('Bois')
    expect(getRank(200).name).toBe('Or')
  })

  it('getRank retourne minPoints calculé', () => {
    expect(getRank(30, 300).minPoints).toBe(30)
    expect(getRank(0, 300).minPoints).toBe(0)
    expect(getRank(300, 300).minPoints).toBe(300)
  })
})

describe('getRankProgress', () => {
  it('score 0 : Bois, 0%, 50 pts pour Bronze', () => {
    const p = getRankProgress(0)
    expect(p.current.name).toBe('Bois')
    expect(p.next.name).toBe('Bronze')
    expect(p.percentage).toBe(0)
    expect(p.ptsToNext).toBe(50)
  })

  it('score 25 : Bois, 50% vers Bronze', () => {
    const p = getRankProgress(25)
    expect(p.current.name).toBe('Bois')
    expect(p.percentage).toBe(50)
    expect(p.ptsToNext).toBe(25)
  })

  it('score 49 : encore Bois, 98%', () => {
    const p = getRankProgress(49)
    expect(p.current.name).toBe('Bois')
    expect(p.percentage).toBe(98)
    expect(p.ptsToNext).toBe(1)
  })

  it('score 50 : Bronze, 0%, 50 pts pour Argent', () => {
    const p = getRankProgress(50)
    expect(p.current.name).toBe('Bronze')
    expect(p.next.name).toBe('Argent')
    expect(p.percentage).toBe(0)
    expect(p.ptsToNext).toBe(50)
  })

  it('score 100 : Argent, 0%, 100 pts pour Or', () => {
    const p = getRankProgress(100)
    expect(p.current.name).toBe('Argent')
    expect(p.next.name).toBe('Or')
    expect(p.percentage).toBe(0)
    expect(p.ptsToNext).toBe(100)
  })

  it('score 275 : Or, 50% vers Diamant', () => {
    const p = getRankProgress(275)
    expect(p.current.name).toBe('Or')
    expect(p.next.name).toBe('Diamant')
    expect(p.percentage).toBe(50)
    expect(p.ptsToNext).toBe(75)
  })

  it('score 499 : Diamant, 99% vers Légendaire', () => {
    const p = getRankProgress(499)
    expect(p.current.name).toBe('Diamant')
    expect(p.next.name).toBe('Légendaire')
    expect(p.ptsToNext).toBe(1)
  })

  it('score 500 : Légendaire, 100%, pas de rang suivant', () => {
    const p = getRankProgress(500)
    expect(p.current.name).toBe('Légendaire')
    expect(p.next).toBeNull()
    expect(p.percentage).toBe(100)
    expect(p.ptsToNext).toBe(0)
  })

  it('score 999 : toujours Légendaire, pas de rang suivant', () => {
    const p = getRankProgress(999)
    expect(p.current.name).toBe('Légendaire')
    expect(p.next).toBeNull()
    expect(p.percentage).toBe(100)
  })

  it('total 300 : seuils recalculés', () => {
    const p = getRankProgress(0, 300)
    expect(p.current.name).toBe('Bois')
    expect(p.next.name).toBe('Bronze')
    expect(p.next.minPoints).toBe(30)
    expect(p.ptsToNext).toBe(30)
  })

  it('total 300, score 150 : Or, 50% vers Diamant', () => {
    const p = getRankProgress(150, 300)
    expect(p.current.name).toBe('Or')   // 300*0.4 = 120
    expect(p.next.name).toBe('Diamant') // 300*0.7 = 210
    expect(p.percentage).toBe(Math.round((150 - 120) / (210 - 120) * 100))
    expect(p.ptsToNext).toBe(60)
  })

  it('total 1000 : Légendaire à 1000', () => {
    const p = getRankProgress(1000, 1000)
    expect(p.current.name).toBe('Légendaire')
    expect(p.next).toBeNull()
    expect(p.percentage).toBe(100)
  })

  it('rétrocompatibilité : getRankProgress(score) sans total', () => {
    const p = getRankProgress(0)
    expect(p.next.minPoints).toBe(50)
    const p2 = getRankProgress(500)
    expect(p2.current.name).toBe('Légendaire')
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
