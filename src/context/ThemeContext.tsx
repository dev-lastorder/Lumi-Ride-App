import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors } from '../constants/Colors';


type ThemeType = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeType;
  colors: typeof lightColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  colors: lightColors,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(systemScheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    setTheme(systemScheme === 'dark' ? 'dark' : 'light');
  }, [systemScheme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const colors = useMemo(() => (theme === 'light' ? lightColors : darkColors), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
