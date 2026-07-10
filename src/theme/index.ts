import { createTheme } from '@mui/material/styles';

/**
 * Warm dark theme — coffee / craft / industrial aesthetic.
 * Primary:   amber-brown  #c87941
 * Surface:   deep espresso #0f0e0d / #1a1815
 * Border:    #2e2b27
 */
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#c87941',
      light: '#dfa06a',
      dark: '#9a5a2c',
      contrastText: '#0f0e0d',
    },
    secondary: {
      main: '#7b9ea6',
      contrastText: '#0f0e0d',
    },
    background: {
      default: '#0f0e0d',
      paper: '#1a1815',
    },
    text: {
      primary: '#f0ebe4',
      secondary: '#9e9189',
    },
    divider: '#2e2b27',
    error: {
      main: '#e07060',
    },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: {
      fontFamily: '"DM Serif Display", serif',
      fontWeight: 400,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"DM Serif Display", serif',
      fontWeight: 400,
    },
    h3: {
      fontFamily: '"DM Serif Display", serif',
      fontWeight: 400,
    },
    h4: {
      fontFamily: '"DM Serif Display", serif',
      fontWeight: 400,
    },
    h5: {
      fontFamily: '"DM Serif Display", serif',
      fontWeight: 400,
    },
    h6: {
      fontFamily: '"DM Serif Display", serif',
      fontWeight: 400,
    },
    subtitle1: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 300,
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      fontSize: '0.7rem',
    },
    body1: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 300,
      fontSize: '0.8rem',
    },
    button: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.06em',
    },
    caption: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 300,
      fontSize: '0.7rem',
      letterSpacing: '0.05em',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#0f0e0d',
          scrollbarWidth: 'thin',
          scrollbarColor: '#2e2b27 transparent',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: '#2e2b27', borderRadius: 4 },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #2e2b27',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2e2b27',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#c87941',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#c87941',
          '& .MuiSlider-thumb': {
            width: 14,
            height: 14,
            '&:hover': { boxShadow: '0 0 0 6px rgba(200,121,65,0.16)' },
          },
          '& .MuiSlider-track': { border: 'none' },
          '& .MuiSlider-rail': { opacity: 0.2 },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          paddingTop: 10,
          paddingBottom: 10,
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #c87941 0%, #9a5a2c 100%)',
          boxShadow: '0 4px 20px rgba(200,121,65,0.25)',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(200,121,65,0.4)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: '0.7rem',
          height: 22,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#2e2b27',
          fontSize: '0.72rem',
          borderRadius: 6,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: '#9e9189' },
      },
    },
  },
});

export default theme;