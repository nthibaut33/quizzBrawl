import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Editor from './components/Editor'
import Game from './components/Game'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/game" element={<Game />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
