import { useState } from 'react'

function OpenAnswer({ revealed, expected, onSubmit }) {
  const [value, setValue] = useState('')

  const normalize = (s) => String(s).trim().toLowerCase()
  const isCorrect = revealed && normalize(value) === normalize(expected)

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim() || revealed) return
    onSubmit(value)
  }

  return (
    <form className="open-answer" onSubmit={handleSubmit}>
      <input
        className={`open-answer__input${
          revealed
            ? isCorrect
              ? ' open-answer__input--correct'
              : ' open-answer__input--wrong'
            : ''
        }`}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ta réponse..."
        disabled={revealed}
        autoFocus
      />
      {!revealed && (
        <button
          className="btn btn--primary"
          type="submit"
          disabled={!value.trim()}
        >
          Valider
        </button>
      )}
    </form>
  )
}

export default OpenAnswer
