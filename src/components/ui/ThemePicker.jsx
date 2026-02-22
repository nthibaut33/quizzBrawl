import { useTheme } from '../../hooks/useTheme.jsx'

function ThemePicker({ onClose }) {
  const { theme, setTheme, themes } = useTheme()

  return (
    <div className="theme-picker-dropdown">
      <p className="theme-picker-dropdown__title">Thème</p>
      {Object.values(themes).map(t => (
        <button
          key={t.id}
          className={`theme-picker__card${theme === t.id ? ' theme-picker__card--active' : ''}`}
          onClick={() => { setTheme(t.id); onClose?.() }}
        >
          <span className="theme-picker__emoji">{t.emoji}</span>
          <span className="theme-picker__label">{t.label}</span>
          <div className="theme-picker__swatches">
            {t.colors.map(c => (
              <span key={c} className="theme-picker__swatch" style={{ background: c }} />
            ))}
          </div>
          {theme === t.id && <span className="theme-picker__check">✓</span>}
        </button>
      ))}
    </div>
  )
}

export default ThemePicker
