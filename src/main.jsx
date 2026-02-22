import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'katex/dist/katex.min.css'
import './index.css'
import App from './App.jsx'

// Appliquer le thème sauvegardé avant le premier rendu React (évite le flash)
const savedTheme = localStorage.getItem('quizzbrawl-theme')
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
