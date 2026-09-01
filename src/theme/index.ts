import { createTheme } from '@mui/material/styles';

/**
 * Windows 98 retro theme, matching the same skin used on
 * marquesgabriel.github.io (portfolio) and token-generator (mtg).
 *
 * This provides sensible light-mode defaults (text/background/divider
 * colors) for anything the src/styles/_win98.scss overrides don't reach -
 * the actual win98 look (flat gray buttons, inset input borders, the
 * titlebar gradient, etc.) comes from that SCSS layer, not from MUI
 * component styleOverrides here, since it targets MUI's stable class names
 * directly and needs `!important` to beat MUI's own competing rules
 * regardless of what the theme configures.
 */
const win98Gray = '#c0c0c0';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000080', // navy, matches the titlebar gradient's start color
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#808080',
      contrastText: '#000000',
    },
    background: {
      default: win98Gray,
      paper: win98Gray,
    },
    text: {
      primary: '#000000',
      secondary: '#000000',
    },
    divider: '#808080',
  },
  typography: {
    // MUI's default type scale is tuned for Roboto - a small pixel-style
    // font like MS Sans Serif at Roboto's sizes (h3 defaults to 3rem/48px)
    // looks badly oversized/disproportionate. Neither portfolio nor mtg
    // hits this: portfolio's headings are plain HTML sized by its own CSS,
    // and mtg's layout is Bootstrap-driven rather than built around large
    // MUI Typography variants - this app is the first to actually need a
    // win98-appropriate size scale, not just a font-family swap.
    fontFamily: '"MS Sans Serif", "Tahoma", sans-serif',
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h6: {
      fontSize: '0.95rem',
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: '0.8125rem',
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: '0.75rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '0.8125rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
    caption: {
      fontSize: '0.6875rem',
    },
    button: {
      fontSize: '0.8125rem',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 0,
  },
});

export default theme;
