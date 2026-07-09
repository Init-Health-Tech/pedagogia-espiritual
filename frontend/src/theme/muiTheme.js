import { createTheme, alpha } from '@mui/material/styles'

const C = {
  navy: '#030E30',
  primary: '#030E30',
  blue: '#123685',
  secondary: '#704E47',
  accent: '#C79B6E',
  cream: '#EBDBB2',
  light: '#EBDBB2',
  surface: '#F5ECD8',
  muted: '#5A5268',
  border: '#D4C4A0',
  dark: '#030E30',
  earth: '#5A3F39',
  moss: '#3D5244',
  sky: '#4A6FA5',
}

const FONT_DISPLAY = '"Libre Baskerville", Georgia, serif'
const FONT_BODY = '"Inter", system-ui, sans-serif'

export const colors = C

export const muiTheme = createTheme({
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
          fontSize: '16px',
          lineHeight: 1.75,
          fontWeight: 400,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 20px',
          minHeight: 48,
          boxShadow: 'none',
          transition: 'background-color 200ms ease-out, border-color 200ms ease-out, transform 200ms ease-out',
          '&:active': { transform: 'scale(0.98)' },
        },
        containedPrimary: {
          '&:hover': { backgroundColor: C.blue, boxShadow: 'none' },
        },
        outlined: {
          borderColor: C.border,
          color: C.primary,
          backgroundColor: C.surface,
          '&:hover': { borderColor: C.primary, backgroundColor: C.surface },
        },
        text: {
          color: C.muted,
          '&:hover': { backgroundColor: C.surface },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          boxShadow: '0 1px 4px rgba(3, 14, 48, 0.06)',
          transition: 'box-shadow 200ms ease-out, border-color 200ms ease-out, transform 200ms ease-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(3, 14, 48, 0.1)',
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
            '& fieldset': { borderColor: C.border },
            '&:hover fieldset': { borderColor: C.primary },
            '&.Mui-focused fieldset': {
              borderColor: C.primary,
              borderWidth: 1,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 3px ${alpha(C.primary, 0.18)}`,
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
            borderBottom: `1px solid ${C.border}`,
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
        paper: { borderRadius: 16, border: `1px solid ${C.border}` },
      },
    },
  },
})

export const TOP_BAR_HEIGHT = 56
export const DOCK_HEIGHT = 88
