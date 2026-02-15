import { useState, useCallback, useRef } from 'react'
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
  questionRef.current = question
  const scoreRef = useRef(score)
  scoreRef.current = score
  const streakRef = useRef(streak)
  streakRef.current = streak
  const stateRef = useRef(state)
  stateRef.current = state
  const questionIndexRef = useRef(questionIndex)
  questionIndexRef.current = questionIndex
  const totalRef = useRef(total)
  totalRef.current = total

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
    if (stateRef.current !== 'playing' || !q) return

    // Validation de la réponse
    const correct = validateAnswer(q, userAnswer)

    // Calcul du score
    const result = processAnswer(correct, q.points, streakRef.current, scoreRef.current)

    setScore(result.newScore)
    setStreak(result.newStreak)
    setLastPoints({ points: result.points, bonus: result.bonus, streakLabel: result.streakLabel })
    setResults(prev => [...prev, { correct, answer: userAnswer, points: result.points, bonus: result.bonus }])
    setState('answered')
  }, [])

  const next = useCallback(() => {
    if (stateRef.current !== 'answered') return

    setLastPoints(null)
    const nextIndex = questionIndexRef.current + 1
    if (nextIndex >= totalRef.current) {
      setState('finished')
    } else {
      setQuestionIndex(nextIndex)
      setState('playing')
    }
  }, [])

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
