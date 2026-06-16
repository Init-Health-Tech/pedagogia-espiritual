import { createTheme, alpha } from '@mui/material/styles'

const C = {
  primary: '#6B4C2A',
  secondary: '#A0784A',
  accent: '#D4A853',
  earth: '#8B6914',
  moss: '#4A6741',
  sky: '#7BA7BC',
  light: '#FAF6EF',
  surface: '#F2EBE0',
  muted: '#9C8B7A',
  border: '#E0D5C5',
  dark: '#2C1F0E',
}

export const colors = C

export const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: C.primary,
      light: C.secondary,
      dark: C.earth,
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
    fontFamily: '"Source Sans 3", system-ui, sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 400,
      fontSize: '2rem',
      letterSpacing: '0.01em',
      color: C.dark,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 400,
      fontSize: '1.75rem',
      letterSpacing: '0.01em',
      color: C.dark,
      lineHeight: 1.25,
    },
    h3: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 400,
      fontSize: '1.375rem',
      color: C.dark,
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 400,
      fontSize: '1.125rem',
    },
    subtitle1: { fontWeight: 400, fontSize: '1rem' },
    subtitle2: { fontWeight: 300, fontSize: '1rem', color: C.muted },
    body1: { fontSize: '1rem', lineHeight: 1.75, fontWeight: 300 },
    body2: { fontSize: '1rem', lineHeight: 1.75, color: C.muted, fontWeight: 300 },
    overline: {
      fontFamily: '"Source Sans 3", sans-serif',
      fontSize: '0.6875rem',
      fontWeight: 500,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: C.secondary,
    },
    button: { textTransform: 'none', fontWeight: 400, fontSize: '0.875rem', letterSpacing: '0.02em' },
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
          fontFamily: '"Source Sans 3", system-ui, sans-serif',
          fontSize: '16px',
          lineHeight: 1.75,
          fontWeight: 300,
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
          '&:hover': { backgroundColor: C.earth, boxShadow: 'none' },
        },
        outlined: {
          borderColor: C.border,
          color: C.primary,
          backgroundColor: C.surface,
          '&:hover': { borderColor: C.secondary, backgroundColor: C.surface },
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
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          transition: 'box-shadow 200ms ease-out, border-color 200ms ease-out, transform 200ms ease-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderColor: C.secondary,
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
            '&:hover fieldset': { borderColor: C.secondary },
            '&.Mui-focused fieldset': {
              borderColor: C.accent,
              borderWidth: 1,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 3px ${alpha(C.accent, 0.2)}`,
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
          backgroundColor: alpha(C.moss, 0.125),
          color: '#2e4228',
        },
        colorWarning: {
          backgroundColor: alpha(C.accent, 0.125),
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
