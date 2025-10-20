// src/context/ThemeContext.jsx

import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode palette
                primary: { main: '#2e7d32' },
                secondary: { main: '#ffa000' },
                background: { default: '#f8f9f8', paper: '#ffffff' },
              }
            : {
                // Dark mode palette
                primary: { main: '#66bb6a' }, // Lighter green for dark mode
                secondary: { main: '#ffc107' },
                background: { default: '#121212', paper: '#1e1e1e' },
              }),
        },
        typography: {
            fontFamily: ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
        },
        shape: { borderRadius: 10 },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);