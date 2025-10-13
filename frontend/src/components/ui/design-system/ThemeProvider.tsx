import { useEffect, useState, ReactNode } from 'react';
import { ThemeContext } from './ThemeProviderContext';

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ai-orchestrator-theme',
}: {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(storageKey) as 'light' | 'dark' | 'system') || defaultTheme;
    }
    return defaultTheme;
  });

  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, theme);
    }
    const actualTheme = theme === 'system' ? systemTheme : theme;
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);
    root.setAttribute('data-theme', actualTheme);
    root.style.colorScheme = actualTheme;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        actualTheme === 'dark' ? '#111827' : '#ffffff'
      );
    }
  }, [theme, systemTheme, storageKey]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const actualTheme = theme === 'system' ? systemTheme : theme;
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };
  const value = {
    theme,
    setTheme,
    actualTheme,
    toggleTheme,
    isSystemTheme: theme === 'system',
  };
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}