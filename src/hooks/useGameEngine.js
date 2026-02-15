import { useState, useCallback, useRef, useEffect } from 'react'
import { processAnswer } from '../lib/scoring'
import { validateAnswer } from '../lib/validation'

/**
 * Hook state machine pour le moteur de jeu.
 * États : ready → playing → answered → playing | finished
 */
export function useGameEngine(quiz) {
  const [state, setState] = useState('ready')     // ready | playing | answered | finished
  const [questionIndex, setQuestionIndex] = useState(0)
  const [results, setResults] = useState([])       // { correct, answer, points, bonus }
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lastPoints, setLastPoints] = useState(null) // { points, bonus, streakLabel } pour affichage

  const question = quiz?.questions?.[questionIndex] ?? null
  const total = quiz?.questions?.length ?? 0

  // Refs pour éviter les dépendances dans les callbacks
  const questionRef = useRef(question)
  const scoreRef = useRef(score)
  const streakRef = useRef(streak)

  // Mise à jour des refs dans useEffect pour éviter les warnings de lint
  useEffect(() => {
    questionRef.current = question
  }, [question])

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  useEffect(() => {
    streakRef.current = streak
  }, [streak])

  const start = useCallback(() => {
    setState('playing')
    setQuestionIndex(0)
    setResults([])
    setScore(0)
    setStreak(0)
    setLastPoints(null)
  }, [])

  const answer = useCallback((userAnswer) => {
    const q = questionRef.current
    if (state !== 'playing' || !q) return

    // Validation de la réponse
    const correct = validateAnswer(q, userAnswer)

    // Calcul du score
    const result = processAnswer(correct, q.points, streakRef.current, scoreRef.current)

    setScore(result.newScore)
    setStreak(result.newStreak)
    setLastPoints({ points: result.points, bonus: result.bonus, streakLabel: result.streakLabel })
    setResults(prev => [...prev, { correct, answer: userAnswer, points: result.points, bonus: result.bonus }])
    setState('answered')
  }, [state])

  const next = useCallback(() => {
    if (state !== 'answered') return

    setLastPoints(null)
    const nextIndex = questionIndex + 1
    if (nextIndex >= total) {
      setState('finished')
    } else {
      setQuestionIndex(nextIndex)
      setState('playing')
    }
  }, [state, questionIndex, total])

  return {
    state,
    question,
    questionIndex,
    total,
    results,
    score,
    streak,
    lastPoints,
    start,
    answer,
    next,
  }
}
