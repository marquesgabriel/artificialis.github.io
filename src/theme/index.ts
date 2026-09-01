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
    fontFamily: '"MS Sans Serif", "Tahoma", sans-serif',
  },
  shape: {
    borderRadius: 0,
  },
});

export default theme;
