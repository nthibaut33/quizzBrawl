import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import pkg from '../../package.json'
import ThemePicker from './ui/ThemePicker'

function Layout() {
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerRef = useRef(null)

  useEffect(() => {
    if (!pickerOpen) return
    function handleClick(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [pickerOpen])

  return (
    <div className="layout">
      <nav className="navbar">
        <NavLink to="/" className="navbar__logo">
          QuizzBrawl <span className="navbar__version">v{pkg.version}</span>
        </NavLink>
        <div className="navbar__links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
          >
            Accueil
          </NavLink>
          <NavLink
            to="/editor"
            className={({ isActive }) =>
              `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
          >
            Éditeur
          </NavLink>
          <div className="navbar__theme-wrap" ref={pickerRef}>
            <button
              className="theme-picker-btn"
              onClick={() => setPickerOpen(o => !o)}
              title="Changer de thème"
              aria-label="Changer de thème"
            >
              🎨
            </button>
            {pickerOpen && <ThemePicker onClose={() => setPickerOpen(false)} />}
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
