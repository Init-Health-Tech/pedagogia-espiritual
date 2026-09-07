import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import {
  createAppTheme,
  defaultPalette,
  highContrastPalette,
  syncColors,
} from '../theme/muiTheme'

const STORAGE_TEXT = 'a11y-text-size'
const STORAGE_CONTRAST = 'a11y-high-contrast'

export const TEXT_SIZE_OPTIONS = [
  { id: 'normal', label: 'Normal', scale: '100%' },
  { id: 'large', label: 'Grande', scale: '118.75%' },
  { id: 'xlarge', label: 'Muy grande', scale: '137.5%' },
]

function readStoredTextSize() {
  try {
    const v = localStorage.getItem(STORAGE_TEXT)
    if (TEXT_SIZE_OPTIONS.some((o) => o.id === v)) return v
  } catch {
    /* ignore */
  }
  return 'normal'
}

function readStoredHighContrast() {
  try {
    return localStorage.getItem(STORAGE_CONTRAST) === 'true'
  } catch {
    return false
  }
}

function applyCssVars(palette) {
  const root = document.documentElement
  root.style.setProperty('--color-navy', palette.navy)
  root.style.setProperty('--color-primary', palette.primary)
  root.style.setProperty('--color-blue', palette.blue)
  root.style.setProperty('--color-secondary', palette.secondary)
  root.style.setProperty('--color-accent', palette.accent)
  root.style.setProperty('--color-earth', palette.earth)
  root.style.setProperty('--color-moss', palette.moss)
  root.style.setProperty('--color-sky', palette.sky)
  root.style.setProperty('--color-cream', palette.cream)
  root.style.setProperty('--color-light', palette.light)
  root.style.setProperty('--color-surface', palette.surface)
  root.style.setProperty('--color-muted', palette.muted)
  root.style.setProperty('--color-border', palette.border)
  root.style.setProperty('--color-dark', palette.dark)
}

function applyDomPreferences(textSize, highContrast) {
  const root = document.documentElement
  const option = TEXT_SIZE_OPTIONS.find((o) => o.id === textSize) || TEXT_SIZE_OPTIONS[0]
  root.style.fontSize = option.scale
  root.dataset.textSize = textSize
  if (highContrast) {
    root.dataset.highContrast = 'true'
  } else {
    delete root.dataset.highContrast
  }
  const palette = highContrast ? highContrastPalette : defaultPalette
  syncColors(palette)
  applyCssVars(palette)
}

// Aplica preferencias guardadas antes del primer paint de React (evita flash)
if (typeof document !== 'undefined') {
  applyDomPreferences(readStoredTextSize(), readStoredHighContrast())
}

const A11yContext = createContext(null)

export function A11yProvider({ children }) {
  const [textSize, setTextSizeState] = useState(readStoredTextSize)
  const [highContrast, setHighContrastState] = useState(readStoredHighContrast)

  useEffect(() => {
    applyDomPreferences(textSize, highContrast)
  }, [textSize, highContrast])

  const setTextSize = useCallback((id) => {
    if (!TEXT_SIZE_OPTIONS.some((o) => o.id === id)) return
    setTextSizeState(id)
    try {
      localStorage.setItem(STORAGE_TEXT, id)
    } catch {
      /* ignore */
    }
  }, [])

  const setHighContrast = useCallback((value) => {
    const next = Boolean(value)
    setHighContrastState(next)
    try {
      localStorage.setItem(STORAGE_CONTRAST, next ? 'true' : 'false')
    } catch {
      /* ignore */
    }
  }, [])

  const toggleHighContrast = useCallback(() => {
    setHighContrast(!highContrast)
  }, [highContrast, setHighContrast])

  const theme = useMemo(
    () => createAppTheme(
      highContrast ? highContrastPalette : defaultPalette,
      { highContrast },
    ),
    [highContrast],
  )

  const value = useMemo(
    () => ({
      textSize,
      setTextSize,
      highContrast,
      setHighContrast,
      toggleHighContrast,
      textSizeOptions: TEXT_SIZE_OPTIONS,
    }),
    [textSize, setTextSize, highContrast, setHighContrast, toggleHighContrast],
  )

  return (
    <A11yContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </A11yContext.Provider>
  )
}

export function useA11y() {
  const ctx = useContext(A11yContext)
  if (!ctx) {
    throw new Error('useA11y debe usarse dentro de A11yProvider')
  }
  return ctx
}
