function AnswerCard({ text, index, selected, correct, revealed, type, onSelect }) {
  const isMultiple = type === 'multiple'

  let className = 'answer-card'
  if (selected) className += ' answer-card--selected'
  if (revealed && selected && correct) className += ' answer-card--correct'
  if (revealed && selected && !correct) className += ' answer-card--wrong'

  return (
    <button
      className={className}
      onClick={() => onSelect(index)}
      disabled={revealed}
    >
      <span className="answer-card__marker">
        {isMultiple
          ? (selected ? '\u2611' : '\u2610')
          : String.fromCharCode(65 + index)
        }
      </span>
      <span className="answer-card__text">{text}</span>
      {revealed && selected && correct && (
        <span className="answer-card__icon answer-card__icon--correct">{'\u2713'}</span>
      )}
      {revealed && selected && !correct && (
        <span className="answer-card__icon answer-card__icon--wrong">{'\u2717'}</span>
      )}
    </button>
  )
}

export default AnswerCard
