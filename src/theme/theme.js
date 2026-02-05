import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2D5F4C', // Deep Forest Green (30% - Primary actions)
      light: '#3D7A63',
      dark: '#1E3A2F',
      contrastText: '#fff',
    },
    secondary: {
      main: '#0D4D3D', // Dark Teal (10% - Accent)
      light: '#1A6B57',
      dark: '#083329',
      contrastText: '#fff',
    },
    info: {
      main: '#3D7A63', // Medium Green
    },
    error: {
      main: '#D84315',
    },
    success: {
      main: '#2D5F4C',
    },
    background: {
      default: '#F5F3EF', // Warm light beige (60% - Background)
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E3A2F', // Dark green for text
      secondary: '#5A6F66', // Muted green-gray
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '"Roboto"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 800, letterSpacing: '-0.025em', color: '#1E3A2F' },
    h2: { fontWeight: 800, letterSpacing: '-0.025em', color: '#1E3A2F' },
    h3: { fontWeight: 800, letterSpacing: '-0.025em', color: '#1E3A2F' },
    h4: { fontWeight: 700, letterSpacing: '-0.025em', color: '#2D5F4C' },
    h5: { fontWeight: 600, color: '#2D5F4C' },
    h6: { fontWeight: 600, color: '#2D5F4C' },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1E3A2F',
          boxShadow: 'none',
          borderBottom: '1px solid #E8E4DC',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          color: '#1E3A2F',
          borderRight: '1px solid #E8E4DC',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(29, 58, 47, 0.15), 0 2px 4px -1px rgba(29, 58, 47, 0.1)',
          },
        },
        containedPrimary: {
          backgroundColor: '#2D5F4C',
          '&:hover': {
            backgroundColor: '#1E3A2F',
          },
        },
        containedSecondary: {
          backgroundColor: '#0D4D3D',
          '&:hover': {
            backgroundColor: '#083329',
          },
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgb(29 58 47 / 0.08), 0 1px 2px -1px rgb(29 58 47 / 0.05)',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#2D5F4C', // Primary green for icons
        }
      }
    }
  },
});

export default theme;
