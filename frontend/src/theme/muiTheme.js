import { createTheme } from '@mui/material/styles'

export const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A2332',
      light: '#2C3A4D',
      dark: '#0F1419',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#5B7C99',
      light: '#8BA4BD',
      dark: '#3D5568',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F3F0',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A2332',
      secondary: '#6B7785',
    },
    divider: '#E2E0DC',
    success: { main: '#5A8F7B' },
    warning: { main: '#B8956B' },
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 600, letterSpacing: '-0.03em', fontSize: '1.75rem' },
    h2: { fontWeight: 600, letterSpacing: '-0.02em', fontSize: '1.375rem' },
    h3: { fontWeight: 600, letterSpacing: '-0.02em', fontSize: '1.125rem' },
    h4: { fontWeight: 600, fontSize: '1rem' },
    subtitle1: { fontWeight: 500, fontSize: '0.9375rem' },
    subtitle2: { fontWeight: 500, fontSize: '0.8125rem', color: '#6B7785' },
    body1: { fontSize: '0.9375rem', lineHeight: 1.65 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6, color: '#6B7785' },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 10 },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#F4F3F0' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          boxShadow: 'none',
          transition: 'background-color 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease',
          '&:hover': { boxShadow: '0 4px 14px rgba(26,35,50,0.12)' },
          '&:active': { transform: 'scale(0.98)' },
        },
        containedPrimary: {
          '&:hover': { backgroundColor: '#2C3A4D' },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #E2E0DC',
          borderRadius: 12,
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E2E0DC',
          backgroundColor: '#1A2332',
          color: '#FFFFFF',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(255,255,255,0.12)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.16)' },
          },
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#6B7785',
            backgroundColor: '#FAFAF9',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, fontSize: '0.75rem' },
      },
    },
  },
})

export const DRAWER_WIDTH = 280
