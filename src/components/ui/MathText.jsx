import { useMemo } from 'react'
import katex from 'katex'

const BLOCK_REGEX = /\$\$([^$]+?)\$\$/g
const INLINE_REGEX = /\$([^$]+?)\$/g

function renderLatex(text) {
  if (!text || typeof text !== 'string') return text || ''
  if (!text.includes('$')) return text

  let html = text
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Render block formulas first ($$...$$)
  html = html.replace(BLOCK_REGEX, (_, formula) => {
    try {
      return katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })
    } catch {
      return `$$${formula}$$`
    }
  })

  // Render inline formulas ($...$)
  html = html.replace(INLINE_REGEX, (_, formula) => {
    try {
      return katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false })
    } catch {
      return `$${formula}$`
    }
  })

  return html
}

function MathText({ text }) {
  const html = useMemo(() => renderLatex(text), [text])

  if (!text || !text.includes('$')) {
    return <>{text}</>
  }

  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

export default MathText
