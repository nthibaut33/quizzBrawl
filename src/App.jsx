import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme.jsx'
import Layout from './components/Layout'
import Home from './components/Home'
import Editor from './components/Editor'
import Game from './components/Game'
import Tutorial from './components/Tutorial'

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/game" element={<Game />} />
            <Route path="/tutorial" element={<Tutorial />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
