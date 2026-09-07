import { createTheme, alpha } from '@mui/material/styles'

export const defaultPalette = {
  navy: '#030E30',
  primary: '#030E30',
  blue: '#123685',
  dark: '#030E30',
  sky: '#4A6FA5',
  secondary: '#6B4C2A',
  accent: '#D4A853',
  cream: '#EBDBB2',
  light: '#FAF6EF',
  surface: '#F2EBE0',
  muted: '#9C8B7A',
  border: '#E0D5C5',
  earth: '#8B6914',
  moss: '#4A6741',
}

/** Paleta alto contraste (WCAG AA/AAA sobre fondos claros) */
export const highContrastPalette = {
  navy: '#000000',
  primary: '#000000',
  blue: '#002B6B',
  dark: '#000000',
  sky: '#1A4A8A',
  secondary: '#4A3000',
  accent: '#8A6500',
  cream: '#FFFFFF',
  light: '#FFFFFF',
  surface: '#FFFFFF',
  muted: '#333333',
  border: '#1A1A1A',
  earth: '#5C4500',
  moss: '#1F4D28',
}

/** Objeto mutable: se actualiza al cambiar preferencias para que `colors.*` en sx se refresque en re-render */
export const colors = { ...defaultPalette }

export function syncColors(palette) {
  Object.assign(colors, palette)
}

const FONT_DISPLAY = '"Libre Baskerville", Georgia, serif'
const FONT_BODY = '"Inter", system-ui, sans-serif'

export function createAppTheme(C = defaultPalette, { highContrast = false } = {}) {
  const borderWidth = highContrast ? 2 : 1

  return createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: C.primary,
        light: C.blue,
        dark: C.navy,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: C.secondary,
        light: C.accent,
        dark: C.earth,
        contrastText: '#FFFFFF',
      },
      background: {
        default: C.light,
        paper: C.surface,
      },
      text: {
        primary: C.dark,
        secondary: C.muted,
      },
      divider: C.border,
      success: { main: C.moss },
      warning: { main: C.accent },
      info: { main: C.sky },
    },
    typography: {
      fontFamily: FONT_BODY,
      h1: {
        fontFamily: FONT_DISPLAY,
        fontWeight: 400,
        fontSize: '2rem',
        letterSpacing: '0.01em',
        color: C.dark,
        lineHeight: 1.2,
      },
      h2: {
        fontFamily: FONT_DISPLAY,
        fontWeight: 400,
        fontSize: '1.75rem',
        letterSpacing: '0.01em',
        color: C.dark,
        lineHeight: 1.25,
      },
      h3: {
        fontFamily: FONT_DISPLAY,
        fontWeight: 400,
        fontSize: '1.375rem',
        color: C.dark,
        lineHeight: 1.3,
      },
      h4: {
        fontFamily: FONT_DISPLAY,
        fontWeight: 400,
        fontSize: '1.125rem',
      },
      subtitle1: { fontWeight: 400, fontSize: '1rem' },
      subtitle2: { fontWeight: 400, fontSize: '1rem', color: C.muted },
      body1: { fontSize: '1rem', lineHeight: 1.75, fontWeight: 400 },
      body2: { fontSize: '1rem', lineHeight: 1.75, color: C.muted, fontWeight: 400 },
      overline: {
        fontFamily: FONT_BODY,
        fontSize: '0.6875rem',
        fontWeight: 500,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: C.primary,
      },
      button: { textTransform: 'none', fontWeight: 500, fontSize: '0.875rem', letterSpacing: '0.02em' },
    },
    shape: { borderRadius: 12 },
    breakpoints: {
      values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: C.light,
            fontFamily: FONT_BODY,
            fontSize: '1rem',
            lineHeight: 1.75,
            fontWeight: 400,
            color: C.dark,
          },
          'a:focus-visible': {
            outline: `3px solid ${alpha(C.primary, 0.55)}`,
            outlineOffset: 2,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 20px',
            minHeight: 48,
            minWidth: 44,
            boxShadow: 'none',
            transition: 'background-color 200ms ease-out, border-color 200ms ease-out, transform 200ms ease-out, box-shadow 200ms ease-out',
            '&:active': { transform: 'scale(0.98)' },
            '&:focus-visible': {
              outline: `3px solid ${alpha(C.primary, 0.55)}`,
              outlineOffset: 2,
            },
          },
          sizeSmall: {
            minHeight: 44,
            minWidth: 44,
            padding: '8px 16px',
          },
          containedPrimary: {
            '&:hover': { backgroundColor: C.blue, boxShadow: 'none' },
          },
          outlined: {
            borderColor: C.border,
            borderWidth,
            color: C.primary,
            backgroundColor: C.surface,
            '&:hover': { borderColor: C.primary, backgroundColor: C.surface, borderWidth },
          },
          text: {
            color: C.muted,
            '&:hover': { backgroundColor: C.surface },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            minWidth: 44,
            minHeight: 44,
            padding: 10,
            '&:focus-visible': {
              outline: `3px solid ${alpha(C.primary, 0.55)}`,
              outlineOffset: 2,
            },
          },
          sizeSmall: {
            minWidth: 44,
            minHeight: 44,
            padding: 10,
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            padding: 12,
            '&:focus-visible': {
              outline: `3px solid ${alpha(C.primary, 0.55)}`,
              outlineOffset: 0,
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 58,
            height: 38,
            padding: 7,
            '& .MuiSwitch-switchBase': {
              padding: 9,
              '&.Mui-focusVisible': {
                outline: `3px solid ${alpha(C.primary, 0.55)}`,
                outlineOffset: 2,
              },
            },
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            marginLeft: -4,
            marginRight: 8,
            minHeight: 44,
            alignItems: 'center',
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            '&:focus-visible': {
              outline: `3px solid ${alpha(C.primary, 0.55)}`,
              outlineOffset: 2,
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 48,
            minWidth: 44,
            '&:focus-visible': {
              outline: `3px solid ${alpha(C.primary, 0.55)}`,
              outlineOffset: -2,
            },
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            minHeight: 56,
            '&:focus-visible': {
              outline: `3px solid ${alpha(C.primary, 0.55)}`,
              outlineOffset: -2,
            },
          },
          expandIconWrapper: {
            marginRight: 4,
            '& .MuiSvgIcon-root, & svg': {
              fontSize: 28,
            },
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            gap: 16,
            padding: '16px 24px 24px',
            '& > :not(style) ~ :not(style)': {
              marginLeft: 0,
            },
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            minHeight: 44,
            '&:focus-visible': {
              outline: `3px solid ${alpha(C.primary, 0.55)}`,
              outlineOffset: -2,
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            minHeight: 48,
            '&:focus-visible': {
              outline: `3px solid ${alpha(C.primary, 0.55)}`,
              outlineOffset: -2,
            },
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: C.surface,
            border: `${borderWidth}px solid ${C.border}`,
            borderRadius: 16,
            boxShadow: highContrast ? 'none' : '0 1px 4px rgba(3, 14, 48, 0.06)',
            transition: 'box-shadow 200ms ease-out, border-color 200ms ease-out, transform 200ms ease-out',
            '&:hover': {
              boxShadow: highContrast ? 'none' : '0 4px 12px rgba(3, 14, 48, 0.1)',
              borderColor: C.primary,
            },
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: C.surface,
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: '#fff',
              fontSize: '1rem',
              transition: 'border-color 200ms ease-out, box-shadow 200ms ease-out',
              '& fieldset': { borderColor: C.border, borderWidth },
              '&:hover fieldset': { borderColor: C.primary },
              '&.Mui-focused fieldset': {
                borderColor: C.primary,
                borderWidth,
              },
              '&.Mui-focused': {
                boxShadow: `0 0 0 3px ${alpha(C.primary, 0.18)}`,
              },
              '&.Mui-focused:focus-within': {
                boxShadow: `0 0 0 3px ${alpha(C.primary, 0.28)}`,
              },
            },
            '& .MuiFormHelperText-root': {
              color: C.muted,
              fontSize: '0.75rem',
              marginTop: 6,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500, fontSize: '0.875rem', borderRadius: 999 },
          colorSuccess: {
            backgroundColor: alpha(C.moss, 0.15),
            color: C.moss,
          },
          colorWarning: {
            backgroundColor: alpha(C.accent, 0.2),
            color: C.earth,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 500,
              fontSize: '0.875rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: C.muted,
              backgroundColor: C.surface,
              borderBottom: `${borderWidth}px solid ${C.border}`,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { fontSize: '1rem' },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 12, fontSize: '1rem' },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            border: `${borderWidth}px solid ${C.border}`,
          },
        },
      },
    },
  })
}

export const muiTheme = createAppTheme(defaultPalette)

/** Alturas de chrome en rem (escalan con el tamaño de texto) */
export const TOP_BAR_HEIGHT_REM = 3.5 // 56px @ 16px
export const DOCK_HEIGHT_REM = 5.5 // 88px @ 16px
/** @deprecated usar TOP_BAR_HEIGHT_REM; valor px de referencia */
export const TOP_BAR_HEIGHT = 56
/** @deprecated usar DOCK_HEIGHT_REM */
export const DOCK_HEIGHT = 88
