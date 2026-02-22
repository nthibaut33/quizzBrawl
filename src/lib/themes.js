/**
 * QuizzBrawl — Thèmes visuels
 * Chaque thème expose un id, un label, un emoji et 3 couleurs d'aperçu.
 * Les variables CSS sont appliquées via l'attribut data-theme sur <html>.
 */

export const THEMES = {
  brawl: {
    id: 'brawl',
    label: 'Brawl Stars',
    emoji: '🎮',
    colors: ['#e6b800', '#0f3460', '#e94560'],
  },
  unicorn: {
    id: 'unicorn',
    label: 'Licorne Arc-en-Ciel',
    emoji: '🦄',
    colors: ['#ff6eb4', '#c084fc', '#67e8f9'],
  },
  harrypotter: {
    id: 'harrypotter',
    label: 'Harry Potter',
    emoji: '⚡',
    colors: ['#c9a84c', '#740001', '#1a472a'],
  },
  pokemon: {
    id: 'pokemon',
    label: 'Pokémon',
    emoji: '🔴',
    colors: ['#f8d030', '#cc0000', '#1565c0'],
  },
}

export const DEFAULT_THEME = 'brawl'
