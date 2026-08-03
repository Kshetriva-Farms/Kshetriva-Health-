import { useThemeContext } from '../context/ThemeContext';

export function useTheme() {
  const { theme, toggleTheme } = useThemeContext();
  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
  };
}
