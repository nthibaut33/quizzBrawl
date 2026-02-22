import { createContext, useContext, useState, useCallback } from 'react'
import { THEMES, DEFAULT_THEME } from '../lib/themes'

const STORAGE_KEY = 'quizzbrawl-theme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored && THEMES[stored] ? stored : DEFAULT_THEME
  })

  const setTheme = useCallback((themeId) => {
    if (!THEMES[themeId]) return
    localStorage.setItem(STORAGE_KEY, themeId)
    document.documentElement.setAttribute('data-theme', themeId)
    setThemeState(themeId)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
