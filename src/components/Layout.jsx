import { NavLink, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="layout">
      <nav className="navbar">
        <NavLink to="/" className="navbar__logo">
          QuizzBrawl
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
          <NavLink
            to="/game"
            className={({ isActive }) =>
              `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
          >
            Jouer
          </NavLink>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
